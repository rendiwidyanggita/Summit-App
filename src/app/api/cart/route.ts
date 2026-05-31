import { addCartItem, cartItemCreateSchema, clearCart, getCart } from "@/lib/server/cart-service";
import { requireUser } from "@/lib/server/authz";
import { created, handleRouteError, ok, parseJson } from "@/lib/server/http";

export async function GET() {
  try {
    const user = await requireUser();
    if (!user.ok) return user.response;

    return ok(await getCart(user.userId));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (!user.ok) return user.response;

    const payload = cartItemCreateSchema.parse(await parseJson(request));
    return created(await addCartItem(user.userId, payload));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE() {
  try {
    const user = await requireUser();
    if (!user.ok) return user.response;

    return ok(await clearCart(user.userId));
  } catch (error) {
    return handleRouteError(error);
  }
}
