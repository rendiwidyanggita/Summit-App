import { getProductBySlug } from "@/lib/server/catalog-service";
import { fail, handleRouteError, ok } from "@/lib/server/http";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return fail(404, "PRODUCT_NOT_FOUND", "Produk tidak ditemukan.");
    }

    return ok(product);
  } catch (error) {
    return handleRouteError(error);
  }
}
