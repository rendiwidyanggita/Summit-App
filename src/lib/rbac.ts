import type { Session } from "next-auth";

export const permissions = {
  adminAccess: "admin.access",
  productRead: "product.read",
  productWrite: "product.write",
  orderRead: "order.read",
  orderWrite: "order.write",
  promoWrite: "promo.write",
  reportRead: "report.read",
  roleManage: "role.manage",
  reviewModerate: "review.moderate",
  returnManage: "return.manage",
  returnRefund: "return.refund",
  complaintManage: "complaint.manage",
  articleWrite: "article.write",
} as const;

export type PermissionCode = (typeof permissions)[keyof typeof permissions];

export const adminNavPermissions: Record<string, PermissionCode | undefined> = {
  "/admin": permissions.adminAccess,
  "/admin/produk": permissions.productRead,
  "/admin/kategori": permissions.productRead,
  "/admin/pesanan": permissions.orderRead,
  "/admin/voucher": permissions.promoWrite,
  "/admin/banner": permissions.promoWrite,
  "/admin/return": permissions.returnManage,
  "/admin/komplain": permissions.complaintManage,
  "/admin/review": permissions.reviewModerate,
  "/admin/artikel": permissions.articleWrite,
};

export function hasPermission(session: Session | null, permission: PermissionCode) {
  return Boolean(session?.user.permissions?.includes(permission));
}

export function isAdminSession(session: Session | null) {
  return Boolean(session?.user.isAdmin);
}
