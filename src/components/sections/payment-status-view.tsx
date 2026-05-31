import Link from "next/link";
import { ArrowLeft, Clock, CreditCard, PackageCheck, QrCode, ReceiptText, ShieldCheck } from "lucide-react";

import { OrderStatusBadge, PaymentStatusBadge } from "@/components/sections/order-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type OrderMock } from "@/lib/order-mock";
import { formatRupiah } from "@/lib/utils";

export function PaymentStatusView({ order }: { order: OrderMock }) {
  const isPending = order.paymentStatus === "PENDING";

  return (
    <div className="container-page py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href={`/akun/pesanan/${order.id}`}>
          <ArrowLeft /> Detail pesanan
        </Link>
      </Button>

      <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="overflow-hidden rounded-[1.5rem] border bg-card">
          <div className="bg-[linear-gradient(135deg,var(--primary),color-mix(in_oklab,var(--primary)_74%,black))] p-5 text-primary-foreground sm:p-7">
            <Badge variant="accent">Status Pembayaran</Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
              {isPending ? "Selesaikan pembayaran" : "Pembayaran tercatat"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-foreground/80 sm:text-base">
              Halaman ini menampilkan feedback payment Sprint 5. Status final tetap mengikuti validasi server dan webhook Midtrans sesuai PRD.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <OrderStatusBadge status={order.status} className="bg-white/15 text-primary-foreground" />
              <PaymentStatusBadge status={order.paymentStatus} className="bg-white/15 text-primary-foreground" />
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:p-7">
            {isPending ? (
              <div className="rounded-2xl border border-accent bg-accent/10 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-accent-foreground">
                      <Clock className="size-4" /> Batas pembayaran
                    </div>
                    <div className="mt-2 text-3xl font-semibold">23:42:18</div>
                    <p className="mt-1 text-sm text-muted-foreground">VA mock aktif sampai {order.expiresAt}. Countdown real akan mengikuti transaksi payment gateway.</p>
                  </div>
                  <div className="rounded-xl bg-background p-4 text-center">
                    <div className="text-xs text-muted-foreground">Total bayar</div>
                    <div className="text-2xl font-semibold">{formatRupiah(order.total)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border bg-secondary p-5">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-full bg-emerald-500/15 text-emerald-700">
                    <PackageCheck className="size-5" />
                  </div>
                  <div>
                    <div className="font-semibold">Pembayaran {order.paidAt ? `pada ${order.paidAt}` : "tercatat"}</div>
                    <div className="text-sm text-muted-foreground">Order bisa dilanjutkan ke proses fulfillment.</div>
                  </div>
                </div>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {order.paymentMethod.id === "qris" ? <QrCode className="size-5 text-primary" /> : <CreditCard className="size-5 text-primary" />}
                  Instruksi mock
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 text-sm">
                <div className="grid gap-3 rounded-lg bg-secondary p-4">
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Metode</span>
                    <span className="font-medium">{order.paymentMethod.label}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Nomor VA / referensi</span>
                    <span className="font-medium">8808 0526 0001</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Order</span>
                    <span className="font-medium">{order.orderNumber}</span>
                  </div>
                </div>
                <div className="grid gap-2">
                  {["Buka mobile banking, e-wallet, atau kanal pembayaran pilihan.", "Masukkan nomor referensi dan pastikan nominal sama dengan total.", "Setelah dibayar, status final akan disinkronkan dari backend payment webhook."].map((item, index) => (
                    <div key={item} className="flex gap-3 rounded-lg border p-3">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{index + 1}</span>
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <Button disabled>{isPending ? "Bayar via Midtrans Mock" : "Pembayaran selesai"}</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ReceiptText className="size-5 text-primary" /> Ringkasan
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatRupiah(order.subtotal)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Ongkir</span>
                <span className="font-medium">{formatRupiah(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Diskon</span>
                <span className="font-medium">{order.discount ? `-${formatRupiah(order.discount)}` : "-"}</span>
              </div>
              <Separator />
              <div className="flex items-end justify-between gap-3">
                <span className="text-muted-foreground">Total</span>
                <span className="text-2xl font-semibold">{formatRupiah(order.total)}</span>
              </div>
              <div className="rounded-lg bg-primary p-4 text-primary-foreground">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />
                  <p className="text-xs leading-5 text-primary-foreground/82">UI ini sengaja tidak mengubah status order dari browser customer. Sumber final pembayaran tetap server.</p>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href="/akun/pesanan">Lihat semua pesanan</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}
