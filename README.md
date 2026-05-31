# Summit Gear

Responsive web B2C e-commerce foundation for hiking gear, based on `PRD.md`.

## Sprint 1 Scope

- Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI primitives.
- Customer and admin route shells.
- Static foundation pages for catalog, cart, checkout, account, article, FAQ, and admin modules.
- Prisma 7 PostgreSQL schema, config, generated client, and seed script.
- Auth.js/NextAuth v5 scaffolding with Credentials, Google, Apple, Prisma adapter, JWT session claims, and RBAC helpers.
- `/api/health` route.

Login/register UI, working account flows, catalog queries, cart logic, checkout, payment, shipping, and CRUD operations are intentionally deferred to later sprints.

## Local Commands

```bash
npm.cmd install
npm.cmd run prisma:generate
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

Use `npm.cmd` on Windows PowerShell because `npm.ps1` may be blocked by execution policy.

## Environment

Copy `.env.example` to `.env` when real Supabase/PostgreSQL and provider credentials are available.

Prisma generation and production build use safe placeholder database URLs through `scripts/prisma-generate.mjs`, so Sprint 1 can build without real Supabase credentials. Do not run migrations or seed against production until `DATABASE_URL` and `DIRECT_URL` are set intentionally.

For Supabase:

- Use `DATABASE_URL` for application runtime, preferably the Supabase pooler transaction-mode URL on port `6543`.
- Use `DIRECT_URL` for Prisma migrations and seed, preferably the Supabase session-mode or direct connection URL on port `5432`.
- After `.env` is filled, run:

```bash
npm.cmd run prisma:migrate -- --name init
npm.cmd run db:seed
```

## Backend API

Public:

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/[slug]`
- `GET /api/products/[slug]/related`
- `GET /api/products/suggest`
- `GET /api/categories`
- `GET /api/brands`
- `GET /api/banners`
- `GET /api/home-feed`
- `GET /api/gear-checklists`
- `GET /api/gear-checklists/[slug]`
- `GET /api/size-guides`
- `GET /api/size-guides/[categorySlug]`
- `POST /api/auth/register`
- `POST /api/auth/verify-email`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/resend-verification`

Authenticated customer:

- `GET /api/account/profile`
- `PATCH /api/account/profile`
- `GET /api/account/addresses`
- `POST /api/account/addresses`
- `PATCH /api/account/addresses/[id]`
- `DELETE /api/account/addresses/[id]`
- `GET /api/search-history`
- `POST /api/search-history`
- `DELETE /api/search-history`
- `GET /api/cart`
- `POST /api/cart`
- `DELETE /api/cart`
- `PATCH /api/cart/items/[id]`
- `DELETE /api/cart/items/[id]`
- `POST /api/checkout/shipping-rates`
- `POST /api/checkout/voucher`
- `POST /api/checkout/order`

Admin:

- `GET /api/admin/summary`

Sprint 2 auth/account behavior:

- Credentials login requires `emailVerified` to be set.
- Google and Apple OAuth providers are enabled only when their env credentials are present.
- Brevo is used for email verification and reset password delivery when `BREVO_API_KEY` and `EMAIL_FROM` are configured.
- In development, missing Brevo credentials skip email delivery with a server warning; production must provide them.

Sprint 3 catalog behavior:

- Product list supports `q`, `category`, `brand`, `minPrice`, `maxPrice`, `minRating`, `discountOnly`, `inStockOnly`, `sort`, `page`, and `pageSize`.
- Sort values are `newest`, `price_asc`, `price_desc`, `name_asc`, `best_selling`, and `rating_desc`.
- Sitemap includes active product and category routes from the database.
- Product detail pages include dynamic metadata and Product JSON-LD.
- Search history is authenticated; size guides and gear checklists are public catalog support APIs.

Sprint 3 verification:

```bash
npm.cmd run build
npm.cmd run verify:sprint3
```

Sprint 4 cart/checkout behavior:

- Cart is persisted per authenticated user and enforces variant stock limits.
- Shipping rates are backend-calculated from cart weight and address province using a deterministic mock-rate table until RajaOngkir/BinderByte credentials are integrated.
- Voucher validation supports fixed amount, percentage, and free-shipping vouchers with active dates, minimum spend, and quota checks.
- Checkout order creation runs in a Prisma transaction, decrements variant stock, creates order items, payment placeholder, shipment placeholder, and clears the cart.
- Midtrans payment creation is not active in Sprint 4; Sprint 4 stops at non-payment order creation readiness.

Sprint 4 verification:

```bash
npm.cmd run build
npm.cmd run verify:sprint4
```

## Verified Routes

- `/`
- `/produk`
- `/keranjang`
- `/checkout`
- `/admin`
- `/admin/produk`
- `/api/health`
