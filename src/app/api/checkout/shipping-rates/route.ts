import { requireUser } from "@/lib/server/authz";
import { handleRouteError, ok, parseJson } from "@/lib/server/http";
import { estimateShipping, shippingEstimateSchema } from "@/lib/server/shipping-service";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (!user.ok) return user.response;

    const payload = shippingEstimateSchema.parse(await parseJson(request));
    return ok(await estimateShipping(user.userId, payload));
  } catch (error) {
    return handleRouteError(error);
  }
}
