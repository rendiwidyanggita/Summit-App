import { Truck } from "lucide-react";

import { AdminModulePage } from "@/components/sections/admin-module-page";

export default function AdminOrdersPage() {
  return <AdminModulePage title="Manajemen Pesanan" description="List order, invoice, packing list, transisi status, input resi, dan fulfillment gudang." icon={Truck} />;
}
