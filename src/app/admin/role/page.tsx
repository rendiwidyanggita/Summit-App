import { ShieldCheck } from "lucide-react";

import { AdminModulePage } from "@/components/sections/admin-module-page";

export default function AdminRolesPage() {
  return <AdminModulePage title="Role & Permission" description="RBAC untuk Super Admin, Operasional, Marketing, Customer Service, dan Finance." icon={ShieldCheck} />;
}
