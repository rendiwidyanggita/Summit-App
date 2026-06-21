"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { CategoryListItem } from "@/lib/product-types";
import { formatRupiah } from "@/lib/utils";

export type CatalogFilterState = {
  categorySlugs: string[];
  brands: string[];
  minPrice: string;
  maxPrice: string;
  minRating: string;
  discountOnly: boolean;
  inStockOnly: boolean;
};

export const defaultCatalogFilterState: CatalogFilterState = {
  categorySlugs: [],
  brands: [],
  minPrice: "",
  maxPrice: "",
  minRating: "",
  discountOnly: false,
  inStockOnly: false,
};

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function ProductFilters({
  value,
  categories = [],
  brands = [],
  onChange,
  onReset,
  lockedCategorySlug,
}: {
  value: CatalogFilterState;
  categories?: CategoryListItem[];
  brands?: { name: string; slug: string }[];
  onChange: (value: CatalogFilterState) => void;
  onReset: () => void;
  lockedCategorySlug?: string;
}) {
  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">Filter Produk</h2>
          <p className="mt-1 text-xs text-muted-foreground">Gunakan filter untuk mempersempit hasil katalog.</p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw /> Reset
        </Button>
      </div>

      {!lockedCategorySlug ? (
        <div>
          <div className="mb-3 text-sm font-medium">Kategori</div>
          <div className="grid gap-2">
            {categories.map((category) => (
              <label key={category.slug} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-secondary">
                <input
                  type="checkbox"
                  className="size-4 rounded border-input accent-primary"
                  checked={value.categorySlugs.includes(category.slug)}
                  onChange={() => onChange({ ...value, categorySlugs: toggleValue(value.categorySlugs, category.slug) })}
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <Separator />

      <div>
        <div className="mb-3 text-sm font-medium">Brand</div>
          <div className="grid gap-2">
          {brands.map((brand) => (
            <label key={brand.slug} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-secondary">
              <input
                type="checkbox"
                className="size-4 rounded border-input accent-primary"
                checked={value.brands.includes(brand.slug)}
                onChange={() => onChange({ ...value, brands: toggleValue(value.brands, brand.slug) })}
              />
              {brand.name}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div className="grid gap-3">
        <div className="text-sm font-medium">Rentang Harga</div>
        <div className="grid gap-2">
          <Label htmlFor="min-price" className="text-xs text-muted-foreground">
            Minimum
          </Label>
          <Input id="min-price" inputMode="numeric" placeholder={formatRupiah(250000)} value={value.minPrice} onChange={(event) => onChange({ ...value, minPrice: event.target.value })} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="max-price" className="text-xs text-muted-foreground">
            Maksimum
          </Label>
          <Input id="max-price" inputMode="numeric" placeholder={formatRupiah(1500000)} value={value.maxPrice} onChange={(event) => onChange({ ...value, maxPrice: event.target.value })} />
        </div>
      </div>

      <Separator />

      <div className="grid gap-2">
        <Label htmlFor="min-rating">Rating minimum</Label>
        <select
          id="min-rating"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={value.minRating}
          onChange={(event) => onChange({ ...value, minRating: event.target.value })}
        >
          <option value="">Semua rating</option>
          <option value="4.8">4.8 ke atas</option>
          <option value="4.6">4.6 ke atas</option>
          <option value="4.4">4.4 ke atas</option>
        </select>
      </div>

      <div className="grid gap-2">
        <label className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-secondary">
          <input type="checkbox" className="size-4 rounded border-input accent-primary" checked={value.discountOnly} onChange={(event) => onChange({ ...value, discountOnly: event.target.checked })} />
          Hanya produk diskon
        </label>
        <label className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-secondary">
          <input type="checkbox" className="size-4 rounded border-input accent-primary" checked={value.inStockOnly} onChange={(event) => onChange({ ...value, inStockOnly: event.target.checked })} />
          Hanya stok tersedia
        </label>
      </div>
    </div>
  );
}
