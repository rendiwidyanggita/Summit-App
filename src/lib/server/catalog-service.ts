import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

const sortValues = [
  "newest",
  "price_asc",
  "price_desc",
  "name_asc",
  "best_selling",
  "rating_desc",
] as const;

// Coerces "1"/"true"/"yes" → true, "0"/"false"/"no"/"" → false, missing → undefined
const booleanFromQuery = z
  .union([z.boolean(), z.string()])
  .optional()
  .transform((value) => {
    if (value === undefined) return undefined;
    if (typeof value === "boolean") return value;
    const normalized = value.trim().toLowerCase();
    if (normalized === "" || normalized === "0" || normalized === "false" || normalized === "no") {
      return false;
    }
    return true;
  });

export const productQuerySchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  brand: z.string().trim().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  discountOnly: booleanFromQuery,
  inStockOnly: booleanFromQuery,
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
    ...(query.minRating !== undefined
      ? {
          ratingAvg: { gte: query.minRating },
        }
      : {}),
    // Convention: any non-null discountPrice is a discount (seed enforces this).
    // Field-reference comparison (discountPrice < price) is unreliable across
    // Prisma versions, so we rely on the seed/business invariant instead.
    ...(query.discountOnly
      ? {
          discountPrice: { not: null },
        }
      : {}),
    ...(query.inStockOnly
      ? {
          variants: { some: { stock: { gt: 0 } } },
        }
      : {}),
  };
}

function productOrderBy(
  sort: ProductQuery["sort"],
):
  | Prisma.ProductOrderByWithRelationInput
  | Prisma.ProductOrderByWithRelationInput[] {
  if (sort === "price_asc") return { price: "asc" };
  if (sort === "price_desc") return { price: "desc" };
  if (sort === "name_asc") return { name: "asc" };
  if (sort === "best_selling") return { soldCount: "desc" };
  if (sort === "rating_desc") {
    return [{ ratingAvg: "desc" }, { ratingCount: "desc" }];
  }

  return { createdAt: "desc" };
}

function serializeProduct(product: ProductWithRelations) {
  return {
    ...product,
    price: Number(product.price),
    discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
    ratingAvg: product.ratingAvg ? Number(product.ratingAvg) : null,
    variants: product.variants?.map((variant) => ({
      ...variant,
      priceModifier: Number(variant.priceModifier),
    })),
  };
}

export type SerializedProduct = ReturnType<typeof serializeProduct>;

function slimSerializeProduct(product: ProductWithRelations) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: Number(product.price),
    discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
    photo: product.photos?.[0] ?? null,
    ratingAvg: product.ratingAvg ? Number(product.ratingAvg) : null,
    ratingCount: product.ratingCount,
    soldCount: product.soldCount,
    isFeatured: product.isFeatured,
    brand: product.brand
      ? { name: product.brand.name, slug: product.brand.slug }
      : null,
    category: product.category
      ? { name: product.category.name, slug: product.category.slug }
      : null,
  };
}

export type SlimProduct = ReturnType<typeof slimSerializeProduct>;

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

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}

export async function listCatalogSitemapEntries() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.category.findMany({
      where: {
        products: {
          some: { status: "ACTIVE" },
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return {
    products,
    categories,
  };
}

export async function getRelatedProducts(slug: string, limit = 6) {
  const safeLimit = Math.min(20, Math.max(1, Math.trunc(limit)));
  const source = await prisma.product.findFirst({
    where: { slug, status: "ACTIVE" },
    select: { id: true, categoryId: true },
  });

  if (!source) return [];

  const related = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      categoryId: source.categoryId,
      NOT: { id: source.id },
    },
    include: {
      category: true,
      brand: true,
      variants: true,
    },
    orderBy: [{ soldCount: "desc" }, { createdAt: "desc" }],
    take: safeLimit,
  });

  return related.map(slimSerializeProduct);
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

// Re-export the slim serializer for use by sibling services (search, home-feed)
export { slimSerializeProduct };
