import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";

type ProductCardProps = {
  product: {
    name: string;
    slug: string;
    category: string;
    brand: string;
    price: number;
    compareAt: number;
    stock: number;
    rating: number;
  };
};

const productImages = [
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=900&q=80",
];

export function ProductCard({ product }: ProductCardProps) {
  const image = productImages[Math.abs(product.slug.length) % productImages.length];

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square bg-secondary">
        <Image src={image} alt={product.name} fill className="object-cover" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
        {product.compareAt > product.price ? <Badge variant="accent" className="absolute left-3 top-3">Diskon</Badge> : null}
      </div>
      <CardContent className="grid gap-3 p-4">
        <div className="min-h-20">
          <div className="text-xs font-medium uppercase text-muted-foreground">{product.category}</div>
          <Link href={`/produk/${product.slug}`} className="mt-1 line-clamp-2 font-semibold hover:text-primary">
            {product.name}
          </Link>
          <div className="mt-1 text-sm text-muted-foreground">{product.brand}</div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-semibold">{formatRupiah(product.price)}</div>
            {product.compareAt > 0 ? <div className="text-xs text-muted-foreground line-through">{formatRupiah(product.compareAt)}</div> : null}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="size-4 fill-accent text-accent" />
            {product.rating}
          </div>
        </div>
        <Button variant="outline" disabled>
          Add to Cart Sprint 2
        </Button>
      </CardContent>
    </Card>
  );
}
