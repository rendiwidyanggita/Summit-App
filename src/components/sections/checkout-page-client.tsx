"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Clock, PackageCheck, ShieldCheck } from "lucide-react";

import { AddressSelector } from "@/components/sections/address-selector";
import { CheckoutSteps, type CheckoutStep } from "@/components/sections/checkout-steps";
import { OrderSummary } from "@/components/sections/order-summary";
import { PaymentSelector } from "@/components/sections/payment-selector";
import { ShippingSelector } from "@/components/sections/shipping-selector";
import { VoucherBox } from "@/components/sections/voucher-box";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  checkoutAddresses,
  getCartSubtotal,
  getGrandTotal,
  getVoucherDiscount,
  initialCartItems,
  paymentMethods,
  shippingServices,
  type VoucherMock,
} from "@/lib/commerce-mock";
import { formatRupiah } from "@/lib/utils";

export function CheckoutPageClient() {
  const [activeStep, setActiveStep] = useState<CheckoutStep>("Alamat");
  const [selectedAddressId, setSelectedAddressId] = useState(checkoutAddresses[0].id);
  const [selectedShippingId, setSelectedShippingId] = useState(shippingServices[0].id);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherMock | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState("va");

  const selectedAddress = checkoutAddresses.find((address) => address.id === selectedAddressId) ?? checkoutAddresses[0];
  const selectedShipping = shippingServices.find((service) => service.id === selectedShippingId) ?? shippingServices[0];
  const subtotal = getCartSubtotal(initialCartItems);
  const total = useMemo(() => getGrandTotal(initialCartItems, selectedShipping.price, selectedVoucher), [selectedShipping.price, selectedVoucher]);
  const discount = getVoucherDiscount(selectedVoucher, subtotal, selectedShipping.price);
  const selectedPayment = paymentMethods.find((method) => method.id === selectedPaymentId) ?? paymentMethods[0];

  return (
    <div className="container-page py-8">
      <section className="mb-6 rounded-[1.5rem] border bg-[linear-gradient(135deg,var(--primary),color-mix(in_oklab,var(--primary)_78%,black))] p-5 text-primary-foreground shadow-sm sm:p-6">
        <Badge variant="accent">Sprint 4 Checkout</Badge>
        <div className="mt-3 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal sm:text-5xl">Checkout Pendakian</h1>
            <p className="mt-3 max-w-2xl text-sm text-primary-foreground/80 sm:text-base">
              Simulasi alur alamat, kurir, voucher, metode pembayaran, dan ringkasan biaya tanpa membuat order real.
            </p>
          </div>
          <div className="rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm">
            <Clock className="mr-2 inline size-4 text-accent" />
            Payment timer mock: 23:42:18
          </div>
        </div>
      </section>

      <CheckoutSteps activeStep={activeStep} onStepChange={setActiveStep} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-5">
          <Card className={activeStep === "Alamat" ? "border-primary" : undefined}>
            <CardHeader>
              <CardTitle className="text-lg">1. Pilih alamat</CardTitle>
            </CardHeader>
            <CardContent>
              <AddressSelector addresses={checkoutAddresses} selectedAddressId={selectedAddressId} onSelect={setSelectedAddressId} />
            </CardContent>
          </Card>

          <Card className={activeStep === "Kurir" ? "border-primary" : undefined}>
            <CardHeader>
              <CardTitle className="text-lg">2. Pilih kurir</CardTitle>
            </CardHeader>
            <CardContent>
              <ShippingSelector services={shippingServices} selectedServiceId={selectedShippingId} onSelect={setSelectedShippingId} />
            </CardContent>
          </Card>

          <Card className={activeStep === "Voucher" ? "border-primary" : undefined}>
            <CardHeader>
              <CardTitle className="text-lg">3. Voucher</CardTitle>
            </CardHeader>
            <CardContent>
              <VoucherBox subtotal={subtotal} selectedVoucher={selectedVoucher} onApply={setSelectedVoucher} />
            </CardContent>
          </Card>

          <Card className={activeStep === "Pembayaran" ? "border-primary" : undefined}>
            <CardHeader>
              <CardTitle className="text-lg">4. Metode pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentSelector methods={paymentMethods} selectedMethodId={selectedPaymentId} onSelect={setSelectedPaymentId} total={total} address={selectedAddress} />
            </CardContent>
          </Card>

          <Card className={activeStep === "Ringkasan" ? "border-primary" : undefined}>
            <CardHeader>
              <CardTitle className="text-lg">5. Review final</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="rounded-md bg-secondary p-3">
                Dikirim ke <span className="font-medium">{selectedAddress.recipient}</span> di {selectedAddress.city} via {selectedShipping.courier} {selectedShipping.service}.
              </div>
              <div className="rounded-md bg-secondary p-3">
                Pembayaran dipilih: <span className="font-medium">{selectedPayment.label}</span>. Total mock: <span className="font-medium">{formatRupiah(total)}</span>.
              </div>
              {selectedPayment.id === "cod" ? (
                <div className="flex gap-3 rounded-md border border-accent bg-accent/15 p-3">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>COD mengikuti limit transaksi, dukungan wilayah, dan riwayat akun. Validasi final tetap di backend.</span>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <OrderSummary
            items={initialCartItems}
            shippingCost={selectedShipping.price}
            voucher={selectedVoucher}
            action={
              <div className="grid gap-3">
                <Button disabled>
                  Buat Order Mock <ArrowRight />
                </Button>
                <p className="text-xs text-muted-foreground">Tombol dinonaktifkan karena order creation dan Midtrans masuk backend/fullstack berikutnya.</p>
              </div>
            }
          />
          <div className="mt-4 grid gap-3 rounded-lg bg-primary p-4 text-sm text-primary-foreground">
            {[
              { icon: PackageCheck, text: "Reserved stock ditampilkan sebagai notice UI." },
              { icon: ShieldCheck, text: `Voucher discount aktif: ${discount ? formatRupiah(discount) : "belum ada"}.` },
              { icon: Clock, text: "VA 24 jam, QRIS/e-wallet 15 menit mengikuti PRD." },
            ].map((item) => (
              <div key={item.text} className="flex gap-3">
                <item.icon className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-3 w-full" asChild>
            <Link href="/keranjang">Kembali ke keranjang</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
