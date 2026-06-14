import { permissions } from "@/lib/rbac";
import { adminBannerMutationSchema, deleteAdminBanner, updateAdminBanner } from "@/lib/server/admin-commerce-service";
import { requireAdmin } from "@/lib/server/authz";
import { handleRouteError, ok, parseJson } from "@/lib/server/http";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, { params }: Context) {
  try { const admin = await requireAdmin(permissions.promoWrite); if (!admin.ok) return admin.response; return ok(await updateAdminBanner(admin.userId, (await params).id, adminBannerMutationSchema.parse(await parseJson(request)))); } catch (error) { return handleRouteError(error); }
}
export async function DELETE(_request: Request, { params }: Context) {
  try { const admin = await requireAdmin(permissions.promoWrite); if (!admin.ok) return admin.response; return ok(await deleteAdminBanner(admin.userId, (await params).id)); } catch (error) { return handleRouteError(error); }
}
