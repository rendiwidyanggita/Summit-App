"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, Loader2, MapPin, PackageCheck, ShieldCheck, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { AddressSelector } from "@/components/sections/address-selector";
import { CheckoutSteps, type CheckoutStep } from "@/components/sections/checkout-steps";
import { DesignParticles } from "@/components/sections/design-particles";
import { OrderSummary } from "@/components/sections/order-summary";
import { PaymentSelector, type PaymentMethodOption } from "@/components/sections/payment-selector";
import { ShippingSelector } from "@/components/sections/shipping-selector";
import { VoucherBox } from "@/components/sections/voucher-box";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiRequestError, apiRequest } from "@/lib/api-client";
import type { AccountAddressResponse, CartResponse, CheckoutOrderResponse, CheckoutPaymentMethod, ShippingRatesResponse, VoucherValidationResponse } from "@/lib/commerce-types";
import { formatRupiah } from "@/lib/utils";

const paymentMethods: PaymentMethodOption[] = [
  { id: "MIDTRANS_VA", label: "Virtual Account", description: "BCA, BNI, BRI, Mandiri via Midtrans pada Sprint 5.", group: "Midtrans" },
  { id: "MIDTRANS_QRIS", label: "QRIS", description: "Pembayaran QRIS disiapkan sebagai metode order.", group: "Midtrans" },
  { id: "MIDTRANS_EWALLET", label: "E-Wallet", description: "GoPay, OVO, DANA, ShopeePay sesuai dukungan Midtrans.", group: "Midtrans" },
  { id: "MIDTRANS_CARD", label: "Kartu Kredit/Debit", description: "Pembayaran kartu melalui Midtrans pada Sprint 5.", group: "Midtrans" },
  { id: "COD", label: "COD", description: "Bayar di tempat, maksimal Rp1.500.000 dan wilayah didukung.", group: "COD" },
];

export function CheckoutPageClient() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<CheckoutStep>("Alamat");
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [addresses, setAddresses] = useState<AccountAddressResponse[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [shippingRates, setShippingRates] = useState<ShippingRatesResponse | null>(null);
  const [selectedShippingId, setSelectedShippingId] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherValidationResponse | null>(null);
  const [voucherMessage, setVoucherMessage] = useState("Coba SUMMIT50 atau FREEONGKIR.");
  const [selectedPaymentId, setSelectedPaymentId] = useState<CheckoutPaymentMethod>("MIDTRANS_VA");
  const [loading, setLoading] = useState(true);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<CheckoutOrderResponse | null>(null);

  const loadCheckout = useCallback(async () => {
    try {
      const [cartData, addressData] = await Promise.all([apiRequest<CartResponse>("/api/cart"), apiRequest<AccountAddressResponse[]>("/api/account/addresses")]);
      setCart(cartData);
      setAddresses(addressData);
      setSelectedAddressId((current) => current || addressData.find((address) => address.isPrimary)?.id || addressData[0]?.id || "");
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        router.push("/masuk?callbackUrl=/checkout");
        return;
      }

      toast.error(error instanceof Error ? error.message : "Checkout gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCheckout();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadCheckout]);

  useEffect(() => {
    if (!selectedAddressId || !cart || cart.items.length === 0 || createdOrder) return;

    let cancelled = false;

    async function loadShippingRates() {
      setShippingLoading(true);
      setShippingRates(null);
      setSelectedShippingId("");
      setSelectedVoucher(null);
      setVoucherMessage("Pakai ulang voucher setelah ongkir terbaru muncul.");

      try {
        const data = await apiRequest<ShippingRatesResponse>("/api/checkout/shipping-rates", {
          method: "POST",
          body: JSON.stringify({ addressId: selectedAddressId }),
        });

        if (cancelled) return;
        setShippingRates(data);
        setSelectedShippingId(data.services[0]?.id ?? "");
        setVoucherMessage("Coba SUMMIT50 atau FREEONGKIR.");
      } catch (error) {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "Gagal menghitung ongkir.");
        }
      } finally {
        if (!cancelled) setShippingLoading(false);
      }
    }

    void loadShippingRates();

    return () => {
      cancelled = true;
    };
  }, [cart, createdOrder, selectedAddressId]);

  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? null;
  const selectedShipping = useMemo(() => shippingRates?.services.find((service) => service.id === selectedShippingId) ?? null, [selectedShippingId, shippingRates?.services]);
  const subtotal = cart?.summary.subtotal ?? 0;
  const discount = selectedVoucher?.discount ?? 0;
  const total = subtotal + (selectedShipping?.price ?? 0) - discount;
  const codSupported = Boolean(shippingRates?.address.codSupported);
  const codBlocked = !codSupported || total > 1_500_000;
  const effectivePaymentId = selectedPaymentId === "COD" && codBlocked ? "MIDTRANS_VA" : selectedPaymentId;
  const selectedPayment = paymentMethods.find((method) => method.id === effectivePaymentId) ?? paymentMethods[0];

  async function applyVoucher(code: string) {
    if (!cart || !selectedShipping) {
      setVoucherMessage("Pilih kurir terlebih dahulu sebelum memakai voucher.");
      return;
    }

    setVoucherLoading(true);

    try {
      const data = await apiRequest<VoucherValidationResponse>("/api/checkout/voucher", {
        method: "POST",
        body: JSON.stringify({
          code,
          subtotal: cart.summary.subtotal,
          shippingCost: selectedShipping.price,
        }),
      });

      setSelectedVoucher(data);
      setVoucherMessage(`${data.code} diterapkan.`);
      toast.success("Voucher diterapkan.");
    } catch (error) {
      setSelectedVoucher(null);
      setVoucherMessage(error instanceof Error ? error.message : "Voucher gagal diterapkan.");
    } finally {
      setVoucherLoading(false);
    }
  }

  async function createOrder() {
    if (!selectedAddress || !selectedShipping || !cart || cart.items.length === 0) return;

    setCreatingOrder(true);

    try {
      const data = await apiRequest<CheckoutOrderResponse>("/api/checkout/order", {
        method: "POST",
        body: JSON.stringify({
          addressId: selectedAddress.id,
          shippingServiceId: selectedShipping.id,
          voucherCode: selectedVoucher?.code,
          paymentMethod: effectivePaymentId,
        }),
      });

      setCreatedOrder(data);
      toast.success("Order checkout berhasil dibuat.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Order gagal dibuat.");
    } finally {
      setCreatingOrder(false);
    }
  }

  if (loading) {
    return (
      <div className="container-page py-8">
        <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          <Loader2 className="mr-2 inline size-4 animate-spin" />
          Memuat cart dan alamat checkout...
        </div>
      </div>
    );
  }

  if (createdOrder) {
    return (
      <div className="container-page py-8">
        <section className="overflow-hidden rounded-[2rem_1rem_2rem_1rem] border bg-card shadow-sm">
          <div className="bg-primary p-5 text-primary-foreground sm:p-7">
            <Badge variant="accent">Order Dibuat</Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">Checkout berhasil</h1>
            <p className="mt-3 max-w-2xl text-sm text-primary-foreground/80 sm:text-base">
              Order non-payment Sprint 4 sudah dibuat. Status pembayaran real dan instruksi Midtrans tetap masuk Sprint 5.
            </p>
          </div>
          <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="grid gap-4">
              {[
                { label: "Nomor order", value: createdOrder.orderNumber },
                { label: "Status", value: createdOrder.status },
                { label: "Metode pembayaran", value: createdOrder.paymentMethod },
                { label: "Batas pembayaran", value: createdOrder.expiresAt ? new Date(createdOrder.expiresAt).toLocaleString("id-ID") : "COD tanpa expiry VA" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border bg-background p-4">
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                  <div className="mt-1 font-semibold">{item.value}</div>
                </div>
              ))}
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ringkasan pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatRupiah(createdOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Ongkir</span>
                  <span className="font-medium">{formatRupiah(createdOrder.shippingCost)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Diskon</span>
                  <span className="font-medium">{createdOrder.discount ? `-${formatRupiah(createdOrder.discount)}` : "-"}</span>
                </div>
                <div className="rounded-md bg-secondary p-4">
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="mt-1 text-2xl font-semibold">{formatRupiah(createdOrder.total)}</div>
                </div>
                <Button asChild>
                  <Link href="/produk">Belanja lagi</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-page py-8">
        <Card>
          <CardContent className="grid gap-4 p-6 text-center">
            <ShoppingBag className="mx-auto size-10 text-primary" />
            <h1 className="text-2xl font-semibold tracking-normal">Keranjang kosong</h1>
            <p className="text-sm text-muted-foreground">Tambahkan produk terlebih dahulu sebelum checkout.</p>
            <Button asChild className="mx-auto">
              <Link href="/produk">Lihat produk</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="container-page py-8">
        <Card>
          <CardContent className="grid gap-4 p-6 text-center">
            <MapPin className="mx-auto size-10 text-primary" />
            <h1 className="text-2xl font-semibold tracking-normal">Alamat belum tersedia</h1>
            <p className="text-sm text-muted-foreground">Tambahkan alamat utama agar backend bisa menghitung ongkir dan membuat snapshot shipment.</p>
            <Button asChild className="mx-auto">
              <Link href="/akun/alamat">Tambah alamat</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <section className="summit-dark relative mb-6 overflow-hidden rounded-xl border border-white/10 p-5 sm:p-6">
        <DesignParticles />
        <Badge variant="accent">Sprint 4 Checkout</Badge>
        <div className="relative mt-3 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="text-3xl font-medium tracking-[-0.03em] sm:text-5xl">Checkout Pendakian</h1>
            <p className="mt-3 max-w-2xl text-sm text-primary-foreground/80 sm:text-base">
              Alamat, kurir, voucher, metode pembayaran, dan order creation sudah memakai backend Sprint 4.
            </p>
          </div>
          <div className="w-fit rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm">
            <Clock className="mr-2 inline size-4 text-accent" />
            Payment real masuk Sprint 5
          </div>
        </div>
      </section>

      <CheckoutSteps activeStep={activeStep} onStepChange={setActiveStep} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-5">
          <Card className={activeStep === "Alamat" ? "border-primary shadow-sm" : "bg-card/92"}>
            <CardHeader>
              <CardTitle className="text-lg">1. Pilih alamat</CardTitle>
            </CardHeader>
            <CardContent>
              <AddressSelector addresses={addresses} selectedAddressId={selectedAddressId} shippingAddress={shippingRates?.address} onSelect={setSelectedAddressId} />
            </CardContent>
          </Card>

          <Card className={activeStep === "Kurir" ? "border-primary shadow-sm" : "bg-card/92"}>
            <CardHeader>
              <CardTitle className="text-lg">2. Pilih kurir</CardTitle>
            </CardHeader>
            <CardContent>
              <ShippingSelector services={shippingRates?.services ?? []} selectedServiceId={selectedShippingId} loading={shippingLoading} onSelect={setSelectedShippingId} />
            </CardContent>
          </Card>

          <Card className={activeStep === "Voucher" ? "border-primary shadow-sm" : "bg-card/92"}>
            <CardHeader>
              <CardTitle className="text-lg">3. Voucher</CardTitle>
            </CardHeader>
            <CardContent>
              <VoucherBox selectedVoucher={selectedVoucher} message={voucherMessage} loading={voucherLoading} onApply={applyVoucher} onClear={() => setSelectedVoucher(null)} />
            </CardContent>
          </Card>

          <Card className={activeStep === "Pembayaran" ? "border-primary shadow-sm" : "bg-card/92"}>
            <CardHeader>
              <CardTitle className="text-lg">4. Metode pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentSelector methods={paymentMethods} selectedMethodId={effectivePaymentId} onSelect={setSelectedPaymentId} total={total} codSupported={codSupported} />
            </CardContent>
          </Card>

          <Card className={activeStep === "Ringkasan" ? "border-primary shadow-sm" : "bg-card/92"}>
            <CardHeader>
              <CardTitle className="text-lg">5. Review final</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="rounded-md bg-secondary p-3">
                Dikirim ke <span className="font-medium">{selectedAddress?.recipient}</span> di {selectedAddress?.city} via {selectedShipping ? `${selectedShipping.courier} ${selectedShipping.service}` : "kurir belum dipilih"}.
              </div>
              <div className="rounded-md bg-secondary p-3">
                Pembayaran dipilih: <span className="font-medium">{selectedPayment.label}</span>. Total: <span className="font-medium">{formatRupiah(total)}</span>.
              </div>
              {selectedPayment.id === "COD" ? (
                <div className="flex gap-3 rounded-md border border-accent bg-accent/15 p-3">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>COD mengikuti limit transaksi, dukungan wilayah, dan validasi final backend.</span>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <OrderSummary
            cart={cart}
            shippingCost={selectedShipping?.price ?? 0}
            discount={discount}
            action={
              <div className="grid gap-3">
                <Button type="button" onClick={createOrder} disabled={!selectedAddress || !selectedShipping || creatingOrder || shippingLoading}>
                  {creatingOrder ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                  Buat order
                </Button>
                <p className="text-xs text-muted-foreground">Order dibuat di backend; pembayaran real dan webhook tetap Sprint 5.</p>
              </div>
            }
          />
          <div className="mt-4 grid gap-3 rounded-xl bg-[var(--green-house)] p-4 text-sm text-white">
            {[
              { icon: PackageCheck, text: "Reserved stock dibuat saat order berhasil." },
              { icon: ShieldCheck, text: `Voucher discount aktif: ${discount ? formatRupiah(discount) : "belum ada"}.` },
              { icon: CheckCircle2, text: shippingRates ? `${shippingRates.chargeableKg} kg chargeable weight.` : "Ongkir menunggu alamat." },
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
