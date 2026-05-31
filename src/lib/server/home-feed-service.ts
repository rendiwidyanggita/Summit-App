import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import {
  listActiveBanners,
  listCategories,
  slimSerializeProduct,
} from "@/lib/server/catalog-service";

const productInclude = {
  category: true,
  brand: true,
  variants: true,
} satisfies Prisma.ProductInclude;

async function fetchFeatured(limit = 8) {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", isFeatured: true },
    include: productInclude,
    orderBy: [{ soldCount: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
  return products.map(slimSerializeProduct);
}

async function fetchBestSellers(limit = 8) {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: productInclude,
    orderBy: [{ soldCount: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
  return products.map(slimSerializeProduct);
}

async function fetchNewArrivals(limit = 8) {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(slimSerializeProduct);
}

async function fetchTopCategories(limit = 6) {
  const all = await listCategories();
  // listCategories returns categories ordered by name; pick the ones with the
  // most products (a Sprint 3 heuristic for "top categories").
  const sorted = [...all].sort((a, b) => b._count.products - a._count.products);
  return sorted.slice(0, limit).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: category.icon,
    productCount: category._count.products,
  }));
}

async function fetchActiveFlashSale() {
  const now = new Date();
  const flashSale = await prisma.flashSale.findFirst({
    where: {
      status: "ACTIVE",
      startsAt: { lte: now },
      endsAt: { gte: now },
    },
    include: { products: true },
    orderBy: { endsAt: "asc" },
  });
  if (!flashSale) return null;

  return {
    id: flashSale.id,
    name: flashSale.name,
    startsAt: flashSale.startsAt,
    endsAt: flashSale.endsAt,
    products: flashSale.products.map((entry) => ({
      id: entry.id,
      productId: entry.productId,
      flashSalePrice: Number(entry.flashSalePrice),
      quota: entry.quota,
    })),
  };
}

export async function getHomeFeed() {
  const [banners, featured, bestSellers, newArrivals, categories, flashSale] = await Promise.all([
    listActiveBanners(),
    fetchFeatured(),
    fetchBestSellers(),
    fetchNewArrivals(),
    fetchTopCategories(),
    fetchActiveFlashSale(),
  ]);

  return {
    banners,
    featured,
    bestSellers,
    newArrivals,
    categories,
    flashSale,
  };
}
