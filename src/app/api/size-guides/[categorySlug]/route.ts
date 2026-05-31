import { getSizeGuidesByCategorySlug } from "@/lib/server/size-guide-service";
import { fail, handleRouteError, ok } from "@/lib/server/http";

export async function GET(_request: Request, { params }: { params: Promise<{ categorySlug: string }> }) {
  try {
    const { categorySlug } = await params;
    const guides = await getSizeGuidesByCategorySlug(categorySlug);

    if (guides.length === 0) {
      return fail(404, "SIZE_GUIDE_NOT_FOUND", "Panduan ukuran tidak ditemukan.");
    }

    return ok(guides);
  } catch (error) {
    return handleRouteError(error);
  }
}
