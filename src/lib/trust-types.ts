import type { AdminListResponse } from "@/lib/admin-types";
import type { CustomerOrderResponse } from "@/lib/commerce-types";

export type WishlistItem = {
  id: string;
  createdAt: string;
  product: {
    id: string;
    slug: string;
    name: string;
    photo: string | null;
    brand: string;
    category: string;
    price: number;
    compareAt: number;
    stock: number;
    soldCount: number;
    ratingAvg: number | null;
  };
};

export type ReviewItem = {
  id: string;
  rating: number;
  text: string;
  photos: string[];
  status: "PENDING" | "PUBLISHED" | "HIDDEN";
  createdAt: string;
  customerName: string;
  orderNumber: string;
  product: { id: string; name: string; slug: string };
  variant: { sku: string; size: string | null; color: string | null } | null;
  user?: { id: string; name: string | null };
};

export type ProductReviewResponse = AdminListResponse<ReviewItem> & {
  summary: { average: number; count: number; distribution: Array<{ rating: number; count: number }> };
};

export type ReturnRequestItem = {
  id: string;
  quantity: number;
  reason: string;
  description: string;
  photos: string[];
  status: "REQUESTED" | "REVIEWING" | "APPROVED" | "REJECTED" | "RECEIVED" | "CLOSED";
  refundStatus: "NOT_STARTED" | "MANUAL_REVIEW" | "PROCESSED";
  reviewNote: string | null;
  createdAt: string;
  order: Pick<CustomerOrderResponse, "id" | "orderNumber" | "status">;
  orderItem: {
    id: string;
    quantity: number;
    product: { id: string; name: string; slug: string; photos: string[] };
    variant: { sku: string; size: string | null; color: string | null } | null;
  };
  user?: { id: string; name: string | null; email: string };
};

export type ComplaintItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  photos: string[];
  status: "OPEN" | "IN_REVIEW" | "RESOLVED" | "CLOSED";
  resolutionNote: string | null;
  createdAt: string;
  order: Pick<CustomerOrderResponse, "id" | "orderNumber" | "status">;
  user?: { id: string; name: string | null; email: string };
};

export type ArticleItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  content: string[];
  image: string | null;
  imageUrl: string | null;
  author: string;
  readingTime: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: string | null;
  updatedAt: string;
};

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  linkUrl: string | null;
  createdAt: string;
};

export type NotificationResponse = AdminListResponse<NotificationItem> & { unread: number };
