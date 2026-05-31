import "dotenv/config";

import { prisma } from "../src/lib/db";
import { addCartItem, getCart, updateCartItem } from "../src/lib/server/cart-service";
import { createCheckoutOrder } from "../src/lib/server/checkout-service";
import { estimateShipping } from "../src/lib/server/shipping-service";
import { validateVoucher } from "../src/lib/server/voucher-service";

const testEmail = "sprint4-backend-test@summitgear.local";

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
  await prisma.user.delete({ where: { id: user.id } });
}

async function main() {
  await cleanup();

  const product = await prisma.product.findFirstOrThrow({
    where: {
      status: "ACTIVE",
      variants: {
        some: {
          stock: { gte: 4 },
        },
      },
    },
    include: {
      variants: {
        where: { stock: { gte: 4 } },
        take: 1,
      },
    },
  });
  const variant = product.variants[0];
  const stockBefore = variant.stock;

  const user = await prisma.user.create({
    data: {
      email: testEmail,
      name: "Sprint 4 Backend Test",
      emailVerified: new Date(),
    },
  });

  const address = await prisma.address.create({
    data: {
      userId: user.id,
      label: "Rumah",
      recipient: "Sprint Test",
      phone: "081234567890",
      fullAddress: "Jl. Sprint 4 No. 1, Sleman",
      province: "DI Yogyakarta",
      city: "Sleman",
      district: "Ngaglik",
      postalCode: "55581",
      isPrimary: true,
    },
  });

  const checks: Array<{ check: string; ok: boolean; detail?: string }> = [];

  const cartAfterAdd = await addCartItem(user.id, {
    productId: product.id,
    variantId: variant.id,
    quantity: 2,
  });
  checks.push({ check: "cart add", ok: cartAfterAdd.summary.totalQuantity === 2 });

  const itemId = cartAfterAdd.items[0].id;
  const cartAfterUpdate = await updateCartItem(user.id, itemId, { quantity: 3 });
  checks.push({ check: "cart update", ok: cartAfterUpdate.summary.totalQuantity === 3 });

  const shipping = await estimateShipping(user.id, { addressId: address.id });
  checks.push({ check: "shipping rates", ok: shipping.services.length >= 3 && shipping.weightGram > 0 });

  const voucher = await validateVoucher({
    code: "SUMMIT50",
    subtotal: cartAfterUpdate.summary.subtotal,
    shippingCost: shipping.services[0].price,
  });
  checks.push({ check: "voucher validation", ok: voucher.discount === 50000 });

  const order = await createCheckoutOrder(user.id, {
    addressId: address.id,
    shippingServiceId: shipping.services[0].id,
    voucherCode: "SUMMIT50",
    paymentMethod: "MIDTRANS_VA",
  });
  checks.push({ check: "order created", ok: order.orderNumber.startsWith("SG-") && order.items.length === 1 });
  checks.push({ check: "order total", ok: order.total === order.subtotal + order.shippingCost - order.discount });
  checks.push({ check: "payment placeholder", ok: order.payment?.status === "PENDING" });
  checks.push({ check: "shipment placeholder", ok: order.shipment?.status === "PENDING" });

  const cartAfterCheckout = await getCart(user.id);
  checks.push({ check: "cart cleared", ok: cartAfterCheckout.items.length === 0 });

  const variantAfter = await prisma.productVariant.findUniqueOrThrow({ where: { id: variant.id } });
  checks.push({ check: "stock reserved", ok: variantAfter.stock === stockBefore - 3 });

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
