"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CatalogSortKey } from "@/lib/constants";

export function CatalogToolbar({
  search,
  sort,
  resultCount,
  onSearchChange,
  onSortChange,
  onOpenFilters,
}: {
  search: string;
  sort: CatalogSortKey;
  resultCount: number;
  onSearchChange: (value: string) => void;
  onSortChange: (value: CatalogSortKey) => void;
  onOpenFilters: () => void;
}) {
  return (
    <div className="grid gap-3 overflow-hidden rounded-[1.35rem] border bg-card p-4 shadow-sm lg:grid-cols-[1fr_auto_auto] lg:items-center">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Cari tenda, carrier, headlamp..." value={search} onChange={(event) => onSearchChange(event.target.value)} aria-label="Cari produk" />
      </div>
      <select
        className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        value={sort}
        onChange={(event) => onSortChange(event.target.value as CatalogSortKey)}
        aria-label="Urutkan produk"
      >
        <option value="newest">Terbaru</option>
        <option value="price-asc">Termurah</option>
        <option value="price-desc">Termahal</option>
        <option value="best-selling">Terlaris</option>
        <option value="rating-desc">Rating tertinggi</option>
      </select>
      <Button type="button" variant="outline" className="lg:hidden" onClick={onOpenFilters} aria-label="Buka filter produk">
        <SlidersHorizontal /> Filter
      </Button>
      <div className="rounded-full bg-secondary px-3 py-2 text-sm font-medium text-muted-foreground lg:text-right">{resultCount} produk ditemukan</div>
    </div>
  );
}
