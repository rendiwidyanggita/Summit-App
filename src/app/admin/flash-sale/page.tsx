import { Gift } from "lucide-react";

import { AdminModulePage } from "@/components/sections/admin-module-page";

export default function AdminFlashSalePage() {
  return <AdminModulePage title="Flash Sale" description="Jadwal flash sale, produk peserta, harga flash sale, kuota, dan countdown campaign." icon={Gift} />;
}
