import { permissions } from "@/lib/rbac";
import { requireAdmin } from "@/lib/server/authz";
import { handleRouteError, ok } from "@/lib/server/http";
import { listAdminReturns, trustListQuerySchema } from "@/lib/server/trust-support-service";

export async function GET(request: Request) {
  try { const admin = await requireAdmin(permissions.returnManage); if (!admin.ok) return admin.response; return ok(await listAdminReturns(trustListQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams)))); } catch (error) { return handleRouteError(error); }
}
