"use client";

import Image from "next/image";
import Link from "next/link";
import { BellRing, Heart, PackageCheck, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { wishlistItems } from "@/lib/support-trust-data";
import { formatRupiah } from "@/lib/utils";

export function WishlistPageClient() {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <Heart className="size-5 text-primary" />
          <div className="mt-3 text-2xl font-semibold">{wishlistItems.length}</div>
          <div className="text-sm text-muted-foreground">Produk favorit mock</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <Tag className="size-5 text-primary" />
          <div className="mt-3 text-2xl font-semibold">{wishlistItems.filter((item) => item.priceDrop > 0).length}</div>
          <div className="text-sm text-muted-foreground">Punya price drop</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <BellRing className="size-5 text-primary" />
          <div className="mt-3 text-2xl font-semibold">{wishlistItems.filter((item) => item.notify).length}</div>
          <div className="text-sm text-muted-foreground">Notifikasi diskon aktif</div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {wishlistItems.map((item, index) => (
          <Card key={item.id} className={index === 0 ? "overflow-hidden border-primary/35 lg:col-span-2" : "overflow-hidden"}>
            <CardContent className={`grid gap-4 p-4 ${index === 0 ? "sm:grid-cols-[220px_1fr]" : "sm:grid-cols-[140px_1fr]"}`}>
              <Link href={`/produk/${item.product.slug}`} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-secondary sm:aspect-square">
                <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover transition-transform hover:scale-105" sizes="180px" />
              </Link>
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  {item.priceDrop > 0 ? <Badge variant="accent">Diskon {item.priceDrop}%</Badge> : <Badge variant="secondary">Harga stabil</Badge>}
                  <Badge variant={item.product.stock > 0 ? "secondary" : "destructive"}>{item.product.stock > 0 ? `${item.product.stock} stok` : "Habis"}</Badge>
                </div>
                <Link href={`/produk/${item.product.slug}`} className={`${index === 0 ? "text-2xl" : "text-lg"} mt-3 block font-semibold hover:text-primary`}>
                  {item.product.name}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">{item.product.brand} - ditambahkan {item.addedAt}</p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <div className="font-semibold">{formatRupiah(item.product.price)}</div>
                    {item.product.compareAt > item.product.price ? <div className="text-xs text-muted-foreground line-through">{formatRupiah(item.product.compareAt)}</div> : null}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <PackageCheck className="size-3.5" />
                    {item.product.sold} terjual
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild>
                    <Link href={`/produk/${item.product.slug}`}>Lihat produk</Link>
                  </Button>
                  <Button variant="outline" disabled>Hapus mock</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-[1.25rem] border border-accent/40 bg-accent/10 p-4 text-sm text-muted-foreground">
        Wishlist persistence dan notifikasi price drop real belum memanggil backend. UI ini menyiapkan kontrak Sprint 7 sesuai PRD.
      </div>
    </div>
  );
}
