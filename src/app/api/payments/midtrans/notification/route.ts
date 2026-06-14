import { isDemoMidtransEnabled } from "@/lib/server/env";
import { fail, handleRouteError, ok, parseJson } from "@/lib/server/http";
import { processMidtransNotification } from "@/lib/server/payment-service";

export async function POST(request: Request) {
  try {
    if (isDemoMidtransEnabled()) {
      return fail(404, "MIDTRANS_WEBHOOK_DISABLED", "Webhook Midtrans tidak tersedia pada mode demo.");
    }

    const payload = await parseJson(request);
    return ok(await processMidtransNotification(payload));
  } catch (error) {
    return handleRouteError(error);
  }
}
