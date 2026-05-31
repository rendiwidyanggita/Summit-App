import { BadgePercent, Boxes, Search, ShieldCheck } from "lucide-react";

import { CatalogPageClient } from "@/components/sections/catalog-page-client";
import { Badge } from "@/components/ui/badge";
import { catalogProducts } from "@/lib/constants";
import { formatRupiah } from "@/lib/utils";

export const metadata = {
  title: "Produk Pendakian",
  description: "Katalog peralatan pendakian Summit Gear dengan search, filter, sort, dan grid produk responsive.",
  alternates: {
    canonical: "/produk",
  },
  openGraph: {
    title: "Produk Pendakian",
    description: "Katalog peralatan pendakian Summit Gear dengan search, filter, sort, dan grid produk responsive.",
    type: "website",
  },
};

export default function ProductsPage() {
  const discountedProducts = catalogProducts.filter((product) => product.compareAt > product.price).length;
  const lowestPrice = Math.min(...catalogProducts.map((product) => product.price));

  return (
    <div className="container-page py-8">
      <section className="mb-6 overflow-hidden rounded-lg border bg-primary text-primary-foreground shadow-sm">
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <Badge variant="accent">Sprint 3 Catalog</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">Produk Pendakian</h1>
            <p className="mt-3 max-w-2xl text-sm text-primary-foreground/80 sm:text-base">
              Cari tenda, carrier, jaket, cooking set, dan essentials lain dengan filter lokal yang siap menjadi kontrak query backend.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:w-[520px]">
            {[
              { icon: Boxes, label: "Produk mock", value: `${catalogProducts.length}` },
              { icon: BadgePercent, label: "Sedang diskon", value: `${discountedProducts}` },
              { icon: Search, label: "Mulai dari", value: formatRupiah(lowestPrice) },
            ].map((item) => (
              <div key={item.label} className="rounded-md border border-white/20 bg-white/10 p-3 backdrop-blur">
                <item.icon className="size-4 text-accent" />
                <div className="mt-2 text-lg font-semibold">{item.value}</div>
                <div className="text-xs text-primary-foreground/72">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-white/15 bg-primary-foreground/8 px-5 py-3 text-sm text-primary-foreground/80 sm:px-6">
          <ShieldCheck className="mr-2 inline size-4 text-accent" />
          Data masih mock lokal; cart, reserved stock, dan checkout tetap masuk Sprint 4.
        </div>
      </section>

      <CatalogPageClient products={catalogProducts} />
    </div>
  );
}
