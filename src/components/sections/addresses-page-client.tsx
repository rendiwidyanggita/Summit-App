"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Home, Loader2, MapPin, Plus, Save, Star, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api-client";

type Address = {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  fullAddress: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  isPrimary: boolean;
};

const emptyForm = {
  label: "",
  recipient: "",
  phone: "",
  fullAddress: "",
  province: "",
  city: "",
  district: "",
  postalCode: "",
  isPrimary: false,
};

export function AddressesPageClient({ initialAddresses }: { initialAddresses: Address[] }) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [form, setForm] = useState<Omit<Address, "id">>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const primary = addresses.find((address) => address.isPrimary);

  function updateField(name: keyof Omit<Address, "id">, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function reloadAddresses() {
    const data = await apiRequest<Address[]>("/api/account/addresses");
    setAddresses(data);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await apiRequest<Address>(`/api/account/addresses/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(form),
        });
        toast.success("Alamat berhasil diperbarui.");
      } else {
        await apiRequest<Address>("/api/account/addresses", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Alamat berhasil ditambahkan.");
      }

      await reloadAddresses();
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Alamat gagal disimpan.");
    } finally {
      setLoading(false);
    }
  }

  async function makePrimary(address: Address) {
    try {
      await apiRequest<Address>(`/api/account/addresses/${address.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isPrimary: true }),
      });
      await reloadAddresses();
      toast.success("Alamat utama diperbarui.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal mengubah alamat utama.");
    }
  }

  async function removeAddress(address: Address) {
    try {
      await apiRequest(`/api/account/addresses/${address.id}`, {
        method: "DELETE",
      });
      await reloadAddresses();
      if (editingId === address.id) resetForm();
      toast.success("Alamat dihapus.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus alamat.");
    }
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 rounded-lg border bg-[linear-gradient(135deg,var(--secondary),var(--background))] p-4 sm:grid-cols-3">
        {[
          { label: "Alamat utama", value: primary?.label ?? "Belum ada", icon: Home },
          { label: "Alamat tersimpan", value: `${addresses.length} lokasi`, icon: MapPin },
          { label: "Checkout readiness", value: primary ? "Siap" : "Lengkapi", icon: CheckCircle2 },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-md bg-card p-3 shadow-sm">
            <div className="grid size-10 place-items-center rounded-md bg-primary text-primary-foreground">
              <item.icon className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-normal">Daftar alamat</h2>
          <p className="mt-1 text-sm text-muted-foreground">Data alamat sudah tersimpan melalui account API.</p>
        </div>
        <Button type="button" variant="accent" onClick={resetForm}>
          <Plus /> Tambah alamat
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {addresses.length === 0 ? (
          <Card>
            <CardContent className="p-5 text-sm text-muted-foreground">Belum ada alamat tersimpan. Tambahkan alamat utama untuk checkout berikutnya.</CardContent>
          </Card>
        ) : null}
        {addresses.map((item) => (
          <Card key={item.id} className={item.isPrimary ? "overflow-hidden border-primary" : "overflow-hidden"}>
            <div className={item.isPrimary ? "h-1.5 bg-[linear-gradient(90deg,var(--primary),var(--accent))]" : "h-1.5 bg-secondary"} />
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  {item.isPrimary ? <Home className="size-4 text-primary" /> : <MapPin className="size-4 text-primary" />}
                  {item.label}
                </CardTitle>
                <CardDescription>{item.recipient}</CardDescription>
              </div>
              {item.isPrimary ? <Badge>Utama</Badge> : <Badge variant="secondary">Tersimpan</Badge>}
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="text-sm text-muted-foreground">
                <div>{item.phone}</div>
                <div className="mt-1">{item.fullAddress}</div>
                <div className="mt-1">
                  {item.district}, {item.city}, {item.province} {item.postalCode}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingId(item.id);
                    setForm({
                      label: item.label,
                      recipient: item.recipient,
                      phone: item.phone,
                      fullAddress: item.fullAddress,
                      province: item.province,
                      city: item.city,
                      district: item.district,
                      postalCode: item.postalCode,
                      isPrimary: item.isPrimary,
                    });
                  }}
                >
                  Edit
                </Button>
                <Button type="button" variant="ghost" size="sm" disabled={item.isPrimary} onClick={() => makePrimary(item)}>
                  Jadikan utama
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeAddress(item)}>
                  <Trash2 /> Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)]">
        <Card className="overflow-hidden">
          <div className="h-1 bg-primary" />
          <CardHeader>
            <CardTitle>{editingId ? "Edit alamat" : "Form alamat"}</CardTitle>
            <CardDescription>Field mengikuti kebutuhan checkout: penerima, nomor HP, wilayah, kode pos, dan detail alamat.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={onSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="label">Label alamat</Label>
                  <Input id="label" value={form.label} onChange={(event) => updateField("label", event.target.value)} placeholder="Rumah, Kantor, Basecamp" required minLength={2} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="recipient">Nama penerima</Label>
                  <Input id="recipient" value={form.recipient} onChange={(event) => updateField("recipient", event.target.value)} autoComplete="name" placeholder="Nama penerima paket" required minLength={2} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Nomor HP penerima</Label>
                  <Input id="phone" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} type="tel" autoComplete="tel" placeholder="08xxxxxxxxxx" required minLength={8} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="postal-code">Kode pos</Label>
                  <Input id="postal-code" value={form.postalCode} onChange={(event) => updateField("postalCode", event.target.value)} inputMode="numeric" autoComplete="postal-code" placeholder="12345" required minLength={4} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="province">Provinsi</Label>
                  <Input id="province" value={form.province} onChange={(event) => updateField("province", event.target.value)} placeholder="Jawa Barat" required minLength={2} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">Kota/Kabupaten</Label>
                  <Input id="city" value={form.city} onChange={(event) => updateField("city", event.target.value)} placeholder="Bandung" required minLength={2} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="district">Kecamatan</Label>
                  <Input id="district" value={form.district} onChange={(event) => updateField("district", event.target.value)} placeholder="Coblong" required minLength={2} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="full-address">Alamat lengkap</Label>
                <Textarea id="full-address" value={form.fullAddress} onChange={(event) => updateField("fullAddress", event.target.value)} placeholder="Nama jalan, nomor rumah, patokan, dan catatan kurir" required minLength={10} />
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={form.isPrimary} onChange={(event) => updateField("isPrimary", event.target.checked)} className="size-4 rounded border-input accent-primary" />
                Jadikan alamat utama
              </label>
              <div className="flex flex-wrap gap-2">
                <Button type="submit" className="w-full sm:w-fit" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : <Save />}
                  Simpan alamat
                </Button>
                {editingId ? (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Batal edit
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="overflow-hidden bg-primary text-primary-foreground">
          <div className="h-1 bg-accent" />
          <CardHeader>
            <CardTitle>Kesiapan checkout</CardTitle>
            <CardDescription className="text-primary-foreground/72">Alamat menjadi sumber kalkulasi ongkir, validasi COD, dan shipment snapshot.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            {[
              { icon: Truck, text: "Provinsi, kota, kecamatan, dan kode pos siap dipakai untuk ongkir RajaOngkir/BinderByte." },
              { icon: Star, text: "Satu alamat utama diprioritaskan pada checkout agar flow mobile tetap cepat." },
              { icon: MapPin, text: "Detail alamat disimpan sebagai snapshot order saat checkout dibuat." },
            ].map((item) => (
              <div key={item.text} className="flex gap-3 rounded-md border border-white/15 bg-white/10 p-3">
                <item.icon className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>{item.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
