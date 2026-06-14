import { addWishlist, listWishlist, wishlistMutationSchema } from "@/lib/server/trust-support-service";
import { requireUser } from "@/lib/server/authz";
import { created, handleRouteError, ok, parseJson } from "@/lib/server/http";

export async function GET() {
  try { const user = await requireUser(); if (!user.ok) return user.response; return ok(await listWishlist(user.userId)); } catch (error) { return handleRouteError(error); }
}
export async function POST(request: Request) {
  try { const user = await requireUser(); if (!user.ok) return user.response; const input = wishlistMutationSchema.parse(await parseJson(request)); return created(await addWishlist(user.userId, input.productId)); } catch (error) { return handleRouteError(error); }
}
