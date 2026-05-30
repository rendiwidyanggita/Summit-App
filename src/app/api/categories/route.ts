import { listCategories } from "@/lib/server/catalog-service";
import { handleRouteError, ok } from "@/lib/server/http";

export async function GET() {
  try {
    return ok(await listCategories());
  } catch (error) {
    return handleRouteError(error);
  }
}
