"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api-client";
import type { AdminListResponse } from "@/lib/admin-types";
import type { ArticleItem } from "@/lib/trust-types";

export function ArticlesPageClient() {
  const [search,setSearch]=useState("");const [data,setData]=useState<AdminListResponse<ArticleItem>|null>(null);const [loading,setLoading]=useState(true);
  const load=useCallback(async()=>{try{setData(await apiRequest(`/api/articles?q=${encodeURIComponent(search)}&pageSize=100`));}catch(e){toast.error(e instanceof Error?e.message:"Artikel gagal dimuat.");}finally{setLoading(false);}},[search]);
  useEffect(()=>{const timer=setTimeout(()=>void load(),200);return()=>clearTimeout(timer);},[load]);
  if(loading)return <div className="container-page grid min-h-72 place-items-center py-8"><Loader2 className="animate-spin text-primary"/></div>;const items=data?.items??[];
  return <div className="container-page py-8"><section className="summit-dark relative overflow-hidden rounded-xl border border-white/10"><Image src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80" alt="Siluet alam untuk artikel outdoor Summit Gear" fill priority className="object-cover opacity-35" sizes="100vw"/><div className="absolute inset-0 bg-[var(--green-house)]/78"/><div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end"><div><Badge variant="accent">Artikel & SEO</Badge><h1 className="mt-4 text-3xl font-medium sm:text-5xl">Tips Outdoor Summit Gear</h1><p className="mt-3 max-w-2xl text-primary-foreground/80">Edukasi gear, checklist pendakian, dan maintenance produk.</p></div><Card className="bg-primary-foreground/95 text-foreground"><CardContent className="p-4"><div className="text-sm font-medium text-muted-foreground">Cari panduan</div><div className="relative mt-3"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari artikel..." className="bg-background pl-9 text-foreground"/></div></CardContent></Card></div></section>
  <div className="mt-6 grid gap-4 md:grid-cols-3">{items.map((article,index)=><Card key={article.slug} className={`overflow-hidden ${index===0?"md:col-span-2":""}`}>{article.image?<Link href={`/artikel/${article.slug}`} className="relative block aspect-[4/3] bg-secondary"><Image src={article.image} alt={article.title} fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw"/></Link>:null}<CardContent className="p-4"><div className="flex gap-2"><Badge variant="secondary">{article.category}</Badge><Badge variant="outline">{article.readingTime}</Badge></div><Link href={`/artikel/${article.slug}`} className="mt-3 block font-semibold hover:text-primary">{article.title}</Link><p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{article.excerpt}</p><Button variant="ghost" className="mt-3 px-0" asChild><Link href={`/artikel/${article.slug}`}>Baca artikel <ArrowRight/></Link></Button></CardContent></Card>)}</div>
  {!items.length?<div className="mt-6 grid place-items-center rounded-lg border bg-card p-10 text-center"><BookOpen className="size-8 text-muted-foreground"/><h2 className="mt-3 font-semibold">Artikel tidak ditemukan</h2></div>:null}</div>;
}
