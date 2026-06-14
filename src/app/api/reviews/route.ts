import { requireUser } from "@/lib/server/authz";
import { created, handleRouteError, parseJson } from "@/lib/server/http";
import { createReview, reviewMutationSchema } from "@/lib/server/trust-support-service";

export async function POST(request: Request) {
  try { const user = await requireUser(); if (!user.ok) return user.response; return created(await createReview(user.userId, reviewMutationSchema.parse(await parseJson(request)))); } catch (error) { return handleRouteError(error); }
}
