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
      <EmptyState
        icon={icon}
        title={`${title} belum tersedia pada versi demo`}
        description="Modul ini tidak termasuk alur demonstrasi saat ini. Gunakan menu admin yang tersedia untuk mencoba operasional produk, order, promo, support, dan konten."
      />
    </div>
  );
}
