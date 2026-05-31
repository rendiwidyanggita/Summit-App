"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { FolderTree, Search, Tags, TextSearch } from "lucide-react";

import { AdminDataToolbar, AdminMetricCard, AdminMockActionNotice, AdminStatusPill } from "@/components/sections/admin-commerce-ui";
import { AdminPageHeader } from "@/components/sections/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminCategories } from "@/lib/admin-commerce-mock";

const options = [
  { label: "Semua kategori", value: "ALL" },
  { label: "Visible", value: "VISIBLE" },
  { label: "Hidden", value: "HIDDEN" },
];

export function AdminCategoriesPageClient() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const categories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return adminCategories.filter((category) => {
      const matchesSearch = keyword ? [category.name, category.slug, category.parent].join(" ").toLowerCase().includes(keyword) : true;
      const matchesStatus = status === "ALL" ? true : category.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="grid gap-6">
      <AdminPageHeader title="Manajemen Kategori" description="UI mock untuk hierarki kategori, slug, metadata SEO, dan visibilitas kategori katalog." />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard title="Kategori" value={String(adminCategories.length)} note="Route kategori sudah tersedia" icon={Tags} />
        <AdminMetricCard title="Parent group" value="2" note="Gear Utama dan Essentials" icon={FolderTree} />
        <AdminMetricCard title="SEO preview" value="Aktif" note="Meta title disiapkan per kategori" icon={TextSearch} />
      </div>

      <AdminDataToolbar search={search} onSearchChange={setSearch} filter={status} onFilterChange={setStatus} options={options} placeholder="Cari kategori, slug, atau parent..." />

      <div className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr]">
        <Card className="rounded-[1.35rem]">
          <CardHeader>
            <CardTitle className="text-base">Hierarki mock</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {["Gear Utama", "Essentials"].map((group) => (
              <div key={group} className="rounded-lg border p-3">
                <div className="font-medium">{group}</div>
                <div className="mt-3 grid gap-2">
                  {adminCategories.filter((category) => category.parent === group).map((category) => (
                    <div key={category.slug} className="flex items-center justify-between rounded-md bg-secondary px-3 py-2 text-sm">
                      <span>{category.name}</span>
                      <span className="text-muted-foreground">{category.productCount} produk</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[1.35rem]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Kategori katalog</CardTitle>
            <Button disabled>Tambah kategori</Button>
          </CardHeader>
          <CardContent className="grid gap-3">
            {categories.length ? (
              categories.map((category) => (
                <div key={category.slug} className="grid gap-3 rounded-[1.15rem] border p-3 md:grid-cols-[96px_minmax(0,1fr)_auto] md:items-center">
                  <div className="relative h-24 overflow-hidden rounded-md bg-secondary md:h-20">
                    <Image src={category.image} alt={category.name} fill className="object-cover" sizes="160px" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-medium">{category.name}</h2>
                      <AdminStatusPill status={category.status} />
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">/{category.slug} - {category.parent}</div>
                    <div className="mt-2 rounded-md bg-secondary px-3 py-2 text-xs text-muted-foreground">Meta: {category.metaTitle}</div>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-lg font-semibold">{category.activeProductCount}/{category.productCount}</div>
                    <div className="text-xs text-muted-foreground">aktif</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="grid place-items-center rounded-lg border p-8 text-center text-sm text-muted-foreground">
                <Search className="mb-2 size-6" />
                Kategori tidak ditemukan.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AdminMockActionNotice />
    </div>
  );
}
