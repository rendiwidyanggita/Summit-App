"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Search, Settings, ShoppingCart, UserRound } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CartNavPopover } from "@/components/layout/cart-nav-popover";
import { customerNav } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CustomerHeader({
  user,
}: {
  user?: {
    name: string | null;
    email: string | null;
    isAdmin: boolean;
  } | null;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href.split("/")[1] === "kategori" ? "/kategori" : href));

  return (
    <header className="summit-nav-shadow sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-3 md:h-[72px]">
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
              {customerNav.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn("rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground", active && "bg-white text-primary shadow-sm")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex min-w-fit items-center gap-2 font-semibold text-[var(--summit-green)]">
          <Image src="/logo.png" alt="Summit Gear Logo" width={36} height={36} className="rounded-full border bg-white p-1" />
          <span className="hidden sm:inline">Summit Gear</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {customerNav.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn("rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground", active && "bg-white text-primary shadow-sm")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden min-w-64 max-w-sm flex-1 items-center lg:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Cari tenda, carrier, headlamp..." aria-label="Cari produk Summit Gear" />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <CartNavPopover />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="px-3" aria-label="Menu akun">
                  <UserRound />
                  <span className="hidden sm:inline">{user.name || "Akun"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <div className="truncate text-sm font-medium">{user.name || "Summit Customer"}</div>
                  <div className="truncate text-xs text-muted-foreground">{user.email}</div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/akun/profil">
                    <UserRound className="size-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                {user.isAdmin ? (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Settings className="size-4" />
                      Admin
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ redirectTo: "/" })}>
                  <LogOut className="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" className="px-3" aria-label="Masuk akun" asChild>
              <Link href="/masuk">
                <UserRound />
                <span className="hidden sm:inline">Masuk</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
