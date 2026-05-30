import { MapPin } from "lucide-react";

import { EmptyState } from "@/components/sections/empty-state";

export default function AddressesPage() {
  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-3xl font-semibold tracking-normal">Alamat Pengiriman</h1>
      <EmptyState icon={MapPin} title="Alamat disiapkan" description="CRUD alamat dan alamat utama adalah bagian dari Sprint 2 agar kontrak user/account stabil." />
    </div>
  );
}
