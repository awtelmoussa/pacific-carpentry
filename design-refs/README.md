# Handoff: Pacific Carpentry — Custom Next.js Ecommerce

## Overview
A bilingual (English / Arabic, full RTL) ecommerce storefront for **Pacific Carpentry**, a Dubai-based maker of furniture and architectural woodwork. Customers browse a catalog, configure a product by **finish (color)** and **size** — where **each size has its own price** — add to cart, and check out. Prices are in **AED**.

Pages: **Home, Products (listing), Product Detail, Our Work (portfolio), About, Contact, Cart/Checkout.**

## About the Design Files
The files in this bundle (`*.dc.html`, `shared.js`) are **design references created in HTML** — working prototypes that show the intended look, layout, copy, and behavior. **They are not production code to copy directly.**

Your task is to **recreate these designs in a custom Next.js codebase** using its idiomatic patterns (App Router, Server Components, Tailwind, a real database). The HTML uses inline styles and a small client-side templating runtime that you should **not** carry over — translate the *visual result* into React + Tailwind components.

`shared.js` is the most directly reusable file: its product data, translation strings, and helpers (`fmt`, `minPrice`, cart logic) map almost 1:1 onto your seed data, i18n message files, and cart utilities.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and interactions are final. Recreate the UI pixel-faithfully using Tailwind. Exact tokens are in the **Design Tokens** section below.

---

## Recommended Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Next.js 14+ (App Router)** | SSR for SEO on product pages; file-based routing matches the page list |
| Styling | **Tailwind CSS** | Map the inline styles below to utilities; add the custom palette to `tailwind.config` |
| Database | **PostgreSQL via Supabase** | Hosted Postgres + image storage + (optional) auth |
| ORM | **Prisma** | Schema in `schema.prisma` (below); type-safe queries |
| i18n + RTL | **next-intl** | Locale routing `/en`, `/ar`; set `dir="rtl"` on `<html>` for Arabic |
| Cart state | **Zustand** (client) or server cart in DB | Prototype uses localStorage; Zustand + `persist` replicates it cleanly |
| Images | **next/image** | Replace the placeholder gradient blocks |
| Payments | **Stripe**, or **Telr / PayTabs** (UAE-friendly) | Not in the prototype — add at checkout |
| Hosting | **Vercel** + Supabase | Standard combo |

### Suggested project structure
```
app/
  [locale]/
    layout.tsx            # sets <html lang dir>, fonts, Nav + Footer
    page.tsx              # Home
    products/
      page.tsx            # Listing (filter + sort)
      [slug]/page.tsx     # Product detail (color/size/price selector)
    work/page.tsx         # Our Work
    about/page.tsx        # About
    contact/page.tsx      # Contact (form)
    cart/page.tsx         # Cart + checkout steps
components/
  Nav.tsx  Footer.tsx  ProductCard.tsx
  VariantSelector.tsx  CartLine.tsx  OrderSummary.tsx
lib/
  cart.ts  format.ts  prisma.ts
messages/ en.json  ar.json   # from shared.js `T`
prisma/ schema.prisma  seed.ts
```

---

## Data Model

The price lives on the **size** row — this is the core requirement ("each size has a price"). Colors and sizes are children of a product. Order items snapshot the chosen color/size/price at purchase time (so later price edits don't rewrite history).

See `schema.prisma` in this folder for the full Prisma schema. Summary:

- **Product** — slug, category, `nameEn/nameAr`, `taglineEn/taglineAr`, `descEn/descAr`, images[]
- **ProductColor** — productId, `nameEn/nameAr`, `hex`
- **ProductSize** — productId, `labelEn/labelAr`, **`price`** (Int, AED)
- **Project** (Our Work) — `titleEn/titleAr`, category, year, images[]
- **Order** — status, total, customer JSON, createdAt
- **OrderItem** — orderId, productId, color, size, **price**, qty (snapshotted strings)

Seed data: port the `PRODUCTS`, `CATEGORIES`, and `PROJECTS` arrays from `shared.js` directly into `prisma/seed.ts`.

---

## Internationalization & RTL

- Two locales: `en` (default) and `ar`. Use `next-intl` with locale-prefixed routes.
- Copy all strings from the `T` object in `shared.js` into `messages/en.json` and `messages/ar.json` (structure is already nested: `nav`, `cta`, `home`, `products`, `detail`, `work`, `about`, `contact`, `cart`, `footer`).
- In the locale `layout.tsx`, set `<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>`. Tailwind flips automatically if you use **logical properties** (`ps-`/`pe-`, `ms-`/`me-`, `text-start`) and `rtl:`/`ltr:` variants — avoid hard `left/right`.
- Fonts switch by locale:
  - **Latin:** display = *Cormorant Garamond*, body = *Manrope*
  - **Arabic:** display = *Amiri*, body = *Tajawal*
- Currency: `fmt(price, locale)` → `AED 4,200` (en) / `٤٬٢٠٠ د.إ` (ar). Port from `shared.js`.
- Numbers in Arabic use `toLocaleString('ar-AE')` (Eastern Arabic numerals) — already in `fmt`.

---

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| `bg` | `#15110D` | Page background (near-black espresso) |
| `bg2` | `#1A140F` | Alternating section background |
| `surface` | `#221C15` | Cards, inputs |
| `surface2` | `#2A2219` | Raised surface |
| `line` | `rgba(237,230,216,0.12)` | Borders |
| `lineSoft` | `rgba(237,230,216,0.07)` | Faint dividers |
| `cream` | `#EDE6D8` | Primary text |
| `creamBright` | `#F4EEE3` | Headings |
| `muted` | `#A8997F` | Secondary text / labels |
| `faint` | `#8A7E6B` / `#6E6353` | Tertiary text, footer |
| `wood` (accent) | `#C2965B` | Primary CTA, prices, kickers |
| `woodSoft` | `#D8B583` | CTA hover |
| `woodDeep` | `#9A6E3A` | Deep accent |
| `success` | `#8FB57A` | Order confirmation, "added" |

Finish swatch hexes (product colors): Natural Oak `#C99A63`, Walnut `#6B4226`, Espresso `#3A2A1E`, Charcoal `#2C2824`, Natural `#CCA573`.

### Typography
- Display: **Cormorant Garamond**, weight 500–600. Headings use `font-size: clamp(...)`, `line-height: ~1.0–1.1`, letter-spacing `-0.01em`. Hero h1: `clamp(46px, 8vw, 104px)`.
- Body/UI: **Manrope**, 300 (lead paragraphs) / 400–500 (body) / 600–700 (buttons, labels).
- Uppercase labels/kickers: 11–13px, `font-weight:600`, `letter-spacing: .14em–.28em`, `text-transform:uppercase`, color = wood `#C2965B`.
- Buttons: 13px, 600–700, `letter-spacing:.10em`, uppercase.

### Spacing & shape
- Section vertical padding: `clamp(70px, 9vw, 130px)`. Horizontal: `clamp(20px, 5vw, 72px)`. Max content width: **1280px** (1180 on cart).
- Border radius: **2px** buttons/inputs, **3–4px** cards/tiles. Pills: `40px`.
- Nav height: **74px**, fixed, translucent (`rgba(21,17,13,0.55)` → `0.92` on scroll), `backdrop-filter: blur(16px)`.
- Card image aspect ratio: **4/5** (product), **1/1** (detail hero), varied in Our Work masonry.

### Motion
- Card hover: `translateY(-6px)`, 0.4s `cubic-bezier(.2,.7,.3,1)`; image zoom `scale(1.05)` 0.6s; overlay fade-in.
- Hero: slow Ken-Burns zoom on the video/poster (18s alternate); content rises in (`pcFade` 0.9s); scroll cue bobs.
- Buttons: background → `#D8B583` on hover (0.25s); ghost buttons brighten border/text.

---

## Screens / Views

### Nav (global, all pages)
Fixed top bar, 74px. Left: "PC" monogram (1px wood border) + wordmark "PACIFIC" (600, `.16em`) over "CARPENTRY" (`.42em`). Center/right: links (Home, Products, Our Work, About, Contact) — active link is cream, others muted. Right cluster: **language toggle** button (shows the *other* language: "العربية" on EN, "English" on AR) that switches locale and persists it; **cart icon** with a wood count badge. Mobile (≤860px): links collapse into a hamburger → full-screen overlay menu.

### Footer (global)
4-column grid (tagline+wordmark, Shop, Company, Newsletter w/ email input + Subscribe). Bottom row: copyright + "Made to order in Dubai, UAE." Collapses to 2 then 1 column.

### Home
1. **Hero** — full-viewport. Background is a **looping muted video** (the client has footage; in the prototype it's a `<video>` with a Ken-Burns gradient fallback and a "Drop your workshop video here" hint). Dark gradient overlay. Content bottom-left: wood kicker, huge serif headline (2 lines), 300-weight subtitle, two CTAs (filled "Shop the collection" → /products, ghost "Our Work" → /work). Scroll cue bottom-center.
2. **Categories** — 5 tiles (Dining Tables, Chairs & Benches, Cabinets, Doors, Custom Shelving), each with index number + name + arrow, link to `/products?cat=`. Hover tints wood.
3. **Featured** — section header + "View all" link; 4-up `ProductCard` grid.
4. **Recent work** — 3 project tiles (1.4fr/1fr/1fr) with hover zoom, caption overlay → /work.
5. **About teaser** — split: text + 3 stats (20+ Years, 1,400+ Pieces, 300+ Clients) + image placeholder.
6. **CTA band** — centered "Have something in mind?" → /contact.

### Products (listing)
Header (kicker/title/sub). Toolbar: category filter **pills** (All + 5 categories; active = filled wood) and a **sort** select (Featured / Price low→high / high→low). 3-column `ProductCard` grid (2 then 2 on smaller). Reads `?cat=` from URL to preset the filter. Empty state message when a category has no items.

### Product Detail  ⭐ core ecommerce
Two columns (1.05fr / 0.95fr), stacks on ≤920px.
- **Left:** 1/1 image with large faint initial watermark + 4 thumbnail placeholders.
- **Right:** category kicker, serif name, tagline, **price that updates with selected size**. **Finish** row: circular swatches (selected = wood ring) + current finish name. **Size** row: stacked option buttons, each showing label + its price; selected = wood border + tint. **Quantity** stepper. **Add to cart** button → writes a cart line `{id, name, color, colorHex, size, price, qty}`, then flips to green "✓ Added". Assurances list (made to order 4–6 wks, ships UAE, solid wood). Description. Below: "You may also like" — 4 `ProductCard`s.

### Our Work
Header + filter pills (All / Residential / Hospitality / Commercial). **Masonry** (CSS columns, 3→2→1) of project tiles with varied aspect ratios, hover zoom, caption overlay (category · year + title). Tiles link to /contact.

### About
Hero split (kicker, 2-line serif title, lead + image). Values band (3 numbered blocks: Our craft / Our materials / Our promise) on `bg2`. Centered CTA with two buttons.

### Contact
Header. Split: **form** (Name, Email, Phone, Subject, Message, Send) → on submit shows a success card ("Thank you — we'll be in touch shortly."). Side column: 3 info cards (Visit / Call / Write) + a styled map placeholder.

### Cart / Checkout
One page, three states driven by a `step` variable:
- **Empty** — message + "Continue shopping".
- **Cart** — line items (image, name, finish·size, qty stepper, remove, line total) + sticky **Order summary** (subtotal, shipping "Calculated at checkout", total, **Checkout** button).
- **Checkout** — replaces left with **Contact & delivery** + **Payment** forms; summary shows shipping; button becomes **Place order** → generates order # `PC-XXXXXX`, clears cart, shows confirmation state with order number.

---

## Interactions & Behavior
- **Language switch:** persist locale (prototype uses `localStorage 'pc_lang'` + reload; in Next.js use locale routing + a cookie). Whole UI re-renders translated, `dir` flips.
- **Cart:** add/increment/decrement/remove; badge count in Nav updates live (prototype dispatches a `pc-cart` event; in Next.js use the Zustand store subscription). Persist across pages/reloads.
- **Variant selection:** changing size updates the displayed unit price; changing color updates the swatch ring, finish name, and image tint.
- **Forms:** validate required fields, email format; show inline success state (prototype is non-networked — wire to an API route / email service).
- **Responsive:** breakpoints used in prototype — 900/920px (split → stack, 3→2 grids), 860px (nav → hamburger), 560px (grids → tighter).

## State Management
- `locale` — from route segment (next-intl).
- `cart: CartLine[]` — global store (Zustand `persist`, or DB-backed cart keyed by session). Line shape: `{ productId, slug, nameEn, nameAr, color, colorHex, size, price, qty }`.
- Product detail (local): `colorIndex`, `sizeIndex`, `qty`, `added`.
- Listing (local/URL): `category` (from `?cat=`), `sort`.
- Cart page (local): `step: 'cart' | 'checkout' | 'done'`, `orderNo`.

## Assets
All imagery in the prototype is **placeholder** (wood-tone gradient blocks with faint grain + watermark initials, labeled "image"/"صورة"). Replace with:
- Real **product photos** (per product; ideally one per finish) → `next/image`.
- **Hero video** (client has footage) → `<video autoplay muted loop playsinline poster>`; keep the gradient as poster/fallback.
- **Project photos** for Our Work.
- Client **logo** (to be supplied) → replace the "PC" wordmark in Nav/Footer.
No icon library is required — the few icons (cart, arrows, hamburger, play, check) are inline SVG / glyphs; swap for `lucide-react` if preferred.

## Files (design references in this bundle)
- `Home.dc.html` — home page
- `Products.dc.html` — listing (filter + sort)
- `ProductDetail.dc.html` — variant selector + add to cart
- `OurWork.dc.html` — portfolio masonry
- `AboutUs.dc.html`, `ContactUs.dc.html`
- `Cart.dc.html` — cart + checkout steps
- `Nav.dc.html`, `Footer.dc.html`, `ProductCard.dc.html` — shared components
- `shared.js` — ⭐ product data, categories, projects, translations (`T`), and helpers (`fmt`, `minPrice`, cart) — port directly to seed + i18n + lib
- `schema.prisma` — starting database schema
- To preview the look: open any `.dc.html` in the conversation, or ask the designer for screenshots.
