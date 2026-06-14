import Link from "next/link";
import { CheckCircle2, MapPinned, PackageCheck, ShieldCheck, Truck } from "lucide-react";

import { AuthPageShell } from "@/components/sections/auth-page-shell";
import { RegisterForm } from "@/components/sections/register-form";
import { hasAppleOAuthEnv, hasGoogleOAuthEnv } from "@/lib/server/env";

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
      <div className="mb-6 overflow-hidden rounded-xl border bg-secondary">
        <div className="flex items-center gap-2 overflow-x-auto p-4 pb-2 text-sm">
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
        <div className="trail-divider" />
        <p className="p-4 pt-3 text-sm leading-6 text-muted-foreground">Akun baru dapat digunakan untuk profil, alamat utama, verifikasi email, dan checkout.</p>
      </div>

      <RegisterForm googleEnabled={hasGoogleOAuthEnv()} appleEnabled={hasAppleOAuthEnv()} />

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
