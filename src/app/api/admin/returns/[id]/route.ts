import { permissions } from "@/lib/rbac";
import { requireAdmin } from "@/lib/server/authz";
import { handleRouteError, ok, parseJson } from "@/lib/server/http";
import { returnStatusSchema, updateReturnStatus } from "@/lib/server/trust-support-service";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const admin = await requireAdmin(permissions.returnManage); if (!admin.ok) return admin.response; return ok(await updateReturnStatus(admin.userId, (await params).id, returnStatusSchema.parse(await parseJson(request)))); } catch (error) { return handleRouteError(error); }
}
