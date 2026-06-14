"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { FolderTree, Loader2, Pencil, Plus, Tags, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminDataToolbar, AdminMetricCard, AdminStatusPill } from "@/components/sections/admin-commerce-ui";
import { AdminPageHeader } from "@/components/sections/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminCategory, AdminListResponse } from "@/lib/admin-types";
import { apiRequest } from "@/lib/api-client";

const options = [{ label: "Semua kategori", value: "ALL" }, { label: "Visible", value: "VISIBLE" }, { label: "Hidden", value: "HIDDEN" }];

export function AdminCategoriesPageClient() {
  const [data, setData] = useState<AdminListResponse<AdminCategory> | null>(null);
  const [search, setSearch] = useState(""); const [status, setStatus] = useState("ALL");
  const [editing, setEditing] = useState<AdminCategory | null | undefined>(undefined); const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    try { setData(await apiRequest(`/api/admin/categories?q=${encodeURIComponent(search)}&status=${status}&pageSize=100`)); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Kategori gagal dimuat."); }
  }, [search, status]);
  useEffect(() => { const timer = setTimeout(() => void load(), 200); return () => clearTimeout(timer); }, [load]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); const form = new FormData(event.currentTarget);
    const payload = { name: String(form.get("name")), slug: String(form.get("slug")), parentId: String(form.get("parentId") ?? ""), icon: String(form.get("icon") ?? ""), imageUrl: String(form.get("imageUrl") ?? ""), isVisible: form.get("isVisible") === "on", metaTitle: String(form.get("metaTitle") ?? ""), metaDescription: "" };
    try { await apiRequest(editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories", { method: editing ? "PATCH" : "POST", body: JSON.stringify(payload) }); toast.success("Kategori disimpan."); setEditing(undefined); await load(); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Kategori gagal disimpan."); } finally { setLoading(false); }
  }
  async function remove(item: AdminCategory) {
    if (!confirm(`Hapus kategori ${item.name}?`)) return;
    try { await apiRequest(`/api/admin/categories/${item.id}`, { method: "DELETE" }); toast.success("Kategori dihapus."); await load(); } catch (error) { toast.error(error instanceof Error ? error.message : "Kategori gagal dihapus."); }
  }
  const items = data?.items ?? [];
  return <div className="grid gap-6"><AdminPageHeader title="Manajemen Kategori" description="Hierarki, slug, metadata SEO, gambar, dan visibilitas kategori dari database." />
    <div className="grid gap-4 md:grid-cols-3"><AdminMetricCard title="Kategori" value={String(data?.pagination.total ?? 0)} note="Total tersimpan" icon={Tags} /><AdminMetricCard title="Visible" value={String(items.filter((i) => i.isVisible).length)} note="Tampil di katalog" icon={FolderTree} /><AdminMetricCard title="Parent" value={String(items.filter((i) => !i.parentId).length)} note="Kategori induk" icon={FolderTree} /></div>
    <div className="flex flex-col gap-3 sm:flex-row"><div className="flex-1"><AdminDataToolbar search={search} onSearchChange={setSearch} filter={status} onFilterChange={setStatus} options={options} /></div><Button onClick={() => setEditing(null)}><Plus /> Tambah kategori</Button></div>
    <div className="grid gap-3">{items.map((item) => <Card key={item.id}><CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex gap-2"><strong>{item.name}</strong><AdminStatusPill status={item.isVisible ? "VISIBLE" : "HIDDEN"} /></div><p className="text-sm text-muted-foreground">/{item.slug} · parent: {item.parent?.name ?? "-"} · {item.activeProductCount}/{item.productCount} produk aktif</p></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setEditing(item)}><Pencil /> Edit</Button><Button size="sm" variant="ghost" onClick={() => void remove(item)}><Trash2 /> Hapus</Button></div></CardContent></Card>)}</div>
    <Dialog open={editing !== undefined} onOpenChange={(open) => !open && setEditing(undefined)}><DialogContent><DialogHeader><DialogTitle>{editing ? "Edit kategori" : "Tambah kategori"}</DialogTitle><DialogDescription>Kategori yang masih memiliki produk atau child tidak dapat dihapus.</DialogDescription></DialogHeader><form className="grid gap-4" onSubmit={save}>
      <Field label="Nama" name="name" value={editing?.name} /><Field label="Slug" name="slug" value={editing?.slug} />
      <div className="grid gap-2"><Label>Parent</Label><select name="parentId" defaultValue={editing?.parentId ?? ""} className="h-10 rounded-md border bg-background px-3"><option value="">Tanpa parent</option>{items.filter((i) => i.id !== editing?.id).map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</select></div>
      <Field label="Icon" name="icon" value={editing?.icon} required={false} /><Field label="URL gambar" name="imageUrl" value={editing?.imageUrl} required={false} /><Field label="Meta title" name="metaTitle" value={editing?.metaTitle} required={false} />
      <label className="flex gap-2 text-sm"><input type="checkbox" name="isVisible" defaultChecked={editing?.isVisible ?? true} /> Tampilkan di katalog</label><Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : null} Simpan</Button>
    </form></DialogContent></Dialog>
  </div>;
}
function Field({ label, name, value, required = true }: { label: string; name: string; value?: string | null; required?: boolean }) { return <div className="grid gap-2"><Label>{label}</Label><Input name={name} defaultValue={value ?? ""} required={required} /></div>; }
