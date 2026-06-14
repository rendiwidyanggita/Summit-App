import { permissions } from "@/lib/rbac";
import { requireAdmin } from "@/lib/server/authz";
import { handleRouteError } from "@/lib/server/http";
import { renderAdminOrderDocument } from "@/lib/server/admin-print-service";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin(permissions.orderRead);
    if (!admin.ok) return admin.response;
    return new Response(await renderAdminOrderDocument((await params).id, "invoice"), { headers: { "content-type": "text/html; charset=utf-8" } });
  } catch (error) { return handleRouteError(error); }
}
