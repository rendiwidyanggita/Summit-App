"use client";

import { useState, type FormEvent } from "react";
import { Camera, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type OrderMock } from "@/lib/order-mock";

export function SupportFormMock({
  order,
  mode,
}: {
  order?: OrderMock;
  mode: "return" | "complaint";
}) {
  const [submitted, setSubmitted] = useState(false);
  const title = mode === "return" ? "Ajukan Return Mock" : "Laporkan Kendala Mock";

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-primary bg-primary/10 p-4 text-sm">
        <div className="font-semibold text-primary">{title} siap dipreview</div>
        <p className="mt-1 text-muted-foreground">Tidak ada API yang dipanggil. Upload bukti, validasi admin, refund, dan notifikasi real tetap backend/fullstack.</p>
      </div>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-2">
        <Label htmlFor={`${mode}-reason`}>{mode === "return" ? "Alasan return" : "Jenis kendala"}</Label>
        <select id={`${mode}-reason`} className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm">
          {(mode === "return" ? ["Barang rusak", "Barang salah kirim", "Ukuran tidak sesuai", "Kemasan rusak"] : ["Item kurang", "Barang salah", "Resi bermasalah", "Butuh bantuan admin"]).map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      {order ? (
        <div className="grid gap-2">
          <Label htmlFor={`${mode}-item`}>Item terkait</Label>
          <select id={`${mode}-item`} className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm">
            {order.items.map((item) => (
              <option key={item.id}>{item.product.name}</option>
            ))}
          </select>
        </div>
      ) : null}
      <div className="grid gap-2">
        <Label htmlFor={`${mode}-description`}>Deskripsi</Label>
        <Textarea id={`${mode}-description`} placeholder="Tulis kronologi singkat dan kondisi barang." required />
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="gap-1">
          <Camera className="size-3.5" /> Foto bukti placeholder
        </Badge>
        {mode === "return" ? <Badge variant="outline">Maks. 7 hari setelah diterima</Badge> : <Badge variant="outline">SLA respon 1x24 jam</Badge>}
      </div>
      <Button type="submit">
        Preview pengajuan <Send />
      </Button>
    </form>
  );
}
