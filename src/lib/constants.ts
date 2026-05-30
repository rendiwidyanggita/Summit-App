import {
  BarChart3,
  Boxes,
  FileText,
  Flag,
  Gift,
  Home,
  LayoutDashboard,
  MessageSquareWarning,
  Package,
  Percent,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Tags,
  Truck,
  Users,
} from "lucide-react";

export const customerNav = [
  { href: "/produk", label: "Produk" },
  { href: "/kategori/tenda", label: "Kategori" },
  { href: "/artikel", label: "Artikel" },
  { href: "/faq", label: "FAQ" },
];

export const categories = [
  "Tenda",
  "Sleeping Bag",
  "Carrier",
  "Sepatu",
  "Jaket",
  "Headlamp",
  "Cooking Set",
  "Aksesoris",
];

export const featuredProducts = [
  {
    name: "Summit Ridge Tent 2P",
    slug: "summit-ridge-tent-2p",
    category: "Tenda",
    brand: "Summit Gear",
    price: 1450000,
    compareAt: 1690000,
    stock: 18,
    rating: 4.8,
  },
  {
    name: "Alpine 45L Carrier",
    slug: "alpine-45l-carrier",
    category: "Carrier",
    brand: "TrailForge",
    price: 875000,
    compareAt: 990000,
    stock: 9,
    rating: 4.7,
  },
  {
    name: "Borneo Dry Shell Jacket",
    slug: "borneo-dry-shell-jacket",
    category: "Jaket",
    brand: "RainPeak",
    price: 625000,
    compareAt: 0,
    stock: 22,
    rating: 4.6,
  },
  {
    name: "Campfire Compact Stove",
    slug: "campfire-compact-stove",
    category: "Cooking Set",
    brand: "CampLab",
    price: 315000,
    compareAt: 385000,
    stock: 31,
    rating: 4.9,
  },
];

export const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produk", label: "Produk", icon: Package },
  { href: "/admin/kategori", label: "Kategori", icon: Tags },
  { href: "/admin/pesanan", label: "Pesanan", icon: Truck },
  { href: "/admin/voucher", label: "Voucher", icon: Percent },
  { href: "/admin/banner", label: "Banner", icon: Flag },
  { href: "/admin/flash-sale", label: "Flash Sale", icon: Gift },
  { href: "/admin/return", label: "Return", icon: RotateCcw },
  { href: "/admin/customer", label: "Customer", icon: Users },
  { href: "/admin/artikel", label: "Artikel", icon: FileText },
  { href: "/admin/laporan", label: "Laporan", icon: BarChart3 },
  { href: "/admin/role", label: "Role", icon: ShieldCheck },
];

export const foundationModules = [
  { label: "Katalog", value: "24 produk seed", icon: Boxes },
  { label: "Order Aktif", value: "Belum terhubung", icon: ShoppingBag },
  { label: "CS", value: "WhatsApp siap", icon: MessageSquareWarning },
  { label: "Web", value: "Mobile-first", icon: Home },
];
