import { requireUser } from "@/lib/server/authz";
import { getCart } from "@/lib/server/cart-service";
import { handleRouteError, ok, parseJson } from "@/lib/server/http";
import { validateVoucher, voucherValidationSchema } from "@/lib/server/voucher-service";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (!user.ok) return user.response;

    const payload = voucherValidationSchema.parse(await parseJson(request));
    const cart = await getCart(user.userId);

    return ok(
      await validateVoucher({
        ...payload,
        subtotal: payload.subtotal ?? cart.summary.subtotal,
      }),
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
