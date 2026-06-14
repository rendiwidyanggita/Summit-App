import { requireUser } from "@/lib/server/authz";
import { handleRouteError, ok } from "@/lib/server/http";
import { markAllNotificationsRead } from "@/lib/server/trust-support-service";

export async function PATCH() {
  try { const user = await requireUser(); if (!user.ok) return user.response; return ok(await markAllNotificationsRead(user.userId)); } catch (error) { return handleRouteError(error); }
}
