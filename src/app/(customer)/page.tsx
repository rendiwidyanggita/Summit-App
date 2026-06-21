import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";

import { DarkPromoBand } from "@/components/sections/dark-promo-band";
import { ProductCard } from "@/components/sections/product-card";
import { SectionHeader } from "@/components/sections/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { catalogProducts, categoryCatalog, featuredProducts, getDiscountPercent } from "@/lib/constants";

export default function HomePage() {
  const bestSellers = [...catalogProducts].sort((a, b) => b.sold - a.sold).slice(0, 4);
  const discountedProducts = catalogProducts.filter((product) => getDiscountPercent(product) > 0);

  return (
    <div className="overflow-hidden">
      <section className="relative isolate overflow-hidden bg-[var(--green-house)] text-white">
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80"
          alt="Lanskap pegunungan sebagai latar Summit Gear"
          fill
          priority
          className="pointer-events-none -z-20 object-cover object-center brightness-[0.58] saturate-[0.75]"
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-10 bg-[var(--green-house)]/60" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_28%,rgba(242,240,235,0.22),transparent_32%),linear-gradient(90deg,rgba(30,57,50,0.92)_0%,rgba(30,57,50,0.72)_42%,rgba(30,57,50,0.42)_100%)]" />
        <div className="container-page grid min-h-[calc(100svh-4rem)] content-center gap-8 py-16 md:min-h-[calc(100svh-4.5rem)] md:grid-cols-[minmax(0,0.58fr)_minmax(320px,0.42fr)] md:items-end md:py-20">
          <div className="max-w-3xl">
            <Badge className="border-white/25 bg-white/10 text-white shadow-none backdrop-blur">Outdoor Gear Store</Badge>
            <h1 className="mt-5 text-5xl font-semibold leading-[0.92] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
              Summit Gear
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              Pilih perlengkapan pendakian yang pas untuk summit attack, camping, dan perjalanan akhir pekan. Jelajahi katalog, kelola keranjang, dan coba alur checkout demonstrasi.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="inverse" size="lg" asChild>
                <Link href="/produk">
                  Lihat Produk <ArrowRight />
                </Link>
              </Button>
              <Button variant="darkOutline" size="lg" asChild>
                <Link href="/keranjang">
                  Cek Keranjang <ShoppingCart />
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/75">
              {["Mobile-first", "SEO-ready", "Checkout flow", "Outdoor catalog"].map((item) => (
                <span key={item} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 shadow-sm backdrop-blur">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-[var(--green-house)]/50 p-4 text-white shadow-2xl backdrop-blur-md sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-white/70">Rekomendasi Minggu Ini</div>
                <div className="mt-1 text-2xl font-semibold tracking-[-0.02em]">Summit Ridge Tent 2P</div>
              </div>
              <Badge className="border-white/20 bg-white text-primary">-{getDiscountPercent(catalogProducts[0])}%</Badge>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { icon: PackageCheck, label: `${catalogProducts.length} produk` },
                { icon: Star, label: "Rating 4.8+" },
                { icon: Truck, label: "Ongkir simulasi" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-white/85">
                  <item.icon className="size-4 text-white" />
                  {item.label}
                </div>
              ))}
            </div>
            <Button variant="inverse" className="mt-5 w-full" asChild>
              <Link href="/produk/summit-ridge-tent-2p">
                Lihat detail gear <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container-page">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Search, title: "Cari cepat", body: "Temukan gear lewat search, kategori, brand, rating, dan harga." },
            { icon: ShoppingCart, title: "Keranjang aktif", body: "Ubah quantity, cek berat, dan lanjut ke checkout demonstrasi." },
            { icon: ShieldCheck, title: "Alur terintegrasi", body: "Order, stok, voucher, dan operasional admin tersambung ke backend." },
          ].map((item) => (
            <div key={item.title} className="summit-card-shadow rounded-xl border bg-card p-6">
              <item.icon className="size-5 text-primary" />
              <h2 className="mt-4 font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader eyebrow="Kategori gear" title="Kategori Pendakian" description="Masuk cepat ke kategori gear dengan visual yang jelas dan copy SEO-friendly." />
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/kategori/tenda">
              Mulai dari tenda <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <Link href="/kategori/tenda" className="group relative min-h-[360px] overflow-hidden rounded-[2rem_1rem_2rem_1rem] bg-[var(--green-house)] text-white shadow-sm">
            <Image src={categoryCatalog[0].image} alt={categoryCatalog[0].name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 58vw, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--green-house)]/92 via-[var(--green-house)]/38 via-[38%] to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <Badge variant="accent">{categoryCatalog[0].highlight}</Badge>
              <h3 className="mt-4 text-3xl font-semibold tracking-normal">{categoryCatalog[0].name}</h3>
              <p className="mt-2 max-w-lg text-sm leading-6 text-white/85">{categoryCatalog[0].description}</p>
            </div>
          </Link>
          <div className="grid gap-3 sm:grid-cols-2">
            {categoryCatalog.slice(1, 7).map((category) => (
              <Link key={category.slug} href={`/kategori/${category.slug}`} className="group relative min-h-44 overflow-hidden rounded-[1.25rem] border bg-[var(--green-house)] text-white shadow-sm">
                <Image src={category.image} alt={category.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 25vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--green-house)]/92 via-[var(--green-house)]/36 via-[40%] to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <Badge variant="accent">{category.highlight}</Badge>
                  <div className="mt-3 text-lg font-semibold">{category.name}</div>
                  <p className="mt-1 line-clamp-2 text-xs text-white/80">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader eyebrow="Featured gear" title="Produk Pilihan" description="Gear yang paling siap masuk flow cart dan checkout customer." />
          <Button variant="ghost" asChild className="w-fit">
            <Link href="/produk">
              Buka katalog <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <DarkPromoBand
        eyebrow="Promo gear"
        title="Temukan perlengkapan dengan harga terbaik."
        description={`${discountedProducts.length} produk diskon dan voucher tersedia untuk dicoba pada alur belanja demonstrasi.`}
        primaryHref="/produk"
        primaryLabel="Lihat produk diskon"
        secondaryHref="/keranjang"
        secondaryLabel="Cek keranjang"
        
      />

      <section className="container-page py-12">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <Badge variant="secondary">Terlaris</Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal">Sering dipilih pendaki</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Produk dengan angka terjual tertinggi dari katalog Summit Gear untuk membantu memilih perlengkapan yang sering diminati.
            </p>
            <Button className="mt-5" asChild>
              <Link href="/produk">
                Jelajahi katalog <Compass />
              </Link>
            </Button>
          </div>
          <div className="grid gap-3">
            {bestSellers.slice(0, 4).map((product, index) => (
              <Link key={product.slug} href={`/produk/${product.slug}`} className="flex items-center gap-4 rounded-lg border bg-card p-3 shadow-sm hover:border-primary">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold text-primary">#{index + 1}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{product.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {product.category} - {product.sold} terjual - {product.rating} rating
                  </div>
                </div>
                
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
