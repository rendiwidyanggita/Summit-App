"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CatalogToolbar, type CatalogSortKey } from "@/components/sections/catalog-toolbar";
import { defaultCatalogFilterState, ProductFilters, type CatalogFilterState } from "@/components/sections/product-filters";
import { ProductGrid } from "@/components/sections/product-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { ProductListItem, CategoryListItem } from "@/lib/product-types";

function subscribeToClientReady() {
  return () => undefined;
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function CatalogPageClient({
  products,
  categories = [],
  brands = [],
  initialCategorySlug,
  initialFilters,
  initialSort,
  initialSearch,
}: {
  products: ProductListItem[];
  categories?: CategoryListItem[];
  brands?: { name: string; slug: string }[];
  initialCategorySlug?: string;
  initialFilters?: CatalogFilterState;
  initialSort?: string;
  initialSearch?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch ?? "");
  const [sort, setSort] = useState<CatalogSortKey>((initialSort as CatalogSortKey | undefined) ?? "newest");
  const [filters, setFilters] = useState<CatalogFilterState>(
    initialFilters ?? {
      ...defaultCatalogFilterState,
      categorySlugs: initialCategorySlug ? [initialCategorySlug] : [],
    }
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribeToClientReady, getClientSnapshot, getServerSnapshot);

  // Apply filters by pushing to URL
  const applyFilters = (newFilters: CatalogFilterState, newSearch: string, newSort: CatalogSortKey) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSearch) params.set("q", newSearch);
    else params.delete("q");

    if (newFilters.categorySlugs.length > 0) params.set("category", newFilters.categorySlugs[0]);
    else params.delete("category");

    if (newFilters.brands.length > 0) params.set("brand", newFilters.brands[0]);
    else params.delete("brand");

    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
    else params.delete("minPrice");

    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
    else params.delete("maxPrice");

    if (newFilters.minRating) params.set("minRating", newFilters.minRating);
    else params.delete("minRating");

    if (newFilters.discountOnly) params.set("discountOnly", "true");
    else params.delete("discountOnly");

    if (newFilters.inStockOnly) params.set("inStockOnly", "true");
    else params.delete("inStockOnly");

    if (newSort !== "newest") params.set("sort", newSort);
    else params.delete("sort");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    applyFilters(filters, val, sort);
  };

  const handleSortChange = (val: CatalogSortKey) => {
    setSort(val);
    applyFilters(filters, search, val);
  };

  const handleFilterChange = (val: CatalogFilterState) => {
    setFilters(val);
    applyFilters(val, search, sort);
  };

  const activeFilterLabels = [
    ...filters.categorySlugs.map((slug) => categories.find((category) => category.slug === slug)?.name ?? slug),
    ...filters.brands,
    filters.minPrice ? `Min ${filters.minPrice}` : "",
    filters.maxPrice ? `Max ${filters.maxPrice}` : "",
    filters.minRating ? `Rating ${filters.minRating}+` : "",
    filters.discountOnly ? "Diskon" : "",
    filters.inStockOnly ? "Stok tersedia" : "",
  ].filter(Boolean);

  const resetFilters = () => {
    const newFilters = {
      ...defaultCatalogFilterState,
      categorySlugs: initialCategorySlug ? [initialCategorySlug] : [],
    };
    setFilters(newFilters);
    applyFilters(newFilters, search, sort);
  };

  const filterPanel = <ProductFilters value={filters} categories={categories} brands={brands} onChange={handleFilterChange} onReset={resetFilters} lockedCategorySlug={initialCategorySlug} />;

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <Card className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-[1.5rem] bg-card/92">
          <CardContent className="p-5">{filterPanel}</CardContent>
        </Card>
      </aside>

      <div className="grid gap-5">
        <CatalogToolbar search={search} sort={sort} resultCount={products.length} onSearchChange={handleSearchChange} onSortChange={handleSortChange} onOpenFilters={() => setFilterOpen(true)} />

        <div className="flex flex-wrap items-center gap-2 rounded-[1.25rem] border bg-card/80 p-3 shadow-sm">
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
                router.push(pathname);
              }}
            >
              <X /> Kosongkan filter
            </Button>
          ) : null}
          {!initialCategorySlug ? (
            <div className="ml-auto hidden gap-2 xl:flex">
              {categories.slice(0, 5).map((category) => (
                <Button key={category.slug} type="button" variant="ghost" size="sm" asChild>
                  <Link href={`/kategori/${category.slug}`}>{category.name}</Link>
                </Button>
              ))}
            </div>
          ) : null}
        </div>

        <ProductGrid products={products} />
      </div>

      {mounted ? (
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter katalog</SheetTitle>
            </SheetHeader>
            <div className="mt-5">{filterPanel}</div>
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  );
}
