import { z } from "zod";

import { requireUser } from "@/lib/server/authz";
import { clearSearchHistory, createSearchHistory, listSearchHistory, searchHistoryCreateSchema } from "@/lib/server/search-history-service";
import { created, handleRouteError, ok, parseJson } from "@/lib/server/http";

const historyQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    if (!user.ok) return user.response;

    const url = new URL(request.url);
    const query = historyQuerySchema.parse(Object.fromEntries(url.searchParams));

    return ok(await listSearchHistory(user.userId, query.limit));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (!user.ok) return user.response;

    const payload = searchHistoryCreateSchema.parse(await parseJson(request));
    return created(await createSearchHistory(user.userId, payload.query));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE() {
  try {
    const user = await requireUser();
    if (!user.ok) return user.response;

    return ok(await clearSearchHistory(user.userId));
  } catch (error) {
    return handleRouteError(error);
  }
}
