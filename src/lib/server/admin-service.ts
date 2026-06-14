import { prisma } from "@/lib/db";

export async function getAdminSummary() {
  const [products, activeProducts, variants, pendingOrders, users, activeVouchers, activeBanners, revenue, bestSellers] = await prisma.$transaction([
    prisma.product.count(),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.productVariant.findMany({ where: { isActive: true }, select: { stock: true, minimumStock: true } }),
    prisma.order.count({
      where: {
        status: {
          in: ["PENDING_PAYMENT", "PAID", "PROCESSING"],
        },
      },
    }),
    prisma.user.count(),
    prisma.voucher.count({ where: { status: "ACTIVE" } }),
    prisma.banner.count({ where: { isActive: true } }),
    prisma.order.aggregate({ where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"] } }, _sum: { total: true } }),
    prisma.product.findMany({ orderBy: { soldCount: "desc" }, take: 5, select: { id: true, name: true, slug: true, soldCount: true } }),
  ]);

  return {
    products,
    activeProducts,
    lowStockVariants: variants.filter((variant) => variant.stock < variant.minimumStock).length,
    pendingOrders,
    users,
    activeVouchers,
    activeBanners,
    revenue: Number(revenue._sum.total ?? 0),
    bestSellers,
  };
}
