import { permissions } from "@/lib/rbac";
import { requireAdmin } from "@/lib/server/authz";
import { handleRouteError, ok, parseJson } from "@/lib/server/http";
import { archiveAdminArticle, articleMutationSchema, updateAdminArticle } from "@/lib/server/trust-support-service";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, { params }: Context) {
  try { const admin = await requireAdmin(permissions.articleWrite); if (!admin.ok) return admin.response; return ok(await updateAdminArticle(admin.userId, (await params).id, articleMutationSchema.parse(await parseJson(request)))); } catch (error) { return handleRouteError(error); }
}
export async function DELETE(_request: Request, { params }: Context) {
  try { const admin = await requireAdmin(permissions.articleWrite); if (!admin.ok) return admin.response; return ok(await archiveAdminArticle(admin.userId, (await params).id)); } catch (error) { return handleRouteError(error); }
}
