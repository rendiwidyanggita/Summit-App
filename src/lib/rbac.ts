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
} as const;

export type PermissionCode = (typeof permissions)[keyof typeof permissions];

export function hasPermission(session: Session | null, permission: PermissionCode) {
  return Boolean(session?.user.permissions?.includes(permission));
}

export function isAdminSession(session: Session | null) {
  return Boolean(session?.user.isAdmin);
}
