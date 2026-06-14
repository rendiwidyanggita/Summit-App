import { permissions } from "@/lib/rbac";
import { adminListQuerySchema, listAuditLogs } from "@/lib/server/admin-commerce-service";
import { requireAdmin } from "@/lib/server/authz";
import { handleRouteError, ok } from "@/lib/server/http";

export async function GET(request: Request) {
  try { const admin = await requireAdmin(permissions.adminAccess); if (!admin.ok) return admin.response; return ok(await listAuditLogs(adminListQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams)))); } catch (error) { return handleRouteError(error); }
}
