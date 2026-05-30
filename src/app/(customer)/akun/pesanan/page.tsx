import { PackageSearch } from "lucide-react";

import { EmptyState } from "@/components/sections/empty-state";

export default function OrdersPage() {
  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-3xl font-semibold tracking-normal">Pesanan Saya</h1>
      <EmptyState icon={PackageSearch} title="Order belum terhubung" description="Tab status, timeline, tracking, dan konfirmasi diterima akan dibangun setelah cart, checkout, dan payment siap." />
    </div>
  );
}
