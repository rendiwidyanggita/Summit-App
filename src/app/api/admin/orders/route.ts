import { permissions } from "@/lib/rbac";
import { adminListQuerySchema, listAdminOrders } from "@/lib/server/admin-commerce-service";
import { requireAdmin } from "@/lib/server/authz";
import { handleRouteError, ok } from "@/lib/server/http";

export async function GET(request: Request) {
  try { const admin = await requireAdmin(permissions.orderRead); if (!admin.ok) return admin.response; return ok(await listAdminOrders(adminListQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams)))); } catch (error) { return handleRouteError(error); }
}
