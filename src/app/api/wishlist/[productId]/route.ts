import { requireUser } from "@/lib/server/authz";
import { handleRouteError, ok } from "@/lib/server/http";
import { removeWishlist } from "@/lib/server/trust-support-service";

export async function DELETE(_request: Request, { params }: { params: Promise<{ productId: string }> }) {
  try { const user = await requireUser(); if (!user.ok) return user.response; return ok(await removeWishlist(user.userId, (await params).productId)); } catch (error) { return handleRouteError(error); }
}
