"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BellRing, CheckCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/api-client";
import type { NotificationResponse } from "@/lib/trust-types";

export function NotificationsPageClient() {
  const [data, setData] = useState<NotificationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { try { setData(await apiRequest("/api/notifications?pageSize=100")); } catch (error) { toast.error(error instanceof Error ? error.message : "Notifikasi gagal dimuat."); } finally { setLoading(false); } }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);
  async function mark(id?: string) { try { await apiRequest(id ? `/api/notifications/${id}` : "/api/notifications/read-all", { method: "PATCH" }); await load(); } catch (error) { toast.error(error instanceof Error ? error.message : "Notifikasi gagal diperbarui."); } }
  if (loading) return <div className="grid min-h-48 place-items-center"><Loader2 className="animate-spin text-primary" /></div>;
  return <div className="grid gap-4">
    <div className="flex items-center justify-between gap-3"><p className="text-sm text-muted-foreground">{data?.unread ?? 0} notifikasi belum dibaca.</p><Button variant="outline" onClick={() => void mark()} disabled={!data?.unread}><CheckCheck />Tandai semua dibaca</Button></div>
    {!data?.items.length ? <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Belum ada notifikasi.</CardContent></Card> : null}
    {data?.items.map((item) => <Card key={item.id} className={item.isRead ? "opacity-75" : "border-primary/40"}><CardContent className="flex gap-4 p-4"><div className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary"><BellRing className="size-5" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{item.title}</h2><Badge variant={item.isRead ? "secondary" : "default"}>{item.isRead ? "Dibaca" : "Baru"}</Badge></div><p className="mt-1 text-sm leading-6 text-muted-foreground">{item.message}</p><div className="mt-3 flex gap-2">{item.linkUrl ? <Button size="sm" variant="outline" asChild><Link href={item.linkUrl}>Buka</Link></Button> : null}{!item.isRead ? <Button size="sm" variant="ghost" onClick={() => void mark(item.id)}>Tandai dibaca</Button> : null}</div></div></CardContent></Card>)}
  </div>;
}
