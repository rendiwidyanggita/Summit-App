import { Flag } from "lucide-react";

import { AdminModulePage } from "@/components/sections/admin-module-page";

export default function AdminBannerPage() {
  return <AdminModulePage title="Manajemen Banner" description="Banner homepage, urutan tampil, jadwal tayang, link campaign, dan status aktif." icon={Flag} />;
}
