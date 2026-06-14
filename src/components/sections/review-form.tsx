"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api-client";
import type { CustomerOrderResponse } from "@/lib/commerce-types";

export function ReviewForm({ order }: { order: CustomerOrderResponse }) {
  const [rating, setRating] = useState(5);
  const [saving, setSaving] = useState(false);
  if (order.status !== "COMPLETED") return null;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); const form = new FormData(event.currentTarget);
    try {
      await apiRequest("/api/reviews", { method: "POST", body: JSON.stringify({ orderItemId: form.get("orderItemId"), rating, text: form.get("text"), photos: String(form.get("photos") ?? "").split(",").map((x)=>x.trim()).filter(Boolean) }) });
      toast.success("Review dikirim dan menunggu moderasi."); event.currentTarget.reset(); setRating(5);
    } catch (error) { toast.error(error instanceof Error ? error.message : "Review gagal dikirim."); } finally { setSaving(false); }
  }
  return <Card><CardHeader><CardTitle className="text-lg">Tulis review produk</CardTitle></CardHeader><CardContent><form className="grid gap-4" onSubmit={submit}><div className="grid gap-2"><Label>Item</Label><select name="orderItemId" className="h-10 rounded-md border bg-background px-3">{order.items.map((item)=><option key={item.id} value={item.id}>{item.product.name}</option>)}</select></div><div className="grid gap-2"><Label>Rating</Label><div className="flex gap-1">{[1,2,3,4,5].map((n)=><button key={n} type="button" onClick={()=>setRating(n)} aria-label={`${n} bintang`}><Star className={`size-6 text-accent ${n<=rating?"fill-accent":""}`}/></button>)}</div></div><div className="grid gap-2"><Label>Review</Label><Textarea name="text" required minLength={10}/></div><div className="grid gap-2"><Label>URL foto (pisahkan koma)</Label><Input name="photos" placeholder="https://..."/></div><Button disabled={saving}>{saving?<Loader2 className="animate-spin"/>:null}Kirim review</Button></form></CardContent></Card>;
}
