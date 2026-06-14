import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { ApiError } from "@/lib/server/http";

const optionalText = z.string().trim().optional().transform((value) => value || null);
const optionalUrl = z.union([z.string().url(), z.literal("")]).optional().transform((value) => value || null);
const urlList = z.array(z.string().url()).max(6).default([]);

export const trustListQuerySchema = z.object({
  q: z.string().trim().optional(),
  status: z.string().trim().default("ALL"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const wishlistMutationSchema = z.object({ productId: z.string().trim().min(1) });
export const reviewMutationSchema = z.object({
  orderItemId: z.string().trim().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  text: z.string().trim().min(10).max(3000),
  photos: urlList,
});
export const reviewModerationSchema = z.object({ status: z.enum(["PUBLISHED", "HIDDEN"]) });
export const returnMutationSchema = z.object({
  orderItemId: z.string().trim().min(1),
  quantity: z.coerce.number().int().positive(),
  reason: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(3000),
  photos: z.array(z.string().url()).min(1).max(6),
});
export const returnStatusSchema = z.object({
  status: z.enum(["REVIEWING", "APPROVED", "REJECTED", "RECEIVED", "CLOSED"]),
  reviewNote: optionalText,
});
export const complaintMutationSchema = z.object({
  orderId: z.string().trim().min(1),
  category: z.string().trim().min(2).max(80),
  title: z.string().trim().min(5).max(160),
  description: z.string().trim().min(10).max(3000),
  photos: urlList,
});
export const complaintStatusSchema = z.object({
  status: z.enum(["IN_REVIEW", "RESOLVED", "CLOSED"]),
  resolutionNote: optionalText,
}).superRefine((value, context) => {
  if (["RESOLVED", "CLOSED"].includes(value.status) && !value.resolutionNote) {
    context.addIssue({ code: "custom", path: ["resolutionNote"], message: "Catatan penyelesaian wajib diisi." });
  }
});
export const articleMutationSchema = z.object({
  title: z.string().trim().min(5).max(200),
  slug: z.string().trim().min(3).max(220).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().trim().min(10).max(500),
  category: z.string().trim().min(2).max(80),
  tags: z.array(z.string().trim().min(1).max(50)).max(12).default([]),
  content: z.string().trim().min(30),
  imageUrl: optionalUrl,
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  metaTitle: optionalText,
  metaDescription: optionalText,
});

type DbClient = Prisma.TransactionClient | typeof prisma;

function pageResult(page: number, pageSize: number, total: number) {
  return { page, pageSize, total, totalPages: Math.ceil(total / pageSize) };
}

async function audit(client: DbClient, actorId: string, action: string, module: string, targetId: string, metadata?: Prisma.InputJsonValue) {
  await client.auditLog.create({ data: { actorId, action, module, targetId, metadata } });
}

function productPrice(product: { price: Prisma.Decimal; discountPrice: Prisma.Decimal | null }) {
  return Number(product.discountPrice ?? product.price);
}

const wishlistInclude = {
  product: {
    include: {
      brand: true,
      category: true,
      variants: { where: { isActive: true } },
    },
  },
} satisfies Prisma.WishlistInclude;

function serializeWishlist(item: Prisma.WishlistGetPayload<{ include: typeof wishlistInclude }>) {
  return {
    id: item.id,
    createdAt: item.createdAt,
    product: {
      id: item.product.id,
      slug: item.product.slug,
      name: item.product.name,
      photo: item.product.photos[0] ?? null,
      brand: item.product.brand.name,
      category: item.product.category.name,
      price: productPrice(item.product),
      compareAt: Number(item.product.price),
      stock: item.product.variants.reduce((sum, variant) => sum + variant.stock, 0),
      soldCount: item.product.soldCount,
      ratingAvg: item.product.ratingAvg ? Number(item.product.ratingAvg) : null,
    },
  };
}

export async function listWishlist(userId: string) {
  const items = await prisma.wishlist.findMany({
    where: { userId, product: { status: "ACTIVE" } },
    include: wishlistInclude,
    orderBy: { createdAt: "desc" },
  });
  return items.map(serializeWishlist);
}

export async function addWishlist(userId: string, productId: string) {
  const product = await prisma.product.findFirst({ where: { id: productId, status: "ACTIVE" }, select: { id: true } });
  if (!product) throw new ApiError(404, "PRODUCT_NOT_FOUND", "Produk aktif tidak ditemukan.");
  const item = await prisma.wishlist.upsert({
    where: { userId_productId: { userId, productId } },
    create: { userId, productId },
    update: {},
    include: wishlistInclude,
  });
  return serializeWishlist(item);
}

export async function removeWishlist(userId: string, productId: string) {
  await prisma.wishlist.deleteMany({ where: { userId, productId } });
  return { productId };
}

const reviewInclude = {
  user: { select: { id: true, name: true } },
  product: { select: { id: true, name: true, slug: true } },
  orderItem: { include: { variant: { select: { sku: true, size: true, color: true } }, order: { select: { orderNumber: true } } } },
  moderatedBy: { select: { id: true, name: true, email: true } },
} satisfies Prisma.ReviewInclude;

function serializeReview(review: Prisma.ReviewGetPayload<{ include: typeof reviewInclude }>) {
  return {
    ...review,
    customerName: review.user.name ?? "Customer Summit",
    variant: review.orderItem.variant,
    orderNumber: review.orderItem.order.orderNumber,
  };
}

export async function createReview(userId: string, input: z.infer<typeof reviewMutationSchema>) {
  const item = await prisma.orderItem.findFirst({
    where: { id: input.orderItemId, order: { userId, status: "COMPLETED" } },
    include: { order: true, review: true },
  });
  if (!item) throw new ApiError(400, "REVIEW_NOT_ELIGIBLE", "Review hanya dapat dibuat untuk item dari order selesai milik Anda.");
  if (item.review) throw new ApiError(409, "REVIEW_EXISTS", "Item ini sudah memiliki review.");
  const review = await prisma.review.create({
    data: { ...input, userId, productId: item.productId, status: "PENDING" },
    include: reviewInclude,
  });
  return serializeReview(review);
}

export async function listProductReviews(slug: string, query: z.infer<typeof trustListQuerySchema>) {
  const product = await prisma.product.findFirst({ where: { slug, status: "ACTIVE" }, select: { id: true } });
  if (!product) throw new ApiError(404, "PRODUCT_NOT_FOUND", "Produk tidak ditemukan.");
  const rating = Number(query.status);
  const where: Prisma.ReviewWhereInput = {
    productId: product.id,
    status: "PUBLISHED",
    ...(Number.isInteger(rating) && rating >= 1 && rating <= 5 ? { rating } : {}),
  };
  const skip = (query.page - 1) * query.pageSize;
  const [items, total, aggregate, grouped] = await prisma.$transaction([
    prisma.review.findMany({ where, include: reviewInclude, orderBy: { createdAt: "desc" }, skip, take: query.pageSize }),
    prisma.review.count({ where }),
    prisma.review.aggregate({ where: { productId: product.id, status: "PUBLISHED" }, _avg: { rating: true }, _count: true }),
    prisma.review.groupBy({ by: ["rating"], where: { productId: product.id, status: "PUBLISHED" }, _count: true }),
  ]);
  return {
    items: items.map(serializeReview),
    summary: {
      average: aggregate._avg.rating ?? 0,
      count: aggregate._count,
      distribution: [5, 4, 3, 2, 1].map((value) => ({ rating: value, count: grouped.find((row) => row.rating === value)?._count ?? 0 })),
    },
    pagination: pageResult(query.page, query.pageSize, total),
  };
}

export async function listAdminReviews(query: z.infer<typeof trustListQuerySchema>) {
  const where: Prisma.ReviewWhereInput = {
    ...(query.status === "ALL" ? {} : { status: query.status as "PENDING" | "PUBLISHED" | "HIDDEN" }),
    ...(query.q ? { OR: [
      { text: { contains: query.q, mode: "insensitive" } },
      { product: { name: { contains: query.q, mode: "insensitive" } } },
      { user: { email: { contains: query.q, mode: "insensitive" } } },
    ] } : {}),
  };
  const skip = (query.page - 1) * query.pageSize;
  const [items, total] = await prisma.$transaction([
    prisma.review.findMany({ where, include: reviewInclude, orderBy: { createdAt: "desc" }, skip, take: query.pageSize }),
    prisma.review.count({ where }),
  ]);
  return { items: items.map(serializeReview), pagination: pageResult(query.page, query.pageSize, total) };
}

async function refreshProductRating(tx: Prisma.TransactionClient, productId: string) {
  const stats = await tx.review.aggregate({ where: { productId, status: "PUBLISHED" }, _avg: { rating: true }, _count: true });
  await tx.product.update({ where: { id: productId }, data: { ratingAvg: stats._avg.rating, ratingCount: stats._count } });
}

export async function moderateReview(actorId: string, id: string, status: "PUBLISHED" | "HIDDEN") {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.review.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, "REVIEW_NOT_FOUND", "Review tidak ditemukan.");
    const review = await tx.review.update({
      where: { id },
      data: { status, moderatedById: actorId, moderatedAt: new Date() },
      include: reviewInclude,
    });
    await refreshProductRating(tx, review.productId);
    await tx.notification.create({
      data: {
        userId: review.userId,
        type: `review.${status.toLowerCase()}`,
        title: status === "PUBLISHED" ? "Review diterbitkan" : "Review disembunyikan",
        message: `Review Anda untuk ${review.product.name} telah dimoderasi.`,
        linkUrl: `/produk/${review.product.slug}`,
      },
    });
    await audit(tx, actorId, "review.moderate", "trust", id, { from: existing.status, to: status });
    return serializeReview(review);
  });
}

const returnInclude = {
  order: { select: { id: true, orderNumber: true, status: true, shipment: true } },
  orderItem: { include: { product: { select: { id: true, name: true, slug: true, photos: true } }, variant: true } },
  user: { select: { id: true, name: true, email: true } },
  reviewedBy: { select: { id: true, name: true, email: true } },
  refundedBy: { select: { id: true, name: true, email: true } },
} satisfies Prisma.ReturnRequestInclude;

function serializeReturn(item: Prisma.ReturnRequestGetPayload<{ include: typeof returnInclude }>) {
  return { ...item, orderItem: { ...item.orderItem, unitPrice: Number(item.orderItem.unitPrice), subtotal: Number(item.orderItem.subtotal) } };
}

export async function createReturnRequest(userId: string, input: z.infer<typeof returnMutationSchema>) {
  const item = await prisma.orderItem.findFirst({
    where: { id: input.orderItemId, order: { userId, status: { in: ["DELIVERED", "COMPLETED"] } } },
    include: { order: { include: { shipment: true } } },
  });
  if (!item?.order.shipment?.deliveredAt) throw new ApiError(400, "RETURN_NOT_ELIGIBLE", "Return hanya tersedia untuk order yang telah diterima.");
  if (Date.now() - item.order.shipment.deliveredAt.getTime() > 7 * 24 * 60 * 60 * 1000) {
    throw new ApiError(400, "RETURN_WINDOW_EXPIRED", "Batas pengajuan return tujuh hari telah berakhir.");
  }
  if (input.quantity > item.quantity) throw new ApiError(400, "RETURN_QUANTITY_INVALID", "Kuantitas return melebihi jumlah pembelian.");
  const active = await prisma.returnRequest.findFirst({ where: { orderItemId: item.id, status: { in: ["REQUESTED", "REVIEWING", "APPROVED", "RECEIVED"] } } });
  if (active) throw new ApiError(409, "RETURN_ACTIVE_EXISTS", "Item ini masih memiliki pengajuan return aktif.");
  const request = await prisma.returnRequest.create({
    data: { ...input, userId, orderId: item.orderId },
    include: returnInclude,
  });
  return serializeReturn(request);
}

export async function listUserReturns(userId: string, query: z.infer<typeof trustListQuerySchema>) {
  return listReturns({ userId }, query);
}

async function listReturns(baseWhere: Prisma.ReturnRequestWhereInput, query: z.infer<typeof trustListQuerySchema>) {
  const where: Prisma.ReturnRequestWhereInput = {
    ...baseWhere,
    ...(query.status === "ALL" ? {} : { status: query.status as Prisma.EnumReturnStatusFilter }),
    ...(query.q ? { OR: [
      { reason: { contains: query.q, mode: "insensitive" } },
      { order: { orderNumber: { contains: query.q, mode: "insensitive" } } },
      { orderItem: { product: { name: { contains: query.q, mode: "insensitive" } } } },
    ] } : {}),
  };
  const skip = (query.page - 1) * query.pageSize;
  const [items, total] = await prisma.$transaction([
    prisma.returnRequest.findMany({ where, include: returnInclude, orderBy: { createdAt: "desc" }, skip, take: query.pageSize }),
    prisma.returnRequest.count({ where }),
  ]);
  return { items: items.map(serializeReturn), pagination: pageResult(query.page, query.pageSize, total) };
}

export async function getUserReturn(userId: string, id: string) {
  const item = await prisma.returnRequest.findFirst({ where: { id, userId }, include: returnInclude });
  if (!item) throw new ApiError(404, "RETURN_NOT_FOUND", "Return tidak ditemukan.");
  return serializeReturn(item);
}

export async function listAdminReturns(query: z.infer<typeof trustListQuerySchema>) {
  return listReturns({}, query);
}

const returnTransitions: Record<string, string[]> = {
  REQUESTED: ["REVIEWING", "REJECTED"],
  REVIEWING: ["APPROVED", "REJECTED"],
  APPROVED: ["RECEIVED"],
  RECEIVED: ["CLOSED"],
};

export async function updateReturnStatus(actorId: string, id: string, input: z.infer<typeof returnStatusSchema>) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.returnRequest.findUnique({ where: { id }, include: returnInclude });
    if (!current) throw new ApiError(404, "RETURN_NOT_FOUND", "Return tidak ditemukan.");
    if (!returnTransitions[current.status]?.includes(input.status)) throw new ApiError(400, "RETURN_TRANSITION_INVALID", `Transisi ${current.status} ke ${input.status} tidak diizinkan.`);
    if (input.status === "CLOSED" && current.refundStatus === "MANUAL_REVIEW") throw new ApiError(400, "REFUND_PENDING", "Return belum dapat ditutup sebelum refund diproses.");
    const request = await tx.returnRequest.update({
      where: { id },
      data: {
        status: input.status,
        reviewNote: input.reviewNote,
        reviewedById: actorId,
        reviewedAt: new Date(),
        ...(input.status === "RECEIVED" ? { refundStatus: "MANUAL_REVIEW" as const } : {}),
      },
      include: returnInclude,
    });
    await tx.notification.create({
      data: { userId: request.userId, type: `return.${input.status.toLowerCase()}`, title: "Status return diperbarui", message: `Return ${request.id} sekarang berstatus ${input.status}.`, linkUrl: "/akun/return" },
    });
    await audit(tx, actorId, "return.status", "support", id, { from: current.status, to: input.status, note: input.reviewNote });
    return serializeReturn(request);
  });
}

export async function processReturnRefund(actorId: string, id: string) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.returnRequest.findUnique({ where: { id }, include: returnInclude });
    if (!current) throw new ApiError(404, "RETURN_NOT_FOUND", "Return tidak ditemukan.");
    if (!["RECEIVED", "CLOSED"].includes(current.status) || current.refundStatus !== "MANUAL_REVIEW") {
      throw new ApiError(400, "REFUND_NOT_READY", "Refund hanya dapat diproses setelah barang return diterima.");
    }
    const request = await tx.returnRequest.update({ where: { id }, data: { refundStatus: "PROCESSED", refundedById: actorId, refundedAt: new Date() }, include: returnInclude });
    await tx.notification.create({ data: { userId: request.userId, type: "return.refunded", title: "Refund return diproses", message: `Refund untuk return ${request.id} telah diproses manual.`, linkUrl: "/akun/return" } });
    await audit(tx, actorId, "return.refund", "finance", id, { from: current.refundStatus, to: "PROCESSED" });
    return serializeReturn(request);
  });
}

const complaintInclude = {
  order: { select: { id: true, orderNumber: true, status: true } },
  user: { select: { id: true, name: true, email: true } },
  resolvedBy: { select: { id: true, name: true, email: true } },
} satisfies Prisma.ComplaintInclude;

export async function createComplaint(userId: string, input: z.infer<typeof complaintMutationSchema>) {
  const order = await prisma.order.findFirst({ where: { userId, OR: [{ id: input.orderId }, { orderNumber: input.orderId }] }, select: { id: true } });
  if (!order) throw new ApiError(404, "ORDER_NOT_FOUND", "Order tidak ditemukan.");
  return prisma.complaint.create({ data: { ...input, orderId: order.id, userId }, include: complaintInclude });
}

async function listComplaints(baseWhere: Prisma.ComplaintWhereInput, query: z.infer<typeof trustListQuerySchema>) {
  const where: Prisma.ComplaintWhereInput = {
    ...baseWhere,
    ...(query.status === "ALL" ? {} : { status: query.status as Prisma.EnumComplaintStatusFilter }),
    ...(query.q ? { OR: [
      { title: { contains: query.q, mode: "insensitive" } },
      { category: { contains: query.q, mode: "insensitive" } },
      { order: { orderNumber: { contains: query.q, mode: "insensitive" } } },
    ] } : {}),
  };
  const skip = (query.page - 1) * query.pageSize;
  const [items, total] = await prisma.$transaction([
    prisma.complaint.findMany({ where, include: complaintInclude, orderBy: { createdAt: "desc" }, skip, take: query.pageSize }),
    prisma.complaint.count({ where }),
  ]);
  return { items, pagination: pageResult(query.page, query.pageSize, total) };
}

export async function listUserComplaints(userId: string, query: z.infer<typeof trustListQuerySchema>) {
  return listComplaints({ userId }, query);
}

export async function getUserComplaint(userId: string, id: string) {
  const complaint = await prisma.complaint.findFirst({ where: { id, userId }, include: complaintInclude });
  if (!complaint) throw new ApiError(404, "COMPLAINT_NOT_FOUND", "Komplain tidak ditemukan.");
  return complaint;
}

export async function listAdminComplaints(query: z.infer<typeof trustListQuerySchema>) {
  return listComplaints({}, query);
}

const complaintTransitions: Record<string, string[]> = {
  OPEN: ["IN_REVIEW", "RESOLVED", "CLOSED"],
  IN_REVIEW: ["RESOLVED", "CLOSED"],
  RESOLVED: ["CLOSED"],
};

export async function updateComplaintStatus(actorId: string, id: string, input: z.infer<typeof complaintStatusSchema>) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.complaint.findUnique({ where: { id } });
    if (!current) throw new ApiError(404, "COMPLAINT_NOT_FOUND", "Komplain tidak ditemukan.");
    if (!complaintTransitions[current.status]?.includes(input.status)) throw new ApiError(400, "COMPLAINT_TRANSITION_INVALID", `Transisi ${current.status} ke ${input.status} tidak diizinkan.`);
    const complaint = await tx.complaint.update({
      where: { id },
      data: { status: input.status, resolutionNote: input.resolutionNote, resolvedById: actorId, resolvedAt: input.status === "IN_REVIEW" ? null : new Date() },
      include: complaintInclude,
    });
    await tx.notification.create({ data: { userId: complaint.userId, type: `complaint.${input.status.toLowerCase()}`, title: "Status komplain diperbarui", message: `Komplain ${complaint.id} sekarang berstatus ${input.status}.`, linkUrl: "/akun/komplain" } });
    await audit(tx, actorId, "complaint.status", "support", id, { from: current.status, to: input.status });
    return complaint;
  });
}

function serializeArticle(article: Prisma.ArticleGetPayload<{ include: { author: { select: { name: true } } } }>) {
  return {
    ...article,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    publishedAt: article.publishedAt?.toISOString() ?? null,
    author: article.author.name ?? "Summit Editorial",
    image: article.imageUrl,
    readingTime: `${Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200))} menit`,
    content: article.content.split(/\r?\n\s*\r?\n/).map((paragraph) => paragraph.trim()).filter(Boolean),
  };
}

const articleInclude = { author: { select: { name: true } } } as const;

export async function listPublicArticles(query: z.infer<typeof trustListQuerySchema>) {
  const where: Prisma.ArticleWhereInput = {
    status: "PUBLISHED",
    publishedAt: { lte: new Date() },
    ...(query.q ? { OR: [
      { title: { contains: query.q, mode: "insensitive" } },
      { excerpt: { contains: query.q, mode: "insensitive" } },
      { category: { contains: query.q, mode: "insensitive" } },
    ] } : {}),
  };
  const skip = (query.page - 1) * query.pageSize;
  const [items, total] = await prisma.$transaction([
    prisma.article.findMany({ where, include: articleInclude, orderBy: { publishedAt: "desc" }, skip, take: query.pageSize }),
    prisma.article.count({ where }),
  ]);
  return { items: items.map(serializeArticle), pagination: pageResult(query.page, query.pageSize, total) };
}

export async function getPublicArticle(slug: string) {
  const article = await prisma.article.findFirst({ where: { slug, status: "PUBLISHED", publishedAt: { lte: new Date() } }, include: articleInclude });
  if (!article) throw new ApiError(404, "ARTICLE_NOT_FOUND", "Artikel tidak ditemukan.");
  const related = await prisma.article.findMany({ where: { id: { not: article.id }, status: "PUBLISHED", category: article.category }, include: articleInclude, orderBy: { publishedAt: "desc" }, take: 2 });
  return { article: serializeArticle(article), related: related.map(serializeArticle) };
}

export async function listAdminArticles(query: z.infer<typeof trustListQuerySchema>) {
  const where: Prisma.ArticleWhereInput = {
    ...(query.status === "ALL" ? {} : { status: query.status as "DRAFT" | "PUBLISHED" | "ARCHIVED" }),
    ...(query.q ? { OR: [{ title: { contains: query.q, mode: "insensitive" } }, { category: { contains: query.q, mode: "insensitive" } }] } : {}),
  };
  const skip = (query.page - 1) * query.pageSize;
  const [items, total] = await prisma.$transaction([
    prisma.article.findMany({ where, include: articleInclude, orderBy: { updatedAt: "desc" }, skip, take: query.pageSize }),
    prisma.article.count({ where }),
  ]);
  return { items: items.map(serializeArticle), pagination: pageResult(query.page, query.pageSize, total) };
}

export async function createAdminArticle(actorId: string, input: z.infer<typeof articleMutationSchema>) {
  return prisma.$transaction(async (tx) => {
    const article = await tx.article.create({ data: { ...input, authorId: actorId, publishedAt: input.status === "PUBLISHED" ? new Date() : null }, include: articleInclude });
    await audit(tx, actorId, "article.create", "content", article.id, { slug: article.slug, status: article.status });
    return serializeArticle(article);
  });
}

export async function updateAdminArticle(actorId: string, id: string, input: z.infer<typeof articleMutationSchema>) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.article.findUnique({ where: { id } });
    if (!current) throw new ApiError(404, "ARTICLE_NOT_FOUND", "Artikel tidak ditemukan.");
    const article = await tx.article.update({
      where: { id },
      data: { ...input, publishedAt: input.status === "PUBLISHED" ? current.publishedAt ?? new Date() : null },
      include: articleInclude,
    });
    await audit(tx, actorId, "article.update", "content", id, { from: current.status, to: article.status, slug: article.slug });
    return serializeArticle(article);
  });
}

export async function archiveAdminArticle(actorId: string, id: string) {
  return prisma.$transaction(async (tx) => {
    const article = await tx.article.update({ where: { id }, data: { status: "ARCHIVED", publishedAt: null }, include: articleInclude });
    await audit(tx, actorId, "article.archive", "content", id, { slug: article.slug });
    return serializeArticle(article);
  });
}

export async function listNotifications(userId: string, query: z.infer<typeof trustListQuerySchema>) {
  const where: Prisma.NotificationWhereInput = {
    userId,
    ...(query.status === "UNREAD" ? { isRead: false } : query.status === "READ" ? { isRead: true } : {}),
    ...(query.q ? { OR: [{ title: { contains: query.q, mode: "insensitive" } }, { message: { contains: query.q, mode: "insensitive" } }] } : {}),
  };
  const skip = (query.page - 1) * query.pageSize;
  const [items, total, unread] = await prisma.$transaction([
    prisma.notification.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: query.pageSize }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);
  return { items, unread, pagination: pageResult(query.page, query.pageSize, total) };
}

export async function markNotificationRead(userId: string, id: string) {
  const updated = await prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });
  if (!updated.count) throw new ApiError(404, "NOTIFICATION_NOT_FOUND", "Notifikasi tidak ditemukan.");
  return { id, isRead: true };
}

export async function markAllNotificationsRead(userId: string) {
  const updated = await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  return { count: updated.count };
}
