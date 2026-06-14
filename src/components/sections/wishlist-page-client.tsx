"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Loader2, PackageCheck, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/api-client";
import type { WishlistItem } from "@/lib/trust-types";
import { formatRupiah } from "@/lib/utils";

export function WishlistPageClient() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try { setItems(await apiRequest<WishlistItem[]>("/api/wishlist")); } catch (error) { toast.error(error instanceof Error ? error.message : "Wishlist gagal dimuat."); } finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  async function remove(productId: string) {
    try { await apiRequest(`/api/wishlist/${productId}`, { method: "DELETE" }); setItems((current) => current.filter((item) => item.product.id !== productId)); toast.success("Produk dihapus dari wishlist."); } catch (error) { toast.error(error instanceof Error ? error.message : "Wishlist gagal diperbarui."); }
  }

  if (loading) return <div className="grid min-h-48 place-items-center"><Loader2 className="animate-spin text-primary" /></div>;
  return <div className="grid gap-5">
    <div className="grid gap-4 md:grid-cols-3">
      <Metric icon={Heart} value={items.length} label="Produk favorit" />
      <Metric icon={Tag} value={items.filter((item) => item.product.compareAt > item.product.price).length} label="Sedang diskon" />
      <Metric icon={PackageCheck} value={items.filter((item) => item.product.stock > 0).length} label="Stok tersedia" />
    </div>
    {!items.length ? <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Wishlist masih kosong. Tambahkan produk dari halaman detail produk.</CardContent></Card> : null}
    <div className="grid gap-4 lg:grid-cols-2">{items.map((item) => <Card key={item.id}><CardContent className="grid gap-4 p-4 sm:grid-cols-[140px_1fr]">
      <Link href={`/produk/${item.product.slug}`} className="relative aspect-square overflow-hidden rounded-lg bg-secondary">{item.product.photo ? <Image src={item.product.photo} alt={item.product.name} fill className="object-cover" sizes="140px" /> : null}</Link>
      <div><div className="flex gap-2"><Badge variant={item.product.stock ? "secondary" : "destructive"}>{item.product.stock ? `${item.product.stock} stok` : "Habis"}</Badge>{item.product.compareAt > item.product.price ? <Badge variant="accent">Diskon</Badge> : null}</div>
      <Link href={`/produk/${item.product.slug}`} className="mt-3 block text-lg font-semibold hover:text-primary">{item.product.name}</Link>
      <p className="text-sm text-muted-foreground">{item.product.brand} · ditambahkan {new Date(item.createdAt).toLocaleDateString("id-ID")}</p>
      <div className="mt-3 font-semibold">{formatRupiah(item.product.price)}</div>
      <div className="mt-4 flex gap-2"><Button asChild><Link href={`/produk/${item.product.slug}`}>Lihat produk</Link></Button><Button variant="outline" onClick={() => void remove(item.product.id)}><Trash2 />Hapus</Button></div></div>
    </CardContent></Card>)}</div>
  </div>;
}

function Metric({ icon: Icon, value, label }: { icon: typeof Heart; value: number; label: string }) {
  return <div className="rounded-lg border bg-card p-4"><Icon className="size-5 text-primary" /><div className="mt-3 text-2xl font-semibold">{value}</div><div className="text-sm text-muted-foreground">{label}</div></div>;
}
