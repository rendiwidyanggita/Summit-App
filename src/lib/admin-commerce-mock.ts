import { catalogProducts, categoryCatalog, getDiscountPercent } from "@/lib/constants";
import { mockOrders, type OrderMock } from "@/lib/order-mock";

export type AdminProductStatus = "ACTIVE" | "DRAFT" | "INACTIVE" | "ARCHIVED";
export type AdminVoucherStatus = "ACTIVE" | "DRAFT" | "EXPIRED";
export type AdminBannerStatus = "ACTIVE" | "SCHEDULED" | "PAUSED";

export type AdminProductMock = {
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  sold: number;
  rating: number;
  status: AdminProductStatus;
  lowStock: boolean;
  variants: number;
  image: string;
  updatedAt: string;
};

export type AdminCategoryMock = {
  slug: string;
  name: string;
  parent: string;
  productCount: number;
  activeProductCount: number;
  metaTitle: string;
  status: "VISIBLE" | "HIDDEN";
  image: string;
};

export type AdminOrderMock = OrderMock & {
  fulfillmentStatus: "Perlu Dibayar" | "Perlu Diproses" | "Packing" | "Dikirim" | "Selesai";
  sla: string;
  warehouseNote: string;
};

export type AdminVoucherMock = {
  code: string;
  name: string;
  status: AdminVoucherStatus;
  type: "Fixed" | "Free Shipping" | "Percentage";
  value: string;
  minSpend: number;
  quota: number;
  used: number;
  period: string;
};

export type AdminBannerMock = {
  id: string;
  title: string;
  status: AdminBannerStatus;
  placement: "Homepage Hero" | "Promo Strip" | "Catalog Top";
  targetUrl: string;
  schedule: string;
  sortOrder: number;
  image: string;
};

const productStatuses: AdminProductStatus[] = ["ACTIVE", "ACTIVE", "ACTIVE", "DRAFT", "INACTIVE", "ACTIVE", "ACTIVE", "ARCHIVED"];

export const adminProducts: AdminProductMock[] = catalogProducts.map((product, index) => ({
  slug: product.slug,
  name: product.name,
  category: product.category,
  brand: product.brand,
  price: product.price,
  stock: product.stock,
  sold: product.sold,
  rating: product.rating,
  status: product.stock === 0 ? "INACTIVE" : productStatuses[index % productStatuses.length],
  lowStock: product.stock < 10,
  variants: product.variants.length,
  image: product.images[0],
  updatedAt: `${24 + index} Mei 2026`,
}));

export const adminCategories: AdminCategoryMock[] = categoryCatalog.map((category, index) => {
  const products = adminProducts.filter((product) => product.category === category.name);
  const activeProducts = products.filter((product) => product.status === "ACTIVE");

  return {
    slug: category.slug,
    name: category.name,
    parent: index < 3 ? "Gear Utama" : "Essentials",
    productCount: products.length,
    activeProductCount: activeProducts.length,
    metaTitle: `${category.name} Outdoor Summit Gear`,
    status: products.length ? "VISIBLE" : "HIDDEN",
    image: category.image,
  };
});

export const adminOrders: AdminOrderMock[] = mockOrders.map((order, index) => {
  const fulfillmentStatus: AdminOrderMock["fulfillmentStatus"] =
    order.status === "PENDING_PAYMENT" ? "Perlu Dibayar" : order.status === "SHIPPED" ? "Dikirim" : order.status === "COMPLETED" ? "Selesai" : index % 2 ? "Packing" : "Perlu Diproses";

  return {
    ...order,
    fulfillmentStatus,
    sla: fulfillmentStatus === "Perlu Dibayar" ? "Menunggu payment" : fulfillmentStatus === "Selesai" ? "Selesai" : "SLA 1x24 jam",
    warehouseNote: fulfillmentStatus === "Dikirim" ? "Resi sudah tersedia" : fulfillmentStatus === "Perlu Dibayar" ? "Stock reserve mock" : "Siapkan packing list",
  };
});

export const adminVouchers: AdminVoucherMock[] = [
  { code: "SUMMIT50", name: "Potongan gear pendakian", status: "ACTIVE", type: "Fixed", value: "Rp50.000", minSpend: 500000, quota: 120, used: 42, period: "1-30 Juni 2026" },
  { code: "FREEONGKIR", name: "Gratis ongkir basecamp", status: "ACTIVE", type: "Free Shipping", value: "s/d Rp40.000", minSpend: 750000, quota: 80, used: 28, period: "15 Mei-15 Juni 2026" },
  { code: "TRAIL10", name: "Diskon aksesori trail", status: "DRAFT", type: "Percentage", value: "10%", minSpend: 300000, quota: 60, used: 0, period: "Draft campaign" },
  { code: "CAMPOLD", name: "Campaign Mei", status: "EXPIRED", type: "Fixed", value: "Rp35.000", minSpend: 450000, quota: 90, used: 90, period: "1-20 Mei 2026" },
];

export const adminBanners: AdminBannerMock[] = [
  {
    id: "hero-summit",
    title: "Summit Attack Essentials",
    status: "ACTIVE",
    placement: "Homepage Hero",
    targetUrl: "/produk?tag=summit",
    schedule: "31 Mei-14 Juni 2026",
    sortOrder: 1,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "promo-tent",
    title: "Tenda 3-season ready",
    status: "SCHEDULED",
    placement: "Catalog Top",
    targetUrl: "/kategori/tenda",
    schedule: "10-24 Juni 2026",
    sortOrder: 2,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "flash-camp",
    title: "Flash Sale Cooking Set",
    status: "PAUSED",
    placement: "Promo Strip",
    targetUrl: "/produk?discount=true",
    schedule: "Paused by marketing",
    sortOrder: 3,
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
  },
];

export function getAdminCommerceSummary() {
  return {
    totalProducts: adminProducts.length,
    activeProducts: adminProducts.filter((product) => product.status === "ACTIVE").length,
    lowStockProducts: adminProducts.filter((product) => product.lowStock).length,
    activeVouchers: adminVouchers.filter((voucher) => voucher.status === "ACTIVE").length,
    activeBanners: adminBanners.filter((banner) => banner.status === "ACTIVE").length,
    discountProducts: catalogProducts.filter((product) => getDiscountPercent(product) > 0).length,
  };
}

