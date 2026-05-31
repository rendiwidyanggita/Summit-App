import { prisma } from "@/lib/db";

export type SuggestedProduct = {
  slug: string;
  name: string;
  photo: string | null;
  price: number;
  discountPrice: number | null;
  category: { slug: string; name: string } | null;
};

export async function suggestProducts(rawQuery: string, limit = 8): Promise<SuggestedProduct[]> {
  const q = (rawQuery ?? "").trim();
  if (q.length < 2) return [];

  const safeLimit = Math.min(20, Math.max(1, Math.trunc(limit)));

  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { brand: { name: { contains: q, mode: "insensitive" } } },
        { category: { name: { contains: q, mode: "insensitive" } } },
      ],
    },
    select: {
      slug: true,
      name: true,
      photos: true,
      price: true,
      discountPrice: true,
      category: { select: { slug: true, name: true } },
    },
    orderBy: [{ soldCount: "desc" }, { createdAt: "desc" }],
    take: safeLimit,
  });

  return products.map((product) => ({
    slug: product.slug,
    name: product.name,
    photo: product.photos[0] ?? null,
    price: Number(product.price),
    discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
    category: product.category
      ? { slug: product.category.slug, name: product.category.name }
      : null,
  }));
}
