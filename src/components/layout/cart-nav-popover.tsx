"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useCart } from "@/contexts/cart-context";
import { formatRupiah } from "@/lib/utils";

export function CartNavPopover() {
  const { cart } = useCart();

  const totalItems = cart?.summary.totalQuantity ?? 0;
  const subtotal = cart?.summary.subtotal ?? 0;

  return (
    <HoverCard openDelay={200} closeDelay={300}>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Keranjang" asChild className="relative">
          <Link href="/keranjang">
            <ShoppingCart />
            {totalItems > 0 && (
              <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {totalItems}
              </span>
            )}
          </Link>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="font-semibold text-sm">Keranjang Belanja</h4>
          <span className="text-xs text-muted-foreground">{totalItems} Barang</span>
        </div>
        
        <div className="grid max-h-[300px] gap-2 overflow-y-auto p-4">
          {!cart || cart.items.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">Keranjang Anda kosong.</div>
          ) : (
            cart.items.slice(0, 5).map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="relative size-12 shrink-0 overflow-hidden rounded bg-secondary">
                  {item.product.photo && <Image src={item.product.photo} alt={item.product.name} fill className="object-cover" sizes="48px" />}
                </div>
                <div className="grid flex-1 gap-1">
                  <div className="line-clamp-1 text-sm font-medium">{item.product.name}</div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{item.quantity} x {formatRupiah(item.unitPrice)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cart && cart.items.length > 0 && (
          <div className="border-t bg-muted/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Subtotal</span>
              <span className="text-sm font-bold text-primary">{formatRupiah(subtotal)}</span>
            </div>
            <Button className="w-full" asChild>
              <Link href="/keranjang">Lihat Keranjang Lengkap</Link>
            </Button>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
