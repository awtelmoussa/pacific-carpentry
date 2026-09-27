# 🪵 Pacific Carpentry

[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Three.js](https://img.shields.io/badge/Three.js-0.184-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

> **Pacific Carpentry** is a modern, high-performance web platform for an architectural woodwork and bespoke heirloom-grade furniture workshop based in Dubai, UAE. The application combines luxury craftsmanship aesthetics with cutting-edge web technologies, including interactive 3D/AR model viewing, bespoke commission tracking, full bilingual (EN/AR) localization, and an end-to-end admin management suite.

---

## ✨ Key Features

### 1. 🛋️ Interactive 3D Showroom & AR Configurator
- **3D Real-Time Exploration**: Interactive 3D model viewing powered by Three.js, `@react-three/fiber`, and `@react-three/drei`.
- **Augmented Reality (AR)**: Web-based AR support via Google's `<model-viewer>` allowing clients to place customized furniture directly into their physical space on iOS (`QuickLook`) and Android (`Scene Viewer`).
- **Interactive Material Switcher**: Preview different timber finishes, stains, and dimensions in real time.

### 2. 🪵 Bespoke Commission Builder & Status Tracker
- **Guided Commission Workflow**: Multi-step bespoke furniture request builder with timber selection, custom dimensions input, reference image uploads, and client specifications.
- **Unique Tracking Code Generation**: Generates structured reference IDs (e.g. `REQ-10492`).
- **Live Status Lookup**: Dedicated client portal for real-time tracking across production phases (`PENDING` ➔ `UNDER_REVIEW` ➔ `QUOTED` ➔ `IN_PRODUCTION` ➔ `COMPLETED`).

### 3. 🌿 Timber & Material Specification Hub
- Comprehensive educational guide for hardwoods (American Walnut, Burmese Teak, White Oak, Hard Maple, Black Cherry).
- Displays Janka hardness ratings, grain textures, sustainability credentials, and finish compatibility.

### 4. 📸 Interactive Portfolio & Work Showcase
- Masonry-based portfolio with category filtering (Residential, Hospitality, Commercial).
- **Interactive Before/After Sliders**: Interactive image comparisons demonstrating the raw timber transformation into finished luxury installations.

### 5. 🛒 E-Commerce Showroom & Payment Integration
- Curated collection catalog with dynamic size-based pricing and swatch selections.
- Cart drawer powered by client-side persistence.
- Seamless payment integration supporting **Ziina Payment Gateway** (AED) with automatic order reconciliation.

### 6. 🛠️ Bespoke UI/UX & Sensory Interactions
- **Desktop Hammer Cursor**: Custom vector-drawn carpentry hammer cursor with physics-based lerp tracking, contextual hover states (tilted strike preparation on links/buttons), and real-time impact sparks on click.
- **Mobile Touch Sparks & Haptics**: 360° radial particle bursts upon finger taps, alongside subtle haptic vibration feedback (`navigator.vibrate`) on supported mobile devices.
- **Adaptive Theme System**: Integrated Dark & Light luxury theme modes with smooth transitions.

### 7. 🌐 Bilingual & RTL-First Architecture
- Complete English (`en`) and Arabic (`ar`) localization powered by `next-intl`.
- Dynamic text direction adaptation (`dir="rtl"` / `dir="ltr"`) with optimized typography:
  - **Latin**: *Cormorant Garamond* (Serif Display) & *Manrope* (Clean Sans)
  - **Arabic**: *Amiri* (Traditional Calligraphy) & *Tajawal* (Modern Geometric Sans)

### 8. 🔐 Executive Admin Dashboard
- Protected administration portal with encrypted credential sessions (`bcryptjs`).
- Manage bespoke commission requests, update statuses, assign custom quotes, and send payment links.
- Manage products, sizes, color swatches, and showroom 3D items.
- Centralized inbox for customer inquiries and contact requests.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Turbopack) |
| **UI & Styling** | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/) |
| **3D & AR** | [Three.js](https://threejs.org/), `@react-three/fiber`, `@react-three/drei`, `@google/model-viewer` |
| **Database & ORM** | [Prisma ORM 7](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/) (Supabase) |
| **Internationalization** | [next-intl](https://next-intl.dev/) (Full EN/AR locale routing) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) |
| **Storage & Hosting** | [Supabase Storage](https://supabase.com/), [Vercel](https://vercel.com/) |
| **Email & Security** | [Nodemailer](https://nodemailer.com/), [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm** / **yarn** / **pnpm**
- **PostgreSQL Database** (e.g. Supabase, Neon, or local PostgreSQL instance)

### 1. Clone the Repository
```bash
git clone https://github.com/awtelmoussa/pacific-carpentry.git
cd pacific-carpentry
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory by copying the example template:
```bash
cp .env.example .env
```

Fill in your configuration credentials:
```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/dbname"

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Business & Payment Info
MANAGER_EMAIL="info@pacificcarpentry.ae"
NEXT_PUBLIC_MANAGER_WHATSAPP="+971500000000"
NEXT_PUBLIC_ZIINA_USERNAME="pacificcarpentry"
```

### 4. Setup Database & Seed Data
Generate the Prisma client and push the schema to your database:
```bash
npx prisma generate
npx prisma db push
```

*(Optional)* Seed sample products, timbers, and projects:
```bash
npx prisma db seed
```

### 5. Launch the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Project Structure

```
Pacific-carpentry/
├── app/
│   ├── [locale]/               # Localized route segments (EN/AR)
│   │   ├── about/              # Brand story & craftsmanship values
│   │   ├── cart/               # Shopping cart & checkout review
│   │   ├── contact/            # Bespoke request & general inquiries
│   │   ├── materials/          # Hardwood species & timber explorer
│   │   ├── products/           # Collection catalog & product detail
│   │   ├── requests/           # Commission status lookup portal
│   │   ├── visualize/          # 3D room configurator & AR viewer
│   │   ├── work/               # Portfolio showcase with Before/After
│   │   ├── layout.tsx          # Localized layout & dynamic metadata
│   │   └── page.tsx            # Main landing page
│   ├── actions/                # Server Actions (Storefront & Admin)
│   ├── admin/                  # Protected management dashboard
│   ├── globals.css             # Tailwind CSS v4 & theme definitions
│   ├── icon.jpg                # Brand tab icon (Favicon)
│   └── layout.tsx              # Root HTML layout with custom cursor
├── components/
│   ├── admin/                  # Admin UI components (Sidebar, Topbar, Modals)
│   ├── BeforeAfterSlider.tsx   # Interactive before/after image comparison
│   ├── BespokeConfigurator.tsx # Step-by-step custom commission builder
│   ├── Configurator3D.tsx      # Three.js 3D model interactive viewport
│   ├── CustomCursor.tsx        # Dynamic hammer cursor & mobile haptics
│   ├── MaterialsClient.tsx     # Hardwood specification visualizer
│   ├── Nav.tsx                 # Responsive navigation bar with locale switch
│   └── ...
├── i18n/                       # next-intl configuration & routing setup
├── messages/                   # Translation message dictionaries (en.json, ar.json)
├── prisma/
│   ├── schema.prisma           # Relational schema (Products, Requests, Orders)
│   └── seed.ts                 # Database seed script
├── public/                     # Static media, hero video, models, slideshow
├── next.config.ts              # Next.js build & image optimizations
└── package.json                # Project dependencies & scripts
```

---

## 🚢 Production Deployment

The project is optimized for deployment on [Vercel](https://vercel.com):

1. Import the repository `https://github.com/awtelmoussa/pacific-carpentry` into Vercel.
2. In **Environment Variables**, provide the matching keys from `.env.example`.
3. The build command defaults to:
   ```bash
   npm run build
   ```
4. Deploy! Next.js will automatically configure edge caching and optimize assets.

---

## 👨‍💻 Author

**Awtel Moussa**
- GitHub: [@awtelmoussa](https://github.com/awtelmoussa)
- Email: [awtel-moussa@outlook.com](mailto:awtel-moussa@outlook.com)

---

## 📄 License

This project is proprietary and confidential. All rights reserved © **Pacific Carpentry**.
