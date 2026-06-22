"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CreditCard, Loader2, PackageCheck, Search, Truck } from "lucide-react";
import { toast } from "sonner";

import { DesignParticles } from "@/components/sections/design-particles";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/sections/order-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ApiRequestError, apiRequest } from "@/lib/api-client";
import type { CustomerOrderResponse, CustomerOrderStatus } from "@/lib/commerce-types";
import { formatRupiah } from "@/lib/utils";

const filters: Array<{ label: string; value: "ALL" | CustomerOrderStatus }> = [
  { label: "Semua", value: "ALL" },
  { label: "Menunggu Bayar", value: "PENDING_PAYMENT" },
  { label: "Sudah Dibayar", value: "PAID" },
  { label: "Diproses", value: "PROCESSING" },
  { label: "Dikirim", value: "SHIPPED" },
  { label: "Terkirim", value: "DELIVERED" },
  { label: "Selesai", value: "COMPLETED" },
  { label: "Dibatalkan", value: "CANCELLED" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function OrdersPageClient() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<"ALL" | CustomerOrderStatus>("ALL");
  const [orders, setOrders] = useState<CustomerOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      setLoading(true);

      try {
        const data = await apiRequest<CustomerOrderResponse[]>(`/api/orders?status=${activeFilter}`);
        if (!cancelled) setOrders(data);
      } catch (error) {
        if (error instanceof ApiRequestError && error.status === 401) {
          router.push("/masuk?callbackUrl=/akun/pesanan");
          return;
        }

        if (!cancelled) toast.error(error instanceof Error ? error.message : "Pesanan gagal dimuat.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadOrders();
    return () => {
      cancelled = true;
    };
  }, [activeFilter, router]);

  return (
    <div className="container-page py-8">
      <section className="summit-dark relative overflow-hidden rounded-xl">
        <DesignParticles />
        <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div>
            <Badge variant="accent">Customer Order</Badge>
            <h1 className="mt-4 text-3xl font-medium tracking-[-0.03em] sm:text-5xl">Pesanan Saya</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-foreground/80 sm:text-base">
              Status pembayaran, shipment, dan total pesanan diperbarui secara seketika.
            </p>
          </div>
          <div className="rounded-2xl border border-white/18 bg-white/12 p-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-white text-primary">
                <PackageCheck className="size-5" />
              </div>
              <div>
                <div className="text-sm text-primary-foreground/72">Hasil filter</div>
                <div className="text-2xl font-semibold">{orders.length} pesanan</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActiveFilter(filter.value)}
            aria-pressed={activeFilter === filter.value}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === filter.value ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:border-primary"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4">
        {loading ? (
          <div className="grid place-items-center rounded-lg border bg-card p-10 text-center">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">Memuat riwayat pesanan Anda...</p>
          </div>
        ) : orders.length ? (
          orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col gap-4 border-b bg-secondary/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{order.orderNumber}</h2>
                      <OrderStatusBadge status={order.status} />
                      {order.payment ? <PaymentStatusBadge status={order.payment.status} /> : null}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">Dibuat {formatDate(order.createdAt)}</div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-muted-foreground">Total pembayaran</div>
                    <div className="text-lg font-semibold">{formatRupiah(order.total)}</div>
                  </div>
                </div>

                <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                  <div className="flex gap-3">
                    <div className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-secondary">
                      {order.items[0]?.product.photo ? (
                        <Image src={order.items[0].product.photo} alt={order.items[0].product.name} fill className="object-cover" sizes="80px" />
                      ) : (
                        <PackageCheck className="size-7 text-primary" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium line-clamp-1">{order.items[0]?.product.name ?? "Pesanan Summit Gear"}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} item dalam pesanan
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {order.shipment ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
                            <Truck className="size-3.5" /> {order.shipment.courier} {order.shipment.service}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
                          <CreditCard className="size-3.5" /> {order.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {order.status === "PENDING_PAYMENT" && order.payment?.redirectUrl ? (
                      <Button asChild>
                        <Link href={`/pembayaran/${order.orderNumber}`}>Lanjut bayar</Link>
                      </Button>
                    ) : null}
                    <Button variant="outline" asChild>
                      <Link href={`/akun/pesanan/${order.orderNumber}`}>
                        Detail <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="grid place-items-center rounded-lg border bg-card p-10 text-center">
            <Search className="size-8 text-muted-foreground" />
            <h2 className="mt-3 font-semibold">Tidak ada pesanan di status ini</h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">Pesanan baru akan muncul setelah checkout berhasil dibuat.</p>
          </div>
        )}
      </div>
    </div>
  );
}
