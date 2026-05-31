"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CheckCircle2, Heart, Home, MapPin, MessageSquareWarning, PackageSearch, RotateCcw, ShieldCheck, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const accountNav = [
  { href: "/akun/profil", label: "Profil", icon: UserRound },
  { href: "/akun/alamat", label: "Alamat", icon: MapPin },
  { href: "/akun/pesanan", label: "Pesanan", icon: PackageSearch },
  { href: "/akun/wishlist", label: "Wishlist", icon: Heart },
  { href: "/akun/return", label: "Return", icon: RotateCcw },
  { href: "/akun/komplain", label: "Komplain", icon: MessageSquareWarning },
  { href: "/akun/notifikasi", label: "Notifikasi", icon: Bell },
];

export function AccountShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container-page py-8">
      <div className="mb-6 overflow-hidden rounded-lg border bg-primary text-primary-foreground shadow-sm">
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Badge variant="accent">Akun Customer</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-primary-foreground/78">{description}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:w-[430px]">
            {[
              { label: "Profil", value: "API" },
              { label: "Alamat", value: "CRUD" },
              { label: "Session", value: "Aktif" },
            ].map((item) => (
              <div key={item.label} className="rounded-md border border-white/20 bg-white/10 p-3 backdrop-blur">
                <div className="text-xl font-semibold">{item.value}</div>
                <div className="text-xs text-primary-foreground/72">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-white/15 bg-primary-foreground/8 px-5 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <CheckCircle2 className="size-4 text-accent" />
            Sprint 2 account sudah memakai session dan API backend.
          </div>
          <Link href="/" className="inline-flex items-center gap-2 font-medium text-primary-foreground hover:underline">
            <Home className="size-4" />
            Kembali belanja
          </Link>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardContent className="p-3">
              <div className="mb-3 rounded-md bg-secondary p-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck className="size-4 text-primary" />
                  Sprint 2 Account
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Auth, profil, dan alamat sudah terhubung ke backend account.</p>
              </div>
              <nav className="flex gap-1 overflow-x-auto lg:grid lg:overflow-visible">
                {accountNav.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex min-w-fit items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
                        active && "bg-secondary text-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </aside>

        <div>{children}</div>
      </div>
    </div>
  );
}
