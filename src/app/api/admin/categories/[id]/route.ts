import { permissions } from "@/lib/rbac";
import { adminCategoryMutationSchema, deleteAdminCategory, updateAdminCategory } from "@/lib/server/admin-commerce-service";
import { requireAdmin } from "@/lib/server/authz";
import { handleRouteError, ok, parseJson } from "@/lib/server/http";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, { params }: Context) {
  try { const admin = await requireAdmin(permissions.productWrite); if (!admin.ok) return admin.response; return ok(await updateAdminCategory(admin.userId, (await params).id, adminCategoryMutationSchema.parse(await parseJson(request)))); } catch (error) { return handleRouteError(error); }
}
export async function DELETE(_request: Request, { params }: Context) {
  try { const admin = await requireAdmin(permissions.productWrite); if (!admin.ok) return admin.response; return ok(await deleteAdminCategory(admin.userId, (await params).id)); } catch (error) { return handleRouteError(error); }
}
