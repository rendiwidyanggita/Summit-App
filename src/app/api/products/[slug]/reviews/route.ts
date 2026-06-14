import { handleRouteError, ok } from "@/lib/server/http";
import { listProductReviews, trustListQuerySchema } from "@/lib/server/trust-support-service";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try { return ok(await listProductReviews((await params).slug, trustListQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams)))); } catch (error) { return handleRouteError(error); }
}
