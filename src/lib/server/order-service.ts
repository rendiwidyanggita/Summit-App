import { z } from "zod";

import { OrderStatus, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { sendOrderCreatedEmail } from "@/lib/server/email-service";
import { getAppUrl } from "@/lib/server/env";
import { ApiError } from "@/lib/server/http";
import { releaseReservedStock } from "@/lib/server/payment-service";

const orderInclude = {
  items: {
    include: {
      product: {
        include: {
          brand: true,
          category: true,
        },
      },
      variant: true,
    },
  },
  payment: true,
  shipment: true,
  voucher: true,
} satisfies Prisma.OrderInclude;

export const orderListQuerySchema = z.object({
  status: z.enum(["ALL", "PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED", "CANCELLED", "EXPIRED"]).default("ALL"),
});

type OrderWithRelations = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;
type OrderCreatedSideEffectsInput = {
  userId: string;
  orderNumber: string;
  total: Prisma.Decimal | number;
  user: {
    email: string;
    name: string | null;
  };
};

function serializeOrderItem(item: OrderWithRelations["items"][number]) {
  return {
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice),
    subtotal: Number(item.subtotal),
    product: {
      id: item.product.id,
      slug: item.product.slug,
      name: item.product.name,
      photo: item.product.photos[0] ?? null,
      brand: item.product.brand ? { name: item.product.brand.name, slug: item.product.brand.slug } : null,
      category: item.product.category ? { name: item.product.category.name, slug: item.product.category.slug } : null,
    },
    variant: item.variant
      ? {
          id: item.variant.id,
          sku: item.variant.sku,
          size: item.variant.size,
          color: item.variant.color,
        }
      : null,
  };
}

export function serializeOrder(order: OrderWithRelations) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentMethod: order.paymentMethod,
    subtotal: Number(order.subtotal),
    shippingCost: Number(order.shippingCost),
    discount: Number(order.subtotal) + Number(order.shippingCost) - Number(order.total),
    total: Number(order.total),
    expiresAt: order.expiresAt,
    stockReleasedAt: order.stockReleasedAt,
    addressSnapshot: order.addressSnapshot,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    voucher: order.voucher
      ? {
          code: order.voucher.code,
          type: order.voucher.type,
        }
      : null,
    payment: order.payment
      ? {
          id: order.payment.id,
          method: order.payment.method,
          status: order.payment.status,
          amount: Number(order.payment.amount),
          midtransOrderId: order.payment.midtransOrderId,
          midtransTransactionId: order.payment.midtransTransactionId,
          snapToken: order.payment.snapToken,
          redirectUrl: order.payment.redirectUrl,
          isDemo: Boolean(order.payment.snapToken?.startsWith("mock-snap-token-")),
          paymentType: order.payment.paymentType,
          fraudStatus: order.payment.fraudStatus,
          paidAt: order.payment.paidAt,
          expiredAt: order.payment.expiredAt,
        }
      : null,
    shipment: order.shipment,
    items: order.items.map(serializeOrderItem),
  };
}

export async function listUserOrders(userId: string, query: z.infer<typeof orderListQuerySchema>) {
  const where: Prisma.OrderWhereInput = {
    userId,
    ...(query.status === "ALL" ? {} : { status: query.status as OrderStatus }),
  };

  const orders = await prisma.order.findMany({
    where,
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });

  return orders.map(serializeOrder);
}

export async function getUserOrder(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: {
      userId,
      OR: [{ id: orderId }, { orderNumber: orderId }],
    },
    include: orderInclude,
  });

  if (!order) {
    throw new ApiError(404, "ORDER_NOT_FOUND", "Order tidak ditemukan.");
  }

  return serializeOrder(order);
}

export async function cancelUserOrder(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: {
      userId,
      OR: [{ id: orderId }, { orderNumber: orderId }],
    },
    include: {
      items: true,
      payment: true,
    },
  });

  if (!order) {
    throw new ApiError(404, "ORDER_NOT_FOUND", "Order tidak ditemukan.");
  }

  if (order.status !== "PENDING_PAYMENT") {
    throw new ApiError(400, "ORDER_CANCEL_NOT_ALLOWED", "Order hanya bisa dibatalkan saat menunggu pembayaran.");
  }

  const updated = await prisma.$transaction(async (tx) => {
    await releaseReservedStock(tx, order);

    await tx.payment.updateMany({
      where: { orderId: order.id, status: "PENDING" },
      data: { status: "FAILED" },
    });

    await tx.notification.create({
      data: {
        userId,
        type: "order.cancelled",
        title: "Order dibatalkan",
        message: `Order ${order.orderNumber} berhasil dibatalkan.`,
        linkUrl: `/akun/pesanan/${order.orderNumber}`,
      },
    });

    return tx.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED" },
      include: orderInclude,
    });
  });

  return serializeOrder(updated);
}

export async function confirmUserOrderReceived(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: {
      userId,
      OR: [{ id: orderId }, { orderNumber: orderId }],
    },
    include: orderInclude,
  });

  if (!order) {
    throw new ApiError(404, "ORDER_NOT_FOUND", "Order tidak ditemukan.");
  }

  if (order.status !== "DELIVERED") {
    throw new ApiError(400, "ORDER_RECEIVED_NOT_ALLOWED", "Konfirmasi diterima hanya tersedia untuk order yang sudah delivered.");
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.notification.create({
      data: {
        userId,
        type: "order.completed",
        title: "Order selesai",
        message: `Order ${order.orderNumber} sudah dikonfirmasi selesai.`,
        linkUrl: `/akun/pesanan/${order.orderNumber}`,
      },
    });

    return tx.order.update({
      where: { id: order.id },
      data: { status: "COMPLETED" },
      include: orderInclude,
    });
  });

  return serializeOrder(updated);
}

export async function sendOrderCreatedSideEffects(order: OrderCreatedSideEffectsInput) {
  await prisma.notification.create({
    data: {
      userId: order.userId,
      type: "order.created",
      title: "Order berhasil dibuat",
      message: `Order ${order.orderNumber} berhasil dibuat.`,
      linkUrl: `/akun/pesanan/${order.orderNumber}`,
    },
  });

  sendOrderCreatedEmail({
    email: order.user.email,
    name: order.user.name,
    orderNumber: order.orderNumber,
    orderUrl: `${getAppUrl().replace(/\/$/, "")}/akun/pesanan/${order.orderNumber}`,
    total: Number(order.total),
  }).catch((error) => {
    console.warn("[email:order-created-failed]", error);
  });
}
