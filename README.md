# Summit Gear — Responsive Web E-Commerce for Hiking Equipment

A mobile-first responsive B2C e-commerce web application for **hikers and outdoor communities in Indonesia**, built with **Next.js**, **PostgreSQL**, and **Prisma**.

The core problem we set out to solve: hikers in Indonesia still struggle to find a trusted, comprehensive, and mobile-friendly platform dedicated to purchasing hiking equipment — most outdoor shops rely on generic marketplaces without a curated shopping experience tailored to hiking needs.

---

## ✨ Technologies

- `Next.js 16` — Fullstack framework (App Router, Server Actions, Route Handlers)
- `React 19` — UI library
- `PostgreSQL` — Relational database
- `Supabase` — Database provider (PostgreSQL hosting)
- `Prisma 7` — ORM & database migration
- `Auth.js / NextAuth` — Authentication (email/password, Google OAuth)
- `Tailwind CSS` — Utility-first CSS framework
- `shadcn/ui` — Reusable component library
- `Midtrans` — Payment gateway (VA, QRIS, e-wallet, credit/debit card)
- `Cloudinary` — Image storage & optimization
- `Brevo` — Transactional email service
- `Vercel` — Deployment platform

---

## 🚀 Features

- **Curated product catalog** — hikers can browse, filter, and search gear by category, brand, price, and rating without sifting through thousands of irrelevant products
- **Integrated checkout with shipping cost calculation** — eliminates the hassle of manually calculating shipping fees; customers know the total cost upfront before paying
- **Multi-payment methods via Midtrans** — VA, QRIS, e-wallet, and credit/debit cards available so customers aren't limited to a single payment option
- **Real-time order management** — customers can track order status from payment to delivery without needing to contact support
- **Return & complaint system** — customers can submit return requests with photo evidence directly from the website
- **Product reviews & ratings** — helps fellow hikers make informed purchase decisions based on previous buyer experiences
- **Centralized admin backoffice** — internal team manages products, inventory, orders, promotions, banners, flash sales, vouchers, and reports from a single dashboard without direct database access
- **Role-based access control (RBAC)** — restricts admin access by responsibility (Super Admin, Operations, Marketing, CS, Finance) to maintain data security
- **SEO-friendly** — URL slugs, meta tags, Open Graph, and sitemap so products are easily discoverable via search engines
- **Mobile-first responsive** — design optimized for a seamless shopping experience across smartphones, tablets, and desktops

---

## 📍 The Process

**The problem:** Hikers in Indonesia — both beginners and experienced — struggle to find an online hiking gear store that provides a curated shopping experience. Existing outdoor shops are typically scattered across generic marketplaces without hiking-specific filters, lack features like size guides or gear checklists, and the ordering process often still relies on manual chat. On the operational side, inventory management, order processing, and promotions are handled separately without a unified system.

**Our approach:** We broke this problem down into two main user groups. For **customers**, we built a complete mobile-first shopping experience — from browsing products with advanced filters, integrated checkout with shipping calculation and multi-payment options, real-time order tracking, to review and return features. For the **internal team**, we built an admin backoffice on the `/admin` route with RBAC so each role (Super Admin, Operations, Marketing, CS, Finance) only accesses relevant modules — from catalog management, order fulfillment, promo campaigns, to sales reports and audit logs.

An interesting technical challenge: we integrated the Midtrans payment gateway with webhooks to ensure the final payment status always follows server-side validation, not the browser-side status from the customer. We also implemented a reserved stock mechanism during checkout to prevent overselling when multiple customers purchase the same product simultaneously.

---

## 🚦 Running the Project

1. Clone the repository:

   ```bash
   git clone <REPOSITORY_URL>
   cd SummitApp
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   > On Windows PowerShell, use `npm.cmd install` if `npm.ps1` is blocked by the execution policy.

3. Setup environment — copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

   Then fill in the following configuration in `.env`:

   | Variable          | Purpose                                                 |
   | ----------------- | ------------------------------------------------------- |
   | `APP_URL`         | Application URL, use `http://localhost:3000`            |
   | `DATABASE_URL`    | Database connection (Supabase pooler port `6543`)       |
   | `DIRECT_URL`      | Direct database connection (port `5432`) for migrations |
   | `AUTH_SECRET`     | Secret key for authentication                           |
   | `AUTH_TRUST_HOST` | Set `true` for local development                        |
   | `DEMO_MODE`       | Set `true` for payment simulation                       |

   Optional variables: `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `CLOUDINARY_*`, `BREVO_API_KEY`, `MIDTRANS_*`, `RAJAONGKIR_API_KEY`, etc.

   **Important for production deployment:**
   - **Brevo email service**: If using Vercel or other platforms with dynamic IPs, you may need to whitelist the IP at https://app.brevo.com/security/authorised_ips or use the one-click authorization link sent to your email when first accessing from a new IP.
   - **Cloudinary** configuration is required for customer profile photo uploads. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in production environment variables.

4. Generate Prisma Client:

   ```bash
   npm run prisma:generate
   ```

5. Run database migrations:

   ```bash
   npm run prisma:migrate
   ```

6. Seed the database with initial data:

   ```bash
   npm run db:seed
   ```

   Admin account after seeding:

   ```
   Email: admin@summitgear.local
   Password: Password123!
   ```

7. Start the development server:

   ```bash
   npm run dev
   ```

8. Open `http://localhost:3000` in your browser

---

## 📦 Preview

<!--
  Replace "preview.mp4" with the actual filename or URL of your demo video.
  For GitHub.com: upload the .mp4 via the GitHub file upload UI and paste the hosted URL here.
-->

<video src="preview.mp4" controls="controls" width="100%">
  Your browser does not support the video tag.
</video>

---

## 📝 License

This project was built for academic purposes.
Licensed under the [MIT License](https://opensource.org/licenses/MIT).
