// Pacific Carpentry — Data layer
// Ported from shared.js design reference

export type Category = {
  id: string;
  en: string;
  ar: string;
};

export type ProductColor = {
  en: string;
  ar: string;
  hex: string;
};

export type ProductSize = {
  en: string;
  ar: string;
  price: number;
};

export type Product = {
  id: string;
  cat: string;
  name: { en: string; ar: string };
  tagline: { en: string; ar: string };
  desc: { en: string; ar: string };
  colors: ProductColor[];
  sizes: ProductSize[];
  status?: string;
  images?: string[];
};

export type Project = {
  id: string;
  en: string;
  ar: string;
  cat: { en: string; ar: string };
  year: string;
  titleEn?: string;
  titleAr?: string;
  catEn?: string;
  catAr?: string;
  slug?: string;
  images?: string[];
};

export const CATEGORIES: Category[] = [
  { id: "dining-tables", en: "Dining Tables", ar: "طاولات الطعام" },
  { id: "chairs", en: "Chairs & Benches", ar: "الكراسي والمقاعد" },
  { id: "cabinets", en: "TV Cabinets & Sideboards", ar: "خزائن التلفزيون والجانبية" },
  { id: "doors", en: "Doors", ar: "الأبواب" },
  { id: "shelving", en: "Custom Shelving", ar: "الأرفف المخصصة" },
];

export const PRODUCTS: Product[] = [
  {
    id: "oakline-dining-table",
    cat: "dining-tables",
    name: { en: "Oakline Dining Table", ar: "طاولة طعام أوكلاين" },
    tagline: { en: "Solid oak, hand-finished", ar: "بلوط صلب، تشطيب يدوي" },
    desc: {
      en: "A statement table built from kiln-dried solid oak with a breadboard edge and hand-rubbed oil finish. Seats your whole family — and then some.",
      ar: "طاولة مميزة مصنوعة من خشب البلوط الصلب المجفف، بحواف مشغولة وتشطيب زيتي يدوي. تتسع لعائلتك بالكامل وأكثر.",
    },
    colors: [
      { en: "Natural Oak", ar: "بلوط طبيعي", hex: "#C99A63" },
      { en: "Walnut", ar: "جوز", hex: "#6B4226" },
      { en: "Espresso", ar: "إسبريسو", hex: "#3A2A1E" },
    ],
    sizes: [
      { en: "4-Seat · 180cm", ar: "٤ مقاعد · ١٨٠سم", price: 4200 },
      { en: "6-Seat · 220cm", ar: "٦ مقاعد · ٢٢٠سم", price: 5400 },
      { en: "8-Seat · 260cm", ar: "٨ مقاعد · ٢٦٠سم", price: 6900 },
    ],
  },
  {
    id: "lattice-dining-chair",
    cat: "chairs",
    name: { en: "Lattice Dining Chair", ar: "كرسي طعام لاتيس" },
    tagline: { en: "Sculpted comfort", ar: "راحة منحوتة" },
    desc: {
      en: "A steam-bent backrest and contoured seat make this chair as comfortable as it is elegant. Sold individually so you can build your set.",
      ar: "ظهر منحني بالبخار ومقعد مُحدّب يجعلان هذا الكرسي مريحاً وأنيقاً. يُباع منفرداً لتكوين طقمك الخاص.",
    },
    colors: [
      { en: "Natural", ar: "طبيعي", hex: "#CCA573" },
      { en: "Walnut", ar: "جوز", hex: "#6B4226" },
      { en: "Charcoal", ar: "فحمي", hex: "#2C2824" },
    ],
    sizes: [
      { en: "Side Chair", ar: "كرسي جانبي", price: 680 },
      { en: "Armchair", ar: "كرسي بمسند", price: 920 },
    ],
  },
  {
    id: "monterey-sideboard",
    cat: "cabinets",
    name: { en: "Monterey Sideboard", ar: "خزانة مونتيري الجانبية" },
    tagline: { en: "Storage, refined", ar: "تخزين بأناقة" },
    desc: {
      en: "Soft-close doors, dovetailed drawers and a continuous grain-matched front. A cabinet built to be handed down.",
      ar: "أبواب بإغلاق ناعم وأدراج مُجمّعة بإتقان وواجهة متناسقة العروق. خزانة مصنوعة لتُورّث للأجيال.",
    },
    colors: [
      { en: "Natural Oak", ar: "بلوط طبيعي", hex: "#C99A63" },
      { en: "Walnut", ar: "جوز", hex: "#6B4226" },
    ],
    sizes: [
      { en: "120cm", ar: "١٢٠سم", price: 3200 },
      { en: "160cm", ar: "١٦٠سم", price: 3900 },
      { en: "200cm", ar: "٢٠٠سم", price: 4700 },
    ],
  },
  {
    id: "harbor-pivot-door",
    cat: "doors",
    name: { en: "Harbor Pivot Door", ar: "باب هاربور المحوري" },
    tagline: { en: "An entrance with weight", ar: "مدخل بحضور" },
    desc: {
      en: "An oversized pivot door with a concealed hinge system and a tactile vertical grain. The first impression of any space.",
      ar: "باب محوري كبير بنظام مفصلات مخفي وعروق رأسية محسوسة. الانطباع الأول لأي مساحة.",
    },
    colors: [
      { en: "Natural Oak", ar: "بلوط طبيعي", hex: "#C99A63" },
      { en: "Walnut", ar: "جوز", hex: "#6B4226" },
      { en: "Charcoal", ar: "فحمي", hex: "#2C2824" },
    ],
    sizes: [
      { en: "Single · 100cm", ar: "مفرد · ١٠٠سم", price: 2800 },
      { en: "Double · 180cm", ar: "مزدوج · ١٨٠سم", price: 5200 },
    ],
  },
  {
    id: "driftwood-shelving",
    cat: "shelving",
    name: { en: "Driftwood Wall Shelving", ar: "أرفف دريفتوود الجدارية" },
    tagline: { en: "Made to your wall", ar: "مصممة لجدارك" },
    desc: {
      en: "Floating shelves with hidden steel brackets, cut to fit your wall to the millimetre. Configure tiers and finish.",
      ar: "أرفف طافية بحوامل فولاذية مخفية، مقصوصة لتناسب جدارك بدقة المليمتر. اختر عدد الطبقات والتشطيب.",
    },
    colors: [
      { en: "Natural Oak", ar: "بلوط طبيعي", hex: "#C99A63" },
      { en: "Walnut", ar: "جوز", hex: "#6B4226" },
    ],
    sizes: [
      { en: "3-Tier", ar: "٣ طبقات", price: 1400 },
      { en: "5-Tier", ar: "٥ طبقات", price: 2100 },
    ],
  },
  {
    id: "cove-coffee-table",
    cat: "dining-tables",
    name: { en: "Cove Coffee Table", ar: "طاولة قهوة كوف" },
    tagline: { en: "A quiet centrepiece", ar: "قطعة محورية هادئة" },
    desc: {
      en: "Low, soft-edged and grounded. A coffee table with a single live edge and a hand-rubbed matte finish.",
      ar: "منخفضة بحواف ناعمة وثابتة. طاولة قهوة بحافة طبيعية واحدة وتشطيب مطفأ يدوي.",
    },
    colors: [
      { en: "Natural Oak", ar: "بلوط طبيعي", hex: "#C99A63" },
      { en: "Walnut", ar: "جوز", hex: "#6B4226" },
    ],
    sizes: [
      { en: "Round · 90cm", ar: "دائرية · ٩٠سم", price: 1600 },
      { en: "Rectangular · 120cm", ar: "مستطيلة · ١٢٠سم", price: 1900 },
    ],
  },
  {
    id: "marin-bookcase",
    cat: "cabinets",
    name: { en: "Marin Bookcase", ar: "مكتبة مارين" },
    tagline: { en: "Floor to ceiling", ar: "من الأرض للسقف" },
    desc: {
      en: "An adjustable solid-wood bookcase with a slim profile and a warm matte finish. Anchors a study or living room.",
      ar: "مكتبة من الخشب الصلب قابلة للتعديل بهيكل نحيف وتشطيب دافئ مطفأ. ترسّخ مكتبك أو غرفة معيشتك.",
    },
    colors: [
      { en: "Natural Oak", ar: "بلوط طبيعي", hex: "#C99A63" },
      { en: "Walnut", ar: "جوز", hex: "#6B4226" },
      { en: "Espresso", ar: "إسبريسو", hex: "#3A2A1E" },
    ],
    sizes: [
      { en: "Standard · 180cm", ar: "قياسي · ١٨٠سم", price: 3400 },
      { en: "Tall · 240cm", ar: "طويل · ٢٤٠سم", price: 4300 },
    ],
  },
  {
    id: "bayview-bench",
    cat: "chairs",
    name: { en: "Bayview Bench", ar: "مقعد بايفيو" },
    tagline: { en: "Seating, simplified", ar: "جلوس مبسّط" },
    desc: {
      en: "A single-slab bench with through-tenon legs. Perfect at the foot of a bed or alongside the dining table.",
      ar: "مقعد من لوح واحد بأرجل مُعشّقة. مثالي عند طرف السرير أو بجانب طاولة الطعام.",
    },
    colors: [
      { en: "Natural Oak", ar: "بلوط طبيعي", hex: "#C99A63" },
      { en: "Walnut", ar: "جوز", hex: "#6B4226" },
    ],
    sizes: [
      { en: "120cm", ar: "١٢٠سم", price: 1200 },
      { en: "160cm", ar: "١٦٠سم", price: 1500 },
    ],
  },
];

export const PROJECTS: Project[] = [
  { id: "villa-kitchen", en: "Al Barari Villa Kitchen", ar: "مطبخ فيلا البراري", cat: { en: "Residential", ar: "سكني" }, year: "2024", images: ["/ourwork/IMG-20260624-WA0026.jpg"] },
  { id: "boutique-hotel", en: "Boutique Hotel Lobby", ar: "ردهة فندق بوتيك", cat: { en: "Hospitality", ar: "ضيافة" }, year: "2024", images: ["/ourwork/IMG-20260624-WA0027.jpg"] },
  { id: "office-fitout", en: "DIFC Office Fit-out", ar: "تجهيز مكتب مركز دبي المالي", cat: { en: "Commercial", ar: "تجاري" }, year: "2023", images: ["/ourwork/IMG-20260624-WA0028.jpg"] },
  { id: "library-walls", en: "Private Library Walls", ar: "جدران مكتبة خاصة", cat: { en: "Residential", ar: "سكني" }, year: "2023", images: ["/ourwork/IMG-20260624-WA0029.jpg"] },
  { id: "restaurant-bar", en: "Restaurant Bar & Millwork", ar: "بار ونجارة مطعم", cat: { en: "Hospitality", ar: "ضيافة" }, year: "2023", images: ["/ourwork/IMG-20260624-WA0030.jpg"] },
  { id: "staircase", en: "Floating Oak Staircase", ar: "درج بلوط طافٍ", cat: { en: "Residential", ar: "سكني" }, year: "2022", images: ["/ourwork/IMG-20260624-WA0031.jpg"] },
];

export function productBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === slug);
}

export function minPrice(p: Product): number {
  return Math.min(...p.sizes.map((s) => s.price));
}

export function catName(id: string, lang: string): string {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c[lang as keyof Pick<Category, 'en' | 'ar'>] : id;
}
