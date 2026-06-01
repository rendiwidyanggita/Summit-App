"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2, Minus, PackageCheck, Plus, Ruler, ShieldCheck, ShoppingCart, Star, Truck } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiRequestError, apiRequest } from "@/lib/api-client";
import type { CartResponse } from "@/lib/commerce-types";
import { cn, formatRupiah } from "@/lib/utils";

export type ProductDetailViewProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  compareAt: number | null;
  stock: number;
  weightGram: number;
  rating: number | null;
  sold: number;
  isNew: boolean;
  variants: Array<{
    id: string;
    label: string;
    sku: string;
    stock: number;
    priceModifier: number;
  }>;
};

function getDiscountPercent(product: ProductDetailViewProduct) {
  if (!product.compareAt || product.compareAt <= product.price) return 0;
  return Math.round(((product.compareAt - product.price) / product.compareAt) * 100);
}

export function ProductDetailSummary({ product }: { product: ProductDetailViewProduct }) {
  const router = useRouter();
  const availableVariants = product.variants.filter((variant) => variant.stock > 0);
  const [selectedVariantId, setSelectedVariantId] = useState(availableVariants[0]?.id ?? product.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId) ?? product.variants[0];
  const discount = getDiscountPercent(product);
  const unitPrice = useMemo(() => product.price + (selectedVariant?.priceModifier ?? 0), [product.price, selectedVariant?.priceModifier]);
  const canAddToCart = Boolean(selectedVariant) && selectedVariant.stock > 0 && quantity > 0;

  function updateQuantity(nextQuantity: number) {
    const max = Math.max(1, selectedVariant?.stock ?? 1);
    setQuantity(Math.min(Math.max(nextQuantity, 1), max));
  }

  async function addToCart() {
    if (!selectedVariant) return;
    setLoading(true);

    try {
      await apiRequest<CartResponse>("/api/cart", {
        method: "POST",
        body: JSON.stringify({
          productSlug: product.slug,
          variantId: selectedVariant.id,
          quantity,
        }),
      });

      toast.success("Produk ditambahkan ke keranjang.");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        router.push(`/masuk?callbackUrl=/produk/${product.slug}`);
        return;
      }

      toast.error(error instanceof Error ? error.message : "Gagal menambahkan produk ke keranjang.");
    } finally {
      setLoading(false);
    }
  }

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
          <Star className="size-4 fill-accent text-accent" /> {product.rating?.toFixed(1) ?? "-"} rating
        </span>
        <span className="size-1 rounded-full bg-muted-foreground/40" />
        <span>{product.sold} terjual</span>
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="h-1 bg-[linear-gradient(90deg,var(--primary),var(--accent))]" />
        <CardContent className="p-5">
          <div className="text-3xl font-semibold">{formatRupiah(unitPrice)}</div>
          {product.compareAt && product.compareAt > product.price ? <div className="mt-1 text-sm text-muted-foreground line-through">{formatRupiah(product.compareAt)}</div> : null}
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
          {product.variants.map((variant) => {
            const active = variant.id === selectedVariantId;

            return (
              <Button
                key={variant.id}
                type="button"
                variant={active ? "default" : "outline"}
                disabled={variant.stock === 0}
                onClick={() => {
                  setSelectedVariantId(variant.id);
                  setQuantity(1);
                }}
                className={cn(active && "shadow-sm")}
              >
                {variant.label} ({variant.stock})
              </Button>
            );
          })}
        </CardContent>
      </Card>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon" onClick={() => updateQuantity(quantity - 1)} disabled={quantity <= 1} aria-label="Kurangi quantity">
            <Minus />
          </Button>
          <div className="grid h-10 min-w-12 place-items-center rounded-md border bg-background px-3 text-sm font-medium">{quantity}</div>
          <Button type="button" variant="outline" size="icon" onClick={() => updateQuantity(quantity + 1)} disabled={!selectedVariant || quantity >= selectedVariant.stock} aria-label="Tambah quantity">
            <Plus />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">Maksimal {selectedVariant?.stock ?? 0} item untuk varian ini.</span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button type="button" disabled={!canAddToCart || loading} onClick={addToCart}>
          {loading ? <Loader2 className="animate-spin" /> : <ShoppingCart />}
          Tambah ke keranjang
        </Button>
        <Button variant="outline" disabled>
          <Heart /> Wishlist mock
        </Button>
      </div>

      <div className="mt-5 grid gap-3 rounded-lg bg-primary p-4 text-sm text-primary-foreground sm:grid-cols-2">
        <div className="flex gap-3">
          <Truck className="mt-0.5 size-4 shrink-0 text-accent" />
          <span>Ongkir dihitung dari alamat dan berat cart pada checkout Sprint 4.</span>
        </div>
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />
          <span>Wishlist, review, dan trust signal tetap mock sampai Sprint 7.</span>
        </div>
      </div>
    </div>
  );
}
