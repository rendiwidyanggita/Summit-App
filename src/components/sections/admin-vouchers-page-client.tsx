"use client";

import { useMemo, useState } from "react";
import { BadgePercent, Percent, Ticket, TimerReset } from "lucide-react";

import { AdminDataToolbar, AdminMetricCard, AdminMockActionNotice, AdminStatusPill } from "@/components/sections/admin-commerce-ui";
import { AdminPageHeader } from "@/components/sections/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminVouchers } from "@/lib/admin-commerce-mock";
import { formatRupiah } from "@/lib/utils";

const options = [
  { label: "Semua voucher", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Draft", value: "DRAFT" },
  { label: "Expired", value: "EXPIRED" },
];

export function AdminVouchersPageClient() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const vouchers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return adminVouchers.filter((voucher) => {
      const matchesSearch = keyword ? [voucher.code, voucher.name, voucher.type].join(" ").toLowerCase().includes(keyword) : true;
      const matchesStatus = status === "ALL" ? true : voucher.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="grid gap-6">
      <AdminPageHeader title="Manajemen Voucher" description="UI mock untuk rules promo, status campaign, kuota, progress pemakaian, dan preview minimum belanja." />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard title="Voucher" value={String(adminVouchers.length)} note="Campaign mock frontend" icon={Ticket} />
        <AdminMetricCard title="Aktif" value={String(adminVouchers.filter((voucher) => voucher.status === "ACTIVE").length)} note="Siap tampil di checkout mock" icon={BadgePercent} />
        <AdminMetricCard title="Terpakai" value={String(adminVouchers.reduce((sum, voucher) => sum + voucher.used, 0))} note="Akumulasi usage mock" icon={TimerReset} />
      </div>

      <AdminDataToolbar search={search} onSearchChange={setSearch} filter={status} onFilterChange={setStatus} options={options} placeholder="Cari kode voucher atau tipe promo..." />

      <div className="grid gap-4 lg:grid-cols-2">
        {vouchers.map((voucher) => {
          const progress = Math.round((voucher.used / voucher.quota) * 100);

          return (
            <Card key={voucher.code} className="overflow-hidden">
              <div className="h-1 bg-[linear-gradient(90deg,var(--primary),var(--accent))]" />
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">{voucher.code}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">{voucher.name}</p>
                  </div>
                  <AdminStatusPill status={voucher.status} />
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-secondary p-3">
                    <div className="text-xs text-muted-foreground">Tipe</div>
                    <div className="mt-1 font-medium">{voucher.type}</div>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    <div className="text-xs text-muted-foreground">Value</div>
                    <div className="mt-1 font-medium">{voucher.value}</div>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    <div className="text-xs text-muted-foreground">Min belanja</div>
                    <div className="mt-1 font-medium">{formatRupiah(voucher.minSpend)}</div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Kuota</span>
                    <span className="font-medium">{voucher.used}/{voucher.quota}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Percent className="size-4" /> {voucher.period}
                  </span>
                  <Button variant="outline" disabled>Ubah rules</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AdminMockActionNotice />
    </div>
  );
}
