import { permissions } from "@/lib/rbac";
import { getAdminSummary } from "@/lib/server/admin-service";
import { requireAdmin } from "@/lib/server/authz";
import { handleRouteError, ok } from "@/lib/server/http";

export async function GET() {
  try {
    const admin = await requireAdmin(permissions.adminAccess);
    if (!admin.ok) return admin.response;

    return ok(await getAdminSummary());
  } catch (error) {
    return handleRouteError(error);
  }
}
