import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function RouteStatePanel({
  icon: Icon,
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden border-primary/15 bg-card/95", className)}>
      <CardContent className="relative grid min-h-72 place-items-center p-6 text-center sm:p-10">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="absolute -right-20 -top-20 size-52 rounded-full bg-secondary/70 blur-3xl" />
        <div className="relative max-w-xl">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-primary shadow-sm">
            <Icon className="size-7" />
          </div>
          {eyebrow ? <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p> : null}
          <h1 className="mt-3 text-2xl font-semibold tracking-normal sm:text-3xl">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
          {actions ? <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div> : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function StateActionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Button asChild>
      <a href={href}>{children}</a>
    </Button>
  );
}
