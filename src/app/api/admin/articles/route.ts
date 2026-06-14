import { permissions } from "@/lib/rbac";
import { requireAdmin } from "@/lib/server/authz";
import { created, handleRouteError, ok, parseJson } from "@/lib/server/http";
import { articleMutationSchema, createAdminArticle, listAdminArticles, trustListQuerySchema } from "@/lib/server/trust-support-service";

export async function GET(request: Request) {
  try { const admin = await requireAdmin(permissions.articleWrite); if (!admin.ok) return admin.response; return ok(await listAdminArticles(trustListQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams)))); } catch (error) { return handleRouteError(error); }
}
export async function POST(request: Request) {
  try { const admin = await requireAdmin(permissions.articleWrite); if (!admin.ok) return admin.response; return created(await createAdminArticle(admin.userId, articleMutationSchema.parse(await parseJson(request)))); } catch (error) { return handleRouteError(error); }
}
