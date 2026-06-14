import { permissions } from "@/lib/rbac";
import { requireAdmin } from "@/lib/server/authz";
import { handleRouteError, ok, parseJson } from "@/lib/server/http";
import { moderateReview, reviewModerationSchema } from "@/lib/server/trust-support-service";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const admin = await requireAdmin(permissions.reviewModerate); if (!admin.ok) return admin.response; const input = reviewModerationSchema.parse(await parseJson(request)); return ok(await moderateReview(admin.userId, (await params).id, input.status)); } catch (error) { return handleRouteError(error); }
}
