import { requireUser } from "@/lib/server/authz";
import { handleRouteError, ok } from "@/lib/server/http";
import { markNotificationRead } from "@/lib/server/trust-support-service";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const user = await requireUser(); if (!user.ok) return user.response; return ok(await markNotificationRead(user.userId, (await params).id)); } catch (error) { return handleRouteError(error); }
}
