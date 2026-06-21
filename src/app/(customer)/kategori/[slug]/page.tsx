import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Boxes, Star } from "lucide-react";

import { CatalogPageClient } from "@/components/sections/catalog-page-client";
import { DesignParticles } from "@/components/sections/design-particles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCategoryBySlug as getCatalogCategoryBySlug, listProducts, listCategories, listBrands, productQuerySchema } from "@/lib/server/catalog-service";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const catalogCategory = await getCatalogCategoryBySlug(slug);

  return {
    title: catalogCategory?.metaTitle ?? "Kategori",
    description: catalogCategory?.metaDescription ?? "Kategori produk Summit Gear.",
    alternates: {
      canonical: `/kategori/${slug}`,
    },
    openGraph: catalogCategory
      ? {
          title: catalogCategory.metaTitle ?? catalogCategory.name,
          description: catalogCategory.metaDescription ?? "Kategori produk Summit Gear.",
          images: catalogCategory.imageUrl ? [catalogCategory.imageUrl] : [],
          type: "website",
        }
      : undefined,
  };
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { slug } = await params;
  const queryParams = await searchParams;
  
  const parsedQuery = productQuerySchema.parse({
    category: slug,
    q: queryParams.q,
    brand: queryParams.brand,
    minPrice: queryParams.minPrice,
    maxPrice: queryParams.maxPrice,
    minRating: queryParams.minRating,
    discountOnly: queryParams.discountOnly,
    inStockOnly: queryParams.inStockOnly,
    sort: queryParams.sort,
    page: queryParams.page,
  });

  const [category, categories, brands, productsData] = await Promise.all([
    getCatalogCategoryBySlug(slug),
    listCategories(),
    listBrands(),
    listProducts(parsedQuery)
  ]);

  if (!category) {
    notFound();
  }

  const mappedProducts = productsData.items.map((p) => ({
    ...p,
    photo: p.photos?.[0] ?? null,
    brand: p.brand ? { name: p.brand.name, slug: p.brand.slug } : null,
    category: p.category ? { name: p.category.name, slug: p.category.slug } : null,
  }));

  const topRated = mappedProducts.reduce((best, product) => ((product.ratingAvg ?? 0) > best ? (product.ratingAvg ?? 0) : best), 0);

  return (
    <div className="container-page py-8">
      <section className="summit-dark relative mb-6 overflow-hidden rounded-xl border border-white/10">
        <DesignParticles />
        <Image src={category.imageUrl ?? "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4"} alt={category.name} fill priority className="object-cover opacity-35" sizes="100vw" />
        <div className="absolute inset-0 bg-[var(--green-house)]/78" />
        <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <Badge variant="accent">Kategori</Badge>
            <h1 className="mt-3 text-3xl font-medium capitalize tracking-[-0.03em] sm:text-5xl">{category.name}</h1>
            <p className="mt-3 max-w-2xl text-sm text-primary-foreground/82 sm:text-base">{category.metaDescription ?? category.name}</p>
          </div>
          <Card className="bg-primary-foreground/95 text-foreground">
            <CardContent className="grid gap-3 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Boxes className="size-4" /> Produk
                </span>
                <span className="font-semibold">{productsData.pagination.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Star className="size-4" /> Rating tertinggi
                </span>
                <span className="font-semibold">{topRated || "-"} </span>
              </div>
              <Button asChild>
                <Link href="/produk">
                  Lihat semua produk <ArrowRight />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {categories.map((item) => (
          <Button key={item.slug} variant={item.slug === category.slug ? "default" : "outline"} size="sm" asChild>
            <Link href={`/kategori/${item.slug}`}>{item.name}</Link>
          </Button>
        ))}
      </div>

      <CatalogPageClient 
        products={mappedProducts} 
        categories={categories.map((c) => ({ ...c, productCount: c._count.products }))} 
        brands={brands} 
        initialCategorySlug={category.slug} 
        initialFilters={{
          categorySlugs: typeof queryParams.category === "string" ? [queryParams.category] : [],
          brands: typeof queryParams.brand === "string" ? [queryParams.brand] : [],
          minPrice: typeof queryParams.minPrice === "string" ? queryParams.minPrice : "",
          maxPrice: typeof queryParams.maxPrice === "string" ? queryParams.maxPrice : "",
          minRating: typeof queryParams.minRating === "string" ? queryParams.minRating : "",
          discountOnly: queryParams.discountOnly === "true",
          inStockOnly: queryParams.inStockOnly === "true",
        }}
        initialSort={typeof queryParams.sort === "string" ? queryParams.sort : "newest"}
        initialSearch={typeof queryParams.q === "string" ? queryParams.q : ""}
      />
    </div>
  );
}
