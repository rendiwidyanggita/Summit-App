import Link from "next/link";
import Image from "next/image";
import { PackageCheck, ShoppingCart, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDiscountPercent, type ProductCatalogItem } from "@/lib/constants";
import { formatRupiah } from "@/lib/utils";

export function ProductCard({ product }: { product: ProductCatalogItem }) {
  const discount = getDiscountPercent(product);

  return (
    <Card className="group overflow-hidden">
      <Link href={`/produk/${product.slug}`} className="relative block aspect-square overflow-hidden bg-secondary">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          {discount > 0 ? <Badge variant="accent">-{discount}%</Badge> : product.isNew ? <Badge>Baru</Badge> : <span />}
          <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>{product.stock > 0 ? `${product.stock} stok` : "Habis"}</Badge>
        </div>
      </Link>
      <CardContent className="grid gap-3 p-4">
        <div className="min-h-24">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-medium uppercase text-muted-foreground">{product.category}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="size-3.5 fill-accent text-accent" />
              {product.rating}
            </div>
          </div>
          <Link href={`/produk/${product.slug}`} className="mt-1 line-clamp-2 font-semibold hover:text-primary">
            {product.name}
          </Link>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{product.brand}</span>
            <span className="size-1 rounded-full bg-muted-foreground/40" />
            <span>{product.sold} terjual</span>
          </div>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="font-semibold">{formatRupiah(product.price)}</div>
            {product.compareAt > product.price ? <div className="text-xs text-muted-foreground line-through">{formatRupiah(product.compareAt)}</div> : null}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <PackageCheck className="size-3.5" />
            {Math.round(product.weightGram / 100) / 10} kg
          </div>
        </div>
        <Button variant="outline" disabled>
          <ShoppingCart /> Add to Cart Sprint 4
        </Button>
      </CardContent>
    </Card>
  );
}
