import { prisma } from "@/lib/db";

export async function getAdminSummary() {
  const [products, activeProducts, lowStockVariants, pendingOrders, users, activeVouchers] = await prisma.$transaction([
    prisma.product.count(),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.productVariant.count({
      where: {
        stock: {
          lt: 10,
        },
      },
    }),
    prisma.order.count({
      where: {
        status: {
          in: ["PENDING_PAYMENT", "PAID", "PROCESSING"],
        },
      },
    }),
    prisma.user.count(),
    prisma.voucher.count({ where: { status: "ACTIVE" } }),
  ]);

  return {
    products,
    activeProducts,
    lowStockVariants,
    pendingOrders,
    users,
    activeVouchers,
  };
}
