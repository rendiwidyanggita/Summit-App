import { listGearChecklists } from "@/lib/server/gear-checklist-service";
import { handleRouteError, ok } from "@/lib/server/http";

export async function GET() {
  try {
    return ok(await listGearChecklists());
  } catch (error) {
    return handleRouteError(error);
  }
}
