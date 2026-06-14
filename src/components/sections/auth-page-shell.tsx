import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, MapPinned, ShieldCheck, Sparkles, Truck } from "lucide-react";

import { DesignParticles } from "@/components/sections/design-particles";
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
    <section className="summit-surface relative overflow-hidden border-b">
      <div className="pointer-events-none absolute -left-24 top-16 size-72 rounded-full bg-[var(--green-light)]/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-8 size-96 rounded-full bg-white/70 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px rotate-12 bg-primary/10" />
      <div className="container-page relative grid min-h-[calc(100vh-4rem)] gap-6 py-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:py-10">
        <div className="relative overflow-hidden rounded-[2rem] border bg-card/88 p-4 shadow-sm backdrop-blur sm:p-6 lg:rounded-[2.5rem_1.25rem_2.5rem_1.25rem]">
          <div className="absolute -right-12 -top-12 size-40 rounded-full bg-[var(--green-light)]/55" />
          <div className="absolute bottom-0 left-0 h-24 w-44 rounded-tr-[5rem] bg-primary/8" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent" className="w-fit">
                {badge}
              </Badge>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                <Sparkles className="size-3.5 text-primary" />
                Outdoor account flow
              </span>
            </div>
            <h1 className="mt-4 max-w-xl text-3xl font-semibold tracking-normal sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{description}</p>
            <div className="trail-divider my-6" />
            {children}
            {footer ? <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div> : null}
          </div>
        </div>

        <div className="summit-dark relative hidden min-h-[640px] overflow-hidden rounded-xl text-white lg:block">
          <DesignParticles />
          <Image
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
            alt="Pendaki menyiapkan perlengkapan outdoor"
            fill
            priority
            className="object-cover opacity-45"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--green-house)] via-[var(--green-house)]/72 to-[var(--green-house)]/18" />
          <div className="absolute left-8 top-28 h-48 w-28 rounded-full border border-white/20" />
          <div className="absolute right-8 top-16 size-24 rounded-full border border-white/20 bg-white/10 backdrop-blur" />
          <div className="absolute left-8 top-8 flex flex-wrap gap-2">
            {["Profil", "Alamat", "Checkout", "Tracking"].map((item) => (
              <span key={item} className="rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm backdrop-blur">
                {item}
              </span>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-8 xl:p-9">
            <Badge variant="secondary" className="mb-4">
              Summit Gear Account
            </Badge>
            <h2 className="max-w-lg text-4xl font-semibold tracking-normal">Belanja gear pendakian lebih cepat, aman, dan mudah dilacak.</h2>
            <div className="mt-7 grid gap-4 rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur">
              {[
                { icon: CheckCircle2, label: "Profil dan alamat tersimpan untuk proses checkout." },
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
