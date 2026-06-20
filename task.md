# Pacific Carpentry — Build Tasks

## Phase 1 — Scaffold
- [x] Initialize Next.js project with TypeScript + Tailwind
- [x] Configure Tailwind CSS v4 design tokens in globals.css
- [x] Set up next-intl (middleware, routing, dynamic loaders, translation files)
- [x] Create root layout with fonts, direction, Nav/Footer wrappers
- [x] Create globals.css with keyframes and custom scrollbars

## Phase 2 — Data & Utilities
- [x] Create lib/data.ts (products, categories, projects)
- [x] Create lib/format.ts (currency formatter for locale-specific formatting)
- [x] Create lib/cart.ts (Zustand store with persist middleware)

## Phase 3 — Shared Components
- [x] Nav.tsx (scroll transitions, language toggle, and cart count)
- [x] Footer.tsx (responsive columns, translation links, newsletter mockup)
- [x] ProductCard.tsx (dynamic color background gradients, hover lift effects, watermark letters)
- [x] SectionHeader.tsx (reusable headings, kicker, and View All link)

## Phase 4 — Pages
- [x] Home page (hero animation, categories tiles, featured items, portfolio zoom)
- [x] Products listing page (category filter pills, featured/price sorting)
- [x] Product detail page (finish swatches, size list prices, quantity stepper, cart integration)
- [x] Our Work page (masonry columns grid, category filtering, contact navigation)
- [x] About page (story layout, value statements, core statistics)
- [x] Contact page (input styling focuses, success alert messages, information cards)
- [x] Cart/Checkout page (multi-step process, quantity stepper, address inputs, order tokens)

## Phase 5 — Polish
- [x] Responsive breakpoints (mobile navigation menus, stack layouts)
- [x] RTL verification (RTL layout switching automatically via lang="ar")
- [x] Animation polish (Ken-Burns hero zoom, content rise up)
- [x] Map CSS variables in globals.css for dark (default) and organic light themes
- [x] Inject synchronous theme check script in root layout.tsx to prevent theme flashing
- [x] Add theme switcher button (Sun/Moon SVG) and localStorage integration in Nav.tsx
- [x] Update Nav logo styles to dynamically toggle blending and filters based on active theme
- [x] Verify build and check for compile errors

## Phase 6 — Admin Panel (Companion Storefront System)
- [x] Create lib/adminStore.ts (Zustand store for database state simulation)
- [x] Integrate storefront checkouts with admin orders list
- [x] Integrate storefront contact forms with admin messages inbox
- [x] Create admin layout auth guard (gates panel and renders split-panel login screen)
- [x] Build admin dashboard page (dynamic KPI summaries, best sellers list)
- [x] Build admin products list (search query handlers, category pills, status badges)
- [x] Build product editor (bilingual fields, repeatable swatches, size lists)
- [x] Build orders list (orders status filter pills)
- [x] Build order details view (dynamic line items list, status update stepper tracking)
- [x] Build Our Work panel (portfolio projects list, CRUD inline forms overlay)
- [x] Build messages inbox (split pane list and reader view)
