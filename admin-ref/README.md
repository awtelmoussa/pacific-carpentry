# Handoff: Pacific Carpentry — Admin Panel (Next.js)

## Overview
The internal **admin panel** for the Pacific Carpentry storefront. It lets the shop owner manage the catalog, fulfil orders, curate the Our Work portfolio, and read contact-form inquiries. It shares the **same database** as the storefront (see `schema.prisma`).

This is the companion to the storefront handoff. Build it as an **authenticated section of the same Next.js app** (e.g. routes under `/admin`, or a separate route group `app/(admin)/`), reusing the same Prisma client and data model.

## About the Design Files
`Admin.dc.html` is a **working design prototype built in HTML** — it shows the exact layout, density, color, and interactions of every admin screen. It is **not production code**. Recreate it as idiomatic Next.js + React + Tailwind. `shared.js` holds the sample catalog/translation data the prototype reads; use it to understand the shapes and to seed the dev DB.

The admin **chrome is English-only**, but every product/project record has **bilingual (EN + AR) fields** — the editor shows English and Arabic inputs side by side. This matches the storefront, which serves both languages.

## Fidelity
**High-fidelity.** Match the prototype's layout and styling. Tokens below.

---

## Recommended Stack
Same app as the storefront. Add:

| Concern | Choice | Notes |
|---|---|---|
| Auth | **NextAuth (Auth.js)** or Supabase Auth | Protect all `/admin` routes; single "owner"/"staff" role is enough to start |
| Data mutations | **Server Actions** or Route Handlers (`app/api/admin/*`) | CRUD for products, orders, projects, messages |
| Image upload | **Supabase Storage** (or UploadThing / S3) | Product & project photos; store returned URLs in `images[]` |
| Tables/forms | Plain React + Tailwind | The prototype is intentionally lightweight — no table library needed |
| Validation | **Zod** | Validate product/size/price payloads server-side |

### Suggested structure
```
app/(admin)/admin/
  layout.tsx            # sidebar + topbar shell, auth guard
  page.tsx              # Dashboard
  products/
    page.tsx            # list (search + category filter)
    [id]/page.tsx       # editor (edit)
    new/page.tsx        # editor (create)
  orders/
    page.tsx            # list (status filter)
    [id]/page.tsx       # detail + status update
  work/page.tsx         # project grid + editor
  messages/page.tsx     # inbox
lib/admin/
  queries.ts  actions.ts
components/admin/
  Sidebar.tsx  Topbar.tsx  StatusBadge.tsx
  ProductForm.tsx  FinishRows.tsx  SizePriceRows.tsx
  OrdersTable.tsx  OrderDetail.tsx
```

The **API/data contract** (endpoints, payloads, entity shapes) is in **`admin-api.json`** in this folder — hand it to Claude alongside this README.

---

## Screens

### Shell (every screen)
- **Dark sidebar** (`#181310`), 248px, collapses to a 72px icon rail under 1020px. Logo top, nav (Dashboard, Products, Orders, Our Work, Messages — Orders & Messages show count badges), owner chip bottom.
- **Topbar:** page title + subtitle on the left; a contextual primary action on the right (e.g. "+ New piece" on Products, "+ Add project" on Our Work). A "← Back" button appears on editor/detail screens.

### Login / Auth  (entry point)
The admin is gated — unauthenticated users land here.
- **Split screen:** left **brand panel** (dark `#181310` with a radial wood gradient + faint grain, the "PC" logo, a serif headline "Furniture worth passing down.", a short subline, and a copyright line); right **form panel** on the paper background.
- **Form:** "Admin" kicker, "Welcome back" heading, subline, **Email** + **Password** inputs, a **Remember me** checkbox, a **Forgot password?** link, a full-width **Sign in** button (wood `#9A6E3A`), and an "Authorized staff only." note.
- The brand panel hides under 760px (form-only on mobile).
- **Behavior:** on submit, authenticate, then redirect to the Dashboard. A **Sign out** button sits on the owner chip at the bottom of the sidebar and returns here. In the prototype this is local state; in Next.js wire it to your auth provider (NextAuth/Auth.js or Supabase Auth) and protect every `/admin` route with a server-side session check (middleware or layout guard), redirecting unauthenticated requests to `/admin/login`.

### Dashboard
- **4 KPI cards:** Revenue (30d), Orders, Pending (needs review), Avg. order — each with an icon and a delta vs last period.
- **Recent orders** table (clickable → order detail).
- **Top pieces** widget (best sellers w/ units + revenue) and an **Inbox** promo card linking to Messages.
- KPI numbers are **derived** server-side from orders; don't hardcode.

### Products — list
- Search field + category filter pills (All + the 5 categories).
- Table row per product: thumbnail (first image / placeholder), name **EN over AR**, category, **finish swatches**, **price range** (min–max across sizes), status badge, chevron.
- Row click → editor. Topbar "+ New piece" → blank editor.

### Products — editor  ⭐ core
The most important screen — it captures the **finish + size→price** model.
- **Details** card: Name (EN/AR), Tagline (EN/AR), Category (select), Status (Active/Draft), Description (EN/AR).
- **Finishes** card: repeatable rows — color swatch + hex + name (EN) + name (AR) + remove; "+ Add finish".
- **Sizes & pricing** card: repeatable rows — size label (EN) + size label (AR) + **price in AED** + remove; "+ Add size". Helper text: every size carries its own price; the lowest becomes the storefront "From" price.
- **Right column (sticky):** Photos uploader (4:5 hero + thumbnails) and a **Summary** (finish count, size count, computed price range) + Save / Cancel.
- On save: validate (≥1 finish, ≥1 size, every size has a positive integer price) and upsert Product + its colors + sizes.

### Orders — list
- Status filter pills (All, Pending, Paid, In production, Shipped, Completed).
- Row: order number, customer (name over email), date, item count, **status badge**, total, chevron → detail.

### Orders — detail
- Left: order header (number, date, item count, status badge); line items (thumbnail, name, finish · size, ×qty, line total); totals (subtotal, shipping, total).
- Right: **Update status** stepper (pending → paid → in production → shipped → completed; current is highlighted, click to set) and a **Customer** card (name, email, phone, delivery address).
- Status change persists to the order and should be auditable (status + updatedAt).

### Our Work
- Responsive card grid of portfolio projects: image, category · year, title (EN over AR), Edit / Delete. "+ Add project" tile. Editor mirrors the product editor's bilingual pattern (title EN/AR, category, year, images).

### Messages
- Inbox list of contact-form submissions: avatar (initials), name, subject, preview, time; **unread** rows are tinted with a dot and bolded. (Wire to the same store the storefront contact form writes to.)

---

## Design Tokens (admin)
Light content on a warm paper background; dark brand sidebar.

| Token | Value | Use |
|---|---|---|
| App background | `#F4F1EB` | Page |
| Surface / cards | `#FFFFFF` | Cards, tables |
| Subtle surface | `#FBF9F5` / `#F7F4EE` | Inputs, table head, hover |
| Sidebar | `#181310` | Nav rail |
| Sidebar text | `#9A8B73` (idle) · `#EDE6D8` (active) | active item bg `rgba(194,150,91,0.16)` |
| Border | `#EAE3D5` / `#E5DECF` | Card & input borders |
| Heading text | `#241C13` | Titles, values |
| Body text | `#5A5043` · muted `#8A7E6B` · faint `#A89B85` | |
| Accent (wood) | `#9A6E3A` (primary buttons) · `#C2965B` (highlights, badges) | hover `#85602F` |

**Status colors** (text on tint): Pending `#B7791F`/`#FBF0DA` · Paid `#2F7D52`/`#E2F1E7` · In production `#9A6E3A`/`#F3E8D6` · Shipped `#2B6CB0`/`#E1ECF7` · Completed `#5A5043`/`#EFEADF` · Cancelled `#C0573E`/`#F7E4DE`.

**Type:** Manrope throughout (300–800); Cormorant Garamond only for the "PC" logo mark. KPI values 30px/800. Card titles 15px/700. Body 13–14px. Uppercase table headers 11px/700, `.06em`.

**Shape & spacing:** cards radius 12px, inputs/buttons 8px, pills 20px. Card padding ~22px. Content padding `clamp(20px,3vw,36px)`. Sidebar 248px → 72px under 1020px; editor splits and KPI grid collapse responsively.

---

## State & Behavior (prototype → real)
- The prototype switches screens with internal state; in Next.js use **routes** (`/admin/products`, `/admin/products/[id]`, etc.).
- Editor rows (finishes, sizes) are **add/remove repeatables** in local form state, submitted as arrays — see `admin-api.json` payloads.
- Order status updates mutate the order and re-render the badge everywhere.
- All inputs in the prototype are display-only; wire them to controlled form state + server actions.
- **Auth:** gate the entire admin area; redirect unauthenticated users to a login page.

## Assets
All imagery is placeholder (wood-tone gradient blocks). Real product/project photos upload via the Photos card → storage → `images[]`. The "PC" mark is a text wordmark until the client's logo is supplied.

## Files in this bundle
- `Admin.dc.html` — the full admin design prototype (open in a browser to explore; click through the sidebar).
- `admin-api.json` — ⭐ API endpoints + request/response contracts + entity shapes for every screen.
- `schema.prisma` — shared database schema (same as the storefront handoff).
- `shared.js` — sample catalog + translations the prototype reads (seed/reference).
