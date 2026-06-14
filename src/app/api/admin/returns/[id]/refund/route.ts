import { permissions } from "@/lib/rbac";
import { requireAdmin } from "@/lib/server/authz";
import { handleRouteError, ok } from "@/lib/server/http";
import { processReturnRefund } from "@/lib/server/trust-support-service";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const admin = await requireAdmin(permissions.returnRefund); if (!admin.ok) return admin.response; return ok(await processReturnRefund(admin.userId, (await params).id)); } catch (error) { return handleRouteError(error); }
}
