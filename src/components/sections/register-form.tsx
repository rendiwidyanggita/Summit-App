"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Apple, Loader2, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/api-client";

type RegisterResponse = {
  id: string;
  email: string;
  name: string | null;
  message?: string;
};

export function RegisterForm({
  googleEnabled,
  appleEnabled,
}: {
  googleEnabled: boolean;
  appleEnabled: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    };

    try {
      const data = await apiRequest<RegisterResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setRegisteredEmail(data.email);
      toast.success("Akun dibuat. Cek email untuk verifikasi.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  }

  async function onOAuth(provider: "google" | "apple") {
    setOauthProvider(provider);
    await signIn(provider, { redirectTo: "/akun/profil" });
  }

  if (registeredEmail) {
    return (
      <div className="rounded-md border bg-background p-4">
        <h2 className="text-base font-semibold">Cek email verifikasi</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Kami mengirim link verifikasi ke <span className="font-medium text-foreground">{registeredEmail}</span>. Setelah verifikasi, kamu bisa masuk dengan email dan password.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/masuk">Masuk</Link>
          </Button>
          <Button variant="outline" type="button" onClick={() => setRegisteredEmail(null)}>
            Daftar akun lain
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="outline" type="button" onClick={() => onOAuth("google")} disabled={!googleEnabled || oauthProvider !== null}>
          {oauthProvider === "google" ? <Loader2 className="animate-spin" /> : <Mail />}
          Google
        </Button>
        <Button variant="outline" type="button" onClick={() => onOAuth("apple")} disabled={!appleEnabled || oauthProvider !== null}>
          {oauthProvider === "apple" ? <Loader2 className="animate-spin" /> : <Apple />}
          Apple
        </Button>
      </div>
      {!appleEnabled ? <p className="mt-2 text-xs text-muted-foreground">Apple OAuth belum diaktifkan untuk development project ini.</p> : null}

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <Separator className="flex-1" />
        atau daftar dengan email
        <Separator className="flex-1" />
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="name">Nama lengkap</Label>
          <Input id="name" name="name" autoComplete="name" placeholder="Contoh: Dimas Pratama" required minLength={2} />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="nama@email.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Nomor HP</Label>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="08xxxxxxxxxx" required minLength={8} />
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput id="password" name="password" autoComplete="new-password" placeholder="Minimal 8 karakter" required minLength={8} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Konfirmasi password</Label>
            <PasswordInput id="confirmPassword" name="confirmPassword" autoComplete="new-password" placeholder="Ulangi password" required minLength={8} />
          </div>
        </div>
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input type="checkbox" required className="mt-0.5 size-4 rounded border-input accent-primary" />
          <span>Saya setuju menerima email verifikasi, status pesanan, dan informasi penting akun Summit Gear.</span>
        </label>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : null}
          Daftar
        </Button>
      </form>
    </>
  );
}
