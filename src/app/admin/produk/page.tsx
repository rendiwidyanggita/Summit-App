import { Package } from "lucide-react";

import { AdminModulePage } from "@/components/sections/admin-module-page";

export default function AdminProductsPage() {
  return <AdminModulePage title="Manajemen Produk" description="CRUD produk, varian, stok, harga, foto, status aktif, dan audit perubahan inventory." icon={Package} />;
}
