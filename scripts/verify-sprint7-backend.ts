import "dotenv/config";

import { prisma } from "../src/lib/db";
import {
  addWishlist,
  archiveAdminArticle,
  articleMutationSchema,
  complaintMutationSchema,
  createAdminArticle,
  createComplaint,
  createReturnRequest,
  createReview,
  getPublicArticle,
  listNotifications,
  listPublicArticles,
  markAllNotificationsRead,
  markNotificationRead,
  moderateReview,
  processReturnRefund,
  removeWishlist,
  returnMutationSchema,
  updateComplaintStatus,
  updateReturnStatus,
} from "../src/lib/server/trust-support-service";

const customerEmail = "sprint7-customer@summitgear.local";
const otherEmail = "sprint7-other@summitgear.local";
const slug = "sprint-7-verification";
const actorEmail = "admin@summitgear.local";

function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
async function rejects(action: () => Promise<unknown>) {
  try { await action(); return false; } catch { return true; }
}
async function cleanup() {
  const reviews = await prisma.review.findMany({ where: { user: { email: customerEmail } }, select: { id: true } });
  const returns = await prisma.returnRequest.findMany({ where: { user: { email: customerEmail } }, select: { id: true } });
  const complaints = await prisma.complaint.findMany({ where: { user: { email: customerEmail } }, select: { id: true } });
  const articles = await prisma.article.findMany({ where: { slug }, select: { id: true } });
  const targetIds = [...reviews, ...returns, ...complaints, ...articles].map((item) => item.id);
  if (targetIds.length) await prisma.auditLog.deleteMany({ where: { targetId: { in: targetIds } } });
  await prisma.article.deleteMany({ where: { slug } });
  await prisma.notification.deleteMany({ where: { user: { email: { in: [customerEmail, otherEmail] } } } });
  await prisma.complaint.deleteMany({ where: { user: { email: customerEmail } } });
  await prisma.returnRequest.deleteMany({ where: { user: { email: customerEmail } } });
  await prisma.review.deleteMany({ where: { user: { email: customerEmail } } });
  await prisma.wishlist.deleteMany({ where: { user: { email: customerEmail } } });
  await prisma.order.deleteMany({ where: { orderNumber: "SG-SPRINT7-ORDER" } });
  await prisma.user.deleteMany({ where: { email: { in: [customerEmail, otherEmail] } } });
  await prisma.product.deleteMany({ where: { slug } });
  await prisma.category.deleteMany({ where: { slug } });
  await prisma.brand.deleteMany({ where: { slug } });
}

async function main() {
  await cleanup();
  const actor = await prisma.user.findUniqueOrThrow({ where: { email: actorEmail } });
  const customer = await prisma.user.create({ data: { email: customerEmail, name: "Sprint 7 Customer", emailVerified: new Date() } });
  const other = await prisma.user.create({ data: { email: otherEmail, name: "Other Customer", emailVerified: new Date() } });
  const category = await prisma.category.create({ data: { name: "Sprint 7", slug } });
  const brand = await prisma.brand.create({ data: { name: "Sprint 7", slug } });
  const product = await prisma.product.create({
    data: { name: "Sprint 7 Product", slug, description: "Produk khusus verifikasi Sprint 7.", categoryId: category.id, brandId: brand.id, weightGram: 500, price: 100000, costPrice: 50000, photos: ["https://example.com/product.jpg"], status: "ACTIVE", variants: { create: { sku: "SPRINT7-SKU", stock: 10 } } },
  });
  const variant = await prisma.productVariant.findFirstOrThrow({ where: { productId: product.id } });
  const order = await prisma.order.create({
    data: {
      orderNumber: "SG-SPRINT7-ORDER", userId: customer.id, addressSnapshot: { recipient: "Customer" }, subtotal: 100000, total: 100000, status: "COMPLETED", paymentMethod: "MIDTRANS_VA",
      shipment: { create: { courier: "JNE", service: "REG", status: "DELIVERED", deliveredAt: new Date() } },
      items: { create: { productId: product.id, variantId: variant.id, quantity: 2, unitPrice: 50000, subtotal: 100000 } },
    },
    include: { items: true },
  });
  const orderItem = order.items[0];

  const firstWishlist = await addWishlist(customer.id, product.id);
  const secondWishlist = await addWishlist(customer.id, product.id);
  check(firstWishlist.id === secondWishlist.id && await prisma.wishlist.count({ where: { userId: customer.id } }) === 1, "wishlist duplicate prevention");
  await removeWishlist(customer.id, product.id);

  const review = await createReview(customer.id, { orderItemId: orderItem.id, rating: 5, text: "Review terverifikasi untuk produk Sprint 7.", photos: [] });
  check(review.status === "PENDING", "review starts pending");
  check(await rejects(() => createReview(customer.id, { orderItemId: orderItem.id, rating: 4, text: "Review kedua harus ditolak.", photos: [] })), "duplicate review rejected");
  await moderateReview(actor.id, review.id, "PUBLISHED");
  const ratedProduct = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
  check(ratedProduct.ratingCount === 1 && Number(ratedProduct.ratingAvg) === 5, "published review updates rating");

  const request = await createReturnRequest(customer.id, returnMutationSchema.parse({ orderItemId: orderItem.id, quantity: 1, reason: "Barang rusak", description: "Barang rusak saat diterima customer.", photos: ["https://example.com/evidence.jpg"] }));
  check(await rejects(() => createReturnRequest(customer.id, returnMutationSchema.parse({ orderItemId: orderItem.id, quantity: 1, reason: "Duplikat", description: "Pengajuan duplikat harus ditolak.", photos: ["https://example.com/evidence.jpg"] }))), "active return duplicate rejected");
  await updateReturnStatus(actor.id, request.id, { status: "REVIEWING", reviewNote: "Bukti diperiksa." });
  await updateReturnStatus(actor.id, request.id, { status: "APPROVED", reviewNote: "Return disetujui." });
  await updateReturnStatus(actor.id, request.id, { status: "RECEIVED", reviewNote: "Barang diterima gudang." });
  check(await rejects(() => processReturnRefund(other.id, "missing")), "invalid refund target rejected");
  const refunded = await processReturnRefund(actor.id, request.id);
  check(refunded.refundStatus === "PROCESSED", "manual refund processed");
  await updateReturnStatus(actor.id, request.id, { status: "CLOSED", reviewNote: "Selesai." });

  const complaint = await createComplaint(customer.id, complaintMutationSchema.parse({ orderId: order.id, category: "Produk", title: "Kondisi produk bermasalah", description: "Customer membutuhkan bantuan admin untuk produk.", photos: [] }));
  await updateComplaintStatus(actor.id, complaint.id, { status: "IN_REVIEW", resolutionNote: null });
  const resolved = await updateComplaintStatus(actor.id, complaint.id, { status: "RESOLVED", resolutionNote: "Penggantian dan refund telah dikonfirmasi." });
  check(resolved.status === "RESOLVED", "complaint resolved");

  const article = await createAdminArticle(actor.id, articleMutationSchema.parse({ title: "Sprint 7 Verification Article", slug, excerpt: "Artikel untuk verifikasi publikasi Sprint 7.", category: "Testing", tags: ["sprint7"], content: "Paragraf artikel verifikasi Sprint 7 yang cukup panjang untuk memenuhi validasi konten.", imageUrl: "", status: "DRAFT", metaTitle: "", metaDescription: "" }));
  check(!(await listPublicArticles({ q: slug, status: "ALL", page: 1, pageSize: 20 })).items.length, "draft article hidden");
  await prisma.article.update({ where: { id: article.id }, data: { status: "PUBLISHED", publishedAt: new Date() } });
  check((await getPublicArticle(slug)).article.slug === slug, "published article visible");
  await archiveAdminArticle(actor.id, article.id);

  const notifications = await listNotifications(customer.id, { status: "ALL", page: 1, pageSize: 100 });
  check(notifications.unread >= 4, "status mutations create notifications");
  check(await rejects(() => markNotificationRead(other.id, notifications.items[0].id)), "notification user isolation");
  await markAllNotificationsRead(customer.id);
  check((await listNotifications(customer.id, { status: "UNREAD", page: 1, pageSize: 100 })).unread === 0, "mark all read");

  const cs = await prisma.role.findUniqueOrThrow({ where: { code: "ADMIN_CUSTOMER_SERVICE" }, include: { permissions: { include: { permission: true } } } });
  const finance = await prisma.role.findUniqueOrThrow({ where: { code: "ADMIN_FINANCE" }, include: { permissions: { include: { permission: true } } } });
  const marketing = await prisma.role.findUniqueOrThrow({ where: { code: "ADMIN_MARKETING" }, include: { permissions: { include: { permission: true } } } });
  check(cs.permissions.some((item) => item.permission.code === "complaint.manage") && !cs.permissions.some((item) => item.permission.code === "return.refund"), "CS permission boundary");
  check(finance.permissions.some((item) => item.permission.code === "return.refund"), "finance refund permission");
  check(marketing.permissions.some((item) => item.permission.code === "article.write"), "marketing article permission");
  check(await prisma.auditLog.count({ where: { actorId: actor.id, module: { in: ["trust", "support", "finance", "content"] } } }) >= 8, "Sprint 7 audit logs");
  console.log("Sprint 7 backend verification passed.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => { await cleanup(); await prisma.$disconnect(); });
