import { z } from "zod";

import { OrderStatus, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { ApiError } from "@/lib/server/http";

const optionalUrl = z.union([z.string().url(), z.literal("")]).optional().transform((value) => value || null);
const optionalText = z.string().trim().optional().transform((value) => value || null);

export const adminListQuerySchema = z.object({
  q: z.string().trim().optional(),
  status: z.string().trim().default("ALL"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

const productVariantSchema = z.object({
  id: z.string().trim().optional(),
  sku: z.string().trim().min(2).max(80),
  size: optionalText,
  color: optionalText,
  stock: z.coerce.number().int().nonnegative(),
  minimumStock: z.coerce.number().int().nonnegative().default(10),
  priceModifier: z.coerce.number().nonnegative().default(0),
  isActive: z.boolean().default(true),
});

export const adminProductMutationSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(10),
  categoryId: z.string().trim().min(1),
  brandId: z.string().trim().min(1),
  weightGram: z.coerce.number().int().positive(),
  price: z.coerce.number().nonnegative(),
  costPrice: z.coerce.number().nonnegative().default(0),
  discountPrice: z.coerce.number().nonnegative().nullable().optional(),
  photos: z.array(z.string().url()).min(1),
  videoUrl: optionalUrl,
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE", "ARCHIVED"]).default("DRAFT"),
  isCodAllowed: z.boolean().default(true),
  tags: z.array(z.string().trim().min(1)).default([]),
  specs: z.record(z.string(), z.unknown()).nullable().optional(),
  isFeatured: z.boolean().default(false),
  metaTitle: optionalText,
  metaDescription: optionalText,
  variants: z.array(productVariantSchema).min(1),
}).superRefine((value, context) => {
  if (value.discountPrice !== null && value.discountPrice !== undefined && value.discountPrice >= value.price) {
    context.addIssue({ code: "custom", path: ["discountPrice"], message: "Harga diskon harus lebih kecil dari harga jual." });
  }
  if (value.costPrice > value.price) {
    context.addIssue({ code: "custom", path: ["costPrice"], message: "Harga beli tidak boleh melebihi harga jual." });
  }
});

export const adminCategoryMutationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  parentId: optionalText,
  icon: optionalText,
  imageUrl: optionalUrl,
  isVisible: z.boolean().default(true),
  metaTitle: optionalText,
  metaDescription: optionalText,
});

export const adminVoucherMutationSchema = z.object({
  code: z.string().trim().min(2).max(40).transform((value) => value.toUpperCase()),
  name: z.string().trim().min(2).max(120),
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"]),
  value: z.coerce.number().positive(),
  minSpend: z.coerce.number().nonnegative().default(0),
  maxDiscount: z.coerce.number().positive().nullable().optional(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  quota: z.coerce.number().int().positive().nullable().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE", "EXPIRED"]).default("DRAFT"),
}).refine((value) => value.endsAt > value.startsAt, { path: ["endsAt"], message: "Waktu selesai harus setelah waktu mulai." });

export const adminBannerMutationSchema = z.object({
  title: z.string().trim().min(2).max(160),
  imageUrl: z.string().url(),
  targetUrl: optionalText,
  placement: z.enum(["HOME_HERO", "PROMO_STRIP", "CATALOG_TOP"]).default("HOME_HERO"),
  sortOrder: z.coerce.number().int().nonnegative().default(0),
  isActive: z.boolean().default(false),
  startsAt: z.coerce.date().nullable().optional(),
  endsAt: z.coerce.date().nullable().optional(),
}).refine((value) => !value.startsAt || !value.endsAt || value.endsAt > value.startsAt, {
  path: ["endsAt"],
  message: "Waktu selesai harus setelah waktu mulai.",
});

export const adminFulfillmentSchema = z.object({
  status: z.enum(["PROCESSING", "SHIPPED", "DELIVERED"]),
  trackingNo: optionalText,
  trackingUrl: optionalUrl,
});

type AuditClient = Prisma.TransactionClient | typeof prisma;

async function writeAudit(
  client: AuditClient,
  actorId: string,
  action: string,
  module: string,
  targetId: string,
  metadata?: Prisma.InputJsonValue,
) {
  await client.auditLog.create({ data: { actorId, action, module, targetId, metadata } });
}

function pagination(page: number, pageSize: number, total: number) {
  return { page, pageSize, total, totalPages: Math.ceil(total / pageSize) };
}

const productInclude = {
  category: true,
  brand: true,
  variants: { orderBy: { createdAt: "asc" as const } },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

function serializeAdminProduct(product: ProductWithRelations) {
  const stock = product.variants.filter((variant) => variant.isActive).reduce((sum, variant) => sum + variant.stock, 0);
  const lowStock = product.variants.some((variant) => variant.isActive && variant.stock < variant.minimumStock);
  const price = Number(product.price);
  const costPrice = Number(product.costPrice);
  return {
    ...product,
    price,
    costPrice,
    discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
    ratingAvg: product.ratingAvg ? Number(product.ratingAvg) : null,
    stock,
    lowStock,
    margin: price > 0 ? Math.round(((price - costPrice) / price) * 100) : 0,
    variants: product.variants.map((variant) => ({ ...variant, priceModifier: Number(variant.priceModifier) })),
  };
}

export async function listAdminProducts(query: z.infer<typeof adminListQuerySchema>) {
  const where: Prisma.ProductWhereInput = {
    ...(query.q ? { OR: [
      { name: { contains: query.q, mode: "insensitive" } },
      { slug: { contains: query.q, mode: "insensitive" } },
      { brand: { name: { contains: query.q, mode: "insensitive" } } },
      { category: { name: { contains: query.q, mode: "insensitive" } } },
    ] } : {}),
    ...(query.status === "ALL" ? {} : query.status === "LOW_STOCK"
      ? { variants: { some: { isActive: true, stock: { lt: prisma.productVariant.fields.minimumStock } } } }
      : { status: query.status as "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED" }),
  };
  const skip = (query.page - 1) * query.pageSize;
  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({ where, include: productInclude, orderBy: { updatedAt: "desc" }, skip, take: query.pageSize }),
    prisma.product.count({ where }),
  ]);
  return { items: items.map(serializeAdminProduct), pagination: pagination(query.page, query.pageSize, total) };
}

export async function getAdminProduct(id: string) {
  const product = await prisma.product.findFirst({ where: { OR: [{ id }, { slug: id }] }, include: productInclude });
  if (!product) throw new ApiError(404, "PRODUCT_NOT_FOUND", "Produk tidak ditemukan.");
  return serializeAdminProduct(product);
}

export async function createAdminProduct(actorId: string, input: z.infer<typeof adminProductMutationSchema>) {
  return prisma.$transaction(async (tx) => {
    const created = await tx.product.create({
      data: {
        name: input.name, slug: input.slug, description: input.description, categoryId: input.categoryId, brandId: input.brandId,
        weightGram: input.weightGram, price: input.price, costPrice: input.costPrice, discountPrice: input.discountPrice ?? null,
        photos: input.photos, videoUrl: input.videoUrl, status: input.status, isCodAllowed: input.isCodAllowed, tags: input.tags,
        specs: input.specs ? input.specs as Prisma.InputJsonObject : Prisma.JsonNull, isFeatured: input.isFeatured, metaTitle: input.metaTitle, metaDescription: input.metaDescription,
        variants: { create: input.variants.map((variant) => ({ sku: variant.sku, size: variant.size, color: variant.color, stock: variant.stock, minimumStock: variant.minimumStock, priceModifier: variant.priceModifier, isActive: variant.isActive })) },
      },
    });
    const product = await tx.product.findUniqueOrThrow({ where: { id: created.id }, include: productInclude });
    await writeAudit(tx, actorId, "product.create", "catalog", product.id, { slug: product.slug });
    return serializeAdminProduct(product);
  });
}

export async function updateAdminProduct(actorId: string, id: string, input: z.infer<typeof adminProductMutationSchema>) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.product.findUnique({ where: { id }, include: { variants: true } });
    if (!existing) throw new ApiError(404, "PRODUCT_NOT_FOUND", "Produk tidak ditemukan.");
    const retainedIds = input.variants.flatMap((variant) => variant.id ? [variant.id] : []);
    await tx.productVariant.updateMany({ where: { productId: id, id: { notIn: retainedIds } }, data: { isActive: false } });
    for (const variant of input.variants) {
      const { id: variantId, ...data } = variant;
      if (variantId) {
        const updated = await tx.productVariant.updateMany({ where: { id: variantId, productId: id }, data });
        if (updated.count !== 1) throw new ApiError(404, "VARIANT_NOT_FOUND", "Varian produk tidak ditemukan.");
      } else {
        await tx.productVariant.create({ data: { ...data, productId: id } });
      }
    }
    await tx.product.update({
      where: { id },
      data: {
        name: input.name, slug: input.slug, description: input.description, categoryId: input.categoryId, brandId: input.brandId,
        weightGram: input.weightGram, price: input.price, costPrice: input.costPrice, discountPrice: input.discountPrice ?? null,
        photos: input.photos, videoUrl: input.videoUrl, status: input.status, isCodAllowed: input.isCodAllowed, tags: input.tags,
        specs: input.specs ? input.specs as Prisma.InputJsonObject : Prisma.JsonNull, isFeatured: input.isFeatured, metaTitle: input.metaTitle, metaDescription: input.metaDescription,
      },
    });
    const product = await tx.product.findUniqueOrThrow({ where: { id }, include: productInclude });
    await writeAudit(tx, actorId, "product.update", "catalog", product.id, { slug: product.slug });
    return serializeAdminProduct(product);
  });
}

export async function archiveAdminProduct(actorId: string, id: string) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.update({ where: { id }, data: { status: "ARCHIVED", variants: { updateMany: { where: {}, data: { isActive: false } } } }, include: productInclude });
    await writeAudit(tx, actorId, "product.archive", "catalog", id, { slug: product.slug });
    return serializeAdminProduct(product);
  });
}

export async function listAdminCategories(query: z.infer<typeof adminListQuerySchema>) {
  const where: Prisma.CategoryWhereInput = {
    ...(query.q ? { OR: [{ name: { contains: query.q, mode: "insensitive" } }, { slug: { contains: query.q, mode: "insensitive" } }] } : {}),
    ...(query.status === "VISIBLE" ? { isVisible: true } : query.status === "HIDDEN" ? { isVisible: false } : {}),
  };
  const skip = (query.page - 1) * query.pageSize;
  const [items, total] = await prisma.$transaction([
    prisma.category.findMany({
      where, skip, take: query.pageSize, orderBy: [{ parentId: "asc" }, { name: "asc" }],
      include: { parent: { select: { id: true, name: true, slug: true } }, products: { select: { status: true } }, _count: { select: { products: true } } },
    }),
    prisma.category.count({ where }),
  ]);
  return {
    items: items.map(({ products, _count, ...item }) => ({ ...item, productCount: _count.products, activeProductCount: products.filter((product) => product.status === "ACTIVE").length })),
    pagination: pagination(query.page, query.pageSize, total),
  };
}

export async function createAdminCategory(actorId: string, input: z.infer<typeof adminCategoryMutationSchema>) {
  const category = await prisma.$transaction(async (tx) => {
    const created = await tx.category.create({ data: input });
    await writeAudit(tx, actorId, "category.create", "catalog", created.id, { slug: created.slug });
    return created;
  });
  return category;
}

export async function updateAdminCategory(actorId: string, id: string, input: z.infer<typeof adminCategoryMutationSchema>) {
  if (input.parentId === id) throw new ApiError(400, "CATEGORY_PARENT_INVALID", "Kategori tidak dapat menjadi parent dirinya sendiri.");
  return prisma.$transaction(async (tx) => {
    const category = await tx.category.update({ where: { id }, data: input });
    await writeAudit(tx, actorId, "category.update", "catalog", id, { slug: category.slug });
    return category;
  });
}

export async function deleteAdminCategory(actorId: string, id: string) {
  return prisma.$transaction(async (tx) => {
    const category = await tx.category.findUnique({ where: { id }, include: { _count: { select: { products: true, children: true } } } });
    if (!category) throw new ApiError(404, "CATEGORY_NOT_FOUND", "Kategori tidak ditemukan.");
    if (category._count.products || category._count.children) throw new ApiError(400, "CATEGORY_IN_USE", "Kategori masih memiliki produk atau subkategori.");
    await tx.category.delete({ where: { id } });
    await writeAudit(tx, actorId, "category.delete", "catalog", id, { slug: category.slug });
    return { id };
  });
}

export async function listAdminVouchers(query: z.infer<typeof adminListQuerySchema>) {
  const where: Prisma.VoucherWhereInput = {
    ...(query.q ? { OR: [{ code: { contains: query.q, mode: "insensitive" } }, { name: { contains: query.q, mode: "insensitive" } }] } : {}),
    ...(query.status === "ALL" ? {} : { status: query.status as "DRAFT" | "ACTIVE" | "INACTIVE" | "EXPIRED" }),
  };
  const skip = (query.page - 1) * query.pageSize;
  const [items, total] = await prisma.$transaction([
    prisma.voucher.findMany({ where, skip, take: query.pageSize, orderBy: { updatedAt: "desc" }, include: { _count: { select: { orders: { where: { status: { notIn: ["CANCELLED", "EXPIRED"] } } } } } } }),
    prisma.voucher.count({ where }),
  ]);
  return { items: items.map(({ _count, ...item }) => ({ ...item, value: Number(item.value), minSpend: Number(item.minSpend), maxDiscount: item.maxDiscount ? Number(item.maxDiscount) : null, used: _count.orders })), pagination: pagination(query.page, query.pageSize, total) };
}

export async function createAdminVoucher(actorId: string, input: z.infer<typeof adminVoucherMutationSchema>) {
  return prisma.$transaction(async (tx) => {
    const voucher = await tx.voucher.create({ data: input });
    await writeAudit(tx, actorId, "voucher.create", "marketing", voucher.id, { code: voucher.code });
    return voucher;
  });
}

export async function updateAdminVoucher(actorId: string, id: string, input: z.infer<typeof adminVoucherMutationSchema>) {
  return prisma.$transaction(async (tx) => {
    const voucher = await tx.voucher.update({ where: { id }, data: input });
    await writeAudit(tx, actorId, "voucher.update", "marketing", id, { code: voucher.code });
    return voucher;
  });
}

export async function deactivateAdminVoucher(actorId: string, id: string) {
  return prisma.$transaction(async (tx) => {
    const voucher = await tx.voucher.update({ where: { id }, data: { status: "INACTIVE" } });
    await writeAudit(tx, actorId, "voucher.deactivate", "marketing", id, { code: voucher.code });
    return voucher;
  });
}

export async function listAdminBanners(query: z.infer<typeof adminListQuerySchema>) {
  const where: Prisma.BannerWhereInput = {
    ...(query.q ? { OR: [{ title: { contains: query.q, mode: "insensitive" } }, { targetUrl: { contains: query.q, mode: "insensitive" } }] } : {}),
    ...(query.status === "ACTIVE" ? { isActive: true } : query.status === "PAUSED" ? { isActive: false } : query.status === "SCHEDULED" ? { startsAt: { gt: new Date() } } : {}),
  };
  const skip = (query.page - 1) * query.pageSize;
  const [items, total] = await prisma.$transaction([
    prisma.banner.findMany({ where, skip, take: query.pageSize, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    prisma.banner.count({ where }),
  ]);
  return { items, pagination: pagination(query.page, query.pageSize, total) };
}

export async function createAdminBanner(actorId: string, input: z.infer<typeof adminBannerMutationSchema>) {
  return prisma.$transaction(async (tx) => {
    const banner = await tx.banner.create({ data: input });
    await writeAudit(tx, actorId, "banner.create", "marketing", banner.id, { title: banner.title });
    return banner;
  });
}

export async function updateAdminBanner(actorId: string, id: string, input: z.infer<typeof adminBannerMutationSchema>) {
  return prisma.$transaction(async (tx) => {
    const banner = await tx.banner.update({ where: { id }, data: input });
    await writeAudit(tx, actorId, "banner.update", "marketing", id, { title: banner.title });
    return banner;
  });
}

export async function deleteAdminBanner(actorId: string, id: string) {
  return prisma.$transaction(async (tx) => {
    const banner = await tx.banner.delete({ where: { id } });
    await writeAudit(tx, actorId, "banner.delete", "marketing", id, { title: banner.title });
    return { id };
  });
}

const adminOrderInclude = {
  user: { select: { id: true, name: true, email: true, phone: true } },
  payment: { select: { status: true, paidAt: true } },
  shipment: true,
  items: { include: { product: true, variant: true } },
  voucher: true,
} satisfies Prisma.OrderInclude;

function serializeAdminOrder(order: Prisma.OrderGetPayload<{ include: typeof adminOrderInclude }>) {
  return { ...order, subtotal: Number(order.subtotal), shippingCost: Number(order.shippingCost), total: Number(order.total), itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0), items: order.items.map((item) => ({ ...item, unitPrice: Number(item.unitPrice), subtotal: Number(item.subtotal) })) };
}

export async function listAdminOrders(query: z.infer<typeof adminListQuerySchema>) {
  const where: Prisma.OrderWhereInput = {
    ...(query.q ? { OR: [{ orderNumber: { contains: query.q, mode: "insensitive" } }, { user: { email: { contains: query.q, mode: "insensitive" } } }] } : {}),
    ...(query.status === "ALL" ? {} : { status: query.status as OrderStatus }),
  };
  const skip = (query.page - 1) * query.pageSize;
  const [items, total] = await prisma.$transaction([
    prisma.order.findMany({ where, include: adminOrderInclude, orderBy: { createdAt: "desc" }, skip, take: query.pageSize }),
    prisma.order.count({ where }),
  ]);
  return { items: items.map(serializeAdminOrder), pagination: pagination(query.page, query.pageSize, total) };
}

export async function getAdminOrder(id: string) {
  const order = await prisma.order.findFirst({ where: { OR: [{ id }, { orderNumber: id }] }, include: adminOrderInclude });
  if (!order) throw new ApiError(404, "ORDER_NOT_FOUND", "Order tidak ditemukan.");
  return serializeAdminOrder(order);
}

const validTransitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PAID: ["PROCESSING"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
};

export async function updateAdminFulfillment(actorId: string, id: string, input: z.infer<typeof adminFulfillmentSchema>) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({ where: { OR: [{ id }, { orderNumber: id }] }, include: adminOrderInclude });
    if (!order) throw new ApiError(404, "ORDER_NOT_FOUND", "Order tidak ditemukan.");
    if (!validTransitions[order.status]?.includes(input.status)) throw new ApiError(400, "ORDER_TRANSITION_INVALID", `Transisi ${order.status} ke ${input.status} tidak diizinkan.`);
    if (input.status === "SHIPPED" && !input.trackingNo) throw new ApiError(400, "TRACKING_REQUIRED", "Nomor resi wajib diisi sebelum order dikirim.");
    const shipmentData = input.status === "SHIPPED"
      ? { status: "SHIPPED" as const, trackingNo: input.trackingNo, trackingUrl: input.trackingUrl, shippedAt: new Date() }
      : input.status === "DELIVERED" ? { status: "DELIVERED" as const, deliveredAt: new Date() } : { status: "READY_TO_SHIP" as const };
    await tx.shipment.update({ where: { orderId: order.id }, data: shipmentData });
    const updated = await tx.order.update({ where: { id: order.id }, data: { status: input.status }, include: adminOrderInclude });
    await tx.notification.create({
      data: { userId: order.userId, type: `order.${input.status.toLowerCase()}`, title: input.status === "SHIPPED" ? "Pesanan dikirim" : "Status pesanan diperbarui", message: `Order ${order.orderNumber} sekarang berstatus ${input.status}.`, linkUrl: `/akun/pesanan/${order.orderNumber}` },
    });
    await writeAudit(tx, actorId, "order.fulfillment", "order", order.id, { from: order.status, to: input.status, trackingNo: input.trackingNo });
    return serializeAdminOrder(updated);
  });
}

export async function listLowStockVariants() {
  const variants = await prisma.productVariant.findMany({
    where: { isActive: true },
    include: { product: { select: { id: true, name: true, slug: true, status: true } } },
    orderBy: { stock: "asc" },
  });
  return variants.filter((variant) => variant.stock < variant.minimumStock).map((variant) => ({ ...variant, priceModifier: Number(variant.priceModifier) }));
}

export async function listAuditLogs(query: z.infer<typeof adminListQuerySchema>) {
  const where: Prisma.AuditLogWhereInput = query.q ? { OR: [{ action: { contains: query.q, mode: "insensitive" } }, { module: { contains: query.q, mode: "insensitive" } }] } : {};
  const skip = (query.page - 1) * query.pageSize;
  const [items, total] = await prisma.$transaction([
    prisma.auditLog.findMany({ where, include: { actor: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: "desc" }, skip, take: query.pageSize }),
    prisma.auditLog.count({ where }),
  ]);
  return { items, pagination: pagination(query.page, query.pageSize, total) };
}
