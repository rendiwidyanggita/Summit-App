import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, MapPinned, ShieldCheck, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function AuthPageShell({
  badge,
  title,
  description,
  children,
  footer,
}: {
  badge: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_30%),linear-gradient(135deg,var(--secondary)_0%,var(--background)_52%,color-mix(in_oklab,var(--primary)_10%,var(--background))_100%)]">
      <div className="pointer-events-none absolute -left-28 top-20 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 size-80 rounded-full bg-accent/20 blur-3xl" />
      <div className="container-page relative grid min-h-[calc(100vh-4rem)] gap-8 py-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:py-12">
        <div className="relative overflow-hidden rounded-[2rem] border bg-card/90 p-5 shadow-sm backdrop-blur sm:p-7">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[4rem] bg-accent/25" />
          <div className="relative">
            <Badge variant="accent" className="w-fit">
              {badge}
            </Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{description}</p>
            <div className="my-6 h-px bg-[linear-gradient(90deg,var(--primary),transparent)]" />
            {children}
            {footer ? <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div> : null}
          </div>
        </div>

        <div className="relative hidden min-h-[640px] overflow-hidden rounded-[2.5rem] bg-primary text-primary-foreground shadow-sm lg:block">
          <Image
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
            alt="Pendaki menyiapkan perlengkapan outdoor"
            fill
            priority
            className="object-cover opacity-45"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/10" />
          <div className="absolute left-8 top-8 flex flex-wrap gap-2">
            {["Profil", "Alamat", "Checkout", "Tracking"].map((item) => (
              <span key={item} className="rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm backdrop-blur">
                {item}
              </span>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-9">
            <Badge variant="secondary" className="mb-4">
              Summit Gear Account
            </Badge>
            <h2 className="max-w-lg text-4xl font-semibold tracking-normal">Belanja gear pendakian lebih cepat, aman, dan mudah dilacak.</h2>
            <div className="mt-7 grid gap-4">
              {[
                { icon: CheckCircle2, label: "Profil dan alamat tersimpan untuk checkout Sprint 4." },
                { icon: ShieldCheck, label: "Session web disiapkan untuk Auth.js dan RBAC admin." },
                { icon: Truck, label: "Pesanan, tracking, dan notifikasi siap mengikuti flow PRD." },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-sm text-primary-foreground/88">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-foreground/95 text-primary">
                    <item.icon className="size-4" />
                  </span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { icon: MapPinned, label: "Alamat utama" },
                { icon: Clock, label: "Reset aman" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 rounded-full bg-primary-foreground/95 px-4 py-2 text-sm font-medium text-primary">
                  <item.icon className="size-4" />
                  {item.label}
                </div>
              ))}
            </div>
            <Link href="/produk" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/85 hover:text-primary-foreground">
              Lihat katalog Summit Gear <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
