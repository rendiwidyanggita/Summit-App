import Link from "next/link";
import { Apple, Clock, KeyRound, Mail, MapPin, Mountain, PackageCheck, ShieldCheck } from "lucide-react";

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
      <div className="mb-5 grid gap-3 rounded-lg bg-primary p-4 text-primary-foreground sm:grid-cols-3">
        {[
          { icon: PackageCheck, label: "Pesanan", value: "Pantau status" },
          { icon: MapPin, label: "Alamat", value: "Siap checkout" },
          { icon: Clock, label: "Session", value: "Login cepat" },
        ].map((item) => (
          <div key={item.label} className="rounded-md border border-white/15 bg-white/10 p-3">
            <item.icon className="size-4 text-accent" />
            <div className="mt-2 text-sm font-semibold">{item.label}</div>
            <div className="text-xs text-primary-foreground/72">{item.value}</div>
          </div>
        ))}
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

      <div className="mt-5 grid gap-3 rounded-md bg-secondary p-4 text-sm">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>Session web disiapkan untuk proteksi halaman akun dan checkout.</span>
        </div>
        <div className="flex gap-3">
          <KeyRound className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>Reset password tersedia jika akses akun perlu dipulihkan.</span>
        </div>
        <div className="flex gap-3">
          <Mountain className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>OAuth Google dan Apple mengikuti requirement Sprint 2 PRD.</span>
        </div>
      </div>
    </AuthPageShell>
  );
}
