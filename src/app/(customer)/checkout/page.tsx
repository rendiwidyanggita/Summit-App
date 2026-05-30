import { CreditCard } from "lucide-react";

import { EmptyState } from "@/components/sections/empty-state";

export default function CheckoutPage() {
  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-3xl font-semibold tracking-normal">Checkout</h1>
      <EmptyState icon={CreditCard} title="Checkout disiapkan untuk Sprint 4" description="Alur alamat, kurir, voucher, ringkasan pesanan, reserved stock, dan payment method belum dibuat pada Sprint 1." />
    </div>
  );
}
