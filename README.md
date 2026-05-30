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
- `GET /api/categories`
- `GET /api/brands`
- `GET /api/banners`
- `POST /api/auth/register`

Authenticated customer:

- `GET /api/account/profile`
- `PATCH /api/account/profile`
- `GET /api/account/addresses`
- `POST /api/account/addresses`
- `PATCH /api/account/addresses/[id]`
- `DELETE /api/account/addresses/[id]`

Admin:

- `GET /api/admin/summary`

## Verified Routes

- `/`
- `/produk`
- `/keranjang`
- `/checkout`
- `/admin`
- `/admin/produk`
- `/api/health`
