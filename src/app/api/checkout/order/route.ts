import { checkoutCreateOrderSchema, createCheckoutOrder } from "@/lib/server/checkout-service";
import { requireUser } from "@/lib/server/authz";
import { created, handleRouteError, parseJson } from "@/lib/server/http";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (!user.ok) return user.response;

    const payload = checkoutCreateOrderSchema.parse(await parseJson(request));
    return created(await createCheckoutOrder(user.userId, payload));
  } catch (error) {
    return handleRouteError(error);
  }
}
