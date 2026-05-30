"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import { CatalogToolbar } from "@/components/sections/catalog-toolbar";
import { defaultCatalogFilterState, ProductFilters, type CatalogFilterState } from "@/components/sections/product-filters";
import { ProductGrid } from "@/components/sections/product-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { categoryCatalog, filterProducts, sortProducts, type CatalogSortKey, type ProductCatalogItem } from "@/lib/constants";

function toNumber(value: string) {
  const numeric = Number(value.replace(/\D/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : undefined;
}

export function CatalogPageClient({
  products,
  initialCategorySlug,
}: {
  products: ProductCatalogItem[];
  initialCategorySlug?: string;
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<CatalogSortKey>("newest");
  const [filters, setFilters] = useState<CatalogFilterState>({
    ...defaultCatalogFilterState,
    categorySlugs: initialCategorySlug ? [initialCategorySlug] : [],
  });
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(products, {
      search,
      categorySlugs: filters.categorySlugs,
      brands: filters.brands,
      minPrice: toNumber(filters.minPrice),
      maxPrice: toNumber(filters.maxPrice),
      minRating: filters.minRating ? Number(filters.minRating) : undefined,
      discountOnly: filters.discountOnly,
      inStockOnly: filters.inStockOnly,
    });

    return sortProducts(filtered, sort);
  }, [filters, products, search, sort]);

  const activeFilterLabels = [
    ...filters.categorySlugs.map((slug) => categoryCatalog.find((category) => category.slug === slug)?.name ?? slug),
    ...filters.brands,
    filters.minPrice ? `Min ${filters.minPrice}` : "",
    filters.maxPrice ? `Max ${filters.maxPrice}` : "",
    filters.minRating ? `Rating ${filters.minRating}+` : "",
    filters.discountOnly ? "Diskon" : "",
    filters.inStockOnly ? "Stok tersedia" : "",
  ].filter(Boolean);

  const resetFilters = () =>
    setFilters({
      ...defaultCatalogFilterState,
      categorySlugs: initialCategorySlug ? [initialCategorySlug] : [],
    });

  const filterPanel = <ProductFilters value={filters} onChange={setFilters} onReset={resetFilters} lockedCategorySlug={initialCategorySlug} />;

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <aside className="hidden lg:block">
        <Card className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <CardContent className="p-5">{filterPanel}</CardContent>
        </Card>
      </aside>

      <div className="grid gap-5">
        <CatalogToolbar search={search} sort={sort} resultCount={filteredProducts.length} onSearchChange={setSearch} onSortChange={setSort} onOpenFilters={() => setFilterOpen(true)} />

        <div className="flex flex-wrap items-center gap-2">
          {activeFilterLabels.map((label) => (
            <Badge key={label} variant="secondary">
              {label}
            </Badge>
          ))}
          {search ? <Badge variant="outline">Search: {search}</Badge> : null}
          {activeFilterLabels.length || search ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                resetFilters();
              }}
            >
              <X /> Kosongkan filter
            </Button>
          ) : null}
          {!initialCategorySlug ? (
            <div className="ml-auto hidden gap-2 xl:flex">
              {categoryCatalog.slice(0, 5).map((category) => (
                <Button key={category.slug} type="button" variant="ghost" size="sm" asChild>
                  <Link href={`/kategori/${category.slug}`}>{category.name}</Link>
                </Button>
              ))}
            </div>
          ) : null}
        </div>

        <ProductGrid products={filteredProducts} />
      </div>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filter katalog</SheetTitle>
          </SheetHeader>
          <div className="mt-5">{filterPanel}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
