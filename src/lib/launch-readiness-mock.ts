import { Accessibility, FileSearch, MonitorSmartphone, Rocket, ShieldCheck } from "lucide-react";

export type LaunchCheckItem = {
  label: string;
  status: "ready" | "mock" | "review";
};

export type SeoChecklistItem = {
  label: string;
  detail: string;
};

export const launchReadinessChecks: LaunchCheckItem[] = [
  { label: "Responsive QA", status: "ready" },
  { label: "Accessibility labels", status: "ready" },
  { label: "Loading/empty/error states", status: "ready" },
  { label: "Backend integration", status: "mock" },
];

export const seoChecklist: SeoChecklistItem[] = [
  { label: "Metadata", detail: "Title, description, Open Graph, dan canonical disiapkan di route utama." },
  { label: "Sitemap", detail: "Public catalog dan artikel mock masuk indeks; admin tetap disallow." },
  { label: "Readable content", detail: "FAQ, artikel, kategori, dan detail produk memakai copy SEO-friendly." },
];

export const launchReadinessCards = [
  { icon: MonitorSmartphone, title: "Mobile-first", body: "Layout dirapikan untuk layar 390px, grid menjadi stack, dan kontrol tetap mudah ditekan." },
  { icon: Accessibility, title: "Accessible UI", body: "Skip link, active nav, aria label, dan focus ring dijaga untuk navigasi keyboard." },
  { icon: FileSearch, title: "SEO polish", body: "Route publik punya metadata yang konsisten dan sitemap tetap membatasi area admin." },
  { icon: ShieldCheck, title: "No BE touch", body: "Hardening Sprint 8 ini hanya UI/mock; auth, API, Prisma, dan service server tidak diubah." },
];

export const adminLaunchNotes = [
  { icon: Rocket, text: "Modul ini siap sebagai layar launch preview frontend." },
  { icon: MonitorSmartphone, text: "Tabel/aksi berat tetap ditahan sampai workflow data real tersedia." },
  { icon: ShieldCheck, text: "Semua aksi simpan, hapus, dan approval masih mock tanpa request API." },
];
