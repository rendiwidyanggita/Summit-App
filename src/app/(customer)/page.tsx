import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, PackageCheck, ShieldCheck, Truck } from "lucide-react";

import { ProductCard } from "@/components/sections/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categories, featuredProducts } from "@/lib/constants";

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
            <Badge variant="accent">Foundation Sprint 1</Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl lg:text-6xl">Summit Gear</h1>
            <p className="mt-4 max-w-2xl text-base text-primary-foreground/85 sm:text-lg">
              Platform belanja peralatan pendakian yang disiapkan untuk katalog, checkout, pembayaran, pengiriman, dan backoffice operasional.
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
              { icon: PackageCheck, label: "Inventory internal" },
              { icon: ShieldCheck, label: "RBAC admin dasar" },
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
            <p className="mt-2 text-sm text-muted-foreground">Struktur kategori awal untuk katalog dan SEO.</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/kategori/tenda">Semua Kategori</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => (
            <Link key={category} href={`/kategori/${category.toLowerCase().replaceAll(" ", "-")}`} className="rounded-lg border bg-card p-4 text-sm font-medium shadow-sm hover:border-primary">
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold tracking-normal">Produk Unggulan</h2>
          <p className="mt-2 text-sm text-muted-foreground">Data statis untuk foundation UI; integrasi database masuk sprint berikutnya.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y bg-secondary/60">
        <div className="container-page grid gap-4 py-10 md:grid-cols-3">
          {[
            "Next.js App Router dengan route customer dan admin.",
            "Prisma PostgreSQL schema siap untuk Supabase.",
            "Auth.js dan RBAC disiapkan tanpa menarik Sprint 2.",
          ].map((text) => (
            <Card key={text}>
              <CardHeader>
                <CheckCircle2 className="size-5 text-primary" />
                <CardTitle className="text-base">{text}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Fondasi ini sengaja statis agar kontrak UI, data, dan route stabil sebelum commerce logic masuk.</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
