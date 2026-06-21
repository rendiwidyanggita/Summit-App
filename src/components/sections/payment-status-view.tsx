"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, CreditCard, ExternalLink, Loader2, PackageCheck, ReceiptText, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { DesignParticles } from "@/components/sections/design-particles";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/sections/order-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ApiRequestError, apiRequest } from "@/lib/api-client";
import type { CustomerOrderResponse } from "@/lib/commerce-types";
import { formatRupiah } from "@/lib/utils";

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function PaymentStatusView({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<CustomerOrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  const loadOrder = useCallback(async () => {
    try {
      setOrder(await apiRequest<CustomerOrderResponse>(`/api/orders/${orderId}`));
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        router.push(`/masuk?callbackUrl=/pembayaran/${orderId}`);
        return;
      }
      toast.error(error instanceof Error ? error.message : "Status pembayaran gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadOrder();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadOrder]);

  async function simulatePayment() {
    if (!order) return;
    setSimulating(true);

    try {
      await apiRequest(`/api/payments/midtrans/demo/${order.orderNumber}`, { method: "POST" });
      toast.success("Pembayaran berhasil dikonfirmasi.");
      await loadOrder();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Verifikasi pembayaran gagal.");
    } finally {
      setSimulating(false);
    }
  }

  if (loading) {
    return <div className="container-page grid min-h-72 place-items-center py-8"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }

  if (!order) {
    return <div className="container-page py-8"><Card><CardContent className="p-6 text-center text-sm text-muted-foreground">Transaksi pembayaran tidak ditemukan.</CardContent></Card></div>;
  }

  const isPending = order.payment?.status === "PENDING";

  return (
    <div className="container-page py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href={`/akun/pesanan/${order.orderNumber}`}><ArrowLeft /> Detail pesanan</Link>
      </Button>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="summit-dark relative overflow-hidden p-5 sm:p-7">
            <DesignParticles />
            <div className="relative">
              <Badge variant="accent">Status Pembayaran</Badge>
              <h1 className="mt-4 text-3xl font-medium tracking-[-0.03em] sm:text-5xl">{isPending ? "Selesaikan pembayaran" : "Status pembayaran tercatat"}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-foreground/80 sm:text-base">
                {order.payment?.isDemo
                  ? "Transaksi ini diproses dengan layanan pembayaran yang dijamin keamanannya."
                  : "Status pembayaran dikonfirmasi melalui sistem secara real-time."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <OrderStatusBadge status={order.status} className="bg-white/15 text-primary-foreground" />
                {order.payment ? <PaymentStatusBadge status={order.payment.status} className="bg-white/15 text-primary-foreground" /> : null}
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:p-7">
            {isPending ? (
              <div className="rounded-xl border bg-secondary p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium"><Clock className="size-4" /> Batas pembayaran</div>
                    <div className="mt-2 text-xl font-semibold">{formatDate(order.payment?.expiredAt ?? order.expiresAt)}</div>
                    <p className="mt-1 text-sm text-muted-foreground">Selesaikan pembayaran sebelum transaksi kedaluwarsa.</p>
                  </div>
                  <div className="rounded-xl bg-background p-4 text-center">
                    <div className="text-xs text-muted-foreground">Total bayar</div>
                    <div className="text-2xl font-semibold">{formatRupiah(order.total)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border bg-secondary p-5">
                <div className="flex items-center gap-3">
                  <PackageCheck className="size-6 text-primary" />
                  <div>
                    <div className="font-semibold">Pembayaran {order.payment?.status ?? "tidak tersedia"}</div>
                    <div className="text-sm text-muted-foreground">{order.payment?.paidAt ? `Tercatat ${formatDate(order.payment.paidAt)}` : "Status akan otomatis diperbarui."}</div>
                  </div>
                </div>
              </div>
            )}

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><CreditCard className="size-5 text-primary" /> Transaksi Midtrans</CardTitle></CardHeader>
              <CardContent className="grid gap-4 text-sm">
                <div className="grid gap-3 rounded-lg bg-secondary p-4">
                  <div className="flex justify-between gap-3"><span className="text-muted-foreground">Metode</span><span className="font-medium">{order.paymentMethod}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-muted-foreground">Payment type</span><span className="font-medium">{order.payment?.paymentType ?? (order.payment?.isDemo ? "Sistem pembayaran otomatis" : "Menunggu konfirmasi")}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-muted-foreground">Order</span><span className="font-medium">{order.orderNumber}</span></div>
                </div>
                {isPending && order.payment?.isDemo ? (
                  <Button onClick={simulatePayment} disabled={simulating}>
                    {simulating ? <Loader2 className="animate-spin" /> : <CreditCard />}
                    Konfirmasi Pembayaran
                  </Button>
                ) : null}
                {isPending && order.payment?.redirectUrl && !order.payment.isDemo ? (
                  <Button asChild><a href={order.payment.redirectUrl}>Buka pembayaran Midtrans <ExternalLink /></a></Button>
                ) : null}
                <Button variant="outline" onClick={() => void loadOrder()}><Loader2 className={loading ? "animate-spin" : ""} /> Perbarui status</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><ReceiptText className="size-5 text-primary" /> Ringkasan</CardTitle></CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex justify-between gap-3"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{formatRupiah(order.subtotal)}</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted-foreground">Ongkir</span><span className="font-medium">{formatRupiah(order.shippingCost)}</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted-foreground">Diskon</span><span className="font-medium">{order.discount ? `-${formatRupiah(order.discount)}` : "-"}</span></div>
              <Separator />
              <div className="flex items-end justify-between gap-3"><span className="text-muted-foreground">Total</span><span className="text-2xl font-semibold">{formatRupiah(order.total)}</span></div>
              <div className="rounded-xl bg-[var(--green-house)] p-4 text-white">
                <div className="flex gap-3"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" /><p className="text-xs leading-5 text-primary-foreground/82">{order.payment?.isDemo ? "Pembayaran diverifikasi secara otomatis melalui gateway pembayaran aman." : "Pembayaran diverifikasi secara otomatis melalui gateway pembayaran aman."}</p></div>
              </div>
              <Button variant="outline" asChild><Link href="/akun/pesanan">Lihat semua pesanan</Link></Button>
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}
