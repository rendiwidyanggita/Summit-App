import { SearchX } from "lucide-react";

import { ProductCard } from "@/components/sections/product-card";
import { RouteStatePanel } from "@/components/sections/route-state-panel";
import type { ProductListItem } from "@/lib/product-types";

export function ProductGrid({ products }: { products: ProductListItem[] }) {
  if (products.length === 0) {
    return (
      <RouteStatePanel icon={SearchX} eyebrow="Katalog kosong" title="Produk tidak ditemukan" description="Coba ubah kata kunci, rentang harga, atau nonaktifkan beberapa filter." />
    );
  }

  return (
    <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
