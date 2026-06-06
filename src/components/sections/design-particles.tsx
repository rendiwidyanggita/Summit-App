import { cn } from "@/lib/utils";

const particles = [
  "right-6 top-8 size-40 bg-[var(--blue-report)]/15",
  "right-28 top-24 size-24 bg-[var(--blue-brand)]/20",
  "right-16 bottom-14 size-16 bg-[var(--orange-fin)]/35",
  "right-52 bottom-20 size-9 bg-[var(--orange-report)]/55",
  "right-8 bottom-40 size-5 bg-[var(--orange-fin)]/70",
];

export function DesignParticles({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {particles.map((particle) => (
        <span key={particle} className={cn("summit-particle hidden md:block", particle)} />
      ))}
    </div>
  );
}
