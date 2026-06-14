import { requireUser } from "@/lib/server/authz";
import { handleRouteError, ok } from "@/lib/server/http";
import { simulateDemoPayment } from "@/lib/server/payment-service";

export async function POST(_request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const user = await requireUser();
    if (!user.ok) return user.response;

    const { orderId } = await params;
    return ok(await simulateDemoPayment(user.userId, orderId));
  } catch (error) {
    return handleRouteError(error);
  }
}
