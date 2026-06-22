"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { Archive, Loader2, Package, Pencil, Plus, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";

import { AdminDataToolbar, AdminLowStockFlag, AdminMetricCard, AdminStatusPill } from "@/components/sections/admin-commerce-ui";
import { AdminPageHeader } from "@/components/sections/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AdminCategory, AdminListResponse, AdminProduct } from "@/lib/admin-types";
import { ApiRequestError, apiRequest } from "@/lib/api-client";
import { formatRupiah } from "@/lib/utils";

type Brand = { id: string; name: string; slug: string };
const statusOptions = ["ALL", "ACTIVE", "DRAFT", "INACTIVE", "ARCHIVED", "LOW_STOCK"].map((value) => ({ label: value.replace("_", " "), value }));

function normalizePhotoUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if ((parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") && parsed.pathname.startsWith("/uploads/")) {
        return parsed.pathname;
      }
    } catch {
      return trimmed;
    }
    return trimmed;
  }
  if (trimmed.startsWith("/uploads/")) return trimmed;
  return trimmed;
}

function assertPhotoInput(urls: string[]) {
  if (!urls.length) {
    throw new Error("Tambahkan minimal satu foto produk.");
  }
}

function getValidationMessage(details: unknown) {
  if (!details || typeof details !== "object") return null;
  const fieldErrors = "fieldErrors" in details ? (details as { fieldErrors?: Record<string, string[]> }).fieldErrors : undefined;
  if (!fieldErrors) return null;
  const firstError = Object.entries(fieldErrors).find(([, messages]) => messages?.length);
  if (!firstError) return null;
  const [field, messages] = firstError;
  return `${field}: ${messages[0]}`;
}

export function AdminProductsPageClient() {
  const [data, setData] = useState<AdminListResponse<AdminProduct> | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [editing, setEditing] = useState<AdminProduct | null | undefined>(undefined);
  const [retainedPhotos, setRetainedPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [products, categoryResult, brandResult] = await Promise.all([
        apiRequest<AdminListResponse<AdminProduct>>(`/api/admin/products?q=${encodeURIComponent(search)}&status=${status}&pageSize=100`),
        apiRequest<AdminListResponse<AdminCategory>>("/api/admin/categories?pageSize=100"),
        apiRequest<Brand[]>("/api/brands"),
      ]);
      setData(products); setCategories(categoryResult.items); setBrands(brandResult);
    } catch (error) { toast.error(error instanceof Error ? error.message : "Produk gagal dimuat."); }
    finally { setLoading(false); }
  }, [search, status]);

  useEffect(() => { const timer = setTimeout(() => void load(), 200); return () => clearTimeout(timer); }, [load]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true);
    const form = new FormData(event.currentTarget);
    const existingVariants = editing?.variants ?? [];
    
    try {
      let uploadedUrls: string[] = [];
      const photoFiles = form.getAll("photoFiles") as File[];
      const validFiles = photoFiles.filter((f) => f.size > 0);
      
      if (validFiles.length > 0) {
        const uploadData = new FormData();
        for (const f of validFiles) uploadData.append("file", f);
        
        const res = await fetch("/api/upload", { method: "POST", body: uploadData });
        if (!res.ok) throw new Error("Gagal mengunggah foto produk.");
        const json = await res.json() as { data?: { urls: string[] }, urls?: string[] };
        uploadedUrls = json.data?.urls || json.urls || [];
      }

      const combinedPhotos = [...retainedPhotos, ...uploadedUrls];
      assertPhotoInput(combinedPhotos);

      const payload = {
        name: String(form.get("name")), slug: String(form.get("slug")), description: String(form.get("description")),
        categoryId: String(form.get("categoryId")), brandId: String(form.get("brandId")), weightGram: Number(form.get("weightGram")),
        price: Number(form.get("price")), costPrice: Number(form.get("costPrice")), discountPrice: form.get("discountPrice") ? Number(form.get("discountPrice")) : null,
        photos: combinedPhotos, videoUrl: editing?.videoUrl ?? "",
        status: String(form.get("status")), isCodAllowed: editing?.isCodAllowed ?? true, tags: editing?.tags ?? [], specs: editing?.specs ?? null, isFeatured: editing?.isFeatured ?? false, metaTitle: editing?.metaTitle ?? "", metaDescription: editing?.metaDescription ?? "",
        variants: existingVariants.length ? existingVariants.map((variant, index) => {
          const isProductActive = String(form.get("status")) !== "ARCHIVED";
          return index === 0
            ? { ...variant, size: variant.size ?? "", color: variant.color ?? "", stock: Number(form.get("stock")), sku: String(form.get("sku")), isActive: isProductActive }
            : { ...variant, size: variant.size ?? "", color: variant.color ?? "", isActive: isProductActive };
        }) : [{ sku: String(form.get("sku")), size: "", color: "", stock: Number(form.get("stock")), minimumStock: 10, priceModifier: 0, isActive: String(form.get("status")) !== "ARCHIVED" }],
      };

      await apiRequest(editing ? `/api/admin/products/${editing.id}` : "/api/admin/products", { method: editing ? "PATCH" : "POST", body: JSON.stringify(payload) });
      toast.success(editing ? "Produk diperbarui." : "Produk ditambahkan."); setEditing(undefined); await load();
    } catch (error) {
      const validationMessage = error instanceof ApiRequestError && error.code === "VALIDATION_ERROR" ? getValidationMessage(error.details) : null;
      toast.error(validationMessage ?? (error instanceof Error ? error.message : "Produk gagal disimpan."));
    }
    finally { setSaving(false); }
  }

  async function archive(product: AdminProduct) {
    if (!window.confirm(`Archive ${product.name}?`)) return;
    try { await apiRequest(`/api/admin/products/${product.id}`, { method: "DELETE" }); toast.success("Produk diarsipkan."); await load(); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Produk gagal diarsipkan."); }
  }

  const products = data?.items ?? [];
  return <div className="grid gap-6">
    <AdminPageHeader title="Manajemen Produk" description="Katalog, varian, stok, harga beli/jual, margin, dan status produk terkelola secara terpusat." />
    <div className="grid gap-4 md:grid-cols-3">
      <AdminMetricCard title="Total produk" value={String(data?.pagination.total ?? 0)} note={`${products.filter((p) => p.status === "ACTIVE").length} aktif`} icon={Package} />
      <AdminMetricCard title="Low stock" value={String(products.filter((p) => p.lowStock).length)} note="Sesuai threshold varian" icon={SlidersHorizontal} />
      <AdminMetricCard title="Total stok" value={String(products.reduce((sum, p) => sum + p.stock, 0))} note="Varian aktif" icon={Package} />
    </div>
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex-1"><AdminDataToolbar search={search} onSearchChange={setSearch} filter={status} onFilterChange={setStatus} options={statusOptions} placeholder="Cari produk..." /></div>
      <Button onClick={() => { setRetainedPhotos([]); setEditing(null); }}><Plus /> Tambah produk</Button>
    </div>
    <Card><CardHeader><CardTitle className="text-base">Produk katalog</CardTitle></CardHeader><CardContent className="grid gap-3">
      {loading ? <Loader2 className="animate-spin" /> : products.map((product) => <div key={product.id} className="grid gap-3 rounded-lg border p-3 md:grid-cols-[64px_1fr_auto] md:items-center">
        <div className="relative size-16 overflow-hidden rounded-md bg-secondary">{product.photos[0] ? <Image src={normalizePhotoUrl(product.photos[0])} alt={product.name} fill className="object-cover" sizes="64px" /> : null}</div>
        <div><div className="flex flex-wrap items-center gap-2"><strong>{product.name}</strong><AdminStatusPill status={product.status} /><AdminLowStockFlag show={product.lowStock} /></div>
          <div className="mt-1 text-sm text-muted-foreground">{product.brand.name} · {product.category.name} · {product.stock} stok · margin {product.margin}%</div>
          <div className="mt-1 font-medium">{formatRupiah(product.price)}</div></div>
        <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => { setRetainedPhotos(product.photos); setEditing(product); }}><Pencil /> Edit</Button><Button size="sm" variant="ghost" onClick={() => void archive(product)}><Archive /> Archive</Button></div>
      </div>)}
    </CardContent></Card>
    <Dialog open={editing !== undefined} onOpenChange={(open) => !open && setEditing(undefined)}><DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto"><DialogHeader><DialogTitle>{editing ? "Edit produk" : "Tambah produk"}</DialogTitle><DialogDescription>Varian pertama dapat diperbarui melalui form ini; varian lain tetap dipertahankan.</DialogDescription></DialogHeader>
      <form className="grid gap-4" onSubmit={save}>
        <div className="grid gap-3 sm:grid-cols-2"><Field label="Nama" name="name" value={editing?.name} /><Field label="Slug" name="slug" value={editing?.slug} /></div>
        <div className="grid gap-2"><Label>Deskripsi</Label><Textarea name="description" defaultValue={editing?.description} required /></div>
        <div className="grid gap-3 sm:grid-cols-2"><SelectField label="Kategori" name="categoryId" value={editing?.categoryId} options={categories.map((c) => ({ value: c.id, label: c.name }))} /><SelectField label="Brand" name="brandId" value={editing?.brandId} options={brands.map((b) => ({ value: b.id, label: b.name }))} /></div>
        <div className="grid gap-3 sm:grid-cols-3"><Field label="Harga jual" name="price" type="number" value={editing?.price} /><Field label="Harga beli" name="costPrice" type="number" value={editing?.costPrice} /><Field label="Harga diskon" name="discountPrice" type="number" value={editing?.discountPrice ?? ""} /></div>
        <div className="grid gap-3 sm:grid-cols-3"><Field label="Berat gram" name="weightGram" type="number" value={editing?.weightGram ?? 500} /><Field label="SKU utama" name="sku" value={editing?.variants[0]?.sku} /><Field label="Stok utama" name="stock" type="number" value={editing?.variants[0]?.stock ?? 0} /></div>
        <div className="grid gap-2">
          <Label>Foto produk (minimal 1)</Label>
          {retainedPhotos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {retainedPhotos.map((url) => (
                <div key={url} className="relative size-16 overflow-hidden rounded-md border bg-secondary">
                  <Image src={normalizePhotoUrl(url)} alt="foto produk" fill className="object-cover" sizes="64px" />
                  <button type="button" onClick={() => setRetainedPhotos((prev) => prev.filter((u) => u !== url))} className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black"><X className="size-3" /></button>
                </div>
              ))}
            </div>
          )}
          <Input type="file" name="photoFiles" accept="image/*" multiple />
        </div>
        <SelectField label="Status" name="status" value={editing?.status ?? "DRAFT"} options={["DRAFT","ACTIVE","INACTIVE","ARCHIVED"].map((value) => ({ value, label: value }))} />
        <Button type="submit" disabled={saving}>{saving ? <Loader2 className="animate-spin" /> : null} Simpan produk</Button>
      </form>
    </DialogContent></Dialog>
  </div>;
}

function Field({ label, name, value, type = "text" }: { label: string; name: string; value?: string | number | null; type?: string }) {
  return <div className="grid gap-2"><Label>{label}</Label><Input name={name} type={type} defaultValue={value ?? ""} required={name !== "discountPrice"} /></div>;
}
function SelectField({ label, name, value, options }: { label: string; name: string; value?: string; options: Array<{ value: string; label: string }> }) {
  return <div className="grid gap-2"><Label>{label}</Label><select name={name} defaultValue={value} required className="h-10 rounded-md border bg-background px-3 text-sm">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>;
}
