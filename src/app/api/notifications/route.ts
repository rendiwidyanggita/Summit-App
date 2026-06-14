import { requireUser } from "@/lib/server/authz";
import { handleRouteError, ok } from "@/lib/server/http";
import { listNotifications, trustListQuerySchema } from "@/lib/server/trust-support-service";

export async function GET(request: Request) {
  try { const user = await requireUser(); if (!user.ok) return user.response; return ok(await listNotifications(user.userId, trustListQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams)))); } catch (error) { return handleRouteError(error); }
}
