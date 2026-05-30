# Product Requirements Document (PRD)
## Summit Gear — Responsive Web B2C E-Commerce Peralatan Pendakian

---

| Field | Detail |
|---|---|
| **Nama Produk** | Summit Gear |
| **Tipe** | Responsive Web Application (B2C E-Commerce) |
| **Platform** | Web responsive berbasis Next.js, mobile-first |
| **Model Bisnis** | Retail B2C E-Commerce, Summit Gear sebagai satu-satunya penjual/penyedia produk |
| **Scope Produk** | Penjualan peralatan pendakian, tidak mencakup rental/penyewaan pada MVP |
| **Versi Dokumen** | 3.0 Web |
| **Tanggal** | 30 Mei 2026 |

---

## 1. Gambaran Umum

Summit Gear adalah platform web e-commerce tersentralisasi untuk penjualan peralatan pendakian. Seluruh produk yang dijual merupakan inventory milik Summit Gear. Pengelolaan katalog, stok, pesanan, pembayaran, pengiriman, promo, artikel, layanan pelanggan, review, return, dan laporan operasional dikendalikan oleh tim internal melalui Admin Backoffice pada route `/admin`.

Website dikembangkan dengan pendekatan **mobile-first responsive** agar nyaman digunakan dari perangkat mobile, tablet, dan desktop. Sistem tetap dirancang scalable, aman, dan modular agar dapat dikembangkan ke tahap lebih besar tanpa perubahan arsitektur besar.

### 1.1 Visi

Menjadi platform web terpercaya di Indonesia untuk pembelian peralatan pendakian yang lengkap, aman, mudah digunakan, dan informatif bagi pendaki pemula maupun berpengalaman.

### 1.2 Target Pengguna

- Pendaki pemula yang membutuhkan perlengkapan pendakian dasar.
- Pendaki berpengalaman yang mencari gear spesifik.
- Komunitas outdoor dan camping.
- Pengguna usia 18–45 tahun di Indonesia.
- Pengguna mobile browser yang membutuhkan pengalaman belanja cepat dan ringan.

### 1.3 Prinsip Produk

| Prinsip | Penjelasan |
|---|---|
| **Mobile-first** | Desain dan pengalaman utama dioptimalkan untuk layar mobile terlebih dahulu, lalu disesuaikan ke tablet dan desktop. |
| **Scalable** | Arsitektur dibuat modular agar mudah dikembangkan ke storage lain, payment extension, role baru, dan integrasi logistik lanjutan. |
| **Secure by design** | Keamanan diterapkan pada autentikasi, otorisasi, validasi input, pembayaran, upload file, dan akses admin. |
| **SEO-ready** | Website harus mudah ditemukan melalui search engine, terutama halaman produk, kategori, dan artikel. |
| **Operationally manageable** | Admin dapat mengelola katalog, stok, order, promo, return, CS, dan laporan dari satu backoffice. |

---

## 2. Fitur MVP (Minimum Viable Product)

MVP Summit Gear tetap mempertahankan cakupan fitur dari PRD sebelumnya, tetapi disesuaikan untuk kebutuhan web responsive, Next.js, SEO, dan backoffice berbasis `/admin`.

### 2.1 Autentikasi & Profil User

| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| A-01 | Register | Registrasi via email dan password. | Tinggi |
| A-02 | Login | Login via email/password, Google Login, dan Apple Login. | Tinggi |
| A-03 | Lupa Password | Reset password via email. | Tinggi |
| A-04 | Profil User | Edit nama, nomor HP, dan foto profil. | Sedang |
| A-05 | Manajemen Alamat | CRUD alamat pengiriman, menyimpan multiple alamat, dan menetapkan alamat utama. | Tinggi |
| A-06 | Verifikasi Email | Mengirim link verifikasi saat register. | Sedang |
| A-07 | Session Management | Mengelola session login web secara aman, termasuk logout dan proteksi halaman akun. | Tinggi |

### 2.2 Katalog & Pencarian Produk

| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| C-01 | Homepage | Banner promo, kategori, produk terlaris, rekomendasi, flash sale, dan highlight campaign. | Tinggi |
| C-02 | List Produk | Grid/list produk responsive dengan pagination atau infinite scroll. | Tinggi |
| C-03 | Filter & Sort | Filter kategori, harga, brand, rating, dan diskon. Sort terbaru, termurah, termahal, terlaris, dan rating tertinggi. | Tinggi |
| C-04 | Search Bar | Pencarian produk dengan autocomplete dan search history. | Tinggi |
| C-05 | Detail Produk | Multi-foto, zoom image, video opsional, deskripsi, varian, stok, berat, harga, harga coret, rating, dan CTA add to cart. | Tinggi |
| C-06 | Kategori | Hierarki kategori: Tenda, Sleeping Bag, Carrier, Sepatu, Jaket, Harness, Carabiner, Headlamp, Matras, Cooking Set, Aksesoris, dan kategori lain yang relevan. | Tinggi |
| C-07 | Size Guide | Panduan ukuran untuk sepatu, jaket, carrier, dan produk lain yang membutuhkan ukuran. | Sedang |
| C-08 | Gear Checklist | Template checklist peralatan per jenis aktivitas, seperti pendakian gunung, tebing, camping, dan item dapat ditambahkan ke cart. | Sedang |
| C-09 | Produk Terkait | Rekomendasi produk serupa atau pelengkap di halaman detail produk. | Sedang |
| C-10 | SEO Produk | URL produk SEO-friendly, metadata produk, Open Graph image, dan schema markup produk. | Tinggi |

### 2.3 Keranjang & Checkout

| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| K-01 | Add to Cart | Menambahkan produk ke keranjang dengan pilihan varian. | Tinggi |
| K-02 | Lihat Keranjang | Menampilkan item, update quantity, hapus item, subtotal, estimasi berat, dan estimasi total. | Tinggi |
| K-03 | Checkout | Alur: pilih alamat → pilih kurir → pilih pembayaran → apply voucher → konfirmasi order. | Tinggi |
| K-04 | Kalkulasi Ongkir | Hitung ongkir real-time berdasarkan alamat dan berat total pesanan. | Tinggi |
| K-05 | Pilih Kurir | Pilihan kurir dan service pengiriman dari gudang Summit Gear. | Tinggi |
| K-06 | Apply Voucher | Input kode voucher, validasi, dan penerapan diskon. | Tinggi |
| K-07 | Ringkasan Pesanan | Review item, alamat, ongkir, voucher, biaya tambahan jika ada, dan total pembayaran. | Tinggi |
| K-08 | Reserved Stock | Stok di-reserve saat checkout dan dilepas kembali jika pembayaran gagal atau expired. | Tinggi |

### 2.4 Pembayaran

| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| P-01 | Payment Gateway | Integrasi Midtrans sebagai payment gateway utama. | Tinggi |
| P-02 | Virtual Account | VA BCA, BNI, BRI, Mandiri, Permata, atau channel VA lain yang tersedia melalui Midtrans. | Tinggi |
| P-03 | QRIS | Pembayaran QRIS melalui Midtrans. | Tinggi |
| P-04 | E-Wallet | GoPay, OVO, DANA, ShopeePay, atau e-wallet lain sesuai dukungan Midtrans. | Tinggi |
| P-05 | Kartu Kredit/Debit | Pembayaran kartu kredit/debit melalui Midtrans. | Tinggi |
| P-06 | COD | Bayar di tempat kepada kurir saat barang diantar. Tidak ada pickup toko. | Rendah |
| P-07 | Countdown Timer | Batas waktu pembayaran, misalnya 24 jam untuk VA dan 15 menit untuk e-wallet/QRIS. | Tinggi |
| P-08 | Konfirmasi Bayar | Halaman status setelah pembayaran berhasil, pending, gagal, atau expired. | Tinggi |
| P-09 | Webhook Midtrans | Endpoint server untuk menerima update status transaksi dari Midtrans. | Tinggi |

**Catatan:** Transfer manual tidak masuk MVP.

### 2.5 Order Management Customer

| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| O-01 | Daftar Pesanan | Menampilkan semua pesanan customer dengan tab status. | Tinggi |
| O-02 | Detail Pesanan | Informasi item, alamat, pembayaran, ongkir, voucher, status, dan timeline order. | Tinggi |
| O-03 | Status Pesanan | Menunggu Pembayaran → Diproses → Dikirim → Diterima/Selesai. | Tinggi |
| O-04 | Batalkan Pesanan | Customer dapat membatalkan pesanan sebelum dibayar atau sebelum diproses. | Tinggi |
| O-05 | Tracking Pengiriman | Menampilkan nomor resi dan link tracking ke website kurir. | Tinggi |
| O-06 | Konfirmasi Diterima | Customer mengonfirmasi barang sudah diterima. | Tinggi |
| O-07 | Return / Pengembalian | Customer mengajukan return melalui sistem dengan alasan dan upload foto bukti. | Sedang |
| O-08 | Riwayat Pesanan | Menampilkan pesanan selesai. | Tinggi |
| O-09 | Komplain Order | Customer dapat mengajukan kendala untuk item tertentu, seperti barang kurang, rusak, atau salah kirim. | Sedang |

### 2.6 Review & Rating

| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| R-01 | Tulis Review Produk | Bintang 1–5, teks, dan foto. Hanya bisa dilakukan setelah pesanan selesai. | Sedang |
| R-02 | Lihat Review Produk | Menampilkan review di halaman detail produk dengan filter rating. | Sedang |
| R-03 | Rating Summary Produk | Rata-rata rating dan distribusi bintang. | Sedang |
| R-04 | Moderasi Review | Admin dapat menyembunyikan review yang melanggar aturan. | Sedang |

### 2.7 Wishlist

| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| W-01 | Tambah Wishlist | Customer dapat menyimpan produk ke daftar favorit. | Sedang |
| W-02 | Lihat Wishlist | Halaman daftar produk favorit. | Sedang |
| W-03 | Notifikasi Diskon Wishlist | Notifikasi saat produk wishlist mendapat diskon. | Rendah |

### 2.8 Notifikasi

| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| N-01 | Email Notification | Email untuk verifikasi, reset password, order berhasil, pembayaran berhasil, order dikirim, dan status return. | Tinggi |
| N-02 | In-App Notification | Halaman notifikasi di akun customer. | Sedang |
| N-03 | Web Push Notification | Notifikasi browser untuk promo, restock, atau update penting. | Rendah |
| N-04 | Notification Preferences | Customer dapat memilih jenis notifikasi yang ingin diterima. | Sedang |

### 2.9 Promo & Diskon

| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| D-01 | Voucher Diskon | Kode promo untuk potongan harga, free ongkir, dan campaign tertentu. | Tinggi |
| D-02 | Diskon Produk | Harga coret dan harga diskon di list dan detail produk. | Tinggi |
| D-03 | Flash Sale | Promo waktu terbatas dengan countdown timer. | Sedang |
| D-04 | Banner Promo | Carousel banner di homepage dan halaman promo. | Tinggi |

### 2.10 Customer Service

| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| CS-01 | WhatsApp Chat | Tombol chat langsung ke nomor WhatsApp CS. | Tinggi |
| CS-02 | FAQ | Halaman pertanyaan umum. | Sedang |
| CS-03 | Customer Support Dashboard | Admin CS dapat melihat komplain dan riwayat penyelesaian masalah customer. | Rendah |

### 2.11 Artikel / Blog

| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| B-01 | List Artikel | Daftar artikel tips, review gear, dan edukasi pendaki pemula. | Rendah |
| B-02 | Detail Artikel | Halaman baca artikel. | Rendah |
| B-03 | SEO Artikel | Slug, meta title, meta description, dan Open Graph image untuk artikel. | Rendah |

### 2.12 Admin / Backoffice Web Portal

Modul sentral untuk tim internal Summit Gear pada route `/admin`.

| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| AD-01 | Dashboard Utama | Ringkasan total penjualan, order aktif, produk terlaris, revenue bulanan, dan low stock. | Tinggi |
| AD-02 | Manajemen Katalog & Inventory | CRUD produk, varian, stok, harga beli, harga jual, margin, foto, status aktif/nonaktif. | Tinggi |
| AD-03 | Stock Alert System | Notifikasi jika stok varian di bawah threshold, default < 10 unit. | Tinggi |
| AD-04 | Manajemen Order & Fulfillment | List order, cetak invoice, cetak packing list, update status order, dan input resi. | Tinggi |
| AD-05 | Manajemen Promo & Voucher | CRUD voucher, periode aktif, kuota, tipe diskon, minimum belanja, maksimum diskon. | Tinggi |
| AD-06 | Manajemen Banner & Flash Sale | CRUD banner homepage, jadwal flash sale, dan produk partisipan. | Tinggi |
| AD-07 | Manajemen Kategori | CRUD kategori produk, hierarki, icon, dan slug. | Sedang |
| AD-08 | Manajemen Customer | Daftar customer, detail profil, riwayat belanja, dan ban/unban akun. | Sedang |
| AD-09 | Laporan Penjualan & Analytics | Laporan harian/bulanan, laba kotor, produk terlaris, pertumbuhan user, dan performa promo. | Tinggi |
| AD-10 | Manajemen Return / RMA | Daftar pengajuan return, approve/reject, update status return, dan pencatatan refund manual. | Sedang |
| AD-11 | Customer Support Dashboard | Riwayat komplain pesanan dan resolusi. | Rendah |
| AD-12 | RBAC Admin | Role-based access control untuk membatasi akses modul sesuai role admin. | Tinggi |

### 2.13 Role & Permission Admin

| Role | Akses Utama |
|---|---|
| **Super Admin** | Akses penuh ke seluruh modul, manajemen admin, konfigurasi, produk, order, pembayaran, voucher, banner, laporan, return, dan customer. |
| **Admin Operasional** | Produk, kategori, stok, order fulfillment, input resi, cetak invoice/packing list, dan update status pesanan. |
| **Admin Marketing** | Voucher, diskon, banner promo, flash sale, artikel/blog, dan campaign. |
| **Admin Customer Service** | Komplain, return request, review bermasalah, dan data pesanan untuk kebutuhan bantuan customer. |
| **Admin Finance** | Monitoring pembayaran, COD, laporan transaksi, refund manual, dan rekonsiliasi Midtrans. |

Satu orang dapat memiliki lebih dari satu role, tetapi sistem permission tetap disiapkan secara modular.

### 2.14 Fitur Pendukung Web

| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| F-01 | SEO-Friendly URL | URL produk, kategori, promo, dan artikel menggunakan slug yang mudah dibaca. | Tinggi |
| F-02 | Social Sharing | Link produk dapat dibagikan ke WhatsApp, media sosial, atau platform lain. | Sedang |
| F-03 | Browser Compatibility | Mendukung browser modern seperti Chrome, Edge, Firefox, Safari, dan mobile browser. | Tinggi |
| F-04 | Cache Busting & Asset Versioning | Menghindari masalah asset lama setelah deployment. | Tinggi |
| F-05 | Responsive Navigation | Header desktop, hamburger menu mobile, cart shortcut, account menu, dan admin sidebar. | Tinggi |
| F-06 | Sitemap & Robots | Sitemap.xml dan robots.txt untuk SEO. | Tinggi |
| F-07 | Web Accessibility Basic | Kontras warna, alt image, focus state, label form, dan navigasi keyboard dasar. | Sedang |

---

## 3. Fitur Post-MVP (Fase 2+)

| Fitur | Deskripsi |
|---|---|
| Loyalty / Poin | Sistem poin untuk repeat buyer dan tier membership. |
| Live Chat In-Web | Chat real-time dengan CS di dalam website. |
| Komunitas / Forum | Sharing trip report dan rekomendasi gear antar user. |
| AR Try-On | Coba virtual sepatu/jaket via AR. |
| Notifikasi Harga | Alert saat harga produk turun. |
| Dark Mode | Tema gelap. |
| Multi-bahasa | Bahasa Indonesia dan English. |
| Web Push Advanced | Web push otomatis untuk promo, wishlist discount, abandoned cart, dan restock. |
| Logistic Aggregator Integration | Integrasi otomatis untuk generate resi dan update tracking. |

**Catatan:** Rental/penyewaan tidak masuk scope Summit Gear versi MVP. Jika suatu saat diperlukan, rental harus dibuat sebagai modul bisnis terpisah karena membutuhkan inventory berbasis tanggal, durasi sewa, deposit, denda, dan pengembalian barang.

---

## 4. Alur Utama (User Flow)

### 4.1 Alur Pembelian

```text
Buka Website → Browse/Cari Produk → Lihat Detail Produk → Add to Cart
→ Lihat Keranjang → Checkout → Pilih Alamat → Pilih Kurir
→ Apply Voucher (opsional) → Ringkasan Pesanan → Pilih Metode Pembayaran
→ Bayar via Midtrans / COD → Order Masuk → Diproses Tim Internal
→ Dikirim → Tracking → Diterima → Selesai → Review
```

### 4.2 Alur Registrasi

```text
Buka Website → Register → Input Email & Password / Google / Apple
→ Verifikasi Email → Lengkapi Profil → Tambah Alamat → Selesai
```

### 4.3 Alur Return

```text
Detail Pesanan Selesai → Ajukan Return → Pilih Alasan + Upload Foto
→ Submit → Menunggu Review Admin → Disetujui/Ditolak
→ Jika disetujui, customer mengikuti instruksi pengembalian
→ Admin menerima barang → Admin Finance/Super Admin memproses refund manual
→ Status return selesai
```

### 4.4 Alur Pemrosesan Order Admin

```text
Customer membayar order → Order masuk tab Perlu Diproses di /admin
→ Admin Operasional mencetak invoice dan packing list
→ Admin gudang menyiapkan barang dan packing
→ Admin menyerahkan paket ke kurir
→ Admin input nomor resi manual atau sistem menerima resi otomatis jika integrasi tersedia
→ Status order berubah menjadi Dikirim
→ Customer menerima tracking di halaman pesanan dan email/in-app notification
```

### 4.5 Alur COD

```text
Customer checkout → Pilih COD → Sistem validasi limit COD dan wilayah dukungan
→ Order dibuat dengan status COD Menunggu Diproses
→ Admin memproses pesanan → Barang dikirim
→ Customer membayar ke kurir saat barang diterima
→ Admin Finance melakukan rekonsiliasi COD
→ Order selesai
```

---

## 5. Arsitektur Teknis (High-Level)

### 5.1 Tech Stack

| Layer | Teknologi |
|---|---|
| **Web Application** | Next.js fullstack, App Router |
| **UI Styling** | Tailwind CSS + shadcn/ui sebagai component library utama |
| **Backend/API** | Next.js Route Handler / Server Action |
| **Database** | PostgreSQL |
| **Database Provider** | Supabase PostgreSQL |
| **ORM** | Prisma |
| **Authentication** | Auth.js / NextAuth dengan email-password, Google OAuth, dan Apple Login |
| **Authorization** | RBAC berbasis role dan permission |
| **Payment Gateway** | Midtrans |
| **Ongkir API** | RajaOngkir sebagai utama, BinderByte sebagai alternatif |
| **Storage Gambar** | Cloudinary sebagai provider utama, dengan abstraction layer agar dapat migrasi ke AWS S3, Supabase Storage, GCS, atau S3-compatible storage |
| **Email Service** | Brevo sebagai provider utama, SMTP-compatible sebagai fallback |
| **Notification** | Email, in-app notification, web push prioritas rendah |
| **Component Library** | shadcn/ui untuk komponen reusable seperti button, input, dialog, form, table, dropdown, sheet, card, tabs, badge, toast, dan data table |
| **Error Tracking** | Sentry / similar |
| **Analytics** | Google Analytics / Mixpanel |
| **Deployment** | Vercel untuk web app, Supabase untuk PostgreSQL, Cloudinary untuk media |

### 5.2 Struktur Route Web

| Area | Route |
|---|---|
| Homepage | `/` |
| Katalog Produk | `/produk` |
| Detail Produk | `/produk/[slug]` |
| Kategori | `/kategori/[slug]` |
| Keranjang | `/keranjang` |
| Checkout | `/checkout` |
| Status Pembayaran | `/pembayaran/[orderId]` |
| Profil User | `/akun/profil` |
| Alamat User | `/akun/alamat` |
| Pesanan User | `/akun/pesanan` |
| Detail Pesanan | `/akun/pesanan/[orderId]` |
| Wishlist | `/akun/wishlist` |
| Notifikasi | `/akun/notifikasi` |
| Artikel | `/artikel` |
| Detail Artikel | `/artikel/[slug]` |
| FAQ | `/faq` |
| Admin Dashboard | `/admin` |
| Admin Produk | `/admin/produk` |
| Admin Kategori | `/admin/kategori` |
| Admin Pesanan | `/admin/pesanan` |
| Admin Voucher | `/admin/voucher` |
| Admin Banner | `/admin/banner` |
| Admin Flash Sale | `/admin/flash-sale` |
| Admin Return | `/admin/return` |
| Admin Customer | `/admin/customer` |
| Admin Artikel | `/admin/artikel` |
| Admin Laporan | `/admin/laporan` |
| Admin Role & Permission | `/admin/role` |

### 5.3 Entity Utama

- **User** — id, nama, email, password_hash, no_hp, foto, email_verified_at, provider, created_at.
- **AdminUser** — id, user_id, role_id, status, created_at.
- **Role** — id, nama, deskripsi.
- **Permission** — id, kode, nama, modul.
- **RolePermission** — id, role_id, permission_id.
- **Product** — id, nama, slug, deskripsi, kategori_id, brand_id, berat, harga, harga_diskon, foto[], video_url, is_active, meta_title, meta_description.
- **ProductVariant** — id, product_id, sku, ukuran, warna, stok, stok_minimum, harga_tambahan.
- **Category** — id, nama, slug, parent_id, icon, meta_title, meta_description.
- **Brand** — id, nama, slug.
- **Cart** — id, user_id, created_at, updated_at.
- **CartItem** — id, cart_id, product_id, variant_id, qty.
- **Order** — id, user_id, alamat_pengiriman, ongkir, voucher_id, total, status, payment_method, created_at.
- **OrderItem** — id, order_id, product_id, product_variant_id, qty, harga_satuan, subtotal.
- **Payment** — id, order_id, metode, status, waktu_bayar, midtrans_transaction_id, midtrans_reference, fraud_status.
- **Shipment** — id, order_id, kurir, service, no_resi, status, tracking_url.
- **ReturnRequest** — id, order_id, user_id, alasan, deskripsi, foto[], status, refund_status, reviewed_by, created_at.
- **Complaint** — id, order_id, user_id, kategori, deskripsi, foto[], status, resolved_by.
- **Review** — id, user_id, product_id, order_item_id, rating, teks, foto[], status, created_at.
- **Voucher** — id, kode, tipe, nilai, min_belanja, max_diskon, berlaku_mulai, berlaku_sampai, kuota, status.
- **Wishlist** — id, user_id, product_id.
- **Address** — id, user_id, label, penerima, no_hp, alamat_lengkap, provinsi, kota, kecamatan, kode_pos, is_utama.
- **Banner** — id, judul, gambar, link_tujuan, urutan, aktif, mulai_tayang, selesai_tayang.
- **FlashSale** — id, nama, mulai, selesai, status.
- **FlashSaleProduct** — id, flash_sale_id, product_id, harga_flash_sale, kuota.
- **Article** — id, judul, slug, konten, gambar, penulis_id, status, meta_title, meta_description, created_at.
- **Notification** — id, user_id, tipe, judul, pesan, is_read, link_url, created_at.
- **AuditLog** — id, actor_id, action, module, target_id, metadata, created_at.

### 5.4 Integrasi Eksternal

| Layanan | Provider | Kegunaan |
|---|---|---|
| Payment Gateway | Midtrans | QRIS, VA, e-wallet, kartu kredit/debit, status pembayaran, dan webhook. |
| Ongkir & Kurir | RajaOngkir / BinderByte | Hitung ongkir dan referensi layanan kurir. |
| Image Storage | Cloudinary | Simpan gambar produk, review, return, banner, artikel, dan profil. |
| Database | Supabase PostgreSQL | Database production. |
| OAuth | Google, Apple | Login sosial. |
| Transactional Email | Brevo / SMTP-compatible provider | Verifikasi email, reset password, order, payment, shipping, return. |
| Error Tracking | Sentry | Monitoring error production. |
| Analytics | Google Analytics / Mixpanel | Analitik perilaku pengguna dan performa funnel. |

---

## 6. Non-Functional Requirements

| Aspek | Requirement |
|---|---|
| **Performa** | Halaman homepage dan list produk load < 3 detik pada koneksi normal. |
| **Performa** | Core Web Vitals dijaga: LCP, CLS, INP sesuai standar web modern. |
| **Performa** | Gambar produk dioptimalkan menggunakan responsive image, lazy loading, dan CDN. |
| **Responsiveness** | Desain mobile-first dan tetap optimal di tablet dan desktop. |
| **Scalability** | Arsitektur modular untuk storage, payment, email, dan logistik. |
| **Scalability** | Database schema mendukung pertumbuhan produk, varian, order, dan user. |
| **Keamanan** | Password di-hash menggunakan algoritma kuat seperti bcrypt/argon2. |
| **Keamanan** | HTTPS wajib untuk semua akses production. |
| **Keamanan** | Rate limiting pada endpoint auth, checkout, payment, dan API sensitif. |
| **Keamanan** | Validasi input dilakukan di server, bukan hanya di client. |
| **Keamanan** | Proteksi CSRF/XSS/SQL injection sesuai best practice Next.js dan ORM. |
| **Keamanan** | Upload file divalidasi berdasarkan tipe file, ukuran, dan sumber. |
| **Keamanan** | RBAC diterapkan untuk seluruh route `/admin`. |
| **Keamanan** | Audit log untuk aktivitas penting admin seperti update harga, stok, order, refund, dan voucher. |
| **Availability** | Target uptime 99.5% untuk fase awal. |
| **Backup** | Database backup harian melalui provider database. |
| **Monitoring** | Logging, error tracking, dan monitoring transaksi kritikal. |
| **SEO** | Sitemap, robots.txt, canonical URL, meta tag, Open Graph, dan schema markup produk. |
| **Accessibility** | Alt text, label form, focus state, semantic HTML, dan warna dengan kontras cukup. |

---

## 7. Desain & UX Guidelines

| Aspek | Panduan |
|---|---|
| **Pendekatan Layout** | Mobile-first responsive dengan grid adaptif untuk produk dan konten. |
| **Warna Utama** | Hijau hutan / earth tone sesuai tema pendakian. |
| **Warna Aksen** | Oranye / kuning untuk CTA, promo, dan highlight. |
| **Tipografi** | Sans-serif clean dan readable, seperti Manrope, Inter, atau Poppins. |
| **Navigasi Mobile** | Header ringkas, hamburger menu, shortcut cart, dan account access. |
| **Navigasi Desktop** | Header lengkap berisi kategori, search bar, cart, wishlist, dan account menu. |
| **Admin Layout** | Sidebar navigation, topbar, search/filter table, dan action button jelas. |
| **CTA** | Tombol beli/add to cart harus jelas, mudah dijangkau, dan konsisten. |
| **Gambar Produk** | Format utama 1:1 atau 4:3, dapat di-zoom, dan harus teroptimasi. |
| **Component System** | Menggunakan shadcn/ui berbasis Tailwind untuk menjaga konsistensi komponen customer web dan admin dashboard. |
| **Form UX** | Validasi error jelas, loading state, empty state, dan success feedback. |
| **Checkout UX** | Step checkout harus sederhana, ringkasan biaya selalu terlihat, dan error pembayaran mudah dipahami. |

---

## 8. Milestone & Timeline

| Fase | Cakupan | Estimasi |
|---|---|---|
| **Fase 1: Foundation & Design System** | Setup Next.js, Tailwind, shadcn/ui, Prisma, Supabase PostgreSQL, Auth.js, struktur route, design system, layout customer, layout admin, RBAC dasar. | 2–3 minggu |
| **Fase 2: Customer Commerce Core** | Homepage, katalog, kategori, search/filter, detail produk, cart, checkout, alamat, voucher, Midtrans, ongkir. | 4–6 minggu |
| **Fase 3: Order, Fulfillment & Notification** | Pesanan customer, order timeline, admin order fulfillment, input resi, email notification, in-app notification, invoice/packing list. | 3–4 minggu |
| **Fase 4: Admin Operations & Marketing** | CRUD produk, varian, stok, kategori, banner, flash sale, voucher, customer management, artikel/blog. | 4–5 minggu |
| **Fase 5: Trust, Support & Reporting** | Review, wishlist, return/RMA, komplain, laporan penjualan, analytics, audit log, SEO finalization, hardening security. | 4–5 minggu |
| **Fase 6: Stabilization & Launch** | Testing end-to-end, payment testing, performance optimization, production deployment, monitoring, bug fixing. | 2–3 minggu |

Total estimasi MVP lengkap: **4–6 bulan**, tergantung jumlah developer, kualitas aset produk, kesiapan data, dan kompleksitas integrasi Midtrans/ongkir.

---


## 8.1 Pembagian Jobdesk Tim FE & BE

Karena project menggunakan **Next.js fullstack dalam satu repository**, pembagian FE dan BE harus dibuat berdasarkan ownership modul, bukan berdasarkan file semata. FE tetap fokus pada UI, UX, responsive layout, dan integrasi tampilan. BE fokus pada schema, API/server action, business logic, security, payment, dan integrasi eksternal.

### 8.1.1 Role Frontend Developer

| Area | Tanggung Jawab | Output |
|---|---|---|
| **Design System** | Setup Tailwind CSS, shadcn/ui, token warna, typography, spacing, radius, reusable component pattern. | Komponen UI konsisten untuk customer dan admin. |
| **Customer Web UI** | Membuat halaman homepage, katalog, detail produk, cart, checkout, akun, wishlist, pesanan, review, return, FAQ, dan artikel. | Halaman responsive mobile-first. |
| **Admin Dashboard UI** | Membuat layout `/admin`, sidebar, topbar, table, form produk, form order, dashboard card, filter, modal, dialog, dan empty state. | Tampilan backoffice siap integrasi. |
| **Responsive & Accessibility** | Memastikan UI optimal di mobile, tablet, desktop, serta memiliki alt text, focus state, label form, dan kontras cukup. | Tampilan usable dan accessible. |
| **Client-side State** | Mengelola state UI seperti cart display, filter, search input, modal, tab status, loading, toast, dan optimistic UI jika diperlukan. | Interaksi UI stabil. |
| **API Integration** | Menghubungkan UI ke endpoint/server action dari BE, menangani loading, error, success, dan validasi tampilan. | UI terhubung dengan data real. |
| **SEO UI Layer** | Membantu implementasi metadata halaman, struktur heading, Open Graph image, dan layout artikel/produk SEO-friendly. | Halaman siap SEO dari sisi struktur konten. |
| **Frontend Testing** | Melakukan testing tampilan, responsive check, form state, dan user flow utama. | UI minim bug visual dan flow. |

### 8.1.2 Role Backend Developer

| Area | Tanggung Jawab | Output |
|---|---|---|
| **Database & Prisma** | Mendesain schema Prisma, relasi tabel, migration, seed data, indexing, dan constraint penting. | Database siap untuk commerce, admin, payment, dan reporting. |
| **Auth & Authorization** | Implementasi Auth.js/NextAuth, email-password, Google, Apple Login, session security, RBAC, dan proteksi route `/admin`. | Login aman dan permission berjalan. |
| **API / Server Action** | Membuat Route Handler atau Server Action untuk produk, kategori, cart, checkout, order, voucher, payment, return, review, wishlist, artikel, dan admin. | Business logic tersedia dan terdokumentasi. |
| **Payment Integration** | Integrasi Midtrans, pembuatan transaksi, webhook, validasi signature, status payment, expiry, dan COD rule. | Payment flow aman dan sinkron. |
| **Shipping Integration** | Integrasi RajaOngkir utama dan BinderByte alternatif, perhitungan ongkir, kurir service, tracking URL, dan input resi. | Ongkir dan pengiriman berjalan. |
| **Storage Service** | Membuat media service untuk Cloudinary dengan abstraction layer agar bisa migrasi ke AWS S3, Supabase Storage, GCS, atau S3-compatible storage. | Upload gambar scalable dan aman. |
| **Notification Service** | Implementasi email Brevo/SMTP-compatible, in-app notification, dan struktur untuk web push prioritas rendah. | Notifikasi transactional berjalan. |
| **Security & Audit** | Validasi server-side, rate limiting, sanitasi input, audit log admin, upload validation, dan proteksi endpoint sensitif. | Sistem aman dan traceable. |
| **Reporting** | Menyiapkan query laporan penjualan, produk terlaris, revenue, margin, order, COD, dan return. | Data dashboard admin tersedia. |
| **Backend Testing** | Testing API/server action, payment webhook, auth, permission, checkout, stock reserve, dan business rules. | Logic backend stabil. |

### 8.1.3 Area Kolaborasi FE & BE

| Modul | FE | BE | Catatan Sinkronisasi |
|---|---|---|---|
| **Auth** | Form login/register/reset, error state, halaman proteksi. | Auth.js, OAuth, session, password hash, email verification. | Sepakati format error dan redirect. |
| **Katalog Produk** | Grid/list, filter UI, detail produk, image gallery. | Query produk, filter/sort, pagination, slug, SEO metadata. | Sepakati query parameter dan response shape. |
| **Cart & Checkout** | Cart UI, step checkout, summary, voucher input. | Cart persistence, reserved stock, voucher validation, ongkir, order creation. | Checkout harus diuji end-to-end. |
| **Payment** | Halaman status pembayaran, countdown, feedback berhasil/gagal. | Midtrans transaction, webhook, status sync, expiry, COD rules. | Jangan bergantung pada client untuk status final payment. |
| **Admin Produk** | Table, form, upload UI, filter, modal. | CRUD produk, varian, stok, image upload, audit log. | Field form harus sama dengan schema Prisma. |
| **Order Fulfillment** | Admin order table, detail order, action button, timeline. | Status transition, input resi, invoice, packing list, notification. | Status order harus punya state machine jelas. |
| **Return & Komplain** | Form pengajuan, upload bukti, status timeline, admin review UI. | ReturnRequest, Complaint, approval, refund status manual, notification. | Refund tidak otomatis via Midtrans pada MVP. |
| **Review & Wishlist** | UI review, rating summary, wishlist button/page. | Validasi order selesai, review moderation, wishlist persistence. | Review tidak boleh dibuat tanpa order selesai. |
| **Artikel & SEO** | Layout artikel, editor/admin UI, metadata display. | CRUD artikel, slug, meta title, sitemap. | Pastikan SEO tidak hanya visual. |

### 8.1.4 Rekomendasi Pembagian Sprint untuk 2 Role

| Sprint | Frontend Developer | Backend Developer | Target Selesai |
|---|---|---|---|
| **Sprint 1 — Foundation** | Setup layout, Tailwind, shadcn/ui, halaman dasar customer dan admin. | Setup Prisma, Supabase PostgreSQL, Auth.js, struktur permission, base API. | Fondasi project siap. |
| **Sprint 2 — Auth & User Account** | UI register, login, reset password, profil, alamat. | Auth email/password, Google, Apple, session, email verification, user/address API. | Auth dan akun berjalan. |
| **Sprint 3 — Catalog** | Homepage, produk, kategori, detail produk, search/filter UI. | Schema produk, kategori, brand, varian, query filter/sort, seed data. | Customer bisa browse produk. |
| **Sprint 4 — Cart & Checkout** | Cart page, checkout step, voucher UI, shipping selection. | Cart, voucher validation, ongkir API, reserved stock, order creation. | Checkout non-payment siap. |
| **Sprint 5 — Payment & Order** | Payment status page, order list/detail, timeline. | Midtrans, webhook, COD rule, order status, notification. | Order dan payment berjalan. |
| **Sprint 6 — Admin Commerce** | Admin produk, kategori, order, voucher, banner UI. | CRUD admin, RBAC enforcement, audit log, stock alert, fulfillment. | Operasional admin berjalan. |
| **Sprint 7 — Support & Trust** | Review, wishlist, return, komplain, FAQ, artikel UI. | Review validation, wishlist, return/RMA, complaint, article API. | Fitur trust/support selesai. |
| **Sprint 8 — Hardening & Launch** | Responsive QA, accessibility, loading/empty/error states, SEO UI polish. | Security hardening, rate limit, backup check, logging, performance query, deployment. | Siap production. |

### 8.1.5 Batasan Ownership

- FE tidak mengubah schema database tanpa koordinasi dengan BE.
- BE tidak mengubah response API/server action tanpa memberi tahu FE.
- Semua form harus memiliki kontrak field yang disepakati sebelum implementasi.
- Semua endpoint sensitif harus divalidasi di server, meskipun FE sudah memiliki validasi client-side.
- Payment status final hanya mengikuti validasi server dan webhook Midtrans, bukan status dari browser customer.
- Komponen shadcn/ui boleh dikustomisasi, tetapi harus tetap konsisten dengan design token Summit Gear.

## 9. Business Rules

| Kategori | Aturan | Detail |
|---|---|---|
| **Return** | Batas waktu pengembalian | Maksimal 7 hari setelah barang diterima. |
| **Return** | Kondisi barang | Harus dalam kondisi asli, belum dipakai, kemasan utuh, dan disertai bukti foto. |
| **Return** | Ongkir return | Ditanggung Summit Gear jika kesalahan gudang, salah kirim, atau barang rusak; ditanggung buyer jika alasan buyer. |
| **Return** | Refund | Refund diproses manual oleh Admin Finance atau Super Admin setelah return disetujui dan barang diverifikasi. |
| **Pembayaran** | Batas waktu VA | 24 jam sejak order dibuat. |
| **Pembayaran** | Batas waktu QRIS/e-wallet | 15 menit sejak order dibuat, atau mengikuti aturan channel Midtrans. |
| **Pembayaran** | Auto-cancel | Order otomatis dibatalkan jika melewati batas waktu pembayaran. |
| **Pembayaran** | Webhook | Status pembayaran final mengikuti notifikasi webhook Midtrans yang tervalidasi. |
| **COD** | Limit transaksi | Maksimal Rp 1.500.000 per transaksi pada MVP. |
| **COD** | Pembatasan produk | Admin dapat menonaktifkan COD untuk produk mahal atau berisiko tinggi. |
| **COD** | Pembatasan wilayah | COD hanya tersedia untuk wilayah yang didukung kurir. |
| **COD** | Verifikasi kontak | Nomor HP wajib diisi dan valid sebelum checkout COD. |
| **COD** | Abuse prevention | Akun dengan riwayat gagal menerima COD dapat dibatasi menggunakan COD. |
| **Fulfillment** | SLA Gudang | Tim gudang memproses packing maksimal 1x24 jam di hari kerja setelah pembayaran berhasil. |
| **Voucher** | Cakupan | Voucher berlaku secara platform-wide atau sesuai aturan campaign yang dibuat admin. |
| **Voucher** | Stacking | Satu voucher per checkout, tidak bisa ditumpuk dengan voucher lain. |
| **Stok** | Reserved stock | Stok di-reserve saat checkout dan dilepas jika pembayaran gagal/expired. |
| **Stok** | Low stock alert | Notifikasi dashboard admin jika stok varian < 10 unit, atau threshold khusus yang ditentukan admin. |
| **Review** | Syarat review | Review hanya bisa dibuat setelah order berstatus selesai. |
| **Review** | Moderasi | Admin dapat menyembunyikan review yang mengandung SARA, ujaran kebencian, spam, atau konten tidak relevan. |
| **Admin** | RBAC | Setiap admin hanya dapat mengakses modul sesuai role dan permission. |
| **Admin** | Audit log | Aktivitas penting admin wajib dicatat untuk kebutuhan audit. |

---

## 10. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Stok tidak akurat | Customer order barang yang sudah habis | Reserved stock saat checkout, stock alert, dan audit stok berkala. |
| Fraud pembayaran | Kerugian finansial | Validasi webhook Midtrans, fraud status Midtrans, dan audit transaksi. |
| COD gagal diterima | Biaya pengiriman dan operasional meningkat | Limit COD Rp 1.500.000, pembatasan COD per produk/wilayah, dan pembatasan akun bermasalah. |
| Ongkir API down | Customer tidak bisa checkout | Fallback ke BinderByte atau tarif flat per zona. |
| Return abuse | Kerugian operasional | Batas return 7 hari, bukti foto, validasi admin, dan audit riwayat return. |
| Performa web lambat | Bounce rate tinggi dan konversi turun | Optimasi gambar, caching, CDN, query optimization, dan monitoring Core Web Vitals. |
| Akses admin disalahgunakan | Perubahan data tidak sah | RBAC, audit log, session security, dan akses Super Admin terbatas. |
| Vendor lock-in storage | Sulit migrasi storage | Storage abstraction layer, sehingga Cloudinary dapat diganti dengan S3/Supabase Storage/GCS. |
| Email gagal terkirim | User tidak menerima verifikasi/status order | Email retry, log email, dan fallback SMTP-compatible provider. |
| SEO buruk | Produk sulit ditemukan di search engine | SEO-friendly URL, metadata, sitemap, schema markup, dan optimasi performa. |

---

## 11. Acceptance Criteria Umum

| Area | Acceptance Criteria |
|---|---|
| Auth | User dapat register, login email/password, login Google, login Apple, reset password, dan logout. |
| Katalog | User dapat melihat produk, filter, sort, search, dan membuka detail produk. |
| Cart | User dapat menambah, mengubah qty, dan menghapus produk dari cart. |
| Checkout | User dapat memilih alamat, kurir, voucher, dan metode pembayaran. |
| Payment | Sistem dapat membuat transaksi Midtrans dan menerima webhook status pembayaran. |
| COD | Sistem dapat membuat order COD sesuai limit dan rule yang berlaku. |
| Order | Customer dapat melihat status pesanan dan admin dapat memproses order. |
| Shipping | Admin dapat input resi manual dan customer dapat melihat tracking link. |
| Return | Customer dapat mengajukan return dan admin dapat approve/reject. |
| Review | Customer hanya dapat review produk dari order yang selesai. |
| Admin | Admin hanya dapat mengakses modul sesuai role. |
| SEO | Halaman produk dan artikel memiliki slug, metadata, dan dapat masuk sitemap. |
| Responsive | Website dapat digunakan dengan baik di mobile, tablet, dan desktop. |
| UI Component | Komponen utama menggunakan shadcn/ui dan konsisten dengan design system Summit Gear. |
| Security | Route sensitif terlindungi, input divalidasi server-side, dan aktivitas admin penting masuk audit log. |

---

## 12. Catatan Scope

- Summit Gear pada MVP hanya menangani **penjualan produk**, bukan rental/penyewaan.
- Pickup toko tidak tersedia pada MVP.
- Transfer manual tidak tersedia pada MVP.
- COD tersedia, tetapi dibatasi oleh nominal, produk, wilayah, dan riwayat akun.
- Cloudinary menjadi media storage utama, tetapi implementasi harus dibuat fleksibel agar dapat migrasi ke AWS S3, Supabase Storage, GCS, atau S3-compatible storage.
- Resi mendukung input manual oleh admin dan disiapkan untuk integrasi otomatis pada fase lanjutan.
- Refund return diproses manual oleh Admin Finance/Super Admin.
- Web push notification menjadi prioritas rendah; email dan in-app notification menjadi notifikasi utama MVP.

---

*Dokumen ini bersifat living document dan dapat diperbarui seiring perubahan kebutuhan bisnis, validasi teknis, dan progress development.*
