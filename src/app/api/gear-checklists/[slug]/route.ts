import { getGearChecklistBySlug } from "@/lib/server/gear-checklist-service";
import { fail, handleRouteError, ok } from "@/lib/server/http";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const checklist = await getGearChecklistBySlug(slug);

    if (!checklist) {
      return fail(404, "CHECKLIST_NOT_FOUND", "Gear checklist tidak ditemukan.");
    }

    return ok(checklist);
  } catch (error) {
    return handleRouteError(error);
  }
}
