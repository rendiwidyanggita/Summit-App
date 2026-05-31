import { z } from "zod";

import { handleRouteError, ok } from "@/lib/server/http";
import { suggestProducts } from "@/lib/server/search-service";

const suggestQuerySchema = z.object({
  q: z.string().optional().default(""),
  limit: z.coerce.number().int().min(1).max(20).default(8),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = suggestQuerySchema.parse(Object.fromEntries(url.searchParams));
    return ok(await suggestProducts(query.q, query.limit));
  } catch (error) {
    return handleRouteError(error);
  }
}
