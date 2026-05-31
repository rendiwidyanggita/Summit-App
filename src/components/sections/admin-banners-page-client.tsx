"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CalendarClock, Flag, LayoutPanelTop, MousePointerClick } from "lucide-react";

import { AdminDataToolbar, AdminMetricCard, AdminMockActionNotice, AdminStatusPill } from "@/components/sections/admin-commerce-ui";
import { AdminPageHeader } from "@/components/sections/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminBanners } from "@/lib/admin-commerce-mock";

const options = [
  { label: "Semua banner", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Paused", value: "PAUSED" },
];

export function AdminBannersPageClient() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const banners = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return adminBanners.filter((banner) => {
      const matchesSearch = keyword ? [banner.title, banner.placement, banner.targetUrl].join(" ").toLowerCase().includes(keyword) : true;
      const matchesStatus = status === "ALL" ? true : banner.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="grid gap-6">
      <AdminPageHeader title="Manajemen Banner" description="UI mock campaign visual: placement, jadwal tayang, target URL, sort order, dan preview desktop/mobile." />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard title="Banner" value={String(adminBanners.length)} note="Campaign homepage dan katalog" icon={Flag} />
        <AdminMetricCard title="Placement" value="3" note="Hero, promo strip, catalog top" icon={LayoutPanelTop} />
        <AdminMetricCard title="Aktif" value={String(adminBanners.filter((banner) => banner.status === "ACTIVE").length)} note="Sedang tampil mock" icon={CalendarClock} />
      </div>

      <AdminDataToolbar search={search} onSearchChange={setSearch} filter={status} onFilterChange={setStatus} options={options} placeholder="Cari banner, placement, atau target URL..." />

      <div className="grid gap-4">
        {banners.map((banner) => (
          <Card key={banner.id} className="overflow-hidden">
            <CardContent className="grid gap-4 p-4 lg:grid-cols-[320px_1fr_auto] lg:items-center">
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-secondary">
                <Image src={banner.image} alt={banner.title} fill className="object-cover" sizes="(min-width: 1024px) 320px, 100vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <div className="absolute bottom-3 left-3 text-sm font-semibold text-white">{banner.placement}</div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold">{banner.title}</h2>
                  <AdminStatusPill status={banner.status} />
                </div>
                <div className="mt-2 grid gap-2 text-sm text-muted-foreground">
                  <span>{banner.schedule}</span>
                  <span className="inline-flex items-center gap-2">
                    <MousePointerClick className="size-4" /> {banner.targetUrl}
                  </span>
                  <span>Sort order #{banner.sortOrder}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button disabled>Preview mobile</Button>
                <Button variant="outline" disabled>Ubah jadwal</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preview guideline</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
          <div className="rounded-lg bg-secondary p-3">Desktop hero memakai image jelas, bukan gradient kosong.</div>
          <div className="rounded-lg bg-secondary p-3">Mobile crop harus tetap menampilkan subjek utama.</div>
          <div className="rounded-lg bg-secondary p-3">CTA target diarahkan ke kategori, produk, atau promo aktif.</div>
        </CardContent>
      </Card>

      <AdminMockActionNotice />
    </div>
  );
}
