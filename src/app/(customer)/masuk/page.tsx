import Link from "next/link";
import { KeyRound, MapPin, Mountain, PackageCheck, ShieldCheck } from "lucide-react";

import { AuthPageShell } from "@/components/sections/auth-page-shell";
import { LoginForm } from "@/components/sections/login-form";
import { hasAppleOAuthEnv, hasGoogleOAuthEnv } from "@/lib/server/env";

export const metadata = {
  title: "Masuk",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl?.startsWith("/") ? params.callbackUrl : "/akun/profil";

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
      <div className="mb-6 overflow-hidden rounded-[1.5rem] bg-primary text-primary-foreground">
        <div className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div className="text-sm font-semibold">Lanjutkan perjalanan belanja</div>
            <p className="mt-1 text-xs leading-5 text-primary-foreground/72">Alamat, pesanan, dan tracking tetap dalam satu flow customer.</p>
          </div>
          <div className="rounded-full bg-[var(--green-light)] px-4 py-2 text-sm font-semibold text-[var(--summit-green)]">Ready 78%</div>
        </div>
        <div className="trail-divider opacity-40" />
        <div className="flex flex-wrap gap-2 p-4 pt-3 text-sm">
          {["Pantau pesanan", "Alamat tersimpan", "Checkout cepat"].map((item) => (
            <span key={item} className="rounded-full bg-white/12 px-3 py-1.5">
              {item}
            </span>
          ))}
        </div>
      </div>

      <LoginForm callbackUrl={callbackUrl} googleEnabled={hasGoogleOAuthEnv()} appleEnabled={hasAppleOAuthEnv()} />

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
