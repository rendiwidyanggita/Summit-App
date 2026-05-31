import { prisma } from "@/lib/db";

export async function listSizeGuides(categorySlug?: string) {
  const guides = await prisma.sizeGuide.findMany({
    where: {
      isActive: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: [{ category: { name: "asc" } }, { title: "asc" }],
  });

  return guides.map((guide) => ({
    id: guide.id,
    title: guide.title,
    description: guide.description,
    rows: guide.rows,
    category: guide.category,
  }));
}

export async function getSizeGuidesByCategorySlug(categorySlug: string) {
  return listSizeGuides(categorySlug);
}
