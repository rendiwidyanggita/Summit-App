import { registerCustomer, registerSchema } from "@/lib/server/auth-service";
import { created, fail, handleRouteError, parseJson } from "@/lib/server/http";

export async function POST(request: Request) {
  try {
    const payload = registerSchema.parse(await parseJson(request));
    const result = await registerCustomer(payload);

    if (!result.ok) {
      return fail(409, result.code, result.message);
    }

    return created(result.user);
  } catch (error) {
    return handleRouteError(error);
  }
}
