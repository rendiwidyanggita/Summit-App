import type { CheckoutPaymentMethod, CustomerOrderAddress, CustomerOrderStatus } from "@/lib/commerce-types";

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type AdminProductStatus = "ACTIVE" | "DRAFT" | "INACTIVE" | "ARCHIVED";
export type AdminVoucherStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | "EXPIRED";
export type AdminBannerPlacement = "HOME_HERO" | "PROMO_STRIP" | "CATALOG_TOP";

export type AdminProductVariant = {
  id: string;
  sku: string;
  size: string | null;
  color: string | null;
  stock: number;
  minimumStock: number;
  priceModifier: number;
  isActive: boolean;
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  categoryId: string;
  brandId: string;
  category: { id: string; name: string; slug: string };
  brand: { id: string; name: string; slug: string };
  weightGram: number;
  price: number;
  costPrice: number;
  discountPrice: number | null;
  photos: string[];
  videoUrl: string | null;
  status: AdminProductStatus;
  isCodAllowed: boolean;
  tags: string[];
  specs: unknown;
  ratingAvg: number | null;
  ratingCount: number;
  soldCount: number;
  isFeatured: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  stock: number;
  lowStock: boolean;
  margin: number;
  variants: AdminProductVariant[];
  updatedAt: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  parent: { id: string; name: string; slug: string } | null;
  icon: string | null;
  imageUrl: string | null;
  isVisible: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  productCount: number;
  activeProductCount: number;
};

export type AdminVoucher = {
  id: string;
  code: string;
  name: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  value: number;
  minSpend: number;
  maxDiscount: number | null;
  startsAt: string;
  endsAt: string;
  quota: number | null;
  used: number;
  status: AdminVoucherStatus;
};

export type AdminBanner = {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl: string | null;
  placement: AdminBannerPlacement;
  sortOrder: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
};

export type AdminOrder = {
  id: string;
  orderNumber: string;
  status: CustomerOrderStatus;
  paymentMethod: CheckoutPaymentMethod;
  total: number;
  addressSnapshot: CustomerOrderAddress;
  createdAt: string;
  user: { id: string; name: string | null; email: string; phone: string | null };
  payment: { status: string; paidAt: string | null } | null;
  shipment: {
    courier: string;
    service: string;
    trackingNo: string | null;
    trackingUrl: string | null;
    status: string;
    shippedAt: string | null;
    deliveredAt: string | null;
  } | null;
  itemCount: number;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product: { name: string; slug: string };
    variant: { sku: string; size: string | null; color: string | null } | null;
  }>;
};

export type AdminListResponse<T> = {
  items: T[];
  pagination: Pagination;
};
