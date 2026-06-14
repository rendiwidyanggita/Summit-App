import "dotenv/config";

import { prisma } from "../src/lib/db";
import {
  adminBannerMutationSchema,
  adminCategoryMutationSchema,
  adminProductMutationSchema,
  adminVoucherMutationSchema,
  archiveAdminProduct,
  createAdminBanner,
  createAdminCategory,
  createAdminProduct,
  createAdminVoucher,
  deleteAdminBanner,
  deleteAdminCategory,
  listLowStockVariants,
  updateAdminFulfillment,
} from "../src/lib/server/admin-commerce-service";

const slug = "sprint-6-verification";
const actorEmail = "admin@summitgear.local";
const customerEmail = "sprint6-customer@summitgear.local";

function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function expectReject(action: () => Promise<unknown>) {
  try { await action(); return false; } catch { return true; }
}

async function cleanup() {
  await prisma.auditLog.deleteMany({ where: { OR: [{ targetId: { contains: slug } }, { metadata: { path: ["slug"], equals: slug } }] } }).catch(() => undefined);
  await prisma.order.deleteMany({ where: { orderNumber: { startsWith: "SG-SPRINT6" } } });
  await prisma.user.deleteMany({ where: { email: customerEmail } });
  await prisma.banner.deleteMany({ where: { title: { contains: slug } } });
  await prisma.voucher.deleteMany({ where: { code: "SPRINT6" } });
  await prisma.product.deleteMany({ where: { slug } });
  await prisma.category.deleteMany({ where: { slug: { startsWith: slug } } });
  await prisma.brand.deleteMany({ where: { slug } });
}

async function main() {
  await cleanup();
  const actor = await prisma.user.findUniqueOrThrow({ where: { email: actorEmail } });
  const category = await createAdminCategory(actor.id, adminCategoryMutationSchema.parse({ name: "Sprint 6", slug, isVisible: true }));
  const brand = await prisma.brand.create({ data: { name: "Sprint 6", slug } });
  const product = await createAdminProduct(actor.id, adminProductMutationSchema.parse({
    name: "Sprint 6 Product", slug, description: "Produk untuk verifikasi backend Sprint 6.", categoryId: category.id, brandId: brand.id,
    weightGram: 1000, price: 200000, costPrice: 100000, photos: ["https://example.com/product.jpg"], status: "ACTIVE",
    variants: [{ sku: "SPRINT6-SKU", stock: 1, minimumStock: 10, priceModifier: 0, isActive: true }],
  }));
  check(product.margin === 50 && product.lowStock, "product margin/low stock");
  check((await listLowStockVariants()).some((variant) => variant.sku === "SPRINT6-SKU"), "stock alert");

  const protectedCategory = await prisma.category.create({ data: { name: "Protected", slug: `${slug}-protected` } });
  await prisma.product.update({ where: { id: product.id }, data: { categoryId: protectedCategory.id } });
  check(await expectReject(() => deleteAdminCategory(actor.id, protectedCategory.id)), "category in use must reject");

  const voucher = await createAdminVoucher(actor.id, adminVoucherMutationSchema.parse({
    code: "SPRINT6", name: "Sprint 6 Voucher", type: "FIXED_AMOUNT", value: 10000, minSpend: 100000,
    startsAt: new Date("2026-01-01"), endsAt: new Date("2027-01-01"), quota: 10, status: "ACTIVE",
  }));
  const banner = await createAdminBanner(actor.id, adminBannerMutationSchema.parse({ title: `Banner ${slug}`, imageUrl: "https://example.com/banner.jpg", placement: "HOME_HERO", isActive: true }));
  check(voucher.code === "SPRINT6" && banner.isActive, "promo create");

  const customer = await prisma.user.create({ data: { email: customerEmail, emailVerified: new Date(), name: "Sprint 6 Customer" } });
  const order = await prisma.order.create({
    data: {
      orderNumber: "SG-SPRINT6-ORDER", userId: customer.id, addressSnapshot: { recipient: "Customer", fullAddress: "Alamat", phone: "0812" },
      subtotal: 200000, total: 200000, status: "PAID", paymentMethod: "MIDTRANS_VA",
      payment: { create: { method: "MIDTRANS_VA", status: "PAID", amount: 200000 } },
      shipment: { create: { courier: "JNE", service: "REG" } },
    },
  });
  check(await expectReject(() => updateAdminFulfillment(actor.id, order.id, { status: "SHIPPED", trackingNo: null, trackingUrl: null })), "invalid transition/tracking reject");
  await updateAdminFulfillment(actor.id, order.id, { status: "PROCESSING", trackingNo: null, trackingUrl: null });
  check(await expectReject(() => updateAdminFulfillment(actor.id, order.id, { status: "SHIPPED", trackingNo: null, trackingUrl: null })), "shipping without tracking reject");
  await updateAdminFulfillment(actor.id, order.id, { status: "SHIPPED", trackingNo: "JNE-SPRINT6", trackingUrl: "https://example.com/track" });
  check(await prisma.notification.count({ where: { userId: customer.id, type: "order.shipped" } }) === 1, "shipment notification");

  const operational = await prisma.role.findUniqueOrThrow({ where: { code: "ADMIN_OPERASIONAL" }, include: { permissions: { include: { permission: true } } } });
  const marketing = await prisma.role.findUniqueOrThrow({ where: { code: "ADMIN_MARKETING" }, include: { permissions: { include: { permission: true } } } });
  check(!operational.permissions.some((item) => item.permission.code === "promo.write"), "operational promo denied");
  check(!marketing.permissions.some((item) => item.permission.code === "order.write"), "marketing order denied");

  await archiveAdminProduct(actor.id, product.id);
  check((await prisma.product.findUniqueOrThrow({ where: { id: product.id } })).status === "ARCHIVED", "product archive");
  check(await prisma.auditLog.count({ where: { actorId: actor.id, createdAt: { gte: new Date(Date.now() - 60_000) } } }) >= 6, "audit log");

  await deleteAdminBanner(actor.id, banner.id);
  await deleteAdminCategory(actor.id, category.id);
  console.log("Sprint 6 backend verification passed.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => { await cleanup(); await prisma.$disconnect(); });
