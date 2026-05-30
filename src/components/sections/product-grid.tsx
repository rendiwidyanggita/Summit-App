import { SearchX } from "lucide-react";

import { ProductCard } from "@/components/sections/product-card";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductCatalogItem } from "@/lib/constants";

export function ProductGrid({ products }: { products: ProductCatalogItem[] }) {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="grid min-h-80 place-items-center p-8 text-center">
          <div>
            <div className="mx-auto grid size-12 place-items-center rounded-md bg-secondary text-primary">
              <SearchX className="size-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">Produk tidak ditemukan</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">Coba ubah kata kunci, rentang harga, atau nonaktifkan beberapa filter.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
