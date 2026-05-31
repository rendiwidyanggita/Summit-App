"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, PackageX, ShieldCheck, ShoppingBag, TicketPercent, Truck } from "lucide-react";

import { CartItemRow } from "@/components/sections/cart-item-row";
import { OrderSummary } from "@/components/sections/order-summary";
import { RouteStatePanel } from "@/components/sections/route-state-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { initialCartItems, type CartItemMock } from "@/lib/commerce-mock";

export function CartPageClient() {
  const [items, setItems] = useState<CartItemMock[]>(initialCartItems);

  function updateQuantity(id: string, quantity: number) {
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, quantity: Math.min(Math.max(quantity, 1), item.variant.stock) } : item)),
    );
  }

  function removeItem(id: string) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-8">
        <RouteStatePanel
          icon={PackageX}
          eyebrow="Keranjang"
          title="Keranjang kosong"
          description="Item berhasil dihapus. Jelajahi katalog Sprint 3 untuk memilih gear pendakian baru."
          actions={
            <Button asChild>
              <Link href="/produk">Lihat produk</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <section className="relative mb-6 overflow-hidden rounded-[2rem_1rem_2rem_1rem] border bg-primary text-primary-foreground shadow-sm">
        <div className="absolute -right-20 -top-20 size-56 rounded-full bg-accent/25 blur-2xl" />
        <div className="relative grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Badge variant="accent">Sprint 4 Cart</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">Keranjang Pendakian</h1>
            <p className="mt-3 max-w-2xl text-sm text-primary-foreground/80 sm:text-base">
              Review item, sesuaikan quantity, cek estimasi berat, lalu lanjut ke checkout mock tanpa menyentuh backend.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm lg:max-w-sm">
            <span className="rounded-full bg-white/12 px-3 py-2">Reserved stock UI</span>
            <span className="rounded-full bg-white/12 px-3 py-2">Voucher Sprint 4</span>
            <span className="rounded-full bg-white/12 px-3 py-2">Ongkir mock</span>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-4">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} onQuantityChange={updateQuantity} onRemove={removeItem} />
          ))}
          <div className="grid gap-3 rounded-[1.25rem] border bg-[linear-gradient(135deg,var(--secondary),var(--background))] p-4 text-sm sm:grid-cols-3">
            {[
              { icon: TicketPercent, text: "Coba voucher SUMMIT50 atau FREEONGKIR di checkout." },
              { icon: Truck, text: "Ongkir dihitung dari total berat dan layanan kurir mock." },
              { icon: ShieldCheck, text: "Reserved stock final tetap harus divalidasi backend." },
            ].map((item) => (
              <div key={item.text} className="flex gap-3">
                <item.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <OrderSummary
            items={items}
            action={
              <Button asChild>
                <Link href="/checkout">
                  Lanjut checkout <ArrowRight />
                </Link>
              </Button>
            }
          />
          <Button variant="outline" className="mt-3 w-full" asChild>
            <Link href="/produk">
              <ShoppingBag /> Tambah gear lain
            </Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
