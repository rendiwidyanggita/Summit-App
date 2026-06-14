import { permissions } from "@/lib/rbac";
import { adminProductMutationSchema, archiveAdminProduct, getAdminProduct, updateAdminProduct } from "@/lib/server/admin-commerce-service";
import { requireAdmin } from "@/lib/server/authz";
import { handleRouteError, ok, parseJson } from "@/lib/server/http";

type Context = { params: Promise<{ id: string }> };
export async function GET(_request: Request, { params }: Context) {
  try { const admin = await requireAdmin(permissions.productRead); if (!admin.ok) return admin.response; return ok(await getAdminProduct((await params).id)); } catch (error) { return handleRouteError(error); }
}
export async function PATCH(request: Request, { params }: Context) {
  try { const admin = await requireAdmin(permissions.productWrite); if (!admin.ok) return admin.response; return ok(await updateAdminProduct(admin.userId, (await params).id, adminProductMutationSchema.parse(await parseJson(request)))); } catch (error) { return handleRouteError(error); }
}
export async function DELETE(_request: Request, { params }: Context) {
  try { const admin = await requireAdmin(permissions.productWrite); if (!admin.ok) return admin.response; return ok(await archiveAdminProduct(admin.userId, (await params).id)); } catch (error) { return handleRouteError(error); }
}
