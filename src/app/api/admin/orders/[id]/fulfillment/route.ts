import { permissions } from "@/lib/rbac";
import { adminFulfillmentSchema, updateAdminFulfillment } from "@/lib/server/admin-commerce-service";
import { requireAdmin } from "@/lib/server/authz";
import { handleRouteError, ok, parseJson } from "@/lib/server/http";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const admin = await requireAdmin(permissions.orderWrite); if (!admin.ok) return admin.response; return ok(await updateAdminFulfillment(admin.userId, (await params).id, adminFulfillmentSchema.parse(await parseJson(request)))); } catch (error) { return handleRouteError(error); }
}
