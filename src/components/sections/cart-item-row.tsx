"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CartItemMock } from "@/lib/commerce-mock";
import { formatRupiah } from "@/lib/utils";

export function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartItemMock;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 rounded-lg border bg-card p-4 shadow-sm sm:grid-cols-[112px_1fr_auto] sm:items-center">
      <Link href={`/produk/${item.product.slug}`} className="relative aspect-square overflow-hidden rounded-md bg-secondary sm:size-28">
        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="112px" />
      </Link>
      <div className="min-w-0">
        <div className="text-xs font-medium uppercase text-muted-foreground">{item.product.category}</div>
        <Link href={`/produk/${item.product.slug}`} className="mt-1 block font-semibold hover:text-primary">
          {item.product.name}
        </Link>
        <div className="mt-1 text-sm text-muted-foreground">
          {item.variant.name} · {item.variant.sku}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>{item.product.weightGram} gram/item</span>
          <span className="size-1 self-center rounded-full bg-muted-foreground/40" />
          <span>Stok mock {item.variant.stock}</span>
        </div>
      </div>
      <div className="grid gap-3 sm:justify-items-end">
        <div className="font-semibold">{formatRupiah(item.product.price * item.quantity)}</div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon" onClick={() => onQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Kurangi quantity">
            <Minus />
          </Button>
          <div className="grid h-10 min-w-12 place-items-center rounded-md border bg-background px-3 text-sm font-medium">{item.quantity}</div>
          <Button type="button" variant="outline" size="icon" onClick={() => onQuantityChange(item.id, item.quantity + 1)} disabled={item.quantity >= item.variant.stock} aria-label="Tambah quantity">
            <Plus />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(item.id)} aria-label="Hapus item">
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  );
}
