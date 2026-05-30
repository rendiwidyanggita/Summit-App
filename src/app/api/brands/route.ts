import { listBrands } from "@/lib/server/catalog-service";
import { handleRouteError, ok } from "@/lib/server/http";

export async function GET() {
  try {
    return ok(await listBrands());
  } catch (error) {
    return handleRouteError(error);
  }
}
