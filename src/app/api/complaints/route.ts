import { requireUser } from "@/lib/server/authz";
import { created, handleRouteError, ok, parseJson } from "@/lib/server/http";
import { complaintMutationSchema, createComplaint, listUserComplaints, trustListQuerySchema } from "@/lib/server/trust-support-service";

export async function GET(request: Request) {
  try { const user = await requireUser(); if (!user.ok) return user.response; return ok(await listUserComplaints(user.userId, trustListQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams)))); } catch (error) { return handleRouteError(error); }
}
export async function POST(request: Request) {
  try { const user = await requireUser(); if (!user.ok) return user.response; return created(await createComplaint(user.userId, complaintMutationSchema.parse(await parseJson(request)))); } catch (error) { return handleRouteError(error); }
}
