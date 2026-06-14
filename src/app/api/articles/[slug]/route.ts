import { handleRouteError, ok } from "@/lib/server/http";
import { getPublicArticle } from "@/lib/server/trust-support-service";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try { return ok(await getPublicArticle((await params).slug)); } catch (error) { return handleRouteError(error); }
}
