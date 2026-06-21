import { Suspense } from "react";
import { CheckoutPageClient } from "@/components/sections/checkout-page-client";

export const metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container-page py-8">Memuat checkout...</div>}>
      <CheckoutPageClient />
    </Suspense>
  );
}
