import { permissions } from "@/lib/rbac";
import { listLowStockVariants } from "@/lib/server/admin-commerce-service";
import { requireAdmin } from "@/lib/server/authz";
import { handleRouteError, ok } from "@/lib/server/http";

export async function GET() {
  try { const admin = await requireAdmin(permissions.productRead); if (!admin.ok) return admin.response; return ok(await listLowStockVariants()); } catch (error) { return handleRouteError(error); }
}
