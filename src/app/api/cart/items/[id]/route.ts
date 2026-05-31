import { cartItemUpdateSchema, removeCartItem, updateCartItem } from "@/lib/server/cart-service";
import { requireUser } from "@/lib/server/authz";
import { handleRouteError, ok, parseJson } from "@/lib/server/http";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    if (!user.ok) return user.response;

    const { id } = await params;
    const payload = cartItemUpdateSchema.parse(await parseJson(request));

    return ok(await updateCartItem(user.userId, id, payload));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    if (!user.ok) return user.response;

    const { id } = await params;
    return ok(await removeCartItem(user.userId, id));
  } catch (error) {
    return handleRouteError(error);
  }
}
