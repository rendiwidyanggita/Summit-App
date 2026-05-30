import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgePercent, CheckCircle2, Clock, PackageCheck, ShieldCheck, Star, Truck } from "lucide-react";

import { ProductCard } from "@/components/sections/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { catalogProducts, categoryCatalog, featuredProducts } from "@/lib/constants";
import { formatRupiah } from "@/lib/utils";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80"
            alt="Pendaki di jalur pegunungan"
            fill
            priority
            className="object-cover opacity-35"
            sizes="100vw"
          />
        </div>
        <div className="container-page relative grid min-h-[560px] content-end gap-8 py-12 md:min-h-[620px] md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div className="pb-6">
            <Badge variant="accent">Sprint 3 Catalog</Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl lg:text-6xl">Summit Gear</h1>
            <p className="mt-4 max-w-2xl text-base text-primary-foreground/85 sm:text-lg">
              Platform belanja peralatan pendakian dengan katalog interaktif, filter produk, detail gear, dan fondasi checkout untuk sprint berikutnya.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="accent" size="lg" asChild>
                <Link href="/produk">
                  Lihat Produk <ArrowRight />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/admin">Buka Admin</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-3 pb-6 sm:grid-cols-2">
            {[
              { icon: PackageCheck, label: `${catalogProducts.length} produk mock` },
              { icon: Star, label: "Filter rating & terlaris" },
              { icon: Truck, label: "Siap ongkir Sprint 4" },
              { icon: Clock, label: "Payment timer Sprint 5" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur">
                <item.icon className="size-5" />
                <div className="mt-3 text-sm font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-normal">Kategori Pendakian</h2>
            <p className="mt-2 text-sm text-muted-foreground">Masuk cepat ke kategori gear dengan hero visual dan produk terfilter.</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/kategori/tenda">Semua Kategori</Link>
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categoryCatalog.slice(0, 8).map((category) => (
            <Link key={category.slug} href={`/kategori/${category.slug}`} className="group relative min-h-40 overflow-hidden rounded-lg border bg-primary text-primary-foreground shadow-sm">
              <Image src={category.image} alt={category.name} fill className="object-cover opacity-35 transition-transform duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 25vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <Badge variant="accent">{category.highlight}</Badge>
                <div className="mt-3 text-lg font-semibold">{category.name}</div>
                <p className="mt-1 line-clamp-2 text-xs text-primary-foreground/78">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-normal">Produk Unggulan</h2>
            <p className="mt-2 text-sm text-muted-foreground">Rekomendasi awal dari katalog mock Sprint 3.</p>
          </div>
          <Button variant="ghost" asChild className="w-fit">
            <Link href="/produk">
              Buka katalog <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y bg-secondary/60">
        <div className="container-page grid gap-5 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg bg-primary p-6 text-primary-foreground">
            <Badge variant="accent">Flash Sale UI</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal">Gear pilihan siap masuk campaign.</h2>
            <p className="mt-3 text-sm text-primary-foreground/78">
              Countdown dan kuota flash sale tetap UI-only sampai modul promo Sprint 6 terhubung ke backend.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {["02 Hari", "14 Jam", "38 Menit"].map((item) => (
                <div key={item} className="rounded-md border border-white/20 bg-white/10 p-3 text-center text-sm font-semibold">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: BadgePercent, title: "Diskon produk", body: `Mulai dari ${formatRupiah(Math.min(...catalogProducts.map((item) => item.price)))}.` },
            { icon: CheckCircle2, title: "Search & filter", body: "Filter lokal siap menjadi kontrak query backend." },
            { icon: ShieldCheck, title: "Checkout boundary", body: "Cart dan reserved stock tetap masuk Sprint 4." },
          ].map((text) => (
            <Card key={text.title}>
              <CardHeader>
                <text.icon className="size-5 text-primary" />
                <CardTitle className="text-base">{text.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{text.body}</CardContent>
            </Card>
          ))}
          </div>
        </div>
      </section>
    </div>
  );
}
