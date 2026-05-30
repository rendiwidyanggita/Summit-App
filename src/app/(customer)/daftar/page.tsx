import Link from "next/link";
import { Apple, CheckCircle2, Mail, MapPinned, PackageCheck, ShieldCheck, Truck } from "lucide-react";

import { AuthPageShell } from "@/components/sections/auth-page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Daftar",
};

export default function RegisterPage() {
  return (
    <AuthPageShell
      badge="Register Customer"
      title="Buat akun Summit Gear"
      description="Simpan profil, nomor HP, dan alamat utama agar checkout perlengkapan pendakian lebih cepat."
      footer={
        <>
          Sudah punya akun?{" "}
          <Link href="/masuk" className="font-medium text-primary hover:underline">
            Masuk
          </Link>
        </>
      }
    >
      <div className="mb-6 rounded-[1.5rem] bg-[linear-gradient(135deg,var(--secondary),var(--background))] p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm">
          {[
            { icon: CheckCircle2, label: "Buat akun" },
            { icon: MapPinned, label: "Lengkapi alamat" },
            { icon: Truck, label: "Checkout cepat" },
          ].map((item, index) => (
            <div key={item.label} className="flex min-w-fit items-center gap-2">
              <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
                <item.icon className="size-4" />
              </span>
              <span className="font-medium">{item.label}</span>
              {index < 2 ? <span className="h-px w-8 bg-border" /> : null}
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Akun baru disiapkan untuk profil, alamat utama, email verification, dan checkout Sprint 4.</p>
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
        atau daftar dengan email
        <Separator className="flex-1" />
      </div>

      <form className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nama lengkap</Label>
          <Input id="name" autoComplete="name" placeholder="Contoh: Dimas Pratama" />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="nama@email.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Nomor HP</Label>
            <Input id="phone" type="tel" autoComplete="tel" placeholder="08xxxxxxxxxx" />
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="new-password" placeholder="Minimal 8 karakter" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Konfirmasi password</Label>
            <Input id="confirm-password" type="password" autoComplete="new-password" placeholder="Ulangi password" />
          </div>
        </div>
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input type="checkbox" className="mt-0.5 size-4 rounded border-input accent-primary" />
          <span>Saya setuju menerima email verifikasi, status pesanan, dan informasi penting akun Summit Gear.</span>
        </label>
        <Button type="button" size="lg" className="w-full">
          Daftar
        </Button>
      </form>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
        {[
          { icon: ShieldCheck, label: "Email verification" },
          { icon: PackageCheck, label: "Order tracking ready" },
          { icon: Truck, label: "Checkout foundation" },
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
