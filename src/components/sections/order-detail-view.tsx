"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Loader2, MapPin, PackageCheck, ReceiptText, RotateCcw, Truck } from "lucide-react";
import { toast } from "sonner";

import { DesignParticles } from "@/components/sections/design-particles";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/sections/order-status-badge";
import { OrderTimeline, type OrderTimelineItem } from "@/components/sections/order-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ReviewForm } from "@/components/sections/review-form";
import { ApiRequestError, apiRequest } from "@/lib/api-client";
import type { CustomerOrderResponse, CustomerOrderStatus } from "@/lib/commerce-types";
import { formatRupiah } from "@/lib/utils";

const progressStatuses: CustomerOrderStatus[] = ["PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"];

function formatDate(value: string | null | undefined) {
  if (!value) return "Menunggu";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function buildTimeline(order: CustomerOrderResponse): OrderTimelineItem[] {
  if (order.status === "CANCELLED" || order.status === "EXPIRED") {
    return [
      { label: "Order dibuat", description: "Order dan reserved stock berhasil dibuat.", date: formatDate(order.createdAt), complete: true },
      {
        label: order.status === "EXPIRED" ? "Pembayaran kedaluwarsa" : "Order dibatalkan",
        description: "Stok barang telah disesuaikan secara otomatis.",
        date: formatDate(order.updatedAt),
        complete: true,
        current: true,
      },
    ];
  }

  const currentIndex = progressStatuses.indexOf(order.status);
  const stages = [
    { status: "PENDING_PAYMENT", label: "Order dibuat", description: "Order dan reserved stock berhasil dibuat.", date: order.createdAt },
    { status: "PAID", label: order.paymentMethod === "COD" ? "COD dikonfirmasi" : "Pembayaran berhasil", description: "Status pembayaran berhasil dikonfirmasi.", date: order.payment?.paidAt },
    { status: "PROCESSING", label: "Diproses", description: "Pesanan masuk antrean fulfillment.", date: order.updatedAt },
    { status: "SHIPPED", label: "Dikirim", description: "Pesanan sudah diserahkan ke kurir.", date: order.shipment?.shippedAt },
    { status: "DELIVERED", label: "Terkirim", description: "Kurir menandai paket sudah diterima.", date: order.shipment?.deliveredAt },
    { status: "COMPLETED", label: "Selesai", description: "Customer mengonfirmasi pesanan selesai.", date: order.updatedAt },
  ] as const;

  return stages.map((stage, index) => ({
    label: stage.label,
    description: stage.description,
    date: formatDate(stage.date),
    complete: index <= currentIndex,
    current: index === currentIndex,
  }));
}

export function OrderDetailView({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<CustomerOrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<"cancel" | "received" | null>(null);

  const loadOrder = useCallback(async () => {
    try {
      setOrder(await apiRequest<CustomerOrderResponse>(`/api/orders/${orderId}`));
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        router.push(`/masuk?callbackUrl=/akun/pesanan/${orderId}`);
        return;
      }
      toast.error(error instanceof Error ? error.message : "Detail pesanan gagal dimuat.");
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

  async function mutateOrder(kind: "cancel" | "received") {
    if (!order) return;
    setAction(kind);

    try {
      const updated = await apiRequest<CustomerOrderResponse>(`/api/orders/${order.orderNumber}/${kind}`, { method: "POST" });
      setOrder(updated);
      toast.success(kind === "cancel" ? "Pesanan berhasil dibatalkan." : "Pesanan berhasil dikonfirmasi selesai.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Aksi pesanan gagal diproses.");
    } finally {
      setAction(null);
    }
  }

  if (loading) {
    return (
      <div className="container-page grid min-h-72 place-items-center py-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-page py-8">
        <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">Pesanan tidak ditemukan atau tidak dapat diakses.</CardContent></Card>
      </div>
    );
  }

  const address = order.addressSnapshot ?? {};

  return (
    <div className="container-page py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/akun/pesanan"><ArrowLeft /> Kembali ke pesanan</Link>
      </Button>

      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="summit-dark relative overflow-hidden p-5 sm:p-7">
          <DesignParticles />
          <div className="relative">
            <Badge variant="accent">Detail Order</Badge>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-medium tracking-[-0.03em] sm:text-5xl">{order.orderNumber}</h1>
                <p className="mt-2 text-sm text-primary-foreground/78">Dibuat {formatDate(order.createdAt)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <OrderStatusBadge status={order.status} className="bg-white/15 text-primary-foreground" />
                {order.payment ? <PaymentStatusBadge status={order.payment.status} className="bg-white/15 text-primary-foreground" /> : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-5">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><PackageCheck className="size-5 text-primary" /> Item pesanan</CardTitle></CardHeader>
            <CardContent className="grid gap-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-lg border p-3">
                  <div className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-md bg-secondary">
                    {item.product.photo ? <Image src={item.product.photo} alt={item.product.name} fill className="object-cover" sizes="80px" /> : <PackageCheck className="size-6 text-primary" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/produk/${item.product.slug}`} className="font-medium hover:text-primary">{item.product.name}</Link>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {[item.variant?.size, item.variant?.color].filter(Boolean).join(" / ") || item.variant?.sku || "Varian"} - {item.quantity} x {formatRupiah(item.unitPrice)}
                    </p>
                  </div>
                  <div className="hidden text-right font-semibold sm:block">{formatRupiah(item.subtotal)}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><MapPin className="size-5 text-primary" /> Alamat dan pengiriman</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-secondary p-4">
                <div className="font-medium">{address.recipient ?? "Penerima"}</div>
                <div className="mt-1 text-sm text-muted-foreground">{address.phone}</div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {[address.fullAddress, address.district, address.city, address.province, address.postalCode].filter(Boolean).join(", ")}
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <div className="flex items-center gap-2 font-medium"><Truck className="size-4 text-primary" /> {order.shipment ? `${order.shipment.courier} ${order.shipment.service}` : "Shipment belum tersedia"}</div>
                <div className="mt-1 text-sm text-muted-foreground">Status: {order.shipment?.status ?? "PENDING"}</div>
                {order.shipment?.trackingNo ? <div className="mt-3 rounded-md bg-background px-3 py-2 text-sm font-medium">Resi {order.shipment.trackingNo}</div> : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><PackageCheck className="size-5 text-primary" /> Timeline order</CardTitle></CardHeader>
            <CardContent><OrderTimeline items={buildTimeline(order)} /></CardContent>
          </Card>
          <ReviewForm order={order} />
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><ReceiptText className="size-5 text-primary" /> Ringkasan biaya</CardTitle></CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex justify-between gap-3"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{formatRupiah(order.subtotal)}</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted-foreground">Ongkir</span><span className="font-medium">{formatRupiah(order.shippingCost)}</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted-foreground">Voucher</span><span className="font-medium">{order.discount ? `-${formatRupiah(order.discount)}` : "-"}</span></div>
              <Separator />
              <div className="flex items-end justify-between gap-3"><span className="text-muted-foreground">Total</span><span className="text-2xl font-semibold">{formatRupiah(order.total)}</span></div>
              <div className="rounded-lg bg-secondary p-3">
                <div className="flex items-center gap-2 font-medium"><CreditCard className="size-4 text-primary" /> {order.paymentMethod}</div>
                <div className="mt-1 text-xs text-muted-foreground">Status pembayaran terverifikasi secara aman dan otomatis.</div>
              </div>
              {order.status === "PENDING_PAYMENT" && order.payment?.redirectUrl ? (
                <Button asChild><Link href={`/pembayaran/${order.orderNumber}`}>Lanjut bayar</Link></Button>
              ) : null}
              {order.status === "PENDING_PAYMENT" ? (
                <Button variant="destructive" onClick={() => mutateOrder("cancel")} disabled={action !== null}>
                  {action === "cancel" ? <Loader2 className="animate-spin" /> : <RotateCcw />} Batalkan pesanan
                </Button>
              ) : null}
              {order.status === "DELIVERED" ? (
                <Button onClick={() => mutateOrder("received")} disabled={action !== null}>
                  {action === "received" ? <Loader2 className="animate-spin" /> : <PackageCheck />} Konfirmasi diterima
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
