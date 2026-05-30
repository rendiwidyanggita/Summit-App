"use client";

import Link from "next/link";
import { Menu, Search, ShoppingCart, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { customerNav } from "@/lib/constants";

export function CustomerHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Buka navigasi">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Summit Gear</SheetTitle>
            </SheetHeader>
            <nav className="mt-8 grid gap-2">
              {customerNav.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex min-w-fit items-center gap-2 font-semibold text-primary">
          <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">SG</span>
          <span className="hidden sm:inline">Summit Gear</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {customerNav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden min-w-64 max-w-sm flex-1 items-center lg:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Cari tenda, carrier, headlamp..." />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <Button variant="ghost" size="icon" aria-label="Keranjang" asChild>
            <Link href="/keranjang">
              <ShoppingCart />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Akun" asChild>
            <Link href="/akun/profil">
              <UserRound />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
