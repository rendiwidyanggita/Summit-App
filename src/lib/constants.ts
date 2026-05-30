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

export type CategoryItem = {
  name: string;
  slug: string;
  description: string;
  image: string;
  highlight: string;
};

export const categoryCatalog: CategoryItem[] = [
  {
    name: "Tenda",
    slug: "tenda",
    description: "Shelter ringan, kuat, dan siap untuk camping maupun pendakian gunung.",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80",
    highlight: "3-season shelter",
  },
  {
    name: "Sleeping Bag",
    slug: "sleeping-bag",
    description: "Sistem tidur hangat untuk suhu gunung tropis hingga jalur dingin.",
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=900&q=80",
    highlight: "Nyaman sampai 5C",
  },
  {
    name: "Carrier",
    slug: "carrier",
    description: "Tas gunung ergonomis untuk day hike, overnight, dan ekspedisi panjang.",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=900&q=80",
    highlight: "35L sampai 65L",
  },
  {
    name: "Sepatu",
    slug: "sepatu",
    description: "Footwear dengan traksi stabil untuk jalur basah, berbatu, dan berlumpur.",
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=900&q=80",
    highlight: "Grip basah",
  },
  {
    name: "Jaket",
    slug: "jaket",
    description: "Layer tahan angin dan hujan ringan untuk cuaca pegunungan yang cepat berubah.",
    image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=80",
    highlight: "Shell ringan",
  },
  {
    name: "Headlamp",
    slug: "headlamp",
    description: "Penerangan hands-free untuk summit attack, camp, dan jalur malam.",
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=900&q=80",
    highlight: "300 lumen",
  },
  {
    name: "Cooking Set",
    slug: "cooking-set",
    description: "Kompor, nesting, dan perlengkapan masak ringkas untuk logistik camp.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    highlight: "Compact camp",
  },
  {
    name: "Aksesoris",
    slug: "aksesoris",
    description: "Item kecil yang sering jadi penyelamat: dry bag, gaiter, trekking pole, dan lainnya.",
    image: "https://images.unsplash.com/photo-1529528070131-eda9f3e90919?auto=format&fit=crop&w=900&q=80",
    highlight: "Trip essentials",
  },
];

export const categories = categoryCatalog.map((category) => category.name);

export type ProductVariant = {
  name: string;
  sku: string;
  stock: number;
  priceModifier?: number;
};

export type ProductCatalogItem = {
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  brand: string;
  price: number;
  compareAt: number;
  stock: number;
  rating: number;
  sold: number;
  weightGram: number;
  images: string[];
  tags: string[];
  variants: ProductVariant[];
  specs: Record<string, string>;
  description: string;
  isNew?: boolean;
};

export type CatalogSortKey = "newest" | "price-asc" | "price-desc" | "best-selling" | "rating-desc";

export type CatalogFilters = {
  search?: string;
  categorySlugs?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  discountOnly?: boolean;
  inStockOnly?: boolean;
};

export const catalogProducts: ProductCatalogItem[] = [
  {
    name: "Summit Ridge Tent 2P",
    slug: "summit-ridge-tent-2p",
    category: "Tenda",
    categorySlug: "tenda",
    brand: "Summit Gear",
    price: 1450000,
    compareAt: 1690000,
    stock: 18,
    rating: 4.8,
    sold: 126,
    weightGram: 2600,
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1478827387698-1527781a4887?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["2 person", "waterproof", "camping"],
    variants: [
      { name: "Forest Green", sku: "SG-TND-RDG-2P-GRN", stock: 11 },
      { name: "Sand", sku: "SG-TND-RDG-2P-SND", stock: 7 },
    ],
    specs: {
      Kapasitas: "2 orang",
      Material: "Ripstop polyester 210T",
      Flysheet: "PU 3000 mm",
      Frame: "Aluminium alloy",
    },
    description: "Tenda 2P ringan untuk pendakian dan camping akhir pekan. Ventilasi ganda, vestibule ringkas, dan flysheet tahan hujan membuatnya aman untuk kondisi gunung tropis.",
    isNew: true,
  },
  {
    name: "Alpine 45L Carrier",
    slug: "alpine-45l-carrier",
    category: "Carrier",
    categorySlug: "carrier",
    brand: "TrailForge",
    price: 875000,
    compareAt: 990000,
    stock: 9,
    rating: 4.7,
    sold: 98,
    weightGram: 1450,
    images: [
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["45L", "rain cover", "overnight"],
    variants: [
      { name: "S/M", sku: "TF-CAR-ALP45-SM", stock: 4 },
      { name: "M/L", sku: "TF-CAR-ALP45-ML", stock: 5 },
    ],
    specs: {
      Volume: "45 liter",
      Frame: "Internal frame",
      Raincover: "Included",
      Kompartemen: "Top, front, side pocket",
    },
    description: "Carrier ergonomis untuk pendakian 1-3 hari dengan hip belt tebal, frame internal, dan akses depan agar packing lebih cepat.",
  },
  {
    name: "Borneo Dry Shell Jacket",
    slug: "borneo-dry-shell-jacket",
    category: "Jaket",
    categorySlug: "jaket",
    brand: "RainPeak",
    price: 625000,
    compareAt: 0,
    stock: 22,
    rating: 4.6,
    sold: 74,
    weightGram: 420,
    images: [
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["windproof", "water repellent", "lightweight"],
    variants: [
      { name: "M", sku: "RP-JKT-BRN-M", stock: 7 },
      { name: "L", sku: "RP-JKT-BRN-L", stock: 10 },
      { name: "XL", sku: "RP-JKT-BRN-XL", stock: 5 },
    ],
    specs: {
      Layer: "2.5L shell",
      Fitur: "Adjustable hood",
      Pocket: "2 zipped pocket",
      Packing: "Packable pouch",
    },
    description: "Shell ringan untuk menahan angin dan gerimis ketika suhu turun di jalur. Cocok sebagai outer layer pendakian tropis.",
  },
  {
    name: "Campfire Compact Stove",
    slug: "campfire-compact-stove",
    category: "Cooking Set",
    categorySlug: "cooking-set",
    brand: "CampLab",
    price: 315000,
    compareAt: 385000,
    stock: 31,
    rating: 4.9,
    sold: 210,
    weightGram: 95,
    images: [
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1496947850313-7743325fa58c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["stove", "compact", "camp kitchen"],
    variants: [{ name: "Standard", sku: "CL-STV-CMP-STD", stock: 31 }],
    specs: {
      Ignition: "Manual",
      Fuel: "Screw gas canister",
      Output: "3000 W",
      Folded: "7 x 5 x 4 cm",
    },
    description: "Kompor lipat ringkas untuk memasak cepat di camp. Kaki burner stabil dan mudah disimpan di pouch kecil.",
  },
  {
    name: "Merapi Trail Shoes",
    slug: "merapi-trail-shoes",
    category: "Sepatu",
    categorySlug: "sepatu",
    brand: "TerraStep",
    price: 1095000,
    compareAt: 1295000,
    stock: 14,
    rating: 4.7,
    sold: 88,
    weightGram: 780,
    images: [
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["trail", "grip", "water resistant"],
    variants: [
      { name: "EU 40", sku: "TS-SHO-MRP-40", stock: 4 },
      { name: "EU 41", sku: "TS-SHO-MRP-41", stock: 5 },
      { name: "EU 42", sku: "TS-SHO-MRP-42", stock: 5 },
    ],
    specs: {
      Upper: "Synthetic mesh",
      Outsole: "Rubber lug 5 mm",
      Midsole: "EVA cushion",
      Use: "Hiking and trail",
    },
    description: "Sepatu trail dengan grip agresif untuk jalur tanah, kerikil, dan akar basah. Toe guard membantu melindungi ujung kaki.",
    isNew: true,
  },
  {
    name: "Polar Night Sleeping Bag",
    slug: "polar-night-sleeping-bag",
    category: "Sleeping Bag",
    categorySlug: "sleeping-bag",
    brand: "Summit Gear",
    price: 545000,
    compareAt: 650000,
    stock: 16,
    rating: 4.5,
    sold: 64,
    weightGram: 1150,
    images: [
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["sleep system", "warm", "mummy"],
    variants: [
      { name: "Regular", sku: "SG-SLB-PLR-REG", stock: 12 },
      { name: "Long", sku: "SG-SLB-PLR-LNG", stock: 4 },
    ],
    specs: {
      Shape: "Mummy",
      Comfort: "8C",
      Limit: "3C",
      Fill: "Synthetic hollow fiber",
    },
    description: "Sleeping bag mummy untuk camp dataran tinggi dengan draft collar dan compression sack agar mudah dipacking.",
  },
  {
    name: "LumenTrail Headlamp 300",
    slug: "lumentrail-headlamp-300",
    category: "Headlamp",
    categorySlug: "headlamp",
    brand: "NightPath",
    price: 265000,
    compareAt: 325000,
    stock: 27,
    rating: 4.6,
    sold: 143,
    weightGram: 88,
    images: [
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["headlamp", "rechargeable", "night hike"],
    variants: [{ name: "Black", sku: "NP-HDL-LT300-BLK", stock: 27 }],
    specs: {
      Brightness: "300 lumen",
      Battery: "USB-C rechargeable",
      Mode: "High, low, red light",
      Runtime: "Up to 12 hours",
    },
    description: "Headlamp rechargeable untuk summit attack dan aktivitas camp malam. Mode red light membantu menjaga visibilitas tanpa menyilaukan teman satu camp.",
  },
  {
    name: "Dry Trekking Pole Pair",
    slug: "dry-trekking-pole-pair",
    category: "Aksesoris",
    categorySlug: "aksesoris",
    brand: "TrailForge",
    price: 420000,
    compareAt: 0,
    stock: 20,
    rating: 4.4,
    sold: 53,
    weightGram: 520,
    images: [
      "https://images.unsplash.com/photo-1529528070131-eda9f3e90919?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["trekking pole", "balance", "aluminium"],
    variants: [{ name: "Pair", sku: "TF-ACC-POLE-PAIR", stock: 20 }],
    specs: {
      Material: "Aluminium 7075",
      Length: "65-135 cm",
      Grip: "EVA foam",
      Lock: "Quick lock",
    },
    description: "Sepasang trekking pole untuk menjaga ritme dan mengurangi beban lutut saat turun gunung.",
  },
  {
    name: "Java Rain Poncho",
    slug: "java-rain-poncho",
    category: "Jaket",
    categorySlug: "jaket",
    brand: "RainPeak",
    price: 235000,
    compareAt: 295000,
    stock: 0,
    rating: 4.3,
    sold: 41,
    weightGram: 310,
    images: [
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["poncho", "rain", "pack cover"],
    variants: [{ name: "One Size", sku: "RP-JKT-PNC-OS", stock: 0 }],
    specs: {
      Material: "PU coated polyester",
      Coverage: "Body and backpack",
      Seam: "Taped seam",
      Packing: "Compact pouch",
    },
    description: "Poncho hujan luas yang bisa menutup carrier. Cocok untuk jalur basah dan persiapan musim hujan.",
  },
  {
    name: "Basecamp Nesting Set",
    slug: "basecamp-nesting-set",
    category: "Cooking Set",
    categorySlug: "cooking-set",
    brand: "CampLab",
    price: 395000,
    compareAt: 465000,
    stock: 12,
    rating: 4.8,
    sold: 71,
    weightGram: 620,
    images: [
      "https://images.unsplash.com/photo-1496947850313-7743325fa58c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["nesting", "cookware", "2-3 person"],
    variants: [{ name: "2-3 Person", sku: "CL-CKW-NEST-23", stock: 12 }],
    specs: {
      Material: "Hard anodized aluminium",
      Include: "Pot, pan, bowl",
      Capacity: "1.8 L pot",
      Handle: "Foldable",
    },
    description: "Set nesting compact untuk memasak menu camp 2-3 orang. Mudah ditumpuk dan hemat ruang di carrier.",
  },
  {
    name: "Summit Daypack 25L",
    slug: "summit-daypack-25l",
    category: "Carrier",
    categorySlug: "carrier",
    brand: "Summit Gear",
    price: 495000,
    compareAt: 0,
    stock: 24,
    rating: 4.5,
    sold: 112,
    weightGram: 680,
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["day hike", "25L", "hydration"],
    variants: [
      { name: "Olive", sku: "SG-CAR-DAY25-OLV", stock: 13 },
      { name: "Black", sku: "SG-CAR-DAY25-BLK", stock: 11 },
    ],
    specs: {
      Volume: "25 liter",
      Hydration: "Compatible",
      Pocket: "Front stash pocket",
      Raincover: "Optional",
    },
    description: "Daypack ringan untuk tektok dan aktivitas outdoor harian. Panel belakang breathable dan kompartemen cukup untuk essentials.",
  },
  {
    name: "Rinjani Inflatable Mat",
    slug: "rinjani-inflatable-mat",
    category: "Aksesoris",
    categorySlug: "aksesoris",
    brand: "SleepRidge",
    price: 575000,
    compareAt: 695000,
    stock: 8,
    rating: 4.6,
    sold: 47,
    weightGram: 520,
    images: [
      "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["sleeping mat", "inflatable", "compact"],
    variants: [{ name: "Regular", sku: "SR-ACC-MAT-REG", stock: 8 }],
    specs: {
      Type: "Inflatable",
      Thickness: "6 cm",
      RValue: "2.2",
      Packed: "28 x 10 cm",
    },
    description: "Matras inflatable untuk tidur lebih nyaman di camp. Ringkas saat dipacking dan cukup tebal untuk permukaan tanah tidak rata.",
  },
];

export const featuredProducts = catalogProducts.slice(0, 4);

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
  { label: "Katalog", value: `${catalogProducts.length} produk mock`, icon: Boxes },
  { label: "Order Aktif", value: "Belum terhubung", icon: ShoppingBag },
  { label: "CS", value: "WhatsApp siap", icon: MessageSquareWarning },
  { label: "Web", value: "Mobile-first", icon: Home },
];

export const catalogBrands = Array.from(new Set(catalogProducts.map((product) => product.brand))).sort();

export function getDiscountPercent(product: ProductCatalogItem) {
  if (!product.compareAt || product.compareAt <= product.price) {
    return 0;
  }

  return Math.round(((product.compareAt - product.price) / product.compareAt) * 100);
}

export function getProductBySlug(slug: string) {
  return catalogProducts.find((product) => product.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categoryCatalog.find((category) => category.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return catalogProducts.filter((product) => product.categorySlug === categorySlug);
}

export function filterProducts(products: ProductCatalogItem[], filters: CatalogFilters) {
  const search = filters.search?.trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch = search
      ? [product.name, product.category, product.brand, product.description, ...product.tags].join(" ").toLowerCase().includes(search)
      : true;
    const matchesCategory = filters.categorySlugs?.length ? filters.categorySlugs.includes(product.categorySlug) : true;
    const matchesBrand = filters.brands?.length ? filters.brands.includes(product.brand) : true;
    const matchesMinPrice = filters.minPrice ? product.price >= filters.minPrice : true;
    const matchesMaxPrice = filters.maxPrice ? product.price <= filters.maxPrice : true;
    const matchesRating = filters.minRating ? product.rating >= filters.minRating : true;
    const matchesDiscount = filters.discountOnly ? getDiscountPercent(product) > 0 : true;
    const matchesStock = filters.inStockOnly ? product.stock > 0 : true;

    return matchesSearch && matchesCategory && matchesBrand && matchesMinPrice && matchesMaxPrice && matchesRating && matchesDiscount && matchesStock;
  });
}

export function sortProducts(products: ProductCatalogItem[], sortKey: CatalogSortKey) {
  const sorted = [...products];

  switch (sortKey) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "best-selling":
      return sorted.sort((a, b) => b.sold - a.sold);
    case "rating-desc":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "newest":
    default:
      return sorted.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
  }
}
