import Link from "next/link";
import { Apple, KeyRound, Mail, MapPin, Mountain, PackageCheck, ShieldCheck } from "lucide-react";

import { AuthPageShell } from "@/components/sections/auth-page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Masuk",
};

export default function LoginPage() {
  return (
    <AuthPageShell
      badge="Login Customer"
      title="Masuk ke Summit Gear"
      description="Lanjutkan belanja, kelola alamat, dan pantau pesanan pendakian dari satu akun."
      footer={
        <>
          Belum punya akun?{" "}
          <Link href="/daftar" className="font-medium text-primary hover:underline">
            Daftar sekarang
          </Link>
        </>
      }
    >
      <div className="mb-6 rounded-[1.5rem] bg-primary p-4 text-primary-foreground">
        <div className="flex flex-wrap gap-2 text-sm">
          {["Pantau pesanan", "Alamat tersimpan", "Checkout cepat"].map((item) => (
            <span key={item} className="rounded-full bg-white/12 px-3 py-1.5">
              {item}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-primary-foreground/78">
          Masuk untuk melanjutkan belanja gear, memakai alamat utama, dan melihat status order saat modul payment/fulfillment aktif.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="outline" type="button">
          <Mail /> Google
        </Button>
        <Button variant="outline" type="button">
          <Apple /> Apple
        </Button>
      </div>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <Separator className="flex-1" />
        atau masuk dengan email
        <Separator className="flex-1" />
      </div>

      <form className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="nama@email.com" />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password">Password</Label>
            <Link href="/lupa-password" className="text-sm font-medium text-primary hover:underline">
              Lupa password?
            </Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" placeholder="Minimal 8 karakter" />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" className="size-4 rounded border-input accent-primary" />
          Ingat sesi masuk di perangkat ini
        </label>
        <Button type="button" size="lg" className="w-full">
          Masuk
        </Button>
      </form>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
        {[
          { icon: ShieldCheck, label: "Session protected" },
          { icon: KeyRound, label: "Reset password" },
          { icon: Mountain, label: "OAuth ready" },
          { icon: PackageCheck, label: "Order tracking" },
          { icon: MapPin, label: "Alamat utama" },
        ].map((item) => (
          <span key={item.label} className="inline-flex items-center gap-2">
            <item.icon className="size-4 text-primary" />
            {item.label}
          </span>
        ))}
      </div>
    </AuthPageShell>
  );
}
