import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

const sortValues = ["newest", "price_asc", "price_desc", "name_asc"] as const;

export const productQuerySchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  brand: z.string().trim().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  sort: z.enum(sortValues).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
});

type ProductQuery = z.infer<typeof productQuerySchema>;
type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    brand: true;
    variants: true;
  };
}>;

function productWhere(query: ProductQuery): Prisma.ProductWhereInput {
  return {
    status: "ACTIVE",
    ...(query.q
      ? {
          OR: [
            { name: { contains: query.q, mode: "insensitive" } },
            { description: { contains: query.q, mode: "insensitive" } },
            { brand: { name: { contains: query.q, mode: "insensitive" } } },
          ],
        }
      : {}),
    ...(query.category ? { category: { slug: query.category } } : {}),
    ...(query.brand ? { brand: { slug: query.brand } } : {}),
    ...(query.minPrice || query.maxPrice
      ? {
          price: {
            ...(query.minPrice ? { gte: query.minPrice } : {}),
            ...(query.maxPrice ? { lte: query.maxPrice } : {}),
          },
        }
      : {}),
  };
}

function productOrderBy(sort: ProductQuery["sort"]): Prisma.ProductOrderByWithRelationInput {
  if (sort === "price_asc") return { price: "asc" };
  if (sort === "price_desc") return { price: "desc" };
  if (sort === "name_asc") return { name: "asc" };

  return { createdAt: "desc" };
}

function serializeProduct(product: ProductWithRelations) {
  return {
    ...product,
    price: Number(product.price),
    discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
    variants: product.variants?.map((variant) => ({
      ...variant,
      priceModifier: Number(variant.priceModifier),
    })),
  };
}

export async function listProducts(query: ProductQuery) {
  const where = productWhere(query);
  const skip = (query.page - 1) * query.pageSize;
  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        variants: true,
      },
      orderBy: productOrderBy(query.sort),
      skip,
      take: query.pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: items.map(serializeProduct),
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.ceil(total / query.pageSize),
    },
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      status: "ACTIVE",
    },
    include: {
      category: true,
      brand: true,
      variants: true,
    },
  });

  return product ? serializeProduct(product) : null;
}

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: [{ parentId: "asc" }, { name: "asc" }],
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}

export async function listBrands() {
  return prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}

export async function listActiveBanners() {
  const now = new Date();

  return prisma.banner.findMany({
    where: {
      isActive: true,
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}
