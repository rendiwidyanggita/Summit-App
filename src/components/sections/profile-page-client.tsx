"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Camera, CheckCircle2, KeyRound, Loader2, LogOut, MailCheck, Phone, Save, Send, ShieldCheck, Sparkles, UserRound, XCircle } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/api-client";

type Profile = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  emailVerified: string | Date | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export function ProfilePageClient({ initialProfile }: { initialProfile: Profile }) {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const completion = [profile.name, profile.phone, profile.emailVerified].filter(Boolean).length;
  const completionPercent = Math.round((completion / 3) * 100);
  const initials = (profile.name ?? profile.email).slice(0, 2).toUpperCase();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      const data = await apiRequest<Profile>("/api/account/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: String(formData.get("name") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          image: String(formData.get("image") ?? ""),
        }),
      });
      setProfile((current) => ({ ...current, ...data }));
      toast.success("Profil berhasil disimpan.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Profil gagal disimpan.");
    } finally {
      setLoading(false);
    }
  }

  async function resendVerification() {
    setSendingVerification(true);

    try {
      await apiRequest("/api/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({
          email: profile.email,
        }),
      });
      toast.success("Jika email belum verified, link verifikasi sudah dikirim.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal mengirim email verifikasi.");
    } finally {
      setSendingVerification(false);
    }
  }

  return (
    <div className="grid gap-5">
      <Card className="overflow-hidden">
        <div className="h-2 bg-primary" />
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Ringkasan akun</CardTitle>
            <CardDescription>Status data utama sebelum checkout dan order tracking aktif.</CardDescription>
          </div>
          <Badge variant={profile.emailVerified ? "accent" : "secondary"} className="w-fit">
            {profile.emailVerified ? "Email Verified" : "Menunggu Verifikasi"}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-md bg-secondary p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="size-4 text-accent" />
              Kelengkapan profil
            </div>
            <div className="mt-4">
              <div className="flex items-end justify-between gap-3">
                <span className="text-4xl font-semibold">{completionPercent}%</span>
                <span className="text-xs text-muted-foreground">Siap checkout</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
                <div className="h-full rounded-full bg-primary" style={{ width: `${completionPercent}%` }} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">Lengkapi nomor HP dan alamat utama untuk membuka alur COD, ongkir, dan notifikasi transaksi.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: profile.emailVerified ? MailCheck : XCircle, label: "Email", value: profile.emailVerified ? "Terverifikasi" : "Belum verifikasi" },
              { icon: Phone, label: "Nomor HP", value: profile.phone || "Belum diisi" },
              { icon: ShieldCheck, label: "Session", value: "Aktif" },
            ].map((item) => (
              <div key={item.label} className="rounded-md border bg-background p-4">
                <item.icon className="size-5 text-primary" />
                <div className="mt-3 text-sm font-medium">{item.label}</div>
                <div className="mt-1 text-sm text-muted-foreground">{item.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
        <Card className="overflow-hidden">
          <div className="h-1 bg-primary" />
          <CardHeader>
            <CardTitle>Data profil</CardTitle>
            <CardDescription>Edit nama, nomor HP, dan URL foto profil.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-5" onSubmit={onSubmit}>
              <div className="rounded-lg bg-secondary/70 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Avatar className="size-20 border-4 border-background shadow-sm">
                    {profile.image ? <AvatarImage src={profile.image} alt={profile.name ?? profile.email} /> : null}
                    <AvatarFallback className="bg-secondary text-xl text-primary">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="image">Foto profil URL</Label>
                    <div className="flex flex-wrap gap-2">
                      <Input id="image" name="image" type="url" defaultValue={profile.image ?? ""} placeholder="https://..." className="max-w-sm" />
                      <Button type="button" variant="outline" disabled>
                        <Camera /> Upload nanti
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Versi demo menerima URL gambar profil.</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama lengkap</Label>
                  <Input id="name" name="name" autoComplete="name" defaultValue={profile.name ?? ""} required minLength={2} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Nomor HP</Label>
                  <Input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={profile.phone ?? ""} placeholder="08xxxxxxxxxx" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" value={profile.email} readOnly />
                <p className="text-xs text-muted-foreground">Email menjadi identitas login dan target verifikasi/reset password.</p>
              </div>
              <Button type="submit" className="w-full sm:w-fit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Save />}
                Simpan profil
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="h-1 bg-accent" />
          <CardHeader>
            <CardTitle>Keamanan akun</CardTitle>
            <CardDescription>Password, reset access, dan logout untuk session management.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Link href="/lupa-password" className="flex items-center gap-3 rounded-md border bg-background p-3 text-sm hover:border-primary">
                <KeyRound className="size-4 text-primary" />
                Kirim link reset password ke email akun
              </Link>
              <Button type="button" variant="outline" className="justify-start" onClick={() => signOut({ redirectTo: "/" })}>
                <LogOut /> Logout dari perangkat ini
              </Button>
              <div className="flex gap-3 rounded-md bg-secondary p-3 text-sm text-muted-foreground">
                <UserRound className="mt-0.5 size-4 shrink-0 text-primary" />
                Halaman ini sudah diproteksi session dan mengambil data dari backend account API.
              </div>
              <div className="flex gap-3 rounded-md bg-secondary p-3 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                Email/password login hanya aktif setelah email terverifikasi.
              </div>
              {!profile.emailVerified ? (
                <Button type="button" variant="secondary" className="justify-start" onClick={resendVerification} disabled={sendingVerification}>
                  {sendingVerification ? <Loader2 className="animate-spin" /> : <Send />}
                  Kirim email verifikasi
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
