import { handleRouteError, ok } from "@/lib/server/http";
import { getHomeFeed } from "@/lib/server/home-feed-service";

export async function GET() {
  try {
    return ok(await getHomeFeed());
  } catch (error) {
    return handleRouteError(error);
  }
}
