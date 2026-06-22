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
        title={`${title} sedang dalam tahap pemeliharaan`}
        description="Modul ini sedang dalam tahap sinkronisasi data. Gunakan menu navigasi lainnya untuk mengelola operasional katalog, pesanan, promosi, bantuan, dan konten utama."
      />
    </div>
  );
}
