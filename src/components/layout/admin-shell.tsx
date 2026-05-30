"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { adminNav } from "@/lib/constants";
import { cn } from "@/lib/utils";

function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1">
      {adminNav.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
              active && "bg-secondary text-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r bg-card lg:block">
        <div className="flex h-16 items-center gap-2 border-b px-5">
          <span className="grid size-9 place-items-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">SG</span>
          <div>
            <div className="font-semibold">Summit Gear</div>
            <div className="text-xs text-muted-foreground">Admin Backoffice</div>
          </div>
        </div>
        <div className="p-4">
          <AdminNav />
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Buka menu admin">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle>Admin Backoffice</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <AdminNav />
              </div>
            </SheetContent>
          </Sheet>

          <div className="relative hidden w-full max-w-md sm:block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Cari produk, order, customer..." />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifikasi admin">
              <Bell />
            </Button>
            <Avatar>
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
