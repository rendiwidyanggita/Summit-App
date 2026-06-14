import { handleRouteError, ok } from "@/lib/server/http";
import { listPublicArticles, trustListQuerySchema } from "@/lib/server/trust-support-service";

export async function GET(request: Request) {
  try { return ok(await listPublicArticles(trustListQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams)))); } catch (error) { return handleRouteError(error); }
}
