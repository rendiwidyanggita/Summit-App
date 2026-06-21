import {
  Boxes,
  FileText,
  Flag,
  Home,
  LayoutDashboard,
  MessageSquareWarning,
  Package,
  Percent,
  RotateCcw,
  ShoppingBag,
  Tags,
  Truck,
  Star,
} from "lucide-react";

export const customerNav = [
  { href: "/produk", label: "Produk" },
  { href: "/kategori/tenda", label: "Kategori" },
  { href: "/artikel", label: "Artikel" },
  { href: "/faq", label: "FAQ" },
];

export const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produk", label: "Produk", icon: Package },
  { href: "/admin/kategori", label: "Kategori", icon: Tags },
  { href: "/admin/pesanan", label: "Pesanan", icon: Truck },
  { href: "/admin/voucher", label: "Voucher", icon: Percent },
  { href: "/admin/banner", label: "Banner", icon: Flag },
  { href: "/admin/return", label: "Return", icon: RotateCcw },
  { href: "/admin/komplain", label: "Komplain", icon: MessageSquareWarning },
  { href: "/admin/review", label: "Review", icon: Star },
  { href: "/admin/artikel", label: "Artikel", icon: FileText },
];

export const foundationModules = [
  { label: "Katalog", value: "Terhubung backend", icon: Boxes },
  { label: "Order Aktif", value: "Terhubung backend", icon: ShoppingBag },
  { label: "CS", value: "WhatsApp siap", icon: MessageSquareWarning },
  { label: "Web", value: "Mobile-first", icon: Home },
];
