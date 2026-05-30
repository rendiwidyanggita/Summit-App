import { Percent } from "lucide-react";

import { AdminModulePage } from "@/components/sections/admin-module-page";

export default function AdminVoucherPage() {
  return <AdminModulePage title="Manajemen Voucher" description="Kode promo, periode aktif, kuota, tipe diskon, minimum belanja, dan maksimum diskon." icon={Percent} />;
}
