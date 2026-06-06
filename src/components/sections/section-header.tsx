import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  inverse = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  inverse?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow ? <p className={cn("text-sm font-medium tracking-[0.08em]", inverse ? "text-white/70" : "text-muted-foreground")}>{eyebrow}</p> : null}
      <h2 className={cn("mt-2 text-2xl font-medium tracking-[-0.02em] sm:text-4xl", inverse ? "text-white" : "text-[var(--summit-green)]")}>{title}</h2>
      {description ? <p className={cn("mt-3 text-sm leading-6 sm:text-base", inverse ? "text-white/70" : "text-muted-foreground")}>{description}</p> : null}
    </div>
  );
}
