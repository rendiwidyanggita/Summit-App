import { Package } from "lucide-react";

import { EmptyState } from "@/components/sections/empty-state";

export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-3xl font-semibold tracking-normal">Detail Pesanan {orderId}</h1>
      <EmptyState icon={Package} title="Detail pesanan placeholder" description="Route detail pesanan sudah tersedia untuk kontrak URL dan layout sebelum data order aktif." />
    </div>
  );
}
