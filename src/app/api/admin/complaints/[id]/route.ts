import { permissions } from "@/lib/rbac";
import { requireAdmin } from "@/lib/server/authz";
import { handleRouteError, ok, parseJson } from "@/lib/server/http";
import { complaintStatusSchema, updateComplaintStatus } from "@/lib/server/trust-support-service";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const admin = await requireAdmin(permissions.complaintManage); if (!admin.ok) return admin.response; return ok(await updateComplaintStatus(admin.userId, (await params).id, complaintStatusSchema.parse(await parseJson(request)))); } catch (error) { return handleRouteError(error); }
}
