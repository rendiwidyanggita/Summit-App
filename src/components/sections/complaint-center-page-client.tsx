"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageSquareWarning, Search, ShieldQuestion } from "lucide-react";

import { SupportFormMock } from "@/components/sections/support-form-mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { complaints } from "@/lib/support-trust-data";

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    OPEN: "Open",
    IN_REVIEW: "Dalam Review",
    RESOLVED: "Selesai",
  };

  return labels[status] ?? status;
}

export function ComplaintCenterPageClient() {
  const [search, setSearch] = useState("");
  const items = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return complaints.filter((complaint) => (keyword ? [complaint.title, complaint.orderNumber, complaint.channel].join(" ").toLowerCase().includes(keyword) : true));
  }, [search]);

  return (
    <div className="grid gap-5">
      <div className="rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <ShieldQuestion className="size-5 text-primary" />
              Pusat Komplain Mock
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Keluhan order, produk, dan pengiriman disiapkan untuk admin CS Sprint 7.</p>
          </div>
          <div className="relative md:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari komplain..." className="pl-9" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-3">
          {items.map((complaint) => (
            <Card key={complaint.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{complaint.title}</h2>
                      <Badge variant={complaint.status === "RESOLVED" ? "secondary" : "outline"}>{statusLabel(complaint.status)}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{complaint.id} - {complaint.channel} - {complaint.createdAt}</p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/akun/pesanan/${complaint.orderId}`}>Order</Link>
                  </Button>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{complaint.summary}</p>
                <div className="mt-3 inline-flex rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">{complaint.responseSla}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="xl:sticky xl:top-20 xl:self-start">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquareWarning className="size-4 text-primary" />
              Buat komplain mock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SupportFormMock mode="complaint" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
