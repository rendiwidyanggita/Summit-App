import Image from "next/image";
import { BadgePercent, Boxes, Search, ShieldCheck } from "lucide-react";

import { CatalogPageClient } from "@/components/sections/catalog-page-client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
      <section className="summit-dark relative mb-6 overflow-hidden rounded-xl border border-white/10">
        <Image
          src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1600&q=80"
          alt="Siluet jalur alam untuk katalog produk Summit Gear"
          fill
          priority
          className="object-cover opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[var(--green-house)]/78" />
        <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_450px] lg:items-end">
          <div>
            <Badge variant="accent">Katalog Summit Gear</Badge>
            <h1 className="mt-3 text-3xl font-medium tracking-[-0.03em] sm:text-5xl">Produk Pendakian</h1>
            <p className="mt-3 max-w-2xl text-sm text-primary-foreground/80 sm:text-base">
              Cari tenda, carrier, jaket, cooking set, dan essentials lain dengan filter, pencarian, dan pengurutan katalog.
            </p>
          </div>
          <Card className="bg-primary-foreground/95 text-foreground">
            <CardContent className="grid gap-3 p-4 text-sm">
              {[
                { icon: Boxes, label: "Produk tersedia", value: `${catalogProducts.length}` },
                { icon: BadgePercent, label: "Sedang diskon", value: `${discountedProducts}` },
                { icon: Search, label: "Mulai dari", value: formatRupiah(lowestPrice) },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <item.icon className="size-4" /> {item.label}
                  </span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="border-t border-white/15 bg-primary-foreground/8 px-5 py-3 text-sm text-primary-foreground/80 sm:px-6">
          <ShieldCheck className="mr-2 inline size-4 text-accent" />
          Katalog demonstrasi dapat digunakan untuk mencoba cart, reserved stock, voucher, dan checkout.
        </div>
      </section>

      <CatalogPageClient products={catalogProducts} />
    </div>
  );
}
