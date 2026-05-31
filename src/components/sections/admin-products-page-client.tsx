"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Boxes, Package, Plus, SlidersHorizontal, TrendingUp } from "lucide-react";

import { AdminDataToolbar, AdminLowStockFlag, AdminMetricCard, AdminMockActionNotice, AdminStatusPill } from "@/components/sections/admin-commerce-ui";
import { AdminPageHeader } from "@/components/sections/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminProducts, getAdminCommerceSummary } from "@/lib/admin-commerce-mock";
import { formatRupiah } from "@/lib/utils";

const statusOptions = [
  { label: "Semua status", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Draft", value: "DRAFT" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Archived", value: "ARCHIVED" },
  { label: "Low stock", value: "LOW_STOCK" },
];

export function AdminProductsPageClient() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const summary = getAdminCommerceSummary();

  const products = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return adminProducts.filter((product) => {
      const matchesSearch = keyword ? [product.name, product.brand, product.category].join(" ").toLowerCase().includes(keyword) : true;
      const matchesStatus = status === "ALL" ? true : status === "LOW_STOCK" ? product.lowStock : product.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="grid gap-6">
      <AdminPageHeader title="Manajemen Produk" description="UI mock untuk katalog admin: status produk, stok, varian, harga, dan quick action inventory tanpa menyentuh backend." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard title="Total produk" value={String(summary.totalProducts)} note={`${summary.activeProducts} aktif di katalog`} icon={Package} />
        <AdminMetricCard title="Low stock" value={String(summary.lowStockProducts)} note="Threshold mock < 10 unit" icon={SlidersHorizontal} />
        <AdminMetricCard title="Produk diskon" value={String(summary.discountProducts)} note="Campaign siap dipreview" icon={TrendingUp} />
        <AdminMetricCard title="Varian aktif" value={String(adminProducts.reduce((sum, product) => sum + product.variants, 0))} note="SKU mock dari katalog FE" icon={Boxes} />
      </div>

      <AdminDataToolbar search={search} onSearchChange={setSearch} filter={status} onFilterChange={setStatus} options={statusOptions} placeholder="Cari nama, brand, atau kategori..." />

      <Card className="overflow-hidden rounded-[1.35rem]">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Produk katalog</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus /> Produk mock
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah produk mock</DialogTitle>
                <DialogDescription>Form CRUD real belum diaktifkan. Sprint 6 hanya menyiapkan affordance UI admin untuk integrasi backend berikutnya.</DialogDescription>
              </DialogHeader>
              <AdminMockActionNotice />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Performa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.slug}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 overflow-hidden rounded-md bg-secondary">
                          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="48px" />
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.brand} - {product.category}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><AdminStatusPill status={product.status} /></TableCell>
                    <TableCell>
                      <div className="font-medium">{product.stock} unit</div>
                      <AdminLowStockFlag show={product.lowStock} />
                    </TableCell>
                    <TableCell>{formatRupiah(product.price)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{product.sold} terjual</div>
                      <div className="text-xs text-muted-foreground">{product.rating} rating - {product.variants} varian</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-3 p-4 lg:hidden">
            {products.map((product) => (
              <div key={product.slug} className="rounded-[1.15rem] border bg-background p-3">
                <div className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                    <Image src={product.image} alt={product.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium line-clamp-1">{product.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{product.brand} - {product.category}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <AdminStatusPill status={product.status} />
                      <AdminLowStockFlag show={product.lowStock} />
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span>{formatRupiah(product.price)}</span>
                  <span className="text-muted-foreground">{product.stock} stok</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <AdminMockActionNotice />
    </div>
  );
}
