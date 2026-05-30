import { auth } from "@/lib/auth";
import { fail } from "@/lib/server/http";

export async function requireUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      ok: false as const,
      response: fail(401, "UNAUTHENTICATED", "Silakan masuk terlebih dahulu."),
    };
  }

  return {
    ok: true as const,
    session,
    userId: session.user.id,
  };
}

export async function requireAdmin(permission?: string) {
  const user = await requireUser();

  if (!user.ok) {
    return user;
  }

  if (!user.session.user.isAdmin) {
    return {
      ok: false as const,
      response: fail(403, "FORBIDDEN", "Akses admin diperlukan."),
    };
  }

  if (permission && !user.session.user.permissions.includes(permission)) {
    return {
      ok: false as const,
      response: fail(403, "MISSING_PERMISSION", `Permission ${permission} diperlukan.`),
    };
  }

  return user;
}
