import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

import { DesignParticles } from "@/components/sections/design-particles";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DarkPromoBand({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  icon: Icon,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <section className={cn("summit-dark relative overflow-hidden", className)}>
      <DesignParticles />
      <div className="container-page relative grid gap-6 py-12 md:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] md:items-center">
        <div>
          <p className="text-sm font-medium tracking-[0.08em] text-white/70">{eyebrow}</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-medium tracking-[-0.03em] text-white sm:text-5xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">{description}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button variant="inverse" size="lg" asChild>
              <Link href={primaryHref}>
                {primaryLabel} <ArrowRight />
              </Link>
            </Button>
            <Button variant="darkOutline" size="lg" asChild>
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          </div>
        </div>
        <div className="hidden justify-end md:flex">
          <div className="grid size-36 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur">
            {Icon ? <Icon className="size-16" /> : <ArrowRight className="size-16" />}
          </div>
        </div>
      </div>
    </section>
  );
}
