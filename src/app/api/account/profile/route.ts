import { getProfile, profileUpdateSchema, updateProfile } from "@/lib/server/account-service";
import { requireUser } from "@/lib/server/authz";
import { handleRouteError, ok, parseJson } from "@/lib/server/http";

export async function GET() {
  try {
    const user = await requireUser();
    if (!user.ok) return user.response;

    return ok(await getProfile(user.userId));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireUser();
    if (!user.ok) return user.response;

    const payload = profileUpdateSchema.parse(await parseJson(request));
    return ok(await updateProfile(user.userId, payload));
  } catch (error) {
    return handleRouteError(error);
  }
}
