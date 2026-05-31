import { catalogProducts, getDiscountPercent, getProductBySlug, type ProductCatalogItem } from "@/lib/constants";
import { type OrderMock, type OrderTimelineItemMock } from "@/lib/order-mock";

export type ReviewMock = {
  id: string;
  productSlug: string;
  orderId: string;
  customerName: string;
  rating: number;
  text: string;
  photos: string[];
  status: "PUBLISHED" | "PENDING_MODERATION";
  createdAt: string;
  variant: string;
};

export type WishlistMockItem = {
  id: string;
  product: ProductCatalogItem;
  addedAt: string;
  priceDrop: number;
  notify: boolean;
};

export type ReturnRequestMock = {
  id: string;
  orderId: string;
  orderNumber: string;
  productName: string;
  reason: string;
  status: "REQUESTED" | "REVIEWING" | "APPROVED" | "REJECTED";
  refundStatus: "NOT_STARTED" | "MANUAL_REVIEW" | "PROCESSED";
  createdAt: string;
  ruleNote: string;
  timeline: OrderTimelineItemMock[];
};

export type ComplaintMock = {
  id: string;
  orderId: string;
  orderNumber: string;
  title: string;
  channel: "Order" | "Produk" | "Pengiriman";
  status: "OPEN" | "IN_REVIEW" | "RESOLVED";
  createdAt: string;
  responseSla: string;
  summary: string;
};

export type FaqItemMock = {
  id: string;
  category: "Belanja" | "Pembayaran" | "Pengiriman" | "Return" | "Akun";
  question: string;
  answer: string;
};

export type ArticleMock = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  image: string;
  author: string;
  publishedAt: string;
  tags: string[];
  content: string[];
};

export const reviews: ReviewMock[] = [
  {
    id: "review-tent-1",
    productSlug: "summit-ridge-tent-2p",
    orderId: "SG-20260521-0017",
    customerName: "Raka Pratama",
    rating: 5,
    text: "Frame stabil dan flysheet terasa aman saat hujan sore. Ruang vestibule cukup untuk dua carrier kecil.",
    photos: ["https://images.unsplash.com/photo-1478827387698-1527781a4887?auto=format&fit=crop&w=400&q=80"],
    status: "PUBLISHED",
    createdAt: "25 Mei 2026",
    variant: "Forest Green",
  },
  {
    id: "review-tent-2",
    productSlug: "summit-ridge-tent-2p",
    orderId: "SG-20260529-0008",
    customerName: "Nadia Laras",
    rating: 4,
    text: "Setup cepat untuk camp weekend. Akan lebih enak kalau pasak tambahannya dijual sebagai bundle.",
    photos: [],
    status: "PUBLISHED",
    createdAt: "30 Mei 2026",
    variant: "Sand",
  },
  {
    id: "review-stove-1",
    productSlug: "campfire-compact-stove",
    orderId: "SG-20260521-0017",
    customerName: "Dimas Ananda",
    rating: 5,
    text: "Kecil, ringan, dan api stabil. Cocok untuk masak cepat di camp tanpa makan banyak ruang carrier.",
    photos: ["https://images.unsplash.com/photo-1496947850313-7743325fa58c?auto=format&fit=crop&w=400&q=80"],
    status: "PUBLISHED",
    createdAt: "24 Mei 2026",
    variant: "Standard",
  },
];

export const wishlistItems: WishlistMockItem[] = ["summit-ridge-tent-2p", "alpine-45l-carrier", "lumentrail-headlamp-300", "rinjani-inflatable-mat"].map((slug, index) => {
  const product = getProductBySlug(slug) ?? catalogProducts[index];

  return {
    id: `wishlist-${slug}`,
    product,
    addedAt: `${20 + index} Mei 2026`,
    priceDrop: getDiscountPercent(product),
    notify: index !== 1,
  };
});

export const returnRequests: ReturnRequestMock[] = [
  {
    id: "RMA-20260525-002",
    orderId: "SG-20260521-0017",
    orderNumber: "SG-20260521-0017",
    productName: "Campfire Compact Stove",
    reason: "Barang salah kirim",
    status: "REVIEWING",
    refundStatus: "MANUAL_REVIEW",
    createdAt: "25 Mei 2026",
    ruleNote: "Return dalam 7 hari setelah diterima, bukti foto wajib, refund manual oleh admin finance.",
    timeline: [
      { label: "Return diajukan", description: "Customer memilih alasan dan mengunggah bukti foto mock.", date: "25 Mei 2026, 09:12 WIB", complete: true },
      { label: "Review admin", description: "Admin CS memeriksa bukti dan kondisi barang.", date: "Sedang berjalan", complete: true, current: true },
      { label: "Keputusan", description: "Return disetujui atau ditolak setelah verifikasi.", date: "Menunggu", complete: false },
      { label: "Refund manual", description: "Refund diproses manual jika return disetujui.", date: "Menunggu", complete: false },
    ],
  },
  {
    id: "RMA-20260518-001",
    orderId: "SG-20260521-0017",
    orderNumber: "SG-20260521-0017",
    productName: "LumenTrail Headlamp 300",
    reason: "Kemasan rusak",
    status: "APPROVED",
    refundStatus: "PROCESSED",
    createdAt: "18 Mei 2026",
    ruleNote: "Ongkir return ditanggung Summit Gear untuk kesalahan gudang atau barang rusak.",
    timeline: [
      { label: "Return diajukan", description: "Bukti foto diterima.", date: "18 Mei 2026", complete: true },
      { label: "Review admin", description: "Barang memenuhi kebijakan return.", date: "19 Mei 2026", complete: true },
      { label: "Disetujui", description: "Instruksi kirim balik dikirim ke customer.", date: "19 Mei 2026", complete: true },
      { label: "Refund manual", description: "Refund dicatat sebagai processed mock.", date: "21 Mei 2026", complete: true, current: true },
    ],
  },
];

export const complaints: ComplaintMock[] = [
  {
    id: "CMP-20260530-006",
    orderId: "SG-20260529-0008",
    orderNumber: "SG-20260529-0008",
    title: "Resi belum bergerak",
    channel: "Pengiriman",
    status: "IN_REVIEW",
    createdAt: "30 Mei 2026",
    responseSla: "Estimasi respon 1x24 jam",
    summary: "Customer meminta pengecekan status pickup kurir karena tracking belum berubah.",
  },
  {
    id: "CMP-20260523-003",
    orderId: "SG-20260521-0017",
    orderNumber: "SG-20260521-0017",
    title: "Item kurang satu",
    channel: "Order",
    status: "RESOLVED",
    createdAt: "23 Mei 2026",
    responseSla: "Selesai",
    summary: "Admin mengirim item pengganti setelah verifikasi packing list.",
  },
];

export const faqs: FaqItemMock[] = [
  { id: "faq-rental", category: "Belanja", question: "Apakah Summit Gear melayani rental?", answer: "Tidak untuk MVP. PRD membatasi scope pada penjualan produk milik Summit Gear." },
  { id: "faq-cod", category: "Pembayaran", question: "Apakah COD tersedia?", answer: "COD disiapkan dengan limit Rp1.500.000, nomor HP wajib, dan dukungan wilayah yang divalidasi backend." },
  { id: "faq-owner", category: "Belanja", question: "Apakah semua produk milik Summit Gear?", answer: "Ya. Model bisnis B2C retail dengan Summit Gear sebagai satu-satunya penjual." },
  { id: "faq-return", category: "Return", question: "Berapa batas waktu return?", answer: "Return maksimal 7 hari setelah barang diterima, barang harus dalam kondisi asli, dan bukti foto wajib dilampirkan." },
  { id: "faq-refund", category: "Return", question: "Apakah refund otomatis?", answer: "Tidak. Refund diproses manual oleh Admin Finance atau Super Admin setelah return disetujui dan barang diverifikasi." },
  { id: "faq-shipping", category: "Pengiriman", question: "Kapan resi tampil?", answer: "Resi tampil setelah admin fulfillment memasukkan nomor resi saat order sudah diproses gudang." },
  { id: "faq-account", category: "Akun", question: "Kenapa review hanya muncul setelah order selesai?", answer: "PRD mensyaratkan review hanya bisa dibuat setelah order berstatus selesai untuk menjaga kualitas rating." },
];

export const articles: ArticleMock[] = [
  {
    slug: "checklist-pendakian-pertama-untuk-pemula",
    title: "Checklist Pendakian Pertama untuk Pemula",
    excerpt: "Panduan ringkas memilih gear wajib, packing, dan kebiasaan aman sebelum mulai naik gunung.",
    category: "Edukasi",
    readingTime: "6 menit",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80",
    author: "Summit Editorial",
    publishedAt: "31 Mei 2026",
    tags: ["pemula", "checklist", "safety"],
    content: [
      "Pendakian pertama lebih nyaman ketika kebutuhan dasar sudah jelas: shelter, sistem tidur, pakaian berlapis, hidrasi, makanan, navigasi, dan lampu cadangan.",
      "Mulai dari rute pendek dan cek prakiraan cuaca. Gear ringan membantu, tetapi keputusan aman di jalur jauh lebih penting daripada sekadar membawa perlengkapan mahal.",
      "Gunakan checklist untuk memastikan barang kecil seperti headlamp, dry bag, obat pribadi, dan jas hujan tidak tertinggal.",
    ],
  },
  {
    slug: "cara-memilih-carrier-sesuai-durasi-perjalanan",
    title: "Cara Memilih Carrier Sesuai Durasi Perjalanan",
    excerpt: "Pilih kapasitas carrier berdasarkan durasi, volume logistik, dan kenyamanan punggung.",
    category: "Gear Guide",
    readingTime: "5 menit",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1400&q=80",
    author: "Summit Editorial",
    publishedAt: "29 Mei 2026",
    tags: ["carrier", "packing", "overnight"],
    content: [
      "Day hike biasanya cukup 20-30 liter, sedangkan perjalanan 2-3 hari lebih aman memakai 40-50 liter dengan hip belt yang menopang beban.",
      "Perhatikan panjang torso, akses kompartemen, rain cover, dan distribusi beban. Carrier yang pas akan terasa stabil walaupun jalur menanjak.",
      "Simpan barang berat dekat punggung dan letakkan item yang sering dipakai di pocket luar.",
    ],
  },
  {
    slug: "perawatan-tenda-setelah-hujan-dan-lumpur",
    title: "Perawatan Tenda Setelah Hujan dan Lumpur",
    excerpt: "Cara membersihkan, mengeringkan, dan menyimpan tenda agar lapisan tetap awet.",
    category: "Maintenance",
    readingTime: "4 menit",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1400&q=80",
    author: "Summit Editorial",
    publishedAt: "27 Mei 2026",
    tags: ["tenda", "maintenance", "camping"],
    content: [
      "Jangan menyimpan tenda dalam kondisi lembap. Keringkan flysheet, inner, dan groundsheet secara terpisah setelah dipakai di jalur basah.",
      "Bersihkan lumpur memakai kain lembut dan air bersih. Hindari deterjen keras karena dapat merusak coating waterproof.",
      "Simpan pole dan pasak dalam pouch terpisah agar tidak menusuk kain saat tenda dipacking.",
    ],
  },
];

export function getReviewsByProductSlug(productSlug: string) {
  return reviews.filter((review) => review.productSlug === productSlug && review.status === "PUBLISHED");
}

export function getRatingSummary(productSlug: string) {
  const productReviews = getReviewsByProductSlug(productSlug);
  const count = productReviews.length;
  const average = count ? productReviews.reduce((sum, review) => sum + review.rating, 0) / count : 0;
  const distribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: productReviews.filter((review) => review.rating === rating).length,
  }));

  return { average, count, distribution };
}

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getRelatedArticles(slug: string) {
  const current = getArticleBySlug(slug);

  return articles.filter((article) => article.slug !== slug && (!current || article.category === current.category || article.tags.some((tag) => current.tags.includes(tag)))).slice(0, 2);
}

export function getEligibleReviewItems(order: OrderMock) {
  if (order.status !== "COMPLETED") {
    return [];
  }

  return order.items.filter((item) => !reviews.some((review) => review.orderId === order.id && review.productSlug === item.product.slug));
}
