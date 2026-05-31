"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ClipboardList, FileText, PackageCheck, Printer, Truck } from "lucide-react";

import { AdminDataToolbar, AdminMetricCard, AdminMockActionNotice, AdminStatusPill } from "@/components/sections/admin-commerce-ui";
import { AdminPageHeader } from "@/components/sections/admin-page-header";
import { OrderTimeline } from "@/components/sections/order-timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { adminOrders } from "@/lib/admin-commerce-mock";
import { formatRupiah } from "@/lib/utils";

const options = [
  { label: "Semua order", value: "ALL" },
  { label: "Perlu Dibayar", value: "Perlu Dibayar" },
  { label: "Perlu Diproses", value: "Perlu Diproses" },
  { label: "Packing", value: "Packing" },
  { label: "Dikirim", value: "Dikirim" },
  { label: "Selesai", value: "Selesai" },
];

export function AdminOrdersPageClient() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [selectedOrderId, setSelectedOrderId] = useState(adminOrders[0]?.id ?? "");
  const selectedOrder = adminOrders.find((order) => order.id === selectedOrderId) ?? adminOrders[0];

  const orders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return adminOrders.filter((order) => {
      const matchesSearch = keyword ? [order.orderNumber, order.address.recipient, order.shipping.courier].join(" ").toLowerCase().includes(keyword) : true;
      const matchesStatus = status === "ALL" ? true : order.fulfillmentStatus === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="grid gap-6">
      <AdminPageHeader title="Manajemen Pesanan" description="UI mock fulfillment: daftar order, SLA gudang, timeline, packing list, invoice, dan input resi placeholder." />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard title="Order mock" value={String(adminOrders.length)} note="Dari Sprint 5 payment/order" icon={ClipboardList} />
        <AdminMetricCard title="Butuh aksi" value={String(adminOrders.filter((order) => order.fulfillmentStatus !== "Selesai").length)} note="Payment, packing, atau pengiriman" icon={PackageCheck} />
        <AdminMetricCard title="Resi tersedia" value={String(adminOrders.filter((order) => order.trackingNumber).length)} note="Tracking preview customer" icon={Truck} />
      </div>

      <AdminDataToolbar search={search} onSearchChange={setSearch} filter={status} onFilterChange={setStatus} options={options} placeholder="Cari order, customer, atau kurir..." />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-3">
          {orders.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() => setSelectedOrderId(order.id)}
              aria-pressed={selectedOrder?.id === order.id}
              aria-label={`Lihat fulfillment order ${order.orderNumber}`}
              className={`rounded-lg border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary ${selectedOrder?.id === order.id ? "border-primary" : ""}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{order.orderNumber}</h2>
                    <AdminStatusPill status={order.fulfillmentStatus} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{order.address.recipient} - {order.address.city}</p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="font-semibold">{formatRupiah(order.total)}</div>
                  <div className="text-xs text-muted-foreground">{order.sla}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-secondary px-3 py-1">{order.shipping.courier} {order.shipping.service}</span>
                <span className="rounded-full bg-secondary px-3 py-1">{order.paymentMethod.label}</span>
                <span className="rounded-full bg-secondary px-3 py-1">{order.warehouseNote}</span>
              </div>
            </button>
          ))}
        </div>

        {selectedOrder ? (
          <Card className="xl:sticky xl:top-20 xl:self-start">
            <CardHeader>
              <CardTitle className="text-base">Detail fulfillment</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <div className="font-semibold">{selectedOrder.orderNumber}</div>
                <div className="mt-1 text-sm text-muted-foreground">{selectedOrder.items.length} item - {formatRupiah(selectedOrder.total)}</div>
              </div>
              <div className="rounded-lg bg-secondary p-3 text-sm">
                <div className="font-medium">{selectedOrder.address.recipient}</div>
                <p className="mt-1 text-muted-foreground">{selectedOrder.address.fullAddress}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" disabled>
                  <Printer /> Invoice
                </Button>
                <Button variant="outline" disabled>
                  <FileText /> Packing
                </Button>
              </div>
              <Button disabled>Input resi mock</Button>
              <Separator />
              <OrderTimeline items={selectedOrder.timeline} />
              <Button variant="outline" asChild>
                <Link href={`/akun/pesanan/${selectedOrder.id}`}>Lihat sisi customer</Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <AdminMockActionNotice />
    </div>
  );
}
