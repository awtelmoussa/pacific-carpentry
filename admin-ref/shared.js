// Pacific Carpentry — shared data, translations, and helpers.
// Plain ES module imported by every page/component.

export const CURRENCY = { en: "AED", ar: "د.إ" };

export function fmt(price, lang) {
  const n = Number(price).toLocaleString(lang === "ar" ? "ar-AE" : "en-US");
  return lang === "ar" ? `${n} ${CURRENCY.ar}` : `${CURRENCY.en} ${n}`;
}

export function fonts(lang) {
  return lang === "ar"
    ? { disp: "'Amiri', serif", body: "'Tajawal', sans-serif" }
    : { disp: "'Cormorant Garamond', serif", body: "'Manrope', sans-serif" };
}

// Google Fonts link set used in every <helmet>
export const FONT_LINKS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&family=Amiri:wght@400;700&family=Tajawal:wght@300;400;500;700&display=swap";

// ---- Theme tokens (values only; styling stays inline in templates) ----
export const C = {
  bg: "#15110D",
  bg2: "#1C1712",
  surface: "#221C15",
  surface2: "#2A2219",
  line: "rgba(237,230,216,0.12)",
  lineSoft: "rgba(237,230,216,0.07)",
  cream: "#EDE6D8",
  muted: "#A8997F",
  faint: "#7A6E5C",
  wood: "#C2965B",
  woodDeep: "#9A6E3A",
  woodSoft: "#D8B583",
};

export const CATEGORIES = [
  { id: "dining-tables", en: "Dining Tables", ar: "طاولات الطعام" },
  { id: "chairs", en: "Chairs & Benches", ar: "الكراسي والمقاعد" },
  { id: "cabinets", en: "Cabinets", ar: "الخزائن" },
  { id: "doors", en: "Doors", ar: "الأبواب" },
  { id: "shelving", en: "Custom Shelving", ar: "الأرفف المخصصة" },
];

export function catName(id, lang) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c[lang] : id;
}

export const PRODUCTS = [
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

export function productById(id) {
  return PRODUCTS.find((p) => p.id === id);
}
export function minPrice(p) {
  return Math.min(...p.sizes.map((s) => s.price));
}

// ---- Our Work projects ----
export const PROJECTS = [
  { id: "villa-kitchen", en: "Al Barari Villa Kitchen", ar: "مطبخ فيلا البراري", cat: { en: "Residential", ar: "سكني" }, year: "2024" },
  { id: "boutique-hotel", en: "Boutique Hotel Lobby", ar: "ردهة فندق بوتيك", cat: { en: "Hospitality", ar: "ضيافة" }, year: "2024" },
  { id: "office-fitout", en: "DIFC Office Fit-out", ar: "تجهيز مكتب مركز دبي المالي", cat: { en: "Commercial", ar: "تجاري" }, year: "2023" },
  { id: "library-walls", en: "Private Library Walls", ar: "جدران مكتبة خاصة", cat: { en: "Residential", ar: "سكني" }, year: "2023" },
  { id: "restaurant-bar", en: "Restaurant Bar & Millwork", ar: "بار ونجارة مطعم", cat: { en: "Hospitality", ar: "ضيافة" }, year: "2023" },
  { id: "staircase", en: "Floating Oak Staircase", ar: "درج بلوط طافٍ", cat: { en: "Residential", ar: "سكني" }, year: "2022" },
];

// ---- UI translations ----
export const T = {
  en: {
    dir: "ltr",
    nav: { home: "Home", products: "Products", work: "Our Work", about: "About", contact: "Contact" },
    cta: { shop: "Shop the collection", explore: "Explore", viewAll: "View all", addToCart: "Add to cart", added: "Added", getQuote: "Request a quote", learnMore: "Learn more", sendMessage: "Send message", checkout: "Checkout", continue: "Continue shopping", placeOrder: "Place order" },
    home: {
      kicker: "Bespoke carpentry · Dubai",
      heroTitle: "Furniture worth\npassing down",
      heroSub: "Pacific Carpentry designs and builds heirloom-grade furniture and architectural woodwork from solid, sustainably sourced timber.",
      videoNote: "Drop your workshop video here",
      catTitle: "Browse by category",
      catSub: "Every piece is made to order in our Dubai workshop.",
      featTitle: "Featured pieces",
      featSub: "A small selection from the current collection.",
      workTitle: "Recent work",
      workSub: "From single statement pieces to full architectural fit-outs.",
      aboutTitle: "Two decades at the bench",
      aboutBody: "What began as a one-man workshop is now a small team of makers obsessed with joinery, grain and the feel of a finished edge. We build slowly, and we build to last.",
      statYears: "Years", statPieces: "Pieces made", statClients: "Happy clients",
      ctaTitle: "Have something in mind?",
      ctaSub: "Tell us about your space and we'll bring it to life in wood.",
    },
    products: { title: "The Collection", sub: "Made to order. Choose your finish and size on each piece.", all: "All", from: "From", sort: "Sort", sortFeatured: "Featured", sortLow: "Price: low to high", sortHigh: "Price: high to low", empty: "No pieces in this category yet." },
    detail: { color: "Finish", size: "Size", qty: "Quantity", desc: "Description", details: "Details & care", made: "Made to order in 4–6 weeks", ships: "Ships across the UAE", crafted: "Solid wood, hand-finished", related: "You may also like", back: "Back to products" },
    work: { title: "Our Work", sub: "Selected projects across homes, hotels and workplaces in the UAE.", all: "All", filterRes: "Residential", filterHos: "Hospitality", filterCom: "Commercial" },
    about: { kicker: "About us", title: "We make things\nthat outlast trends", lead: "Pacific Carpentry is a Dubai-based workshop crafting furniture and architectural woodwork for homes, designers and businesses across the region.", b1Title: "Our craft", b1: "Every joint is considered. We favour traditional joinery, solid timber and finishes that age gracefully — no veneers, no shortcuts.", b2Title: "Our materials", b2: "We source sustainably certified hardwoods and finish them with low-VOC, food-safe oils and waxes.", b3Title: "Our promise", b3: "Made to order, built to last, and backed for a decade. If it carries our mark, it's made to be handed down.", valuesTitle: "How we work" },
    contact: { kicker: "Contact", title: "Let's build\nsomething", sub: "Tell us about your project or ask about a piece. We reply within one business day.", name: "Name", email: "Email", phone: "Phone", subject: "Subject", message: "Message", visit: "Visit the workshop", call: "Call us", write: "Write to us", hours: "Sat–Thu, 9am–6pm", sent: "Thank you — we'll be in touch shortly." },
    cart: { title: "Your cart", empty: "Your cart is empty.", emptySub: "Pieces you add will appear here.", item: "Item", price: "Price", qty: "Qty", total: "Total", subtotal: "Subtotal", shipping: "Shipping", calc: "Calculated at checkout", remove: "Remove", summary: "Order summary", secure: "Secure checkout", contactInfo: "Contact & delivery", payment: "Payment", card: "Card number", expiry: "MM / YY", cvc: "CVC", placed: "Order placed", placedSub: "Thank you for your order. A confirmation has been sent to your email.", orderNo: "Order number" },
    footer: { tagline: "Heirloom furniture & architectural woodwork, made in Dubai.", shop: "Shop", company: "Company", connect: "Connect", newsletter: "Join our list", newsletterSub: "New pieces and workshop notes, occasionally.", subscribe: "Subscribe", rights: "All rights reserved.", made: "Made to order in Dubai, UAE." },
  },
  ar: {
    dir: "rtl",
    nav: { home: "الرئيسية", products: "المنتجات", work: "أعمالنا", about: "من نحن", contact: "تواصل معنا" },
    cta: { shop: "تسوّق المجموعة", explore: "استكشف", viewAll: "عرض الكل", addToCart: "أضف إلى السلة", added: "تمت الإضافة", getQuote: "اطلب عرض سعر", learnMore: "اعرف المزيد", sendMessage: "إرسال الرسالة", checkout: "إتمام الشراء", continue: "متابعة التسوق", placeOrder: "تأكيد الطلب" },
    home: {
      kicker: "نجارة مخصصة · دبي",
      heroTitle: "أثاثٌ يستحق\nأن يُورَّث",
      heroSub: "تصمم باسيفيك كاربنتري وتصنع أثاثاً وأعمالاً خشبية معمارية بمستوى التحف، من خشب صلب من مصادر مستدامة.",
      videoNote: "ضع فيديو ورشتك هنا",
      catTitle: "تصفّح حسب الفئة",
      catSub: "كل قطعة تُصنع حسب الطلب في ورشتنا بدبي.",
      featTitle: "قطع مختارة",
      featSub: "مجموعة صغيرة من تشكيلتنا الحالية.",
      workTitle: "أعمال حديثة",
      workSub: "من القطع المميزة المفردة إلى التجهيزات المعمارية الكاملة.",
      aboutTitle: "عقدان من العمل",
      aboutBody: "ما بدأ كورشة لرجل واحد أصبح اليوم فريقاً صغيراً من الحرفيين المهووسين بالتعشيق وعروق الخشب وملمس الحافة المصقولة. نصنع بتأنٍّ، ونصنع ليدوم.",
      statYears: "سنة", statPieces: "قطعة مصنوعة", statClients: "عميل سعيد",
      ctaTitle: "هل لديك فكرة في بالك؟",
      ctaSub: "أخبرنا عن مساحتك وسنُجسّدها بالخشب.",
    },
    products: { title: "المجموعة", sub: "تُصنع حسب الطلب. اختر التشطيب والمقاس لكل قطعة.", all: "الكل", from: "ابتداءً من", sort: "ترتيب", sortFeatured: "مميّز", sortLow: "السعر: من الأقل للأعلى", sortHigh: "السعر: من الأعلى للأقل", empty: "لا توجد قطع في هذه الفئة بعد." },
    detail: { color: "التشطيب", size: "المقاس", qty: "الكمية", desc: "الوصف", details: "التفاصيل والعناية", made: "تُصنع حسب الطلب خلال ٤–٦ أسابيع", ships: "توصيل لكل الإمارات", crafted: "خشب صلب بتشطيب يدوي", related: "قد يعجبك أيضاً", back: "العودة للمنتجات" },
    work: { title: "أعمالنا", sub: "مشاريع مختارة في المنازل والفنادق وأماكن العمل في الإمارات.", all: "الكل", filterRes: "سكني", filterHos: "ضيافة", filterCom: "تجاري" },
    about: { kicker: "من نحن", title: "نصنع أشياءَ\nتتجاوز الموضة", lead: "باسيفيك كاربنتري ورشة مقرها دبي تصنع الأثاث والأعمال الخشبية المعمارية للمنازل والمصممين والشركات في المنطقة.", b1Title: "حرفتنا", b1: "كل وصلة مدروسة. نفضّل التعشيق التقليدي والخشب الصلب والتشطيبات التي تتقادم بأناقة — بلا قشرة، بلا اختصارات.", b2Title: "موادنا", b2: "نستورد أخشاباً صلبة معتمدة الاستدامة ونشطّبها بزيوت وشموع منخفضة الانبعاثات وآمنة غذائياً.", b3Title: "وعدنا", b3: "تُصنع حسب الطلب، تُبنى لتدوم، ومضمونة لعقد كامل. ما يحمل علامتنا، صُنع ليُورَّث.", valuesTitle: "كيف نعمل" },
    contact: { kicker: "تواصل", title: "لنصنع\nشيئاً معاً", sub: "أخبرنا عن مشروعك أو اسأل عن قطعة. نرد خلال يوم عمل واحد.", name: "الاسم", email: "البريد الإلكتروني", phone: "الهاتف", subject: "الموضوع", message: "الرسالة", visit: "زر الورشة", call: "اتصل بنا", write: "راسلنا", hours: "السبت–الخميس، ٩ص–٦م", sent: "شكراً لك — سنتواصل معك قريباً." },
    cart: { title: "سلتك", empty: "سلتك فارغة.", emptySub: "ستظهر القطع التي تضيفها هنا.", item: "القطعة", price: "السعر", qty: "الكمية", total: "الإجمالي", subtotal: "المجموع الفرعي", shipping: "الشحن", calc: "يُحسب عند الدفع", remove: "إزالة", summary: "ملخص الطلب", secure: "دفع آمن", contactInfo: "التواصل والتوصيل", payment: "الدفع", card: "رقم البطاقة", expiry: "شهر / سنة", cvc: "الرمز", placed: "تم تأكيد الطلب", placedSub: "شكراً لطلبك. تم إرسال تأكيد إلى بريدك الإلكتروني.", orderNo: "رقم الطلب" },
    footer: { tagline: "أثاث تراثي وأعمال خشبية معمارية، صُنع في دبي.", shop: "تسوّق", company: "الشركة", connect: "تواصل", newsletter: "انضم لقائمتنا", newsletterSub: "قطع جديدة وملاحظات من الورشة، من حين لآخر.", subscribe: "اشترك", rights: "جميع الحقوق محفوظة.", made: "تُصنع حسب الطلب في دبي، الإمارات." },
  },
};

// ---- Cart helpers (localStorage) ----
const CART_KEY = "pc_cart_v1";
export function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; }
}
export function setCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("pc-cart"));
}
export function cartCount() {
  return getCart().reduce((n, i) => n + i.qty, 0);
}
export function addToCart(line) {
  const items = getCart();
  const key = (l) => `${l.id}|${l.color}|${l.size}`;
  const found = items.find((i) => key(i) === key(line));
  if (found) found.qty += line.qty;
  else items.push(line);
  setCart(items);
}
export function getLang() {
  return localStorage.getItem("pc_lang") || "en";
}
export function setLang(l) {
  localStorage.setItem("pc_lang", l);
}
