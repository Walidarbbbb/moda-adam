# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install   # install dependencies (first time only)
npm run dev   # start dev server at http://localhost:3000
npm run build # production build
```

There is no lint script and no test suite.

## What this is

A B2B wholesale fashion demo (prototipo) — Spanish-language, fully client-side, no backend. All state lives in the browser via `localStorage`. Comments marked `👉 EN REAL:` throughout the code mark where real services would replace the simulated behavior.

Stack: Next.js 14 (App Router), React 18, TypeScript 5.5, Tailwind 3.

## Architecture

**State (`lib/store.tsx`)** — a single React Context (`StoreProvider` / `useStore()`) holds all app state: products, cart, orders, current user. It hydrates from `localStorage` on mount (guarded by a `hydrated` flag to avoid SSR mismatches). All pages and components consume state exclusively through `useStore()`.

> `lib/cart-store.tsx` (`CartProvider`/`useCart()`) is an unused legacy store — do not use it.

**Data model (`lib/types.ts`)** — core types: `Product` (with `Variant[]` for size+color+stock combinations), `CartItem`, `User` / `SafeUser`, `Order`. Categories: `'camisetas' | 'pantalones' | 'blusas-camisas' | 'chaquetas' | 'vestidos-faldas' | 'sudaderas' | 'conjuntos' | 'calzado' | 'accesorios' | 'deportiva'`. Sizes: `'S' | 'M' | 'L' | 'XL' | 'XXL'`.

**Seed data (`lib/seed-data.ts`)** — `SEED_PRODUCTS` and `SEED_USERS` are the initial demo data. `resetDemo()` in the store restores these and clears localStorage.

**Business constants (`lib/constants.ts`)** — `MIN_ORDER = 6` (minimum units per line), `SIZES` (ordered `['S','M','L','XL','XXL']`), `WHATSAPP_NUMBER`, `CATEGORIES` (all 10, with label + tagline), `BUSINESS` info. Change these for a real deployment.

**Utilities (`lib/format.ts`)** — `eur()` (euro formatter), `slugify()`, `totalUnits()`, `totalPrice()`, `whatsappLink()` (builds wa.me URL with order summary), `formatDate()`.

**Integration stubs** (unused in demo, wired to env vars):
- `lib/supabase/client.ts` + `lib/supabase/server.ts` — Supabase client helpers (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- `lib/stripe.ts` — `createCheckoutSession()` helper (`STRIPE_SECRET_KEY`)
- `lib/whatsapp.ts` — `sendWhatsAppTemplate()` and order notification helpers (`WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, `WHATSAPP_OWNER_NUMBER`)

**Key shared components** — `components/DemoBanner.tsx` (thin ink bar shown at the top of every page, signals demo mode), `components/CartDrawer.tsx` (slide-over panel, opens automatically on `addToCart`), `components/ProductCard.tsx` + `components/ProductImage.tsx` (used across catalog and admin), `components/admin/AdminShell.tsx` (wraps all `/admin` routes — renders an inline `trabajador` login when unauthenticated, so admin pages need no redirect logic of their own).

**Email confirmation** — `app/api/email-confirmacion/route.ts` is the one real API route. The checkout page calls it fire-and-forget after `placeOrder()`. Requires env var `RESEND_API_KEY`; silently no-ops if missing. `RESEND_FROM` defaults to `onboarding@resend.dev` (needs a verified Resend domain for production).

## Routes

| Path | Purpose |
|------|---------|
| `/` | Homepage with featured products and category circles |
| `/catalogo` | All-category landing |
| `/catalogo/[categoria]` | Category listing (10 slugs) |
| `/producto/[id]` | Product detail — color/size selector, stock, add to cart |
| `/checkout` | Simulated payment form (no real charge) |
| `/pedido/[id]` | Order confirmation + WhatsApp share button |
| `/mis-pedidos` | Customer order history (requires `cliente` role) |
| `/login` | Customer login |
| `/registro` | Customer registration |
| `/admin` | Admin dashboard (requires `trabajador` role) |
| `/admin/productos` | Product list with stock editing |
| `/admin/productos/nuevo` | Create product |
| `/admin/productos/[id]` | Edit product |

## Auth

Two roles: `cliente` (customer) and `trabajador` (admin). Login validates against the in-memory user list — passwords stored in plain text in localStorage (demo only). Demo credentials: `cliente@modaadam.com` / `cliente123` and `admin@modaadam.com` / `admin123`. Registration always creates `cliente` role.

## Key conventions

- All stateful components are Client Components (`'use client'`). Pages that only need store data are also client components.
- Variant IDs follow the pattern `"{color-slug}-{size}"`, e.g. `"negro-xl"`.
- Stock `0` on a variant means "AGOTADO" (out of stock) — the UI shows a badge and blocks adding to cart.
- `placeOrder()` decrements variant stock and clears the cart in a single state update.
- `Product.minOrder` overrides the global `MIN_ORDER` constant per product (`addToCart` and `updateQty` both use `product.minOrder ?? MIN_ORDER`).
- When adding a field to `Product` or `Variant` in `lib/types.ts`, update `components/admin/ProductForm.tsx` accordingly.
- When significantly changing `SEED_PRODUCTS` (e.g. new images or references), bump `DATA_VERSION` in `lib/store.tsx` so existing browsers discard stale localStorage and reload the seed.

## Styling

Tailwind with a custom palette (defined in `tailwind.config.ts`): `ink` (#1A1A1A), `bone`, `paper`, `beige`/`clay` (#D4A574), `clay-light` (#E8C9A0), `clay-dark` (#B07840), `sand`, `muted` (#6B6B6B), `sage`. Layout uses a `wrap` max-width utility. Reusable CSS classes defined in `app/globals.css`:
- Buttons: `btn-ink` / `btn-primary` / `btn-black` (all identical — dark fill), `btn-outline` (bordered), `btn-beige` (clay fill), `btn-ghost` (transparent)
- Forms: `input`, `input-sm`, `label`
- Layout: `card` (bordered container), `chip` (small badge), `eyebrow` (section label), `shadow-card`, `shadow-lift`

Font: `Inter` → `--font-inter`, used for both `font-sans` and `font-display`.
