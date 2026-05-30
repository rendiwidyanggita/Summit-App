import { LucideIcon } from "lucide-react";

import { AdminPageHeader } from "@/components/sections/admin-page-header";
import { EmptyState } from "@/components/sections/empty-state";

export function AdminModulePage({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div>
      <AdminPageHeader title={title} description={description} />
      <EmptyState icon={icon} title={`${title} belum aktif`} description="Route, layout, dan navigasi admin sudah tersedia. CRUD, validasi server, RBAC enforcement, audit log, dan integrasi data masuk sprint operasional berikutnya." />
    </div>
  );
}
