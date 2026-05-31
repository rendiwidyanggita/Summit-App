"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CreditCard, PackageCheck, Search, Truck } from "lucide-react";

import { OrderStatusBadge, PaymentStatusBadge } from "@/components/sections/order-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getOrders, type OrderStatusMock } from "@/lib/order-mock";
import { formatRupiah } from "@/lib/utils";

const filters: Array<{ label: string; value: "ALL" | OrderStatusMock }> = [
  { label: "Semua", value: "ALL" },
  { label: "Menunggu Bayar", value: "PENDING_PAYMENT" },
  { label: "Diproses", value: "PROCESSING" },
  { label: "Dikirim", value: "SHIPPED" },
  { label: "Selesai", value: "COMPLETED" },
];

export function OrdersPageClient() {
  const [activeFilter, setActiveFilter] = useState<"ALL" | OrderStatusMock>("ALL");
  const orders = getOrders();

  const filteredOrders = useMemo(() => {
    if (activeFilter === "ALL") {
      return orders;
    }

    return orders.filter((order) => order.status === activeFilter);
  }, [activeFilter, orders]);

  return (
    <div className="container-page py-8">
      <section className="overflow-hidden rounded-[1.5rem] bg-primary text-primary-foreground">
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div>
            <Badge variant="accent">Sprint 5 Order</Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">Pesanan Saya</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-foreground/80 sm:text-base">
              Pantau payment status, fulfillment, resi, dan timeline order dari data mock frontend. Status final payment tetap disiapkan untuk sinkronisasi server.
            </p>
          </div>
          <div className="rounded-2xl border border-white/18 bg-white/12 p-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-accent text-accent-foreground">
                <PackageCheck className="size-5" />
              </div>
              <div>
                <div className="text-sm text-primary-foreground/72">Order aktif</div>
                <div className="text-2xl font-semibold">{orders.length} pesanan</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-white/10 p-3">Payment countdown</div>
              <div className="rounded-lg bg-white/10 p-3">Timeline fulfillment</div>
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
        {filteredOrders.length ? (
          filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col gap-4 border-b bg-secondary/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{order.orderNumber}</h2>
                      <OrderStatusBadge status={order.status} />
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">Dibuat {order.createdAt}</div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-muted-foreground">Total pembayaran</div>
                    <div className="text-lg font-semibold">{formatRupiah(order.total)}</div>
                  </div>
                </div>

                <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                  <div className="flex gap-3">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      <Image src={order.items[0].product.images[0]} alt={order.items[0].product.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium line-clamp-1">{order.items[0].product.name}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {order.items[0].quantity} barang pertama, total {order.items.reduce((sum, item) => sum + item.quantity, 0)} item
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
                          <Truck className="size-3.5" /> {order.shipping.courier} {order.shipping.service}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
                          <CreditCard className="size-3.5" /> {order.paymentMethod.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {order.paymentStatus === "PENDING" ? (
                      <Button asChild>
                        <Link href={`/pembayaran/${order.id}`}>Lanjut bayar</Link>
                      </Button>
                    ) : null}
                    <Button variant="outline" asChild>
                      <Link href={`/akun/pesanan/${order.id}`}>
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
            <p className="mt-1 max-w-md text-sm text-muted-foreground">Coba pilih tab status lain untuk melihat contoh order mock Sprint 5.</p>
          </div>
        )}
      </div>
    </div>
  );
}
