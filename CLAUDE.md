# AllienStore — Claude Code Master Prompt

> Give this entire file to Claude Code at the start of every session.
> It contains everything needed to build, extend, and scale AllienStore.

---

## 1. Project Overview

**AllienStore** is an Indian affiliate deals & coupons platform — like CashKaro — built on top of the INRDeals affiliate network. Users browse 245+ active stores, find coupon codes, click affiliate links, and make purchases. The site owner (you) earns commission on every sale tracked through the affiliate links.

**Live reference:** CashKaro.com — study its store pages, coupon cards, category pages, and search.

**Your role as Claude Code:** Build, extend, and debug this Next.js project. Always follow this document. Never deviate from the tech stack, brand colors, or folder structure defined here.

---

## 2. INRDeals API Credentials

> ⚠️ NEVER expose these in client-side code. Always call from `/app/api/` server routes only.

```
Token:    2b373c2fb9eeb4d3421f2e0cbb99982ed2c0c3d0
Username: all665437315
```

### 4 APIs Available

#### API 1 — Stores Campaign List
```
GET https://inrdeals.com/fetch/stores
Params: token, id, merchant (optional), type (optional), category (optional)
Returns: url (affiliate link), id, logo, merchant, category, type, payout, status
Cache: 1 hour (revalidate: 3600)
Used on: Homepage, /stores, /stores/[slug], /category/[cat], Search
```

#### API 2 — Coupons Feed
```
GET https://inrdeals.com/api/v1/coupon-feed
Params: token, id, store_id (optional), search (optional), category (optional), start_date, end_date
Returns: id, url (affiliate link), label, offer, coupon_code, description, expire_date, storelogo_id, categories, logo{store_name}
Cache: 30 minutes per store_id
Used on: /stores/[slug], /coupons, Homepage featured, /category/[cat], Blog posts
```

#### API 3 — Transactions / Earnings
```
GET https://inrdeals.com/fetch/reports
Params: token, id, startdate (YYYY-MM-DD), enddate (YYYY-MM-DD), page, sub_id, txn_id
Returns: transaction_id, sale_amount, status, store_name, sale_date, click_id, user_commission, sub_id1
Rate limit: 10,000 hits/month — fetch ONCE daily via cron, store in Supabase
Used on: /dashboard (private admin page only)
```

#### API 4 — Short URL Generator
```
GET https://inrdeals.com/api/v1/shortlink/generator
Params: token, user_id, offer_url (encoded tracking URL), src, campaign, subid
Returns: {"url": "https://inr.deals/xYz9L"}
Cache: Forever per store (cache result in DB)
Used on: Every store page Share button, CouponCard share
```

### Affiliate Tracking URL Structure
```
https://inr.deals/track?id=all665437315&src=api&campaign={type}&url={encoded_store_url}&subid={source}
```

**Subid values for traffic attribution:**
- `whatsapp` — WhatsApp group shares
- `instagram` — Instagram bio link
- `telegram` — Telegram channel
- `blog` — SEO blog article links
- `homepage` — Homepage click-outs
- `search` — Search result clicks

---

## 3. Tech Stack — Do Not Change

| Layer | Tool | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR for SEO, file-based routing, API routes |
| Language | TypeScript | Type safety for API responses |
| Styling | Tailwind CSS + shadcn/ui | Brand colors as CSS vars, copy-paste components |
| Cache | Next.js fetch cache + Upstash Redis | Avoid rate limits on INRDeals APIs |
| Database | Supabase (PostgreSQL) | Transaction storage, short URL cache |
| Hosting | Vercel | Zero config deploy, auto SSL, edge CDN |
| Images | Clearbit Logo API + next/image | Free brand logos, auto-optimized |
| AI Coding | Cursor AI | Vibe coding tool |

---

## 4. Brand Identity & Design System

### Logo
- File: `public/logo.png`
- Geometric triangular "A" mark — steel blue + slate grey + purple italic "store" text
- Always display with `height: 44px` in navbar, `height: 36px` in footer

### Color Palette (Tailwind config)
```typescript
// tailwind.config.ts
colors: {
  brand: {
    blue:        '#2E9BD6',  // Primary — logo blue triangle
    'blue-dark': '#1A78B0',  // Hover states
    'blue-light':'#E8F5FB',  // Backgrounds, highlights
    'blue-mid':  '#B3DDF2',  // Borders on blue elements
    slate:       '#4A5568',  // Secondary text, nav links
    'slate-dark':'#2D3748',  // Headings, dark backgrounds
    'slate-light':'#EDF2F7', // Page backgrounds
    purple:      '#6B46C1',  // Accent — logo "store" italic
    'purple-light':'#EDE9FE',// Purple backgrounds
    white:       '#FFFFFF',
    off:         '#F7FAFC',  // Off-white page bg
    border:      '#E2E8F0',  // Default borders
    muted:       '#718096',  // Muted text
  }
}
```

### Typography
```
Heading font: Rajdhani (Google Fonts) — geometric, matches logo angularity
Body font:    Nunito (Google Fonts) — clean, friendly, readable
Code font:    system monospace

Font weights: 400 (body), 500 (medium), 600 (semibold), 700 (bold)
```

### Design Principles
- White/off-white backgrounds — never dark mode (it's a shopping site, stays light)
- Blue primary CTAs — always `bg-brand-blue text-white rounded-full`
- Cards: `bg-white border border-brand-border rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all`
- Top border accent on hover: `group-hover:opacity-100` gradient from brand-blue to purple
- Payout pills: `bg-brand-blue-light border border-brand-blue-mid text-brand-blue-dark`
- Coupon cards: dashed border `border-2 border-dashed border-brand-blue-mid`
- Section titles use Rajdhani font with blue accent on key word

---

## 5. Complete Folder Structure

```
allienstore/
├── app/
│   ├── layout.tsx                    ← Root layout (Navbar + Footer + fonts)
│   ├── page.tsx                      ← Homepage
│   ├── stores/
│   │   ├── page.tsx                  ← /stores — all stores grid with filters
│   │   └── [slug]/
│   │       └── page.tsx              ← /stores/flipkart — store detail + coupons
│   ├── category/
│   │   └── [cat]/
│   │       └── page.tsx              ← /category/fashion — filtered stores
│   ├── coupons/
│   │   └── page.tsx                  ← /coupons — all live coupons
│   ├── search/
│   │   └── page.tsx                  ← /search?q= — stores + coupons results
│   ├── dashboard/
│   │   └── page.tsx                  ← /dashboard — private earnings (password)
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx              ← /blog/myntra-coupons-today — SEO articles
│   └── api/
│       ├── stores/
│       │   └── route.ts              ← Proxies Stores API (hides token)
│       ├── coupons/
│       │   └── route.ts              ← Proxies Coupons API
│       ├── shortlink/
│       │   └── route.ts              ← Proxies Short URL API
│       └── transactions/
│           └── route.ts              ← Proxies Transactions API (dashboard only)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                ← Sticky nav: logo + search + links
│   │   ├── Footer.tsx                ← Full footer with categories + social
│   │   └── PageLayout.tsx            ← Wraps pages: Navbar + Footer + SEO
│   │
│   ├── stores/
│   │   ├── StoreCard.tsx             ← Single store card (used everywhere)
│   │   ├── StoreGrid.tsx             ← Responsive grid of StoreCards
│   │   ├── StoreCarousel.tsx         ← Horizontal scroll row for homepage
│   │   ├── StoreHero.tsx             ← Top section of store detail page
│   │   ├── FilterSidebar.tsx         ← Category + type filters
│   │   └── SimilarStores.tsx         ← "You may also like" section
│   │
│   ├── coupons/
│   │   ├── CouponCard.tsx            ← Individual coupon with copy button
│   │   ├── CouponGrid.tsx            ← Grid of CouponCards
│   │   ├── CopyCodeBtn.tsx           ← Copy + open affiliate link
│   │   └── ExpiryBadge.tsx           ← Green/orange/red expiry indicator
│   │
│   ├── home/
│   │   ├── HeroBanner.tsx            ← Homepage hero section
│   │   ├── CategoryGrid.tsx          ← Icon + name + count grid
│   │   ├── HowItWorks.tsx            ← 4-step trust strip
│   │   ├── BrandMarquee.tsx          ← Scrolling brand name ticker
│   │   └── CTABanner.tsx             ← Bottom CTA with WhatsApp share
│   │
│   └── ui/
│       ├── SearchBar.tsx             ← Global search with autocomplete
│       ├── ShareBtn.tsx              ← WhatsApp + copy link (Short URL API)
│       ├── LoadingSkeleton.tsx       ← Shimmer placeholder cards
│       ├── EmptyState.tsx            ← No results message
│       ├── TypeBadge.tsx             ← CPS/CPA/CPL/CPM colored badge
│       └── EarningsChart.tsx         ← Dashboard line chart (Recharts)
│
├── lib/
│   ├── inrdeals.ts                   ← All 4 API client functions
│   ├── cache.ts                      ← Upstash Redis caching helpers
│   ├── utils.ts                      ← Helpers: slugify, initials, formatPayout
│   └── supabase.ts                   ← Supabase client
│
├── types/
│   └── index.ts                      ← All TypeScript interfaces
│
├── public/
│   └── logo.png                      ← AllienStore logo
│
├── data/
│   └── stores.json                   ← Local store list (primary source — see Section 7)
├── .env.local                        ← API keys (never commit)
├── tailwind.config.ts
├── next.config.ts
└── CLAUDE.md                         ← This file
```

---

## 6. TypeScript Interfaces

```typescript
// types/index.ts

export interface Store {
  id: string
  name: string           // merchant name
  category: string       // primary category
  type: string           // CPS | CPA | CPL | CPM
  payout: string         // "Flat 36% / Sale" or "₹380 / Action"
  link: string           // affiliate tracking URL (already has your id embedded)
  logo?: string          // logo URL from API or Clearbit
  domain?: string        // extracted from link for Clearbit
  status: 'active' | 'inactive'
  slug: string           // url-safe name: "flipkart", "myntra"
}

export interface Coupon {
  id: number
  url: string            // affiliate link (use this for "Shop Now" button)
  label: string          // "30% OFF" — show as big badge
  offer: string          // full offer description
  coupon_code: string    // the actual code to copy (can be empty string)
  description: string    // HTML string of terms
  expire_date: string    // "2025-01-31 00:00:00"
  storelogo_id: number   // store ID for Coupons API
  categories: string     // "food", "fashion" etc
  logo: {
    id: number
    store_name: string
  }
}

export interface Transaction {
  id: number
  transaction_id: string
  sale_amount: string
  status: 'pending' | 'verified' | 'rejected'
  store_name: string
  sale_date: string
  click_id: string
  user_commission: string
  sub_id1: string | null
}

export type CampaignType = 'CPS' | 'CPA' | 'CPL' | 'CPM' | 'CPL_LEAD' | 'CPM_CAR'

export type Category =
  | 'Health & Beauty'
  | 'Fashion'
  | 'Banking & Finance'
  | 'Electronics'
  | 'Travel'
  | 'Home & Kitchen'
  | 'Online Services'
  | 'Food & Grocery'
  | 'Domain & Hosting'
  | 'Education'
  | 'Sports & Fitness'
  | 'Baby & Kids'
  | 'Jewelery'
  | 'Automobiles'
  | 'Entertainment'
  | 'Recharge'
  | 'Books'
  | 'Software'
  | 'Services'
  | 'Others'
```

---

## 7. API Client (lib/inrdeals.ts)

### Local Store Data — `data/stores.json`

> The project uses a local `data/stores.json` file as the **primary source of store details**.
> The INRDeals Stores API (API 1) is only used as a **live fallback** when the local file is absent or when explicitly refreshing data.

**File location:** `data/stores.json` (in the project root, next to `package.json`)

**Shape of each entry in `stores.json`:**
```json
[
  {
    "id": "65",
    "merchant": "Flipkart",
    "category": "Electronics",
    "type": "CPS",
    "payout": "Flat 8% / Sale",
    "url": "https://inr.deals/track?id=all665437315&src=api&campaign=CPS&url=https%3A%2F%2Fwww.flipkart.com",
    "logo": "",
    "status": "active"
  }
]
```

**How to read `stores.json` (utility — add to `lib/inrdeals.ts`):**
```typescript
import storesJson from '@/data/stores.json'   // static import — bundled at build time

function loadStoresFromJson(): Store[] {
  const raw: any[] = Array.isArray(storesJson) ? storesJson : []
  return raw
    .filter((s) => s.status?.toLowerCase() === 'active')
    .map((s) => ({
      id:       String(s.id || ''),
      name:     s.merchant || s.name || '',
      category: normalizeCategory(s.category),
      type:     (s.type || '').toUpperCase(),
      payout:   s.payout || '',
      link:     s.url || '',
      logo:     s.logo || '',
      domain:   extractDomain(s.url || ''),
      status:   'active' as const,
      slug:     slugify(s.merchant || s.name || ''),
    }))
}
```

**Add to `tsconfig.json` if not already present:**
```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

---

```typescript
// lib/inrdeals.ts
// All API calls go through Next.js server — token never exposed to browser

const BASE = 'https://inrdeals.com'
const TOKEN = process.env.INRDEALS_TOKEN!
const UID   = process.env.INRDEALS_UID!

// ── Stores API ──────────────────────────────────────────────
// Strategy:
//   1. Always try data/stores.json first (fast, no rate-limit risk).
//   2. Fall back to live INRDeals API only if stores.json is empty or missing.
//   3. Client-side fetch('/api/stores') hits the same logic via the route proxy.
export async function fetchStores(params?: {
  merchant?: string
  type?: string
  category?: string
}): Promise<Store[]> {

  // ── Step 1: Load from local stores.json ──────────────────
  let stores = loadStoresFromJson()

  // ── Step 2: Fallback to live API if local data is empty ──
  if (stores.length === 0) {
    const url = new URL(`${BASE}/fetch/stores`)
    url.searchParams.set('token', TOKEN)
    url.searchParams.set('id', UID)
    if (params?.merchant) url.searchParams.set('merchant', params.merchant)
    if (params?.type) url.searchParams.set('type', params.type)
    if (params?.category) url.searchParams.set('category', params.category)

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 } // cache 1 hour
    })
    const data = await res.json()
    const raw = Array.isArray(data) ? data : (data?.result?.data || data?.data || [])
    stores = raw
      .filter((s: any) => s.status?.toLowerCase() === 'active')
      .map((s: any) => ({
        id:       String(s.id || ''),
        name:     s.merchant || s.name || '',
        category: normalizeCategory(s.category),
        type:     (s.type || '').toUpperCase(),
        payout:   s.payout || '',
        link:     s.url || '',
        logo:     s.logo || '',
        domain:   extractDomain(s.url || ''),
        status:   'active' as const,
        slug:     slugify(s.merchant || s.name || ''),
      }))
  }

  // ── Step 3: Apply optional filters ───────────────────────
  if (params?.merchant) {
    stores = stores.filter(s =>
      s.name.toLowerCase().includes(params.merchant!.toLowerCase())
    )
  }
  if (params?.type) {
    stores = stores.filter(s => s.type === params.type!.toUpperCase())
  }
  if (params?.category) {
    stores = stores.filter(s =>
      s.category.toLowerCase() === params.category!.toLowerCase()
    )
  }

  return stores
}

// ── Helper: get a single store by slug from stores.json ────
export async function getStoreBySlug(slug: string): Promise<Store | null> {
  const stores = await fetchStores()
  return stores.find(s => s.slug === slug) ?? null
}

// ── Coupons API ─────────────────────────────────────────────
export async function fetchCoupons(params?: {
  store_id?: number
  search?: string
  category?: string
  start_date?: string
  end_date?: string
}): Promise<Coupon[]> {
  const url = new URL(`${BASE}/api/v1/coupon-feed`)
  url.searchParams.set('token', TOKEN)
  url.searchParams.set('id', UID)
  if (params?.store_id) url.searchParams.set('store_id', String(params.store_id))
  if (params?.search) url.searchParams.set('search', params.search)
  if (params?.category) url.searchParams.set('category', params.category)
  if (params?.start_date) url.searchParams.set('start_date', params.start_date)
  if (params?.end_date) url.searchParams.set('end_date', params.end_date)

  const res = await fetch(url.toString(), {
    next: { revalidate: 1800 } // cache 30 min
  })
  const data = await res.json()
  return data?.result?.data || data?.data || []
}

// ── Short URL API ────────────────────────────────────────────
export async function generateShortUrl(trackingUrl: string, subid?: string): Promise<string> {
  const url = new URL(`${BASE}/api/v1/shortlink/generator`)
  url.searchParams.set('token', TOKEN)
  url.searchParams.set('user_id', UID)
  url.searchParams.set('offer_url', encodeURIComponent(trackingUrl))
  if (subid) url.searchParams.set('subid', subid)

  const res = await fetch(url.toString(), { cache: 'force-cache' })
  const data = await res.json()
  return data?.url || trackingUrl
}

// ── Transactions API ─────────────────────────────────────────
export async function fetchTransactions(params: {
  startdate: string   // YYYY-MM-DD
  enddate: string     // YYYY-MM-DD
  page?: number
  sub_id?: string
}): Promise<Transaction[]> {
  const url = new URL(`${BASE}/fetch/reports`)
  url.searchParams.set('token', TOKEN)
  url.searchParams.set('id', UID)
  url.searchParams.set('startdate', params.startdate)
  url.searchParams.set('enddate', params.enddate)
  if (params.page) url.searchParams.set('page', String(params.page))
  if (params.sub_id) url.searchParams.set('sub_id', params.sub_id)

  const res = await fetch(url.toString(), { cache: 'no-store' })
  const data = await res.json()
  return data?.result?.data || data?.data || []
}

// ── Helpers ──────────────────────────────────────────────────
function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function extractDomain(url: string): string {
  try {
    const match = url.match(/url=([^&]+)/)
    if (match) {
      const decoded = decodeURIComponent(match[1])
      const domain = new URL(decoded).hostname.replace(/^www\./, '')
      return domain
    }
  } catch {}
  return ''
}

function normalizeCategory(raw: string): string {
  if (!raw) return 'Others'
  const first = raw.split(',')[0].trim()
  const map: Record<string, string> = {
    'Fashion & Apparels': 'Fashion',
    'Medical & Healthcare': 'Health & Beauty',
    'Accessories': 'Fashion',
    'Gifting & Toys': 'Baby & Kids',
  }
  return map[first] || first
}
```

---

## 8. Environment Variables

```bash
# .env.local — never commit this file

INRDEALS_TOKEN=2b373c2fb9eeb4d3421f2e0cbb99982ed2c0c3d0
INRDEALS_UID=all665437315

# Supabase (get from supabase.com dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Upstash Redis (get from upstash.com — free tier)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Dashboard password
DASHBOARD_PASSWORD=your-secret-password
```

---

## 9. Pages — What Each Page Must Do

### Homepage (`app/page.tsx`)
**Sections in order:**
1. `HeroBanner` — dark blue geometric bg, headline "Shop Smart, Earn on Every Purchase", search bar, 3 floating store cards, stats (245 stores / 20 categories / 36% top commission)
2. Trust bar — "Powered by INRDeals · 245 Verified Brands · Free to Use"
3. `CategoryGrid` — 12 category boxes with emoji icon, name, store count
4. `BrandMarquee` — scrolling ticker of all store names
5. `StoreCarousel` — "Featured Stores" — top 8 stores by payout
6. `CouponGrid` — "Today's Top Coupons" — 6 coupons from Coupons API (category: all)
7. `HowItWorks` — 4 steps: Find Deal → Click Link → Shop Normally → You Earn
8. Why AllienStore — 6 trust cards
9. `CTABanner` — dark bg, WhatsApp share button

**Data fetching:** Call `/api/stores` and `/api/coupons` server-side. Pass as props to client components.

---

### All Stores (`app/stores/page.tsx`)
- Full `StoreGrid` with all 245 stores
- `FilterSidebar`: categories checkboxes + type filter (CPS/CPA/CPL/CPM)
- Sort: A-Z / Z-A / Highest Payout / By Category
- Search input filters client-side
- Load More button (24 per page)
- URL state: `/stores?category=Fashion&type=CPS` — shareable filtered URLs

---

### Store Detail (`app/stores/[slug]/page.tsx`) ⭐ MOST IMPORTANT
**This is the page that earns money and ranks on Google.**

Layout:
```
[Store Logo Large]  [Store Name]           [Affiliate commission rate]
                    [Category badge]        [BIG "Activate Deal" button]
                                           [Share on WhatsApp button]
────────────────────────────────────────────────────────────────
"How to use" — 3 step mini explainer
────────────────────────────────────────────────────────────────
All Coupons for this store (CouponGrid)
  - Each CouponCard: label badge, offer title, copy code, expiry, Shop Now btn
────────────────────────────────────────────────────────────────
Similar Stores (SimilarStores — same category, 4 cards)
```

**SEO:** Set `<title>` to `"{Store Name} Coupons, Offers & Cashback — AllienStore"`. Meta description: `"Get the best {Store Name} coupon codes and offers today. Up to {payout} cashback via AllienStore."`

**Data:** Fetch store by slug from Stores API. Fetch coupons by store_id from Coupons API. Generate short URL via Short URL API.

---

### Category Page (`app/category/[cat]/page.tsx`)
- Category hero: emoji icon + category name + description + store count
- All stores in that category, sorted by payout descending
- Top 3 coupons for that category
- `SEO title`: "Best {Category} Coupons & Cashback in India — AllienStore"

---

### All Coupons (`app/coupons/page.tsx`)
- Full `CouponGrid` — all coupons from API
- Filter by: store name search | category | type (% off / flat / no code needed)
- Sort: newest first | expiring soon | highest discount
- Each `CouponCard` has copy code + Shop Now (affiliate link)

---

### Search (`app/search/page.tsx`)
- Takes `?q=` query param
- Two tabs: "Stores" (N results) | "Coupons" (N results)
- Stores: `StoreGrid` filtered by name match
- Coupons: `CouponGrid` filtered by offer/store name match
- Empty state with search suggestions

---

### Dashboard (`app/dashboard/page.tsx`) — Private
- Password gate: check against `DASHBOARD_PASSWORD` env var
- Date range picker (default: last 30 days)
- Metric cards: Total earnings | Pending | Confirmed | This month
- Line chart: daily earnings (Recharts)
- Table: top 10 stores by commission
- Subid breakdown: WhatsApp vs Instagram vs Telegram vs Blog vs Homepage

---

## 10. Key Components — Specs

### StoreCard
```tsx
// Props
interface StoreCardProps {
  store: Store
  variant?: 'default' | 'compact' | 'featured'
}

// Layout (default variant):
// [Logo 48px] [Name (Rajdhani bold)] [Category muted text]
// [Payout pill — blue-light bg, blue-dark text, "💰 Flat 36% / Sale"]
// [Type badge — CPS/CPA/CPL colored]
// ["Get Deal →" button — full width, brand-blue, rounded-lg]

// On hover: translateY(-3px), shadow-lg, blue top border accent appears
// Logo: Clearbit (logo.clearbit.com/{domain}) with initials fallback
// Clicking entire card links to /stores/[slug]
// "Get Deal" button links to store.link (affiliate URL) in new tab
```

### CouponCard
```tsx
// Props
interface CouponCardProps {
  coupon: Coupon
  storeName?: string
}

// Layout:
// Left: 4px blue-to-purple gradient border
// [Label badge — "30% OFF" in brand-blue Rajdhani]  [Store name muted]
// [Offer title — 2 lines max, clamp]
// IF coupon_code:  [Code box: monospace purple text | "Copy" button]
// IF no code:      ["No code needed — auto-applied at checkout"]
// [Expiry badge] [Shop Now button — gradient bg]
// Style: dashed border, border-2 border-dashed border-brand-blue-mid
```

### CopyCodeBtn
```tsx
// Behavior:
// 1. Click → navigator.clipboard.writeText(code)
// 2. Button shows "Copied! ✓" with green bg for 2 seconds
// 3. After copy → opens coupon.url (affiliate link) in new tab
// This is the #1 conversion action — make it prominent
```

### ShareBtn
```tsx
// Props: { storeLink: string, storeName: string }
// Calls /api/shortlink to get short URL
// Shows: WhatsApp icon button → opens wa.me with pre-filled message
// Copy icon button → copies short URL to clipboard
// WhatsApp message: "Check out {storeName} deals on AllienStore! {shortUrl}"
```

### ExpiryBadge
```tsx
// Logic:
const daysLeft = Math.ceil((new Date(expire_date).getTime() - Date.now()) / 86400000)
// daysLeft > 7:  green badge "X days left"
// daysLeft 1-7:  orange badge "Expires in X days"
// daysLeft <= 0: red badge "Expired" (still show coupon, may still work)
```

### LoadingSkeleton
```tsx
// Matches StoreCard dimensions exactly
// Shimmer animation: bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100
// animate-pulse or custom shimmer keyframe
// Show 8 skeletons while Stores API loads
```

---

## 11. Category Reference

All 20 categories with icons (use these exactly):

```typescript
export const CATEGORIES = {
  'Health & Beauty':   { icon: '💄', count: 54 },
  'Fashion':           { icon: '👗', count: 46 },
  'Banking & Finance': { icon: '🏦', count: 29 },
  'Electronics':       { icon: '💻', count: 23 },
  'Travel':            { icon: '✈️', count: 17 },
  'Home & Kitchen':    { icon: '🏠', count: 13 },
  'Online Services':   { icon: '🌐', count: 11 },
  'Food & Grocery':    { icon: '🛒', count: 9  },
  'Domain & Hosting':  { icon: '🖥️', count: 8  },
  'Education':         { icon: '📚', count: 7  },
  'Sports & Fitness':  { icon: '🏋️', count: 6  },
  'Baby & Kids':       { icon: '🧸', count: 6  },
  'Jewelery':          { icon: '💍', count: 4  },
  'Others':            { icon: '🏷️', count: 4  },
  'Automobiles':       { icon: '🚗', count: 2  },
  'Entertainment':     { icon: '🎬', count: 2  },
  'Recharge':          { icon: '📱', count: 1  },
  'Books':             { icon: '📖', count: 1  },
  'Software':          { icon: '⚙️', count: 1  },
  'Services':          { icon: '🛠️', count: 1  },
} as const
```

---

## 12. API Routes (Server Proxy)

```typescript
// app/api/stores/route.ts
import { fetchStores } from '@/lib/inrdeals'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const stores = await fetchStores({
    merchant: searchParams.get('merchant') || undefined,
    type: searchParams.get('type') || undefined,
    category: searchParams.get('category') || undefined,
  })
  return NextResponse.json(stores)
}
```

Same pattern for `/api/coupons/route.ts` and `/api/shortlink/route.ts`.

**Important:** All 4 API routes must be server-only. Never call INRDeals APIs from client components. Use `fetch('/api/stores')` from client if needed.

---

## 13. SEO Requirements

Every page must have correct meta tags. Use Next.js `generateMetadata`:

```typescript
// app/stores/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const store = await getStoreBySlug(params.slug)
  return {
    title: `${store.name} Coupons, Offers & Cashback — AllienStore`,
    description: `Get the best ${store.name} coupon codes and deals today. Up to ${store.payout} via AllienStore affiliate deals platform.`,
    openGraph: {
      title: `${store.name} — Best Deals on AllienStore`,
      description: `Shop at ${store.name} through AllienStore and save with exclusive coupon codes.`,
      images: [{ url: `https://logo.clearbit.com/${store.domain}` }],
    },
  }
}
```

Also generate:
- `app/sitemap.ts` — all store + category pages (helps Google index everything)
- `app/robots.ts` — allow all crawling
- `<link rel="canonical">` on all pages

---

## 14. Supabase Schema

```sql
-- Transactions table (for dashboard)
create table transactions (
  id            bigint primary key,
  transaction_id text unique,
  sale_amount   decimal,
  commission    decimal,
  status        text,
  store_name    text,
  sale_date     timestamptz,
  sub_id        text,
  fetched_at    timestamptz default now()
);

-- Short URLs cache
create table short_urls (
  store_id    text primary key,
  short_url   text not null,
  created_at  timestamptz default now()
);

-- Indexes
create index on transactions(sale_date desc);
create index on transactions(status);
create index on transactions(sub_id);
```

---

## 15. Build Order for Claude Code Sessions

When starting a new session, build in this exact order:

### Session 1 — Project Setup
1. `npx create-next-app@latest allienstore --typescript --tailwind --app`
2. `npx shadcn@latest init` — choose default style, slate base
3. Configure `tailwind.config.ts` with brand colors (Section 4)
4. Add Google Fonts (Rajdhani + Nunito) to `app/layout.tsx`
5. Copy `public/logo.png`
6. Create `.env.local` with credentials (Section 8)
7. Build `Navbar.tsx` and `Footer.tsx`
8. Build `PageLayout.tsx` wrapping all pages

### Session 2 — Core Data Layer
1. Create `data/stores.json` — populate with store list from INRDeals API or manually (see Section 7 shape). This is the primary store data source.
2. Create `types/index.ts` (Section 6)
3. Create `lib/inrdeals.ts` (Section 7) — reads `data/stores.json` first, falls back to live API
4. Create `app/api/stores/route.ts`
5. Create `app/api/coupons/route.ts`
6. Test: `curl http://localhost:3000/api/stores` — should return stores from `data/stores.json`

### Session 3 — Store Components
1. Build `StoreCard.tsx` (Section 10)
2. Build `StoreGrid.tsx`
3. Build `LoadingSkeleton.tsx`
4. Build `TypeBadge.tsx`
5. Build `app/stores/page.tsx` with filter + sort

### Session 4 — Homepage
1. Build `HeroBanner.tsx`
2. Build `CategoryGrid.tsx`
3. Build `BrandMarquee.tsx`
4. Build `StoreCarousel.tsx`
5. Build `HowItWorks.tsx`
6. Assemble `app/page.tsx`

### Session 5 — Coupons + Store Detail (💰 Revenue page)
1. Build `CopyCodeBtn.tsx`
2. Build `ExpiryBadge.tsx`
3. Build `CouponCard.tsx`
4. Build `CouponGrid.tsx`
5. Create `app/api/coupons/route.ts`
6. Build `app/stores/[slug]/page.tsx` — THE KEY PAGE
7. Build `app/coupons/page.tsx`

### Session 6 — Category + Search
1. Build `app/category/[cat]/page.tsx`
2. Build `SearchBar.tsx` with autocomplete
3. Build `app/search/page.tsx`

### Session 7 — Short URLs + Sharing
1. Create `app/api/shortlink/route.ts`
2. Build `ShareBtn.tsx`
3. Add share button to every store + coupon page
4. Test WhatsApp share flow

### Session 8 — Dashboard
1. Set up Supabase (Section 14)
2. Create `lib/supabase.ts`
3. Create `app/api/transactions/route.ts`
4. Build `EarningsChart.tsx` (use Recharts)
5. Build `app/dashboard/page.tsx` with password gate

### Session 9 — SEO + Deploy
1. Add `generateMetadata` to all pages
2. Create `app/sitemap.ts`
3. Create `app/robots.ts`
4. Run `npm run build` — fix all errors
5. `vercel --prod` — live deploy

---

## 16. Common Patterns

### Fetching stores server-side
```typescript
// In any server component (page.tsx)
// fetchStores() reads from data/stores.json first; falls back to live API if empty
import { fetchStores, getStoreBySlug } from '@/lib/inrdeals'

export default async function Page() {
  const stores = await fetchStores()
  // pass to client components as props
}

// To get a single store on the detail page:
export default async function StorePage({ params }: { params: { slug: string } }) {
  const store = await getStoreBySlug(params.slug)
  if (!store) notFound()
  // ...
}
```

### Clearbit logo with fallback
```tsx
function StoreLogo({ domain, name }: { domain: string, name: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
  return (
    <div className="w-12 h-12 rounded-xl bg-brand-blue-light border border-brand-blue-mid flex items-center justify-center overflow-hidden">
      {domain ? (
        <img
          src={`https://logo.clearbit.com/${domain}`}
          alt={name}
          className="w-full h-full object-contain p-1"
          onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling!.style.display = 'flex' }}
        />
      ) : null}
      <span className="text-brand-blue-dark font-bold text-sm font-rajdhani hidden">{initials}</span>
    </div>
  )
}
```

### Loading state pattern
```tsx
'use client'
import { useState, useEffect } from 'react'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { StoreGrid } from '@/components/stores/StoreGrid'

export function StoresSection() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stores').then(r => r.json()).then(data => {
      setStores(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <LoadingSkeleton count={8} />
  return <StoreGrid stores={stores} />
}
```

---

## 17. Deployment Checklist

Before running `vercel --prod`:

- [ ] `npm run build` passes with zero errors
- [ ] All env vars set in Vercel dashboard (Settings → Environment Variables)
- [ ] Test `/api/stores` returns data
- [ ] Test `/api/coupons` returns data
- [ ] Test a store detail page `/stores/flipkart` loads coupons
- [ ] Test copy code button works
- [ ] Test affiliate links open correct store with `?id=all665437315` in URL
- [ ] Test on mobile (Safari iOS + Chrome Android)
- [ ] Lighthouse score > 80 on Performance
- [ ] All pages have correct `<title>` and meta description
- [ ] Logo shows in navbar and footer

---

## 18. Do Not Do These

- ❌ Never call INRDeals APIs directly from client components (exposes token)
- ❌ Never commit `.env.local` to git
- ❌ Never use `any` type in TypeScript — use the interfaces in Section 6
- ❌ Never hardcode the affiliate URL — always use `store.link` from API
- ❌ Never use `color: #333` or other hardcoded colors — use Tailwind brand classes
- ❌ Never add dark mode — this is a shopping site, light mode only
- ❌ Never call Transactions API on every page load — only in dashboard, only via cron
- ❌ Never skip the `revalidate` cache on Stores API calls — it will hammer the API
- ❌ Never use `<a>` for internal navigation — use Next.js `<Link>`
- ❌ Never skip `alt` text on images — required for SEO

---

## 19. Quick Start Commands

```bash
# Clone and install
git clone https://github.com/yourusername/allienstore
cd allienstore
npm install

# Run locally
npm run dev
# → http://localhost:3000

# Test API routes
curl http://localhost:3000/api/stores
curl "http://localhost:3000/api/coupons?store_id=65"

# Build for production
npm run build

# Deploy
vercel --prod
```

---

## 20. Reference — Popular Store IDs for Coupons API

Use these `store_id` values when calling the Coupons API for specific stores:

| Store | store_id |
|---|---|
| Amazon | 1 |
| Flipkart | 65 |
| Myntra | 193 |
| Swiggy | 167 |
| Zomato | 298 |
| MakeMyTrip | 173 |
| Nykaa | 206 |
| Paytm | 228 |
| BookMyShow | 252 |
| Dominos | 46 |
| Uber | 278 |
| Ola | 297 |
| Cleartrip | 33 |
| GoDaddy | 86 |
| PhonePe | 1545 |
| Goibibo | 603 |
| Yatra | 328 |

For stores not in this list, use `search` param: `?search=StoreName`

---

*Last updated: 2025 | AllienStore v1.0 | Built on INRDeals Affiliate Network*
