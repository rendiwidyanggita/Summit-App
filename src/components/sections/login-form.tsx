"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Apple, Loader2, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Separator } from "@/components/ui/separator";

export function LoginForm({
  callbackUrl,
  googleEnabled,
  appleEnabled,
}: {
  callbackUrl: string;
  googleEnabled: boolean;
  appleEnabled: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Email, password, atau status verifikasi belum valid.");
      return;
    }

    toast.success("Berhasil masuk.");
    router.push(callbackUrl);
    router.refresh();
  }

  async function onOAuth(provider: "google" | "apple") {
    setOauthProvider(provider);
    await signIn(provider, { redirectTo: callbackUrl });
  }

  return (
    <>
      <div className={`grid gap-3 ${appleEnabled ? "sm:grid-cols-2" : ""}`}>
        <Button variant="outline" type="button" onClick={() => onOAuth("google")} disabled={!googleEnabled || oauthProvider !== null}>
          {oauthProvider === "google" ? <Loader2 className="animate-spin" /> : <Mail />}
          Google
        </Button>
        {appleEnabled ? (
          <Button variant="outline" type="button" onClick={() => onOAuth("apple")} disabled={oauthProvider !== null}>
            {oauthProvider === "apple" ? <Loader2 className="animate-spin" /> : <Apple />}
            Apple
          </Button>
        ) : null}
      </div>

      {!googleEnabled ? <p className="mt-2 text-xs text-muted-foreground">Google Login belum dikonfigurasi untuk deployment ini.</p> : null}

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <Separator className="flex-1" />
        atau masuk dengan email
        <Separator className="flex-1" />
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="nama@email.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password">Password</Label>
            <Link href="/lupa-password" className="text-sm font-medium text-primary hover:underline">
              Lupa password?
            </Link>
          </div>
          <PasswordInput id="password" name="password" autoComplete="current-password" placeholder="Minimal 8 karakter" required minLength={8} />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : null}
          Masuk
        </Button>
      </form>
    </>
  );
}
