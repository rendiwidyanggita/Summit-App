import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PackageCheck, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductListItem } from "@/lib/product-types";
import { formatRupiah } from "@/lib/utils";

export function ProductCard({ product }: { product: ProductListItem }) {
  const discount = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const currentPrice = product.discountPrice ?? product.price;
  return (
    <Card className="group relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
      <div className="absolute inset-x-0 top-0 z-10 h-1 bg-primary" />
      <Link href={`/produk/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-secondary">
        <Image
          src={product.photo ?? "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          {discount > 0 ? <Badge variant="accent">-{discount}%</Badge> : product.isFeatured ? <Badge>Unggulan</Badge> : <span />}
        </div>
      </Link>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-h-32">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-medium uppercase text-muted-foreground">{product.category?.name ?? "Produk"}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="size-3.5 fill-accent text-accent" />
              {product.ratingAvg ?? 0}
            </div>
          </div>
          <Link href={`/produk/${product.slug}`} className="mt-1 line-clamp-2 min-h-12 font-semibold hover:text-primary">
            {product.name}
          </Link>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{product.brand?.name ?? "Lainnya"}</span>
            <span className="size-1 rounded-full bg-muted-foreground/40" />
            <span>{product.soldCount} terjual</span>
          </div>
        </div>
        <div className="mt-auto flex min-h-12 items-end justify-between gap-3">
          <div>
            <div className="font-semibold">{formatRupiah(currentPrice)}</div>
            <div className={product.discountPrice ? "text-xs text-muted-foreground line-through" : "invisible text-xs"}>
              {product.discountPrice ? formatRupiah(product.price) : "Harga pembanding"}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <PackageCheck className="size-3.5" />
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/produk/${product.slug}`}>
            Lihat detail <ArrowRight />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
