import { permissions } from "@/lib/rbac";
import { getAdminOrder } from "@/lib/server/admin-commerce-service";
import { requireAdmin } from "@/lib/server/authz";
import { handleRouteError, ok } from "@/lib/server/http";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const admin = await requireAdmin(permissions.orderRead); if (!admin.ok) return admin.response; return ok(await getAdminOrder((await params).id)); } catch (error) { return handleRouteError(error); }
}
