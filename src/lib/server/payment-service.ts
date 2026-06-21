import crypto from "node:crypto";

import { OrderStatus, PaymentStatus, Prisma } from "@/generated/prisma/client";
import { getAppUrl, hasMidtransEnv, isDemoMidtransEnabled, isMidtransProduction } from "@/lib/server/env";
import { ApiError } from "@/lib/server/http";
import { createNotification } from "@/lib/server/notification-service";
import { sendPaymentPaidEmail } from "@/lib/server/email-service";
import { prisma } from "@/lib/db";

type OrderForPayment = Prisma.OrderGetPayload<{
  include: {
    user: true;
    items: {
      include: {
        product: true;
        variant: true;
      };
    };
    payment: true;
  };
}>;

export type MidtransNotificationPayload = {
  order_id?: string;
  transaction_status?: string;
  fraud_status?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
  transaction_id?: string;
  payment_type?: string;
  transaction_time?: string;
  [key: string]: unknown;
};

function midtransSnapBaseUrl() {
  return isMidtransProduction() ? "https://app.midtrans.com" : "https://app.sandbox.midtrans.com";
}

function midtransServerKey() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();

  if (!serverKey && process.env.NODE_ENV === "production") {
    throw new ApiError(500, "MIDTRANS_CONFIG_MISSING", "Konfigurasi Midtrans belum tersedia.");
  }

  return serverKey;
}

function shouldMockMidtrans() {
  return isDemoMidtransEnabled() || (process.env.NODE_ENV !== "production" && (!hasMidtransEnv() || process.env.MIDTRANS_MOCK_ENABLED === "true"));
}

function basicAuth(serverKey: string) {
  return Buffer.from(`${serverKey}:`).toString("base64");
}

function paymentMethodLabel(method: OrderForPayment["paymentMethod"]) {
  const labels = {
    MIDTRANS_VA: "Virtual Account",
    MIDTRANS_QRIS: "QRIS",
    MIDTRANS_EWALLET: "E-Wallet",
    MIDTRANS_CARD: "Kartu Kredit/Debit",
    COD: "COD",
  };

  return labels[method];
}

function buildSnapPayload(order: OrderForPayment) {
  const orderUrl = `${getAppUrl().replace(/\/$/, "")}/pembayaran/${order.orderNumber}`;
  const itemDetails = order.items.map((item) => ({
    id: item.variant?.sku ?? item.product.slug,
    price: Math.round(Number(item.unitPrice)),
    quantity: item.quantity,
    name: item.product.name.slice(0, 50),
  }));
  const shippingCost = Math.round(Number(order.shippingCost));
  const discount = Number(order.subtotal) + shippingCost - Number(order.total);

  if (shippingCost > 0) {
    itemDetails.push({
      id: "SHIPPING",
      price: shippingCost,
      quantity: 1,
      name: "Ongkir",
    });
  }

  if (discount > 0) {
    itemDetails.push({
      id: "DISCOUNT",
      price: -Math.round(discount),
      quantity: 1,
      name: "Voucher",
    });
  }

  return {
    transaction_details: {
      order_id: order.orderNumber,
      gross_amount: Math.round(Number(order.total)),
    },
    item_details: itemDetails,
    customer_details: {
      first_name: order.user.name ?? order.user.email,
      email: order.user.email,
      phone: order.user.phone ?? undefined,
    },
    credit_card: {
      secure: true,
    },
    callbacks: {
      finish: orderUrl,
    },
    enabled_payments:
      order.paymentMethod === "MIDTRANS_VA"
        ? ["bank_transfer"]
        : order.paymentMethod === "MIDTRANS_QRIS"
          ? ["qris"]
          : order.paymentMethod === "MIDTRANS_EWALLET"
            ? ["gopay", "shopeepay"]
            : order.paymentMethod === "MIDTRANS_CARD"
              ? ["credit_card"]
              : undefined,
  };
}

export async function createMidtransSnapTransaction(order: OrderForPayment) {
  if (order.paymentMethod === "COD") return null;

  if (shouldMockMidtrans()) {
    return {
      token: `mock-snap-token-${order.orderNumber}`,
      redirect_url: `${getAppUrl().replace(/\/$/, "")}/pembayaran/${order.orderNumber}`,
      isMock: true,
    };
  }

  const serverKey = midtransServerKey();

  if (!serverKey) {
    throw new ApiError(500, "MIDTRANS_CONFIG_MISSING", "Konfigurasi Midtrans belum tersedia.");
  }

  // Try with specific enabled_payments first
  let payload = buildSnapPayload(order);
  let response = await fetch(`${midtransSnapBaseUrl()}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      authorization: `Basic ${basicAuth(serverKey)}`,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  let result = (await response.json().catch(() => null)) as { token?: string; redirect_url?: string; error_messages?: string[]; status_code?: string } | null;

  // Fallback: if error 402 (payment method not enabled), retry without enabled_payments constraint
  if (!response.ok && result?.status_code === "402") {
    console.warn("[midtrans] Payment channel not enabled, retrying with all available channels...");
    
    payload = { ...payload, enabled_payments: undefined };
    response = await fetch(`${midtransSnapBaseUrl()}/snap/v1/transactions`, {
      method: "POST",
      headers: {
        authorization: `Basic ${basicAuth(serverKey)}`,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    result = (await response.json().catch(() => null)) as { token?: string; redirect_url?: string; error_messages?: string[] } | null;
  }

  if (!response.ok || !result?.token || !result.redirect_url) {
    throw new ApiError(response.status || 502, "MIDTRANS_CREATE_FAILED", "Gagal membuat transaksi Midtrans.", result);
  }

  return {
    token: result.token,
    redirect_url: result.redirect_url,
    isMock: false,
  };
}

export function createMidtransSignature(input: { orderId: string; statusCode: string; grossAmount: string; serverKey?: string }) {
  if (!input.serverKey && shouldMockMidtrans()) return "mock-signature";

  const serverKey = input.serverKey ?? midtransServerKey();

  if (!serverKey) {
    throw new ApiError(500, "MIDTRANS_CONFIG_MISSING", "Konfigurasi Midtrans belum tersedia.");
  }

  return crypto.createHash("sha512").update(`${input.orderId}${input.statusCode}${input.grossAmount}${serverKey}`).digest("hex");
}

function verifyNotificationSignature(payload: MidtransNotificationPayload) {
  if (!payload.order_id || !payload.status_code || !payload.gross_amount || !payload.signature_key) {
    throw new ApiError(400, "MIDTRANS_PAYLOAD_INVALID", "Payload notification Midtrans tidak lengkap.");
  }

  if (shouldMockMidtrans() && payload.signature_key === "mock-signature") return;

  const signature = createMidtransSignature({
    orderId: payload.order_id,
    statusCode: payload.status_code,
    grossAmount: payload.gross_amount,
  });

  if (signature !== payload.signature_key) {
    throw new ApiError(401, "MIDTRANS_SIGNATURE_INVALID", "Signature Midtrans tidak valid.");
  }
}

function mapNotification(payload: MidtransNotificationPayload): { paymentStatus: PaymentStatus; orderStatus: OrderStatus; paid: boolean; releaseStock: boolean } {
  const status = payload.transaction_status;
  const fraudStatus = payload.fraud_status;

  if (status === "settlement" || (status === "capture" && fraudStatus === "accept")) {
    return { paymentStatus: "PAID", orderStatus: "PAID", paid: true, releaseStock: false };
  }

  if (status === "capture" && fraudStatus === "challenge") {
    return { paymentStatus: "PENDING", orderStatus: "PENDING_PAYMENT", paid: false, releaseStock: false };
  }

  if (status === "deny" || status === "cancel") {
    return { paymentStatus: "FAILED", orderStatus: "CANCELLED", paid: false, releaseStock: true };
  }

  if (status === "expire") {
    return { paymentStatus: "EXPIRED", orderStatus: "EXPIRED", paid: false, releaseStock: true };
  }

  return { paymentStatus: "PENDING", orderStatus: "PENDING_PAYMENT", paid: false, releaseStock: false };
}

function parseMidtransDate(value: unknown) {
  if (typeof value !== "string" || value.trim() === "") return new Date();
  const parsed = new Date(value.replace(" ", "T"));
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export async function releaseReservedStock(tx: Prisma.TransactionClient, order: Prisma.OrderGetPayload<{ include: { items: true } }>) {
  if (order.stockReleasedAt) return false;

  for (const item of order.items) {
    if (item.variantId) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }
  }

  await tx.order.update({
    where: { id: order.id },
    data: { stockReleasedAt: new Date() },
  });

  return true;
}

export async function processMidtransNotification(payload: MidtransNotificationPayload) {
  verifyNotificationSignature(payload);

  const orderNumber = payload.order_id!;
  const mapped = mapNotification(payload);

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        payment: true,
        user: true,
      },
    });

    if (!order || !order.payment) {
      throw new ApiError(404, "ORDER_NOT_FOUND", "Order Midtrans tidak ditemukan.");
    }

    const wasPaid = order.payment.status === "PAID";
    const alreadyFinal = ["PAID", "EXPIRED", "CANCELLED", "COMPLETED"].includes(order.status);

    if (mapped.releaseStock) {
      await releaseReservedStock(tx, order);
    }

    const paidAt = mapped.paid ? parseMidtransDate(payload.transaction_time) : order.payment.paidAt;

    const payment = await tx.payment.update({
      where: { orderId: order.id },
      data: {
        status: mapped.paymentStatus,
        midtransTransactionId: typeof payload.transaction_id === "string" ? payload.transaction_id : order.payment.midtransTransactionId,
        midtransOrderId: orderNumber,
        paymentType: typeof payload.payment_type === "string" ? payload.payment_type : order.payment.paymentType,
        fraudStatus: typeof payload.fraud_status === "string" ? payload.fraud_status : order.payment.fraudStatus,
        paidAt,
        rawPayload: JSON.parse(JSON.stringify(payload)) as Prisma.InputJsonObject,
      },
    });

    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status: mapped.orderStatus,
      },
    });

    const shouldNotifyPaid = mapped.paid && !wasPaid;
    const shouldNotifyFailed = mapped.releaseStock && !alreadyFinal;

    if (shouldNotifyPaid) {
      await tx.notification.create({
        data: {
          userId: order.userId,
          type: "payment.paid",
          title: "Pembayaran berhasil",
          message: `Pembayaran untuk order ${order.orderNumber} berhasil tercatat.`,
          linkUrl: `/akun/pesanan/${order.orderNumber}`,
        },
      });
    } else if (shouldNotifyFailed) {
      await tx.notification.create({
        data: {
          userId: order.userId,
          type: mapped.paymentStatus === "EXPIRED" ? "payment.expired" : "payment.failed",
          title: mapped.paymentStatus === "EXPIRED" ? "Pembayaran kedaluwarsa" : "Pembayaran gagal",
          message: `Order ${order.orderNumber} ${mapped.paymentStatus === "EXPIRED" ? "kedaluwarsa" : "dibatalkan"}.`,
          linkUrl: `/akun/pesanan/${order.orderNumber}`,
        },
      });
    }

    return {
      order: updatedOrder,
      payment,
      user: order.user,
      shouldNotifyPaid,
    };
  });

  if (result.shouldNotifyPaid) {
    sendPaymentPaidEmail({
      email: result.user.email,
      name: result.user.name,
      orderNumber: result.order.orderNumber,
      orderUrl: `${getAppUrl().replace(/\/$/, "")}/akun/pesanan/${result.order.orderNumber}`,
      total: Number(result.payment.amount),
    }).catch((error) => {
      console.warn("[email:payment-paid-failed]", error);
    });
  }

  return {
    orderNumber: result.order.orderNumber,
    orderStatus: result.order.status,
    paymentStatus: result.payment.status,
    paymentType: result.payment.paymentType,
    fraudStatus: result.payment.fraudStatus,
  };
}

export async function simulateDemoPayment(userId: string, orderId: string) {
  if (!isDemoMidtransEnabled()) {
    throw new ApiError(404, "DEMO_PAYMENT_DISABLED", "Simulasi pembayaran tidak tersedia.");
  }

  const order = await prisma.order.findFirst({
    where: {
      userId,
      OR: [{ id: orderId }, { orderNumber: orderId }],
    },
    include: {
      payment: true,
    },
  });

  if (!order?.payment) {
    throw new ApiError(404, "ORDER_NOT_FOUND", "Order pembayaran tidak ditemukan.");
  }

  if (!order.payment.snapToken?.startsWith("mock-snap-token-")) {
    throw new ApiError(400, "NOT_DEMO_PAYMENT", "Order ini bukan transaksi pembayaran demo.");
  }

  if (order.payment.status !== "PENDING" || order.status !== "PENDING_PAYMENT") {
    throw new ApiError(400, "PAYMENT_NOT_PENDING", "Pembayaran demo ini sudah tidak menunggu pembayaran.");
  }

  const grossAmount = Number(order.total).toFixed(2);

  return processMidtransNotification({
    transaction_time: new Date().toISOString(),
    transaction_status: "settlement",
    transaction_id: `demo-${order.orderNumber}`,
    status_code: "200",
    signature_key: "mock-signature",
    payment_type: "demo",
    order_id: order.orderNumber,
    gross_amount: grossAmount,
    fraud_status: "accept",
  });
}

export async function notifyOrderCreated(order: OrderForPayment) {
  await createNotification({
    userId: order.userId,
    type: "order.created",
    title: "Order berhasil dibuat",
    message: `Order ${order.orderNumber} berhasil dibuat dengan metode ${paymentMethodLabel(order.paymentMethod)}.`,
    linkUrl: `/akun/pesanan/${order.orderNumber}`,
  });
}
