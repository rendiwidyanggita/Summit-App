import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Package, Star } from "lucide-react";

import { ProductCard } from "@/components/sections/product-card";
import { ProductDetailSummary } from "@/components/sections/product-detail-summary";
import { ProductGallery } from "@/components/sections/product-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { catalogProducts, getProductBySlug, getProductsByCategory } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  return {
    title: product?.name ?? "Produk",
    description: product?.description ?? "Detail produk Summit Gear.",
    openGraph: product
      ? {
          title: product.name,
          description: product.description,
          images: product.images.slice(0, 1),
        }
      : undefined,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getProductsByCategory(product.categorySlug)
    .filter((item) => item.slug !== product.slug)
    .slice(0, 3);

  const fallbackRelatedProducts = catalogProducts.filter((item) => item.slug !== product.slug).slice(0, 3);

  return (
    <div className="container-page py-8">
      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/produk" className="hover:text-primary">
          Produk
        </Link>
        <span>/</span>
        <Link href={`/kategori/${product.categorySlug}`} className="hover:text-primary">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <ProductGallery images={product.images} alt={product.name} />
        <ProductDetailSummary product={product} />
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardContent className="p-5">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="description">Deskripsi</TabsTrigger>
                <TabsTrigger value="specs">Spesifikasi</TabsTrigger>
                <TabsTrigger value="reviews">Review</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-5 text-sm leading-6 text-muted-foreground">
                <p>{product.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="specs" className="mt-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="rounded-md border bg-background p-3 text-sm">
                      <div className="text-muted-foreground">{key}</div>
                      <div className="mt-1 font-medium">{value}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-5">
                <div className="rounded-md bg-secondary p-4 text-sm text-muted-foreground">
                  <Star className="mb-2 size-5 fill-accent text-accent" />
                  Rating summary dan review pembeli akan aktif setelah order selesai dan modul review Sprint 7 tersedia.
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid gap-5">
          <Card className="overflow-hidden">
            <div className="h-1 bg-accent" />
            <CardHeader>
              <CardTitle className="text-base">Kesiapan Sprint Berikutnya</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-muted-foreground">
              {[
                { icon: Package, text: "SKU varian sudah tersedia sebagai kontrak cart item." },
                { icon: CheckCircle2, text: "Stok dan berat siap dipakai untuk checkout dan ongkir." },
                { icon: ArrowRight, text: "CTA tetap disabled sampai cart Sprint 4 aktif." },
              ].map((item) => (
                <div key={item.text} className="flex gap-3">
                  <item.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Button variant="outline" asChild>
            <Link href={`/kategori/${product.categorySlug}`}>
              Jelajahi kategori {product.category}
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-normal">Produk Terkait</h2>
            <p className="mt-2 text-sm text-muted-foreground">Rekomendasi lokal berdasarkan kategori yang sama.</p>
          </div>
          <Button variant="ghost" className="hidden sm:inline-flex" asChild>
            <Link href="/produk">Lihat semua</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(relatedProducts.length ? relatedProducts : fallbackRelatedProducts).map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
