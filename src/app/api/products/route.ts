import { listProducts, productQuerySchema } from "@/lib/server/catalog-service";
import { handleRouteError, ok } from "@/lib/server/http";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = productQuerySchema.parse(Object.fromEntries(url.searchParams));
    return ok(await listProducts(query));
  } catch (error) {
    return handleRouteError(error);
  }
}
