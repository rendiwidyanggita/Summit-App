"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2, MessageSquareWarning } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api-client";
import type { AdminListResponse } from "@/lib/admin-types";
import type { CustomerOrderResponse } from "@/lib/commerce-types";
import type { ComplaintItem } from "@/lib/trust-types";

export function ComplaintCenterPageClient(){
  const [data,setData]=useState<AdminListResponse<ComplaintItem>|null>(null);const [orders,setOrders]=useState<CustomerOrderResponse[]>([]);const [saving,setSaving]=useState(false);const [loading,setLoading]=useState(true);
  const load=useCallback(async()=>{try{const [complaints,customerOrders]=await Promise.all([apiRequest<AdminListResponse<ComplaintItem>>("/api/complaints?pageSize=100"),apiRequest<CustomerOrderResponse[]>("/api/orders")]);setData(complaints);setOrders(customerOrders);}catch(e){toast.error(e instanceof Error?e.message:"Komplain gagal dimuat.");}finally{setLoading(false);}},[]);useEffect(()=>{const timer=window.setTimeout(()=>void load(),0);return()=>window.clearTimeout(timer);},[load]);
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setSaving(true);const f=new FormData(event.currentTarget);try{await apiRequest("/api/complaints",{method:"POST",body:JSON.stringify({orderId:f.get("orderId"),category:f.get("category"),title:f.get("title"),description:f.get("description"),photos:String(f.get("photos")??"").split(",").map(x=>x.trim()).filter(Boolean)})});toast.success("Komplain berhasil dibuat.");event.currentTarget.reset();await load();}catch(e){toast.error(e instanceof Error?e.message:"Komplain gagal dibuat.");}finally{setSaving(false);}}
  if(loading)return <div className="grid min-h-48 place-items-center"><Loader2 className="animate-spin text-primary"/></div>;return <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]"><div className="grid gap-3">{!data?.items.length?<Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Belum ada komplain.</CardContent></Card>:null}{data?.items.map(item=><Card key={item.id}><CardContent className="p-4"><div className="flex justify-between gap-3"><div><div className="flex gap-2"><strong>{item.title}</strong><Badge variant="secondary">{item.status}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{item.id} · {item.category} · {item.order.orderNumber}</p></div><Button size="sm" variant="outline" asChild><Link href={`/akun/pesanan/${item.order.orderNumber}`}>Order</Link></Button></div><p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>{item.resolutionNote?<p className="mt-3 rounded-md bg-secondary p-3 text-sm">Resolusi: {item.resolutionNote}</p>:null}</CardContent></Card>)}</div>
  <Card className="xl:sticky xl:top-20 xl:self-start"><CardHeader><CardTitle className="flex gap-2 text-base"><MessageSquareWarning className="size-4 text-primary"/>Buat komplain</CardTitle></CardHeader><CardContent>{orders.length?<form className="grid gap-3" onSubmit={submit}><Field label="Order"><select name="orderId" className="h-10 rounded-md border bg-background px-3">{orders.map(order=><option key={order.id} value={order.id}>{order.orderNumber}</option>)}</select></Field><Field label="Kategori"><select name="category" className="h-10 rounded-md border bg-background px-3">{["Order","Produk","Pengiriman","Pembayaran"].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Judul"><Input name="title" required minLength={5}/></Field><Field label="Deskripsi"><Textarea name="description" required minLength={10}/></Field><Field label="URL foto (opsional, pisahkan koma)"><Input name="photos"/></Field><Button disabled={saving}>{saving?<Loader2 className="animate-spin"/>:null}Kirim komplain</Button></form>:<p className="text-sm text-muted-foreground">Belum ada order untuk dikomplain.</p>}</CardContent></Card></div>;
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <div className="grid gap-2"><Label>{label}</Label>{children}</div>}
