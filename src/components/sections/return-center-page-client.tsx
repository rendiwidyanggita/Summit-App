"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2, RotateCcw, ShieldCheck, Truck } from "lucide-react";
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
import type { ReturnRequestItem } from "@/lib/trust-types";

export function ReturnCenterPageClient() {
  const [data,setData]=useState<AdminListResponse<ReturnRequestItem>|null>(null); const [orders,setOrders]=useState<CustomerOrderResponse[]>([]); const [saving,setSaving]=useState(false); const [loading,setLoading]=useState(true);
  const load=useCallback(async()=>{try{const [returns,allOrders]=await Promise.all([apiRequest<AdminListResponse<ReturnRequestItem>>("/api/returns?pageSize=100"),apiRequest<CustomerOrderResponse[]>("/api/orders")]);setData(returns);setOrders(allOrders.filter((order)=>["DELIVERED","COMPLETED"].includes(order.status)));}catch(e){toast.error(e instanceof Error?e.message:"Return gagal dimuat.");}finally{setLoading(false);}},[]);
  useEffect(()=>{const timer=window.setTimeout(()=>void load(),0);return()=>window.clearTimeout(timer);},[load]);
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setSaving(true);const form=new FormData(event.currentTarget);try{await apiRequest("/api/returns",{method:"POST",body:JSON.stringify({orderItemId:form.get("orderItemId"),quantity:Number(form.get("quantity")),reason:form.get("reason"),description:form.get("description"),photos:String(form.get("photos")).split(",").map(x=>x.trim()).filter(Boolean)})});toast.success("Return berhasil diajukan.");event.currentTarget.reset();await load();}catch(e){toast.error(e instanceof Error?e.message:"Return gagal diajukan.");}finally{setSaving(false);}}
  const eligible=orders.flatMap((order)=>order.items.map((item)=>({order,item}))); if(loading)return <div className="grid min-h-48 place-items-center"><Loader2 className="animate-spin text-primary"/></div>;
  return <div className="grid gap-5"><div className="grid gap-4 md:grid-cols-3"><Metric icon={RotateCcw} title="7 hari" body="Batas return setelah barang diterima."/><Metric icon={ShieldCheck} title="Bukti foto" body="Minimal satu URL foto kondisi barang."/><Metric icon={Truck} title="Refund manual" body="Diproses Admin Finance setelah barang diterima."/></div>
  <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]"><div className="grid gap-3">{!data?.items.length?<Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Belum ada pengajuan return.</CardContent></Card>:null}{data?.items.map((request)=><Card key={request.id}><CardContent className="p-4"><div className="flex justify-between gap-3"><div><div className="flex gap-2"><strong>{request.id}</strong><Badge variant="secondary">{request.status}</Badge><Badge variant="outline">{request.refundStatus}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{request.order.orderNumber} · {request.orderItem.product.name} · {request.reason}</p></div><span className="text-sm text-muted-foreground">{new Date(request.createdAt).toLocaleDateString("id-ID")}</span></div><p className="mt-3 text-sm">{request.description}</p>{request.reviewNote?<p className="mt-3 rounded-md bg-secondary p-3 text-sm text-muted-foreground">Catatan admin: {request.reviewNote}</p>:null}<Button className="mt-3" size="sm" variant="outline" asChild><Link href={`/akun/pesanan/${request.order.orderNumber}`}>Lihat order</Link></Button></CardContent></Card>)}</div>
  <Card className="xl:sticky xl:top-20 xl:self-start"><CardHeader><CardTitle className="text-base">Ajukan return baru</CardTitle></CardHeader><CardContent>{eligible.length?<form className="grid gap-3" onSubmit={submit}><Field label="Item"><select name="orderItemId" className="h-10 rounded-md border bg-background px-3">{eligible.map(({order,item})=><option key={item.id} value={item.id}>{order.orderNumber} · {item.product.name}</option>)}</select></Field><Field label="Kuantitas"><Input name="quantity" type="number" min={1} defaultValue={1} required/></Field><Field label="Alasan"><Input name="reason" required/></Field><Field label="Deskripsi"><Textarea name="description" required minLength={10}/></Field><Field label="URL bukti foto (pisahkan koma)"><Input name="photos" type="text" required placeholder="https://..."/></Field><Button disabled={saving}>{saving?<Loader2 className="animate-spin"/>:null}Ajukan return</Button></form>:<p className="text-sm text-muted-foreground">Tidak ada order delivered/completed yang dapat dipilih.</p>}</CardContent></Card></div></div>;
}
function Metric({icon:Icon,title,body}:{icon:typeof RotateCcw;title:string;body:string}){return <div className="rounded-lg border bg-card p-4"><Icon className="size-5 text-primary"/><div className="mt-3 font-semibold">{title}</div><p className="mt-1 text-sm text-muted-foreground">{body}</p></div>}
function Field({label,children}:{label:string;children:React.ReactNode}){return <div className="grid gap-2"><Label>{label}</Label>{children}</div>}
