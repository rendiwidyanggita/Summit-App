import Image from "next/image";
import { notFound } from "next/navigation";
import { Heart, ShoppingCart, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { featuredProducts } from "@/lib/constants";
import { formatRupiah } from "@/lib/utils";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = featuredProducts.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container-page grid gap-8 py-8 lg:grid-cols-[1fr_0.9fr]">
      <div className="relative aspect-square overflow-hidden rounded-lg border bg-secondary">
        <Image src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80" alt={product.name} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
      <div>
        <Badge variant="secondary">{product.category}</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-normal">{product.name}</h1>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="size-4 fill-accent text-accent" /> {product.rating} rating awal
        </div>
        <div className="mt-6 text-3xl font-semibold">{formatRupiah(product.price)}</div>
        {product.compareAt > 0 ? <div className="mt-1 text-sm text-muted-foreground line-through">{formatRupiah(product.compareAt)}</div> : null}
        <Card className="mt-6">
          <CardContent className="grid gap-3 p-5 text-sm text-muted-foreground">
            <p>Halaman detail ini adalah foundation UI untuk multi-foto, varian, stok, berat, SEO metadata, dan CTA add to cart.</p>
            <p>Business logic add to cart, wishlist, review, dan rekomendasi produk masuk sprint berikutnya.</p>
          </CardContent>
        </Card>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button disabled>
            <ShoppingCart /> Add to Cart Sprint 2
          </Button>
          <Button variant="outline" disabled>
            <Heart /> Wishlist Sprint 7
          </Button>
        </div>
      </div>
    </div>
  );
}
