import { ShoppingCart } from "lucide-react";

import { EmptyState } from "@/components/sections/empty-state";

export default function CartPage() {
  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-3xl font-semibold tracking-normal">Keranjang</h1>
      <EmptyState icon={ShoppingCart} title="Keranjang belum aktif" description="UI route keranjang sudah tersedia. Persistence cart, update quantity, subtotal, dan estimasi berat masuk Sprint 4." />
    </div>
  );
}
