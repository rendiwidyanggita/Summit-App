import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Package } from "lucide-react";

import { ProductCard } from "@/components/sections/product-card";
import { ProductDetailSummary, type ProductDetailViewProduct } from "@/components/sections/product-detail-summary";
import { ProductGallery } from "@/components/sections/product-gallery";
import { ProductReviews } from "@/components/sections/product-reviews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { catalogProducts, getProductsByCategory } from "@/lib/constants";
import { getProductBySlug as getCatalogProductBySlug } from "@/lib/server/catalog-service";

function buildProductJsonLd(product: Awaited<ReturnType<typeof getCatalogProductBySlug>>, baseUrl: string) {
  if (!product) return null;

  const variants = product.variants ?? [];
  const availableStock = variants.reduce((total, variant) => total + variant.stock, 0);
  const price = product.discountPrice ?? product.price;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.metaDescription ?? product.description,
    image: product.photos,
    sku: variants[0]?.sku,
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand.name,
        }
      : undefined,
    category: product.category?.name,
    url: `${baseUrl}/produk/${product.slug}`,
    aggregateRating: product.ratingAvg
      ? {
          "@type": "AggregateRating",
          ratingValue: product.ratingAvg,
          reviewCount: product.ratingCount,
        }
      : undefined,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "IDR",
      lowPrice: price,
      highPrice: product.price,
      offerCount: Math.max(1, variants.length),
      availability: availableStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const catalogProduct = await getCatalogProductBySlug(slug);
  const title = catalogProduct?.metaTitle ?? catalogProduct?.name ?? "Produk";
  const description = catalogProduct?.metaDescription ?? catalogProduct?.description ?? "Detail produk Summit Gear.";
  const images = catalogProduct?.photos?.slice(0, 1);

  return {
    title,
    description,
    alternates: {
      canonical: `/produk/${slug}`,
    },
    openGraph: catalogProduct
      ? {
          title,
          description,
          images,
          type: "website",
        }
      : undefined,
  };
}

function serializeSpecs(specs: unknown) {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return {};

  return Object.fromEntries(Object.entries(specs).map(([key, value]) => [key, String(value)]));
}

function variantLabel(variant: NonNullable<Awaited<ReturnType<typeof getCatalogProductBySlug>>>["variants"][number]) {
  const label = [variant.size, variant.color].filter(Boolean).join(" / ");
  return label || variant.sku;
}

function toProductDetailView(product: NonNullable<Awaited<ReturnType<typeof getCatalogProductBySlug>>>): ProductDetailViewProduct {
  const currentPrice = product.discountPrice ?? product.price;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category?.name ?? "Produk",
    brand: product.brand?.name ?? "Summit Gear",
    price: currentPrice,
    compareAt: product.discountPrice ? product.price : null,
    stock: product.variants.reduce((total, variant) => total + variant.stock, 0),
    weightGram: product.weightGram,
    rating: product.ratingAvg,
    sold: product.soldCount,
    isNew: Date.now() - new Date(product.createdAt).getTime() < 1000 * 60 * 60 * 24 * 30,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      label: variantLabel(variant),
      sku: variant.sku,
      stock: variant.stock,
      priceModifier: variant.priceModifier,
    })),
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const catalogProduct = await getCatalogProductBySlug(slug);
  const baseUrl = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const productJsonLd = buildProductJsonLd(catalogProduct, baseUrl);

  if (!catalogProduct) {
    notFound();
  }

  const categorySlug = catalogProduct.category?.slug ?? "";
  const productView = toProductDetailView(catalogProduct);
  const specs = serializeSpecs(catalogProduct.specs);
  const relatedProducts = getProductsByCategory(categorySlug)
    .filter((item) => item.slug !== catalogProduct.slug)
    .slice(0, 3);

  const fallbackRelatedProducts = catalogProducts.filter((item) => item.slug !== catalogProduct.slug).slice(0, 3);

  return (
    <div className="container-page py-8">
      {productJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}

      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/produk" className="hover:text-primary">
          Produk
        </Link>
        <span>/</span>
        <Link href={`/kategori/${categorySlug}`} className="hover:text-primary">
          {catalogProduct.category?.name ?? "Kategori"}
        </Link>
        <span>/</span>
        <span className="text-foreground">{catalogProduct.name}</span>
      </div>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <ProductGallery images={catalogProduct.photos} alt={catalogProduct.name} />
        <ProductDetailSummary product={productView} />
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardContent className="p-5">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="description">Deskripsi</TabsTrigger>
                <TabsTrigger value="specs">Spesifikasi</TabsTrigger>
                <TabsTrigger value="reviews">Review</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-5 text-sm leading-6 text-muted-foreground">
                <p>{catalogProduct.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {catalogProduct.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="specs" className="mt-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="rounded-md border bg-background p-3 text-sm">
                      <div className="text-muted-foreground">{key}</div>
                      <div className="mt-1 font-medium">{value}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-5">
                <ProductReviews productSlug={catalogProduct.slug} />
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
                { icon: ArrowRight, text: "Tombol add-to-cart sudah terhubung ke backend." },
              ].map((item) => (
                <div key={item.text} className="flex gap-3">
                  <item.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Button variant="outline" asChild>
            <Link href={`/kategori/${categorySlug}`}>
              Jelajahi kategori {catalogProduct.category?.name ?? "produk"}
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
