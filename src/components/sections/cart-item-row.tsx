"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CartItemResponse } from "@/lib/commerce-types";
import { formatRupiah } from "@/lib/utils";

function variantLabel(item: CartItemResponse) {
  if (!item.variant) return "Varian tidak tersedia";
  return [item.variant.size, item.variant.color].filter(Boolean).join(" / ") || item.variant.sku;
}

export function CartItemRow({
  item,
  busy,
  selected,
  onSelect,
  onQuantityChange,
  onRemove,
}: {
  item: CartItemResponse;
  busy?: boolean;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  const stock = item.variant?.stock ?? item.quantity;

  return (
    <div className="flex gap-4 rounded-lg border bg-card p-4 shadow-sm items-center sm:grid-cols-[auto_112px_1fr_auto] sm:grid">
      <input 
        type="checkbox" 
        className="size-5 cursor-pointer accent-primary" 
        checked={selected} 
        onChange={(e) => onSelect(item.id, e.target.checked)} 
      />
      <Link href={`/produk/${item.product.slug}`} className="relative aspect-square overflow-hidden rounded-md bg-secondary sm:size-28">
        <Image src={item.product.photo ?? "/icon.svg"} alt={item.product.name} fill className="object-cover" sizes="112px" />
      </Link>
      <div className="min-w-0">
        <div className="text-xs font-medium uppercase text-muted-foreground">{item.product.category?.name ?? "Produk"}</div>
        <Link href={`/produk/${item.product.slug}`} className="mt-1 block font-semibold hover:text-primary">
          {item.product.name}
        </Link>
        <div className="mt-1 text-sm text-muted-foreground">
          {variantLabel(item)} - {item.variant?.sku ?? "-"}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>{item.product.weightGram} gram/item</span>
          <span className="size-1 self-center rounded-full bg-muted-foreground/40" />
          <span>Stok {stock}</span>
        </div>
      </div>
      <div className="grid gap-3 sm:justify-items-end">
        <div className="font-semibold">{formatRupiah(item.lineSubtotal)}</div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon" onClick={() => onQuantityChange(item.id, item.quantity - 1)} disabled={busy || item.quantity <= 1} aria-label="Kurangi quantity">
            {busy ? <Loader2 className="animate-spin" /> : <Minus />}
          </Button>
          <div className="grid h-10 min-w-12 place-items-center rounded-md border bg-background px-3 text-sm font-medium">{item.quantity}</div>
          <Button type="button" variant="outline" size="icon" onClick={() => onQuantityChange(item.id, item.quantity + 1)} disabled={busy || item.quantity >= stock} aria-label="Tambah quantity">
            <Plus />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(item.id)} disabled={busy} aria-label="Hapus item">
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  );
}
