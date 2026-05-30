import { addressCreateSchema, createAddress, listAddresses } from "@/lib/server/account-service";
import { requireUser } from "@/lib/server/authz";
import { created, handleRouteError, ok, parseJson } from "@/lib/server/http";

export async function GET() {
  try {
    const user = await requireUser();
    if (!user.ok) return user.response;

    return ok(await listAddresses(user.userId));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (!user.ok) return user.response;

    const payload = addressCreateSchema.parse(await parseJson(request));
    return created(await createAddress(user.userId, payload));
  } catch (error) {
    return handleRouteError(error);
  }
}
