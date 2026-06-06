import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export function FloatingCartFab() {
  return (
    <Link
      href="/keranjang"
      aria-label="Buka keranjang"
      className="fixed bottom-4 right-4 z-40 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_6px_rgba(0,0,0,0.24),0_8px_12px_rgba(0,0,0,0.14)] transition-all duration-200 active:scale-95 active:shadow-[0_0_6px_rgba(0,0,0,0.24),0_8px_12px_rgba(0,0,0,0)] md:bottom-6 md:right-6"
    >
      <ShoppingCart className="size-5" />
    </Link>
  );
}
