import {
  Boxes,
  FileText,
  Flag,
  Home,
  LayoutDashboard,
  MessageSquareWarning,
  Package,
  Percent,
  RotateCcw,
  ShoppingBag,
  Tags,
  Truck,
  Star,
} from "lucide-react";

import {
  catalogProducts,
  categoryCatalog,
  type CatalogFilters,
  type CatalogSortKey,
  type CategoryItem,
  type ProductCatalogItem,
  type ProductVariant,
} from "@/lib/catalog-mock";

// Re-export catalog mock data so existing FE imports keep working unchanged.
export { catalogProducts, categoryCatalog };
export type { CatalogFilters, CatalogSortKey, CategoryItem, ProductCatalogItem, ProductVariant };

export const customerNav = [
  { href: "/produk", label: "Produk" },
  { href: "/kategori/tenda", label: "Kategori" },
  { href: "/artikel", label: "Artikel" },
  { href: "/faq", label: "FAQ" },
];

export const categories = categoryCatalog.map((category) => category.name);

export const featuredProducts = catalogProducts.slice(0, 4);

export const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produk", label: "Produk", icon: Package },
  { href: "/admin/kategori", label: "Kategori", icon: Tags },
  { href: "/admin/pesanan", label: "Pesanan", icon: Truck },
  { href: "/admin/voucher", label: "Voucher", icon: Percent },
  { href: "/admin/banner", label: "Banner", icon: Flag },
  { href: "/admin/return", label: "Return", icon: RotateCcw },
  { href: "/admin/komplain", label: "Komplain", icon: MessageSquareWarning },
  { href: "/admin/review", label: "Review", icon: Star },
  { href: "/admin/artikel", label: "Artikel", icon: FileText },
];

export const foundationModules = [
  { label: "Katalog", value: `${catalogProducts.length} produk demo`, icon: Boxes },
  { label: "Order Aktif", value: "Terhubung backend", icon: ShoppingBag },
  { label: "CS", value: "WhatsApp siap", icon: MessageSquareWarning },
  { label: "Web", value: "Mobile-first", icon: Home },
];

export const catalogBrands = Array.from(new Set(catalogProducts.map((product) => product.brand))).sort();

export function getDiscountPercent(product: ProductCatalogItem) {
  if (!product.compareAt || product.compareAt <= product.price) {
    return 0;
  }

  return Math.round(((product.compareAt - product.price) / product.compareAt) * 100);
}

export function getProductBySlug(slug: string) {
  return catalogProducts.find((product) => product.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categoryCatalog.find((category) => category.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return catalogProducts.filter((product) => product.categorySlug === categorySlug);
}

export function filterProducts(products: ProductCatalogItem[], filters: CatalogFilters) {
  const search = filters.search?.trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch = search
      ? [product.name, product.category, product.brand, product.description, ...product.tags].join(" ").toLowerCase().includes(search)
      : true;
    const matchesCategory = filters.categorySlugs?.length ? filters.categorySlugs.includes(product.categorySlug) : true;
    const matchesBrand = filters.brands?.length ? filters.brands.includes(product.brand) : true;
    const matchesMinPrice = filters.minPrice ? product.price >= filters.minPrice : true;
    const matchesMaxPrice = filters.maxPrice ? product.price <= filters.maxPrice : true;
    const matchesRating = filters.minRating ? product.rating >= filters.minRating : true;
    const matchesDiscount = filters.discountOnly ? getDiscountPercent(product) > 0 : true;
    const matchesStock = filters.inStockOnly ? product.stock > 0 : true;

    return matchesSearch && matchesCategory && matchesBrand && matchesMinPrice && matchesMaxPrice && matchesRating && matchesDiscount && matchesStock;
  });
}

export function sortProducts(products: ProductCatalogItem[], sortKey: CatalogSortKey) {
  const sorted = [...products];

  switch (sortKey) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "best-selling":
      return sorted.sort((a, b) => b.sold - a.sold);
    case "rating-desc":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "newest":
    default:
      return sorted.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
  }
}
