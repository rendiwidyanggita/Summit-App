import { z } from "zod";

import { PaymentMethod, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { getCartForCheckout, serializeCart } from "@/lib/server/cart-service";
import { ApiError } from "@/lib/server/http";
import { estimateShipping, getShippingServiceById } from "@/lib/server/shipping-service";
import { calculateVoucherDiscount, validateVoucher } from "@/lib/server/voucher-service";

export const checkoutCreateOrderSchema = z.object({
  addressId: z.string().trim().min(1),
  shippingServiceId: z.string().trim().min(1),
  voucherCode: z.string().trim().optional(),
  paymentMethod: z.enum([
    "MIDTRANS_VA",
    "MIDTRANS_QRIS",
    "MIDTRANS_EWALLET",
    "MIDTRANS_CARD",
    "COD",
  ]),
});

function addMinutes(minutes: number) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

function paymentExpiry(method: PaymentMethod) {
  if (method === "COD") return null;
  if (method === "MIDTRANS_VA") return addMinutes(24 * 60);
  return addMinutes(15);
}

function lineUnitPrice(item: Awaited<ReturnType<typeof getCartForCheckout>>["items"][number]) {
  const basePrice = item.product.discountPrice ?? item.product.price;
  return new Prisma.Decimal(basePrice).plus(item.variant ? item.variant.priceModifier : 0);
}

function buildOrderNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SG-${datePart}-${randomPart}`;
}

async function createUniqueOrderNumber(tx: Prisma.TransactionClient) {
  for (let i = 0; i < 5; i += 1) {
    const orderNumber = buildOrderNumber();
    const existing = await tx.order.findUnique({
      where: { orderNumber },
      select: { id: true },
    });

    if (!existing) return orderNumber;
  }

  throw new ApiError(500, "ORDER_NUMBER_FAILED", "Gagal membuat nomor order.");
}

export async function createCheckoutOrder(userId: string, input: z.infer<typeof checkoutCreateOrderSchema>) {
  const shippingRates = await estimateShipping(userId, { addressId: input.addressId });
  const shippingService = getShippingServiceById(input.shippingServiceId, shippingRates);
  const address = await prisma.address.findFirst({
    where: { id: input.addressId, userId },
  });

  if (!address) {
    throw new ApiError(404, "ADDRESS_NOT_FOUND", "Alamat pengiriman tidak ditemukan.");
  }

  const cartPreview = await getCartForCheckout(userId);
  const serializedCart = serializeCart(cartPreview);
  const subtotal = new Prisma.Decimal(serializedCart.summary.subtotal);
  let voucher: Awaited<ReturnType<typeof validateVoucher>> | null = null;

  if (input.voucherCode) {
    voucher = await validateVoucher({
      code: input.voucherCode,
      subtotal: Number(subtotal),
      shippingCost: shippingService.price,
    });
  }

  const discount = voucher
    ? calculateVoucherDiscount(
        {
          type: voucher.type,
          value: voucher.value,
          maxDiscount: voucher.maxDiscount,
        },
        Number(subtotal),
        shippingService.price,
      )
    : 0;
  const total = subtotal.plus(shippingService.price).minus(discount);

  if (input.paymentMethod === "COD") {
    if (!shippingRates.address.codSupported) {
      throw new ApiError(400, "COD_NOT_SUPPORTED", "COD tidak tersedia untuk alamat atau nominal transaksi ini.");
    }

    if (total.greaterThan(1_500_000)) {
      throw new ApiError(400, "COD_LIMIT_EXCEEDED", "COD maksimal Rp1.500.000 per transaksi.");
    }
  }

  return prisma.$transaction(async (tx) => {
    const cart = await getCartForCheckout(userId, tx);
    const orderNumber = await createUniqueOrderNumber(tx);
    const expiresAt = paymentExpiry(input.paymentMethod);

    for (const item of cart.items) {
      if (!item.variantId) {
        throw new ApiError(400, "VARIANT_REQUIRED", "Semua item checkout wajib memiliki varian.");
      }

      const updated = await tx.productVariant.updateMany({
        where: {
          id: item.variantId,
          stock: { gte: item.quantity },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (updated.count !== 1) {
        throw new ApiError(400, "INSUFFICIENT_STOCK", `Stok ${item.product.name} tidak mencukupi.`);
      }
    }

    const order = await tx.order.create({
      data: {
        orderNumber,
        userId,
        addressSnapshot: {
          id: address.id,
          label: address.label,
          recipient: address.recipient,
          phone: address.phone,
          fullAddress: address.fullAddress,
          province: address.province,
          city: address.city,
          district: address.district,
          postalCode: address.postalCode,
        },
        shippingCost: shippingService.price,
        voucherId: voucher?.id ?? null,
        subtotal,
        total,
        status: input.paymentMethod === "COD" ? "PROCESSING" : "PENDING_PAYMENT",
        paymentMethod: input.paymentMethod,
        expiresAt,
        items: {
          create: cart.items.map((item) => {
            const unitPrice = lineUnitPrice(item);

            return {
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice,
              subtotal: unitPrice.mul(item.quantity),
            };
          }),
        },
        payment: {
          create: {
            method: input.paymentMethod,
            status: "PENDING",
            amount: total,
            midtransOrderId: input.paymentMethod === "COD" ? null : orderNumber,
            expiredAt: expiresAt,
          },
        },
        shipment: {
          create: {
            courier: shippingService.courier,
            service: shippingService.service,
            status: "PENDING",
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        payment: true,
        shipment: true,
        voucher: true,
      },
    });

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentMethod: order.paymentMethod,
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost),
      discount,
      total: Number(order.total),
      expiresAt: order.expiresAt,
      addressSnapshot: order.addressSnapshot,
      shipment: order.shipment,
      payment: order.payment
        ? {
            id: order.payment.id,
            method: order.payment.method,
            status: order.payment.status,
            amount: Number(order.payment.amount),
            midtransOrderId: order.payment.midtransOrderId,
            expiredAt: order.payment.expiredAt,
          }
        : null,
      voucher: order.voucher
        ? {
            code: order.voucher.code,
            type: order.voucher.type,
          }
        : null,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        productName: item.product.name,
        sku: item.variant?.sku ?? null,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        subtotal: Number(item.subtotal),
      })),
    };
  });
}
