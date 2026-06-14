import "dotenv/config";

import { prisma } from "../src/lib/db";
import { addCartItem } from "../src/lib/server/cart-service";
import { createCheckoutOrder } from "../src/lib/server/checkout-service";
import { cancelUserOrder, confirmUserOrderReceived, getUserOrder, listUserOrders } from "../src/lib/server/order-service";
import { createMidtransSignature, processMidtransNotification, simulateDemoPayment } from "../src/lib/server/payment-service";
import { estimateShipping } from "../src/lib/server/shipping-service";

process.env.DEMO_MODE = "true";
process.env.MIDTRANS_MOCK_ENABLED = "true";

const testEmail = "sprint5-backend-test@summitgear.local";

function assertCheck(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function cleanup() {
  const user = await prisma.user.findUnique({
    where: { email: testEmail },
    select: { id: true },
  });

  if (!user) return;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
  });

  for (const order of orders) {
    if (order.stockReleasedAt) continue;

    for (const item of order.items) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }
  }

  await prisma.order.deleteMany({ where: { userId: user.id } });
  await prisma.cart.deleteMany({ where: { userId: user.id } });
  await prisma.address.deleteMany({ where: { userId: user.id } });
  await prisma.notification.deleteMany({ where: { userId: user.id } });
  await prisma.searchHistory.deleteMany({ where: { userId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });
}

async function createTestUser() {
  const user = await prisma.user.create({
    data: {
      email: testEmail,
      name: "Sprint 5 Backend Test",
      phone: "081234567890",
      emailVerified: new Date(),
    },
  });

  const address = await prisma.address.create({
    data: {
      userId: user.id,
      label: "Rumah",
      recipient: "Sprint Test",
      phone: "081234567890",
      fullAddress: "Jl. Sprint 5 No. 1, Sleman",
      province: "DI Yogyakarta",
      city: "Sleman",
      district: "Ngaglik",
      postalCode: "55581",
      isPrimary: true,
    },
  });

  return { user, address };
}

async function getVariant() {
  const product = await prisma.product.findFirstOrThrow({
    where: {
      status: "ACTIVE",
      variants: {
        some: {
          stock: { gte: 8 },
        },
      },
    },
    include: {
      variants: {
        where: { stock: { gte: 8 } },
        take: 1,
      },
    },
  });

  return {
    product,
    variant: product.variants[0],
  };
}

async function createOrder(userId: string, addressId: string, productId: string, variantId: string, quantity: number, paymentMethod: "MIDTRANS_VA" | "COD" = "MIDTRANS_VA") {
  await addCartItem(userId, {
    productId,
    variantId,
    quantity,
  });

  const shipping = await estimateShipping(userId, { addressId });

  return createCheckoutOrder(userId, {
    addressId,
    shippingServiceId: shipping.services[0].id,
    paymentMethod,
  });
}

function notificationPayload(orderNumber: string, grossAmount: number, transactionStatus: string) {
  const statusCode = "200";
  const grossAmountString = grossAmount.toFixed(2);

  return {
    transaction_time: "2026-06-01 10:00:00",
    transaction_status: transactionStatus,
    transaction_id: `midtrans-${orderNumber}`,
    status_code: statusCode,
    signature_key: createMidtransSignature({
      orderId: orderNumber,
      statusCode,
      grossAmount: grossAmountString,
    }),
    payment_type: "bank_transfer",
    order_id: orderNumber,
    gross_amount: grossAmountString,
    fraud_status: "accept",
  };
}

async function expectReject(label: string, action: () => Promise<unknown>) {
  try {
    await action();
  } catch {
    return { check: label, ok: true };
  }

  return { check: label, ok: false };
}

async function main() {
  await cleanup();

  const { user, address } = await createTestUser();
  const { product, variant } = await getVariant();
  const stockStart = variant.stock;
  const checks: Array<{ check: string; ok: boolean }> = [];

  const midtransOrder = await createOrder(user.id, address.id, product.id, variant.id, 1);
  checks.push({ check: "midtrans demo returned", ok: Boolean(midtransOrder.payment?.snapToken && midtransOrder.payment.redirectUrl && midtransOrder.payment.isDemo) });

  const paidResult = await simulateDemoPayment(user.id, midtransOrder.orderNumber);
  checks.push({ check: "demo settlement paid", ok: paidResult.orderStatus === "PAID" && paidResult.paymentStatus === "PAID" });
  checks.push(await expectReject("demo settlement ownership enforced", () => simulateDemoPayment("missing-user", midtransOrder.orderNumber)));

  const stockAfterPaid = await prisma.productVariant.findUniqueOrThrow({ where: { id: variant.id } });
  await processMidtransNotification(notificationPayload(midtransOrder.orderNumber, midtransOrder.total, "settlement"));
  const paidNotifications = await prisma.notification.count({
    where: {
      userId: user.id,
      type: "payment.paid",
    },
  });
  const stockAfterReplay = await prisma.productVariant.findUniqueOrThrow({ where: { id: variant.id } });
  checks.push({ check: "settlement replay idempotent", ok: paidNotifications === 1 && stockAfterReplay.stock === stockAfterPaid.stock });

  const expiredOrder = await createOrder(user.id, address.id, product.id, variant.id, 2);
  const stockAfterExpiredReserve = await prisma.productVariant.findUniqueOrThrow({ where: { id: variant.id } });
  await processMidtransNotification(notificationPayload(expiredOrder.orderNumber, expiredOrder.total, "expire"));
  const stockAfterExpired = await prisma.productVariant.findUniqueOrThrow({ where: { id: variant.id } });
  await processMidtransNotification(notificationPayload(expiredOrder.orderNumber, expiredOrder.total, "expire"));
  const stockAfterExpiredReplay = await prisma.productVariant.findUniqueOrThrow({ where: { id: variant.id } });
  checks.push({
    check: "expire releases stock once",
    ok: stockAfterExpired.stock === stockAfterExpiredReserve.stock + 2 && stockAfterExpiredReplay.stock === stockAfterExpired.stock,
  });

  const codOrder = await createOrder(user.id, address.id, product.id, variant.id, 1, "COD");
  checks.push({ check: "cod skips snap", ok: !codOrder.payment?.snapToken && codOrder.status === "PROCESSING" });

  const cancellableOrder = await createOrder(user.id, address.id, product.id, variant.id, 1);
  const cancelled = await cancelUserOrder(user.id, cancellableOrder.orderNumber);
  checks.push({ check: "cancel pending releases stock", ok: cancelled.status === "CANCELLED" && Boolean(cancelled.stockReleasedAt) });

  const orders = await listUserOrders(user.id, { status: "ALL" });
  const detail = await getUserOrder(user.id, midtransOrder.orderNumber);
  checks.push({ check: "customer order list/detail", ok: orders.length >= 4 && detail.orderNumber === midtransOrder.orderNumber });

  checks.push(await expectReject("cancel paid rejected", () => cancelUserOrder(user.id, midtransOrder.orderNumber)));
  checks.push(await expectReject("received before delivered rejected", () => confirmUserOrderReceived(user.id, midtransOrder.orderNumber)));

  await prisma.order.update({ where: { orderNumber: midtransOrder.orderNumber }, data: { status: "DELIVERED" } });
  const completed = await confirmUserOrderReceived(user.id, midtransOrder.orderNumber);
  checks.push({ check: "delivered can complete", ok: completed.status === "COMPLETED" });

  const stockBeforeCleanup = await prisma.productVariant.findUniqueOrThrow({ where: { id: variant.id } });
  checks.push({ check: "stock reserved for active orders", ok: stockBeforeCleanup.stock < stockStart });

  console.table(checks);

  for (const check of checks) {
    assertCheck(check.ok, check.check);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await cleanup();
    await prisma.$disconnect();
  });
