import { prisma } from "@/lib/db";

export type GearChecklistSummary = {
  id: string;
  slug: string;
  name: string;
  activity: string;
  description: string | null;
  sortOrder: number;
  itemCount: number;
};

export async function listGearChecklists(): Promise<GearChecklistSummary[]> {
  const records = await prisma.gearChecklist.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { items: true } },
    },
  });

  return records.map((record) => ({
    id: record.id,
    slug: record.slug,
    name: record.name,
    activity: record.activity,
    description: record.description,
    sortOrder: record.sortOrder,
    itemCount: record._count.items,
  }));
}

export type GearChecklistDetail = {
  id: string;
  slug: string;
  name: string;
  activity: string;
  description: string | null;
  sortOrder: number;
  items: Array<{
    id: string;
    label: string;
    quantity: number;
    isOptional: boolean;
    sortOrder: number;
    product:
      | {
          id: string;
          slug: string;
          name: string;
          price: number;
          discountPrice: number | null;
          photo: string | null;
        }
      | null;
  }>;
};

export async function getGearChecklistBySlug(slug: string): Promise<GearChecklistDetail | null> {
  const record = await prisma.gearChecklist.findFirst({
    where: { slug, isActive: true },
    include: {
      items: {
        orderBy: { sortOrder: "asc" },
        include: {
          product: {
            select: {
              id: true,
              slug: true,
              name: true,
              price: true,
              discountPrice: true,
              photos: true,
            },
          },
        },
      },
    },
  });

  if (!record) return null;

  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    activity: record.activity,
    description: record.description,
    sortOrder: record.sortOrder,
    items: record.items.map((item) => ({
      id: item.id,
      label: item.label,
      quantity: item.quantity,
      isOptional: item.isOptional,
      sortOrder: item.sortOrder,
      product: item.product
        ? {
            id: item.product.id,
            slug: item.product.slug,
            name: item.product.name,
            price: Number(item.product.price),
            discountPrice: item.product.discountPrice ? Number(item.product.discountPrice) : null,
            photo: item.product.photos[0] ?? null,
          }
        : null,
    })),
  };
}
