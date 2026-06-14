# Summit Gear

Panduan instalasi, pengaturan lokal, dan deployment demo Summit Gear.

## Prasyarat

Pastikan perangkat sudah memiliki:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) beserta npm
- Database PostgreSQL, direkomendasikan menggunakan [Supabase](https://supabase.com/)

Versi utama teknologi yang digunakan project ini:

- Next.js 16
- React 19
- Prisma 7
- PostgreSQL

## 1. Clone Repository

```bash
git clone <URL_REPOSITORY>
cd SummitApp
```

Jika repository sudah tersedia secara lokal, masuk langsung ke direktori project.

## 2. Instal Dependensi

```bash
npm install
```

Pada Windows PowerShell, gunakan `npm.cmd` jika eksekusi `npm.ps1` diblokir oleh execution policy:

```powershell
npm.cmd install
```

## 3. Konfigurasi Environment

Salin file `.env.example` menjadi `.env`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Linux/macOS:

```bash
cp .env.example .env
```

Kemudian isi nilai pada `.env` sesuai layanan yang digunakan.

### Variabel Wajib

| Variabel | Kegunaan |
| --- | --- |
| `APP_URL` | URL aplikasi lokal, gunakan `http://localhost:3000`. |
| `NODE_ENV` | Mode aplikasi, gunakan `development` untuk pengembangan lokal. |
| `DEMO_MODE` | Aktifkan perilaku khusus demo seperti simulasi pembayaran. |
| `DATABASE_URL` | Koneksi database saat aplikasi berjalan. Untuk Supabase, gunakan transaction pooler port `6543`. |
| `DIRECT_URL` | Koneksi database untuk migrasi dan seed. Untuk Supabase, gunakan session pooler atau koneksi langsung port `5432`. |
| `AUTH_SECRET` | Secret aman untuk proses autentikasi. |
| `AUTH_TRUST_HOST` | Gunakan `true` untuk mempercayai host aplikasi lokal. |

Contoh konfigurasi koneksi Supabase:

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres"
```

Jangan menyimpan kredensial asli ke Git. File `.env` sudah diabaikan melalui `.gitignore`.

### Variabel Opsional

Isi variabel berikut hanya jika fitur terkait akan digunakan:

- `AUTH_GOOGLE_ID` dan `AUTH_GOOGLE_SECRET`: login Google.
- `AUTH_APPLE_ID` dan `AUTH_APPLE_SECRET`: login Apple, belum digunakan pada versi demo.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan `SUPABASE_SERVICE_ROLE_KEY`: tidak diperlukan karena aplikasi mengakses Supabase PostgreSQL melalui Prisma.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, dan `CLOUDINARY_API_SECRET`: penyimpanan gambar Cloudinary.
- `BREVO_API_KEY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, dan `EMAIL_FROM`: pengiriman email.
- `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`, dan `MIDTRANS_IS_PRODUCTION`: hanya diperlukan untuk integrasi Midtrans nyata.
- `MIDTRANS_MOCK_ENABLED`: aktifkan bersama `DEMO_MODE=true` untuk simulasi pembayaran tanpa Midtrans.
- `RAJAONGKIR_API_KEY` dan `BINDERBYTE_API_KEY`: belum diperlukan karena versi demo memakai kalkulasi ongkir simulasi.
- `NEXT_PUBLIC_GA_ID` dan `SENTRY_DSN`: belum digunakan pada versi demo.

## 4. Siapkan Database dengan Prisma

Generate Prisma Client:

```bash
npm run prisma:generate
```

Terapkan migrasi database:

```bash
npm run prisma:migrate
```

Isi database dengan data awal:

```bash
npm run db:seed
```

Untuk membuka Prisma Studio:

```bash
npm run prisma:studio
```

Pada Windows PowerShell, ganti `npm` dengan `npm.cmd` untuk seluruh perintah di atas jika diperlukan.

### Akun Admin Hasil Seed

Setelah seed berhasil dijalankan, gunakan akun berikut:

```text
Email: admin@summitgear.local
Password: Password123!
```

Akun ini hanya ditujukan untuk pengembangan lokal.

## 5. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Perintah Project

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan development server. |
| `npm run build` | Generate Prisma Client dan membuat production build. |
| `npm run start` | Menjalankan production build. |
| `npm run lint` | Menjalankan pemeriksaan ESLint. |
| `npm run prisma:generate` | Generate Prisma Client. |
| `npm run prisma:migrate` | Menjalankan migrasi Prisma untuk development. |
| `npm run prisma:studio` | Membuka Prisma Studio. |
| `npm run db:seed` | Mengisi database dengan data awal. |
| `npm run verify:sprint3` | Menjalankan verifikasi backend Sprint 3. |
| `npm run verify:sprint4` | Menjalankan verifikasi backend Sprint 4. |
| `npm run verify:sprint5` | Menjalankan verifikasi backend Sprint 5. |
| `npm run verify:sprint6` | Menjalankan verifikasi backend Sprint 6. |
| `npm run verify:sprint7` | Menjalankan verifikasi backend Sprint 7. |

Untuk memverifikasi project secara umum:

```bash
npm run lint
npm run build
npm run verify:sprint6
npm run verify:sprint7
```

Untuk mencoba production build secara lokal:

```bash
npm run build
npm run start
```

## Deployment Demo di Vercel

Deployment ini ditujukan untuk demonstrasi tugas kuliah dan tidak boleh digunakan untuk menerima transaksi nyata.

1. Hubungkan repository GitHub ke Vercel.
2. Tambahkan environment variables berikut pada Vercel:

```env
APP_URL="https://URL-DEPLOYMENT-VERCEL"
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
AUTH_SECRET="SECRET-ACAK-YANG-AMAN"
AUTH_TRUST_HOST="true"
DEMO_MODE="true"
MIDTRANS_MOCK_ENABLED="true"
MIDTRANS_IS_PRODUCTION="false"
AUTH_GOOGLE_ID="GOOGLE-CLIENT-ID"
AUTH_GOOGLE_SECRET="GOOGLE-CLIENT-SECRET"
BREVO_API_KEY="BREVO-API-KEY"
EMAIL_FROM="Summit Gear <EMAIL-SENDER-TERVERIFIKASI>"
```

3. Di Google Cloud Console, tambahkan callback URL:

```text
https://URL-DEPLOYMENT-VERCEL/api/auth/callback/google
```

4. Verifikasi sender pada Brevo agar registrasi, verifikasi email, dan reset password dapat didemokan. Jika fitur authorized IP Brevo aktif, izinkan sumber deployment atau nonaktifkan pembatasan IP khusus selama demo.
5. Jalankan migration dan seed dari komputer lokal menggunakan `DIRECT_URL`:

```powershell
npx.cmd prisma migrate deploy
npm.cmd run db:seed
```

Pada mode demo:

- Pembayaran Midtrans disimulasikan tanpa server/client key atau merchant production.
- COD tetap dapat digunakan.
- Tarif dan estimasi ongkir merupakan simulasi.
- Apple Login, Cloudinary, RajaOngkir, BinderByte, Sentry, dan analytics tidak diperlukan.
- Jangan mengaktifkan `DEMO_MODE` atau `MIDTRANS_MOCK_ENABLED` untuk toko production nyata.

## Troubleshooting

### `npm.ps1` tidak dapat dijalankan di Windows PowerShell

Gunakan executable npm Windows secara langsung:

```powershell
npm.cmd run dev
```

### Prisma gagal terhubung ke database

- Pastikan `DATABASE_URL` dan `DIRECT_URL` di `.env` sudah benar.
- Pastikan password database dan region Supabase sesuai.
- Gunakan `DIRECT_URL` port `5432` untuk migrasi dan seed.
- Pastikan project Supabase aktif dan koneksi jaringan tidak diblokir.

### Prisma Client belum tersedia atau tidak sesuai schema

Jalankan ulang:

```bash
npm run prisma:generate
```

### Data awal belum tersedia

Pastikan migrasi berhasil, kemudian jalankan:

```bash
npm run db:seed
```

### Port `3000` sedang digunakan

Hentikan proses yang menggunakan port tersebut atau jalankan Next.js pada port lain:

```bash
npm run dev -- --port 3001
```
