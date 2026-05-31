import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  CheckCircle2,
  Clock,
  Compass,
  MapPinned,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react";

import { ProductCard } from "@/components/sections/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { catalogProducts, categoryCatalog, featuredProducts, getDiscountPercent } from "@/lib/constants";
import { formatRupiah } from "@/lib/utils";

export default function HomePage() {
  const bestSellers = [...catalogProducts].sort((a, b) => b.sold - a.sold).slice(0, 4);
  const discountedProducts = catalogProducts.filter((product) => getDiscountPercent(product) > 0);
  const lowestPrice = Math.min(...catalogProducts.map((product) => product.price));

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-primary text-primary-foreground">
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
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/76 to-primary/20" />
        <div className="container-page relative grid min-h-[calc(100vh-4rem)] content-center gap-8 py-10 md:grid-cols-[1.08fr_0.92fr] md:items-center md:py-14 lg:-translate-y-4">
          <div>
            <Badge variant="accent">Outdoor Gear Store</Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl lg:text-6xl">Summit Gear</h1>
            <p className="mt-4 max-w-2xl text-base text-primary-foreground/85 sm:text-lg">
              Pilih perlengkapan pendakian yang pas untuk summit attack, camping, dan perjalanan akhir pekan. Katalog, keranjang, dan checkout mock sudah disiapkan untuk flow belanja web.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="accent" size="lg" asChild>
                <Link href="/produk">
                  Lihat Produk <ArrowRight />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/keranjang">
                  Cek Keranjang <ShoppingCart />
                </Link>
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap gap-3 text-sm text-primary-foreground/82">
              {["Mobile-first", "SEO-ready", "Checkout flow", "Outdoor catalog"].map((item) => (
                <span key={item} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="rounded-lg border border-white/18 bg-white/12 p-4 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-primary-foreground/72">Rekomendasi Minggu Ini</div>
                  <div className="mt-1 text-2xl font-semibold">Summit Ridge Tent 2P</div>
                </div>
                <Badge variant="accent">-{getDiscountPercent(catalogProducts[0])}%</Badge>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: PackageCheck, label: `${catalogProducts.length} produk` },
                  { icon: Star, label: "Rating 4.8+" },
                  { icon: Truck, label: "Ongkir mock" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm">
                    <item.icon className="size-4 text-accent" />
                    {item.label}
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-5 w-full" asChild>
                <Link href="/produk/summit-ridge-tent-2p">
                  Lihat detail gear <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Search, title: "Cari cepat", body: "Temukan gear lewat search, kategori, brand, rating, dan harga." },
            { icon: ShoppingCart, title: "Keranjang aktif", body: "Ubah quantity, cek berat, dan lanjut ke checkout mock." },
            { icon: ShieldCheck, title: "Siap integrasi", body: "UI sudah menjaga boundary untuk payment, ongkir, dan stock reserve." },
          ].map((item, index) => (
            <div key={item.title} className={`rounded-[1.35rem] border bg-card p-5 shadow-sm ${index === 1 ? "md:-translate-y-3 md:border-primary/30" : ""}`}>
              <item.icon className="size-5 text-primary" />
              <h2 className="mt-4 font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-normal">Kategori Pendakian</h2>
            <p className="mt-2 text-sm text-muted-foreground">Masuk cepat ke kategori gear dengan visual yang jelas dan copy SEO-friendly.</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/kategori/tenda">
              Mulai dari tenda <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <Link href="/kategori/tenda" className="group relative min-h-[360px] overflow-hidden rounded-[2rem_1rem_2rem_1rem] bg-primary text-primary-foreground shadow-sm">
            <Image src={categoryCatalog[0].image} alt={categoryCatalog[0].name} fill className="object-cover opacity-42 transition-transform duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 58vw, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <Badge variant="accent">{categoryCatalog[0].highlight}</Badge>
              <h3 className="mt-4 text-3xl font-semibold tracking-normal">{categoryCatalog[0].name}</h3>
              <p className="mt-2 max-w-lg text-sm leading-6 text-primary-foreground/82">{categoryCatalog[0].description}</p>
            </div>
          </Link>
          <div className="grid gap-3 sm:grid-cols-2">
            {categoryCatalog.slice(1, 7).map((category) => (
              <Link key={category.slug} href={`/kategori/${category.slug}`} className="group relative min-h-44 overflow-hidden rounded-[1.25rem] border bg-primary text-primary-foreground shadow-sm">
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
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-normal">Produk Pilihan</h2>
            <p className="mt-2 text-sm text-muted-foreground">Gear yang paling siap masuk flow cart dan checkout customer.</p>
          </div>
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

      <section className="border-y bg-secondary/60">
        <div className="container-page grid gap-5 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative overflow-hidden rounded-[2rem_1rem_2rem_1rem] bg-primary p-6 text-primary-foreground">
            <div className="absolute -right-16 -top-16 size-44 rounded-full bg-accent/25 blur-2xl" />
            <Badge variant="accent">Promo Preview</Badge>
            <h2 className="relative mt-4 text-3xl font-semibold tracking-normal">Flash sale gear camp siap ditampilkan.</h2>
            <p className="relative mt-3 text-sm leading-6 text-primary-foreground/78">
              Preview campaign untuk diskon produk, voucher, dan countdown. Data final tetap bisa disambungkan ke modul promo admin nanti.
            </p>
            <div className="relative mt-5 grid grid-cols-3 gap-3">
              {["02 Hari", "14 Jam", "38 Menit"].map((item) => (
                <div key={item} className="rounded-md border border-white/20 bg-white/10 p-3 text-center text-sm font-semibold">
                  {item}
                </div>
              ))}
            </div>
            <Button variant="secondary" className="relative mt-5" asChild>
              <Link href="/produk">Lihat produk diskon</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: BadgePercent, title: `${discountedProducts.length} produk diskon`, body: `Harga mulai dari ${formatRupiah(lowestPrice)} untuk item essentials.` },
              { icon: CheckCircle2, title: "Checkout readable", body: "Alamat, kurir, voucher, pembayaran, dan total biaya terlihat berurutan." },
              { icon: MapPinned, title: "Alamat & ongkir", body: "Flow disiapkan untuk kalkulasi ongkir dan snapshot alamat order." },
              { icon: Clock, title: "Payment timer", body: "Copy dan UI countdown mengikuti batas waktu pembayaran di PRD." },
            ].map((item) => (
              <Card key={item.title} className="overflow-hidden rounded-[1.25rem]">
                <CardHeader>
                  <item.icon className="size-5 text-primary" />
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-muted-foreground">{item.body}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <Badge variant="secondary">Terlaris</Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal">Sering dipilih pendaki</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Produk dengan angka terjual tertinggi dari katalog mock. Bagian ini menjaga homepage tetap informatif tanpa terasa seperti kumpulan kartu yang sama.
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
                <Zap className="size-4 shrink-0 text-accent" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
