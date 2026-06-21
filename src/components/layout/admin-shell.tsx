"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search, Globe } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { adminNav } from "@/lib/constants";
import { adminNavPermissions } from "@/lib/rbac";
import { cn } from "@/lib/utils";

function AdminNav({ permissions }: { permissions: string[] }) {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1">
      {adminNav.filter((item) => {
        const required = adminNavPermissions[item.href];
        return !required || permissions.includes(required);
      }).map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
              active && "bg-white text-primary shadow-sm",
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

export function AdminShell({ children, permissions }: { children: React.ReactNode; permissions: string[] }) {
  return (
    <div className="min-h-screen bg-background">
      <SkipToContent />
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r bg-secondary/80 backdrop-blur lg:flex">
        <div className="flex h-[72px] items-center gap-2 border-b px-5">
          <Image src="/logo.png" alt="Summit Gear Logo" width={36} height={36} className="rounded-full border bg-white p-1" />
          <div>
            <div className="font-semibold">Summit Gear</div>
            <div className="text-xs text-muted-foreground">Admin Backoffice</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <AdminNav permissions={permissions} />
        </div>
        <div className="border-t p-4">
          <Link href="/" className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
            <Globe className="size-4" />
            Website Utama
          </Link>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="summit-nav-shadow sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Buka menu admin">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col">
              <SheetHeader>
                <SheetTitle>Admin Backoffice</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex-1 overflow-y-auto">
                <AdminNav permissions={permissions} />
              </div>
              <div className="mt-auto border-t pt-4">
                <Link href="/" className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <Globe className="size-4" />
                  Website Utama
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          <div className="relative hidden w-full max-w-md sm:block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Cari produk, order, customer..." aria-label="Cari data admin Summit Gear" />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifikasi admin">
              <Bell />
            </Button>
            <Link href="/akun/profil" aria-label="Profil Admin">
              <Avatar className="transition-all hover:ring-2 hover:ring-primary hover:ring-offset-2">
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>
        <main id="main-content" className="p-4 sm:p-6" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
