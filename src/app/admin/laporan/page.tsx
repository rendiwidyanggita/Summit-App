import { BarChart3 } from "lucide-react";

import { AdminModulePage } from "@/components/sections/admin-module-page";

export default function AdminReportsPage() {
  return <AdminModulePage title="Laporan Penjualan" description="Revenue harian/bulanan, laba kotor, produk terlaris, pertumbuhan user, dan performa promo." icon={BarChart3} />;
}
