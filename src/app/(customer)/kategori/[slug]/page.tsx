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
import { categoryCatalog, getCategoryBySlug, getProductsByCategory } from "@/lib/constants";
import { getCategoryBySlug as getCatalogCategoryBySlug } from "@/lib/server/catalog-service";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const catalogCategory = await getCatalogCategoryBySlug(slug);
  const fallbackCategory = getCategoryBySlug(slug);

  return {
    title: catalogCategory?.metaTitle ?? (fallbackCategory ? `${fallbackCategory.name} Pendakian` : "Kategori"),
    description: catalogCategory?.metaDescription ?? fallbackCategory?.description ?? "Kategori produk Summit Gear.",
    alternates: {
      canonical: `/kategori/${slug}`,
    },
    openGraph: fallbackCategory
      ? {
          title: `${fallbackCategory.name} Pendakian`,
          description: fallbackCategory.description,
          images: [fallbackCategory.image],
          type: "website",
        }
      : undefined,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = getProductsByCategory(category.slug);
  const topRated = products.reduce((best, product) => (product.rating > best ? product.rating : best), 0);

  return (
    <div className="container-page py-8">
      <section className="summit-dark relative mb-6 overflow-hidden rounded-xl border border-white/10">
        <DesignParticles />
        <Image src={category.image} alt={category.name} fill priority className="object-cover opacity-35" sizes="100vw" />
        <div className="absolute inset-0 bg-[var(--green-house)]/78" />
        <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <Badge variant="accent">{category.highlight}</Badge>
            <h1 className="mt-3 text-3xl font-medium capitalize tracking-[-0.03em] sm:text-5xl">{category.name}</h1>
            <p className="mt-3 max-w-2xl text-sm text-primary-foreground/82 sm:text-base">{category.description}</p>
          </div>
          <Card className="bg-primary-foreground/95 text-foreground">
            <CardContent className="grid gap-3 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Boxes className="size-4" /> Produk
                </span>
                <span className="font-semibold">{products.length}</span>
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
        {categoryCatalog.map((item) => (
          <Button key={item.slug} variant={item.slug === category.slug ? "default" : "outline"} size="sm" asChild>
            <Link href={`/kategori/${item.slug}`}>{item.name}</Link>
          </Button>
        ))}
      </div>

      <CatalogPageClient products={products} initialCategorySlug={category.slug} />
    </div>
  );
}
