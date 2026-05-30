import { listActiveBanners } from "@/lib/server/catalog-service";
import { handleRouteError, ok } from "@/lib/server/http";

export async function GET() {
  try {
    return ok(await listActiveBanners());
  } catch (error) {
    return handleRouteError(error);
  }
}
