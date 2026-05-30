import { Users } from "lucide-react";

import { AdminModulePage } from "@/components/sections/admin-module-page";

export default function AdminCustomerPage() {
  return <AdminModulePage title="Manajemen Customer" description="Daftar customer, detail profil, riwayat belanja, dan ban/unban akun." icon={Users} />;
}
