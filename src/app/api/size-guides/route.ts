import { z } from "zod";

import { handleRouteError, ok } from "@/lib/server/http";
import { listSizeGuides } from "@/lib/server/size-guide-service";

const sizeGuideQuerySchema = z.object({
  category: z.string().trim().optional(),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = sizeGuideQuerySchema.parse(Object.fromEntries(url.searchParams));

    return ok(await listSizeGuides(query.category));
  } catch (error) {
    return handleRouteError(error);
  }
}
