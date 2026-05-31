"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw, ShieldCheck, Truck } from "lucide-react";

import { OrderTimeline } from "@/components/sections/order-timeline";
import { SupportFormMock } from "@/components/sections/support-form-mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { returnRequests } from "@/lib/support-trust-data";

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    REQUESTED: "Diajukan",
    REVIEWING: "Review Admin",
    APPROVED: "Disetujui",
    REJECTED: "Ditolak",
  };

  return labels[status] ?? status;
}

export function ReturnCenterPageClient() {
  const [selectedId, setSelectedId] = useState(returnRequests[0]?.id ?? "");
  const selected = returnRequests.find((request) => request.id === selectedId) ?? returnRequests[0];

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: RotateCcw, title: "7 hari", body: "Batas return setelah barang diterima." },
          { icon: ShieldCheck, title: "Bukti foto", body: "Kondisi barang dan kemasan wajib jelas." },
          { icon: Truck, title: "Ongkir return", body: "Ditentukan dari alasan dan hasil review admin." },
        ].map((item) => (
          <div key={item.title} className="rounded-lg border bg-card p-4">
            <item.icon className="size-5 text-primary" />
            <div className="mt-3 font-semibold">{item.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-3">
          {returnRequests.map((request) => (
            <button
              key={request.id}
              type="button"
              onClick={() => setSelectedId(request.id)}
              aria-pressed={selected?.id === request.id}
              aria-label={`Lihat return ${request.id}`}
              className={`rounded-lg border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary ${selected?.id === request.id ? "border-primary" : ""}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{request.id}</h2>
                    <Badge variant="secondary">{statusLabel(request.status)}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{request.productName} - {request.reason}</p>
                </div>
                <div className="text-sm text-muted-foreground">{request.createdAt}</div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{request.ruleNote}</p>
            </button>
          ))}
        </div>

        <div className="grid gap-4 xl:sticky xl:top-20 xl:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ajukan return baru</CardTitle>
            </CardHeader>
            <CardContent>
              <SupportFormMock mode="return" />
            </CardContent>
          </Card>
          {selected ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Timeline {selected.id}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <OrderTimeline items={selected.timeline} />
                <Button variant="outline" asChild>
                  <Link href={`/akun/pesanan/${selected.orderId}`}>
                    Detail order <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
