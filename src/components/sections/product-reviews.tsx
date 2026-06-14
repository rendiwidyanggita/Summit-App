"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, MessageSquareText, Star } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/api-client";
import type { ProductReviewResponse } from "@/lib/trust-types";

export function ProductReviews({ productSlug }: { productSlug: string }) {
  const [rating, setRating] = useState(0);
  const [data, setData] = useState<ProductReviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { try { setData(await apiRequest(`/api/products/${productSlug}/reviews?status=${rating || "ALL"}&pageSize=100`)); } catch (error) { toast.error(error instanceof Error ? error.message : "Review gagal dimuat."); } finally { setLoading(false); } }, [productSlug, rating]);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);
  if (loading) return <div className="grid min-h-40 place-items-center"><Loader2 className="animate-spin text-primary" /></div>;
  const summary = data?.summary ?? { average: 0, count: 0, distribution: [] };
  return <div className="grid gap-5">
    <div className="grid gap-4 rounded-lg border bg-secondary/60 p-4 md:grid-cols-[220px_1fr]"><div><div className="flex items-end gap-2"><span className="text-4xl font-semibold">{summary.average.toFixed(1)}</span><span className="pb-1 text-sm text-muted-foreground">/ 5</span></div><div className="mt-2 flex text-accent">{[1,2,3,4,5].map((n)=><Star key={n} className={`size-4 ${n<=Math.round(summary.average)?"fill-accent":""}`}/>)}</div><p className="mt-2 text-sm text-muted-foreground">{summary.count} review pembeli terverifikasi.</p></div>
    <div className="grid gap-2">{summary.distribution.map((item)=><button key={item.rating} type="button" onClick={()=>setRating(rating===item.rating?0:item.rating)} className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-background"><span className="w-10">{item.rating} star</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-background"><div className="h-full bg-accent" style={{width:`${summary.count?(item.count/summary.count)*100:0}%`}}/></div><span>{item.count}</span></button>)}</div></div>
    <div className="flex flex-wrap gap-2"><Button variant={rating===0?"default":"outline"} onClick={()=>setRating(0)}>Semua</Button>{[5,4,3,2,1].map((n)=><Button key={n} variant={rating===n?"default":"outline"} onClick={()=>setRating(n)}>{n} star</Button>)}</div>
    {!data?.items.length?<div className="grid place-items-center rounded-lg border bg-card p-8 text-center"><MessageSquareText className="size-8 text-muted-foreground"/><h3 className="mt-3 font-semibold">Belum ada review</h3></div>:null}
    <div className="grid gap-3">{data?.items.map((review)=><Card key={review.id}><CardContent className="p-4"><div className="flex justify-between gap-3"><div><div className="flex gap-2"><h3 className="font-semibold">{review.customerName}</h3><Badge variant="secondary">Verified order</Badge></div><div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><span className="flex text-accent">{[1,2,3,4,5].map((n)=><Star key={n} className={`size-3.5 ${n<=review.rating?"fill-accent":""}`}/>)}</span>{[review.variant?.size,review.variant?.color].filter(Boolean).join(" / ") || review.variant?.sku} · {new Date(review.createdAt).toLocaleDateString("id-ID")}</div></div><Badge variant="outline">{review.status}</Badge></div><p className="mt-3 text-sm leading-6 text-muted-foreground">{review.text}</p>{review.photos.length?<div className="mt-3 flex gap-2">{review.photos.map((photo)=><div key={photo} className="relative size-20 overflow-hidden rounded-md bg-secondary"><Image src={photo} alt="Foto review" fill className="object-cover" sizes="80px"/></div>)}</div>:<div className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground"><Camera className="size-3.5"/>Tidak ada foto</div>}</CardContent></Card>)}</div>
  </div>;
}
