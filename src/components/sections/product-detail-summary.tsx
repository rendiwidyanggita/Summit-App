import { Heart, PackageCheck, Ruler, ShieldCheck, ShoppingCart, Star, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDiscountPercent, type ProductCatalogItem } from "@/lib/constants";
import { formatRupiah } from "@/lib/utils";

export function ProductDetailSummary({ product }: { product: ProductCatalogItem }) {
  const discount = getDiscountPercent(product);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{product.category}</Badge>
        {discount > 0 ? <Badge variant="accent">Diskon {discount}%</Badge> : null}
        {product.isNew ? <Badge>Produk baru</Badge> : null}
      </div>
      <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl">{product.name}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>{product.brand}</span>
        <span className="size-1 rounded-full bg-muted-foreground/40" />
        <span className="flex items-center gap-1">
          <Star className="size-4 fill-accent text-accent" /> {product.rating} rating
        </span>
        <span className="size-1 rounded-full bg-muted-foreground/40" />
        <span>{product.sold} terjual</span>
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="h-1 bg-[linear-gradient(90deg,var(--primary),var(--accent))]" />
        <CardContent className="p-5">
          <div className="text-3xl font-semibold">{formatRupiah(product.price)}</div>
          {product.compareAt > product.price ? <div className="mt-1 text-sm text-muted-foreground line-through">{formatRupiah(product.compareAt)}</div> : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md bg-secondary p-3 text-sm">
              <PackageCheck className="mb-2 size-4 text-primary" />
              {product.stock > 0 ? `${product.stock} stok tersedia` : "Stok habis"}
            </div>
            <div className="rounded-md bg-secondary p-3 text-sm">
              <Ruler className="mb-2 size-4 text-primary" />
              {product.weightGram} gram
            </div>
            <div className="rounded-md bg-secondary p-3 text-sm">
              <ShieldCheck className="mb-2 size-4 text-primary" />
              COD mengikuti rule Sprint 4
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="text-base">Pilih varian</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {product.variants.map((variant) => (
            <Button key={variant.sku} type="button" variant="outline" disabled={variant.stock === 0}>
              {variant.name} ({variant.stock})
            </Button>
          ))}
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button disabled>
          <ShoppingCart /> Add to Cart Sprint 4
        </Button>
        <Button variant="outline" disabled>
          <Heart /> Wishlist Sprint 7
        </Button>
      </div>

      <div className="mt-5 grid gap-3 rounded-lg bg-primary p-4 text-sm text-primary-foreground sm:grid-cols-2">
        <div className="flex gap-3">
          <Truck className="mt-0.5 size-4 shrink-0 text-accent" />
          <span>Ongkir real-time disiapkan untuk RajaOngkir/BinderByte pada Sprint 4.</span>
        </div>
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />
          <span>Reserved stock dan checkout aman masuk setelah cart aktif.</span>
        </div>
      </div>
    </div>
  );
}
