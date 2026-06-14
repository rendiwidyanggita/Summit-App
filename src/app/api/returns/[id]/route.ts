import { requireUser } from "@/lib/server/authz";
import { handleRouteError, ok } from "@/lib/server/http";
import { getUserReturn } from "@/lib/server/trust-support-service";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const user = await requireUser(); if (!user.ok) return user.response; return ok(await getUserReturn(user.userId, (await params).id)); } catch (error) { return handleRouteError(error); }
}
