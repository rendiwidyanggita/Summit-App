import { permissions } from "@/lib/rbac";
import { adminListQuerySchema, adminProductMutationSchema, createAdminProduct, listAdminProducts } from "@/lib/server/admin-commerce-service";
import { requireAdmin } from "@/lib/server/authz";
import { created, handleRouteError, ok, parseJson } from "@/lib/server/http";

export async function GET(request: Request) {
  try {
    const admin = await requireAdmin(permissions.productRead);
    if (!admin.ok) return admin.response;
    return ok(await listAdminProducts(adminListQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams))));
  } catch (error) { return handleRouteError(error); }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin(permissions.productWrite);
    if (!admin.ok) return admin.response;
    return created(await createAdminProduct(admin.userId, adminProductMutationSchema.parse(await parseJson(request))));
  } catch (error) { return handleRouteError(error); }
}
