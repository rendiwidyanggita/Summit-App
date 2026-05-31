import { getRelatedProducts } from "@/lib/server/catalog-service";
import { handleRouteError, ok } from "@/lib/server/http";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const url = new URL(request.url);
    const rawLimit = Number(url.searchParams.get("limit") ?? 6);
    const limit = Math.min(20, Math.max(1, Number.isFinite(rawLimit) ? rawLimit : 6));
    return ok(await getRelatedProducts(slug, limit));
  } catch (error) {
    return handleRouteError(error);
  }
}
