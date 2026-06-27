'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface TimberItem {
  id: string;
  title: string;
  sub: string;
  desc: string;
  properties: string;
  uses: string;
  janka: number;
  jankaLabel: string;
  jankaPct: number;
  image: string;
}

interface MaterialsClientProps {
  locale: string;
  timbers: TimberItem[];
  translations: {
    janka: string;
    durability: string;
    uses: string;
    care: string;
    getQuote: string;
    back: string;
  };
}

export default function MaterialsClient({ locale, timbers, translations }: MaterialsClientProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  const isAr = locale === 'ar';
  const arrow = isAr ? '←' : '→';

  // High quality Unsplash wood textures for circular swatches
  const swatches: Record<string, string> = {
    'Walnut': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=120&h=120&q=80',
    'Premium Teak': 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=120&h=120&q=80',
    'Natural Oak': 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=120&h=120&q=80',
    'Hard Maple': 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?auto=format&fit=crop&w=120&h=120&q=80',
    'American Cherry': 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=120&h=120&q=80',
  };

  // Comparative matrix data
  const comparisonMatrix = [
    {
      nameEn: 'American Walnut',
      nameAr: 'الجوز الأمريكي',
      hardness: '1,010 lbf',
      sunResEn: 'Medium',
      sunResAr: 'متوسطة',
      priceEn: 'Premium Luxury',
      priceAr: 'فخامة عالية',
      outdoorEn: 'No (Indoor only)',
      outdoorAr: 'لا (داخلي فقط)',
      shiftEn: 'Mellows & lightens slightly',
      shiftAr: 'يفتح لوناً قليلاً مع الوقت',
    },
    {
      nameEn: 'Burmese Teak',
      nameAr: 'التيك البورمي',
      hardness: '1,155 lbf',
      sunResEn: 'Excellent (High Oil)',
      sunResAr: 'ممتازة (محتوى زيتي عالٍ)',
      priceEn: 'High Premium',
      priceAr: 'ممتاز مرتفع',
      outdoorEn: 'Yes (Highly resistant)',
      outdoorAr: 'نعم (مقاومة عالية جداً)',
      shiftEn: 'Ages to warm golden-brown',
      shiftAr: 'يتقادم إلى بني ذهبي دافئ',
    },
    {
      nameEn: 'Natural Solid Oak',
      nameAr: 'البلوط الطبيعي الصلب',
      hardness: '1,360 lbf',
      sunResEn: 'High',
      sunResAr: 'عالية',
      priceEn: 'Premium Standard',
      priceAr: 'معياري فاخر',
      outdoorEn: 'Semi (Sheltered only)',
      outdoorAr: 'جزئي (مظلل فقط)',
      shiftEn: 'Develops amber/straw tone',
      shiftAr: 'يكتسب لون قش عنبري دافئ',
    },
    {
      nameEn: 'Hard Maple',
      nameAr: 'القيقب الصلب',
      hardness: '1,450 lbf',
      sunResEn: 'High',
      sunResAr: 'عالية',
      priceEn: 'Standard Premium',
      priceAr: 'معياري ممتاز',
      outdoorEn: 'No (Indoor only)',
      outdoorAr: 'لا (داخلي فقط)',
      shiftEn: 'Takes a golden honey cast',
      shiftAr: 'يتحول إلى لون عسلي ذهبي',
    },
    {
      nameEn: 'American Cherry',
      nameAr: 'الكرز الأمريكي',
      hardness: '950 lbf',
      sunResEn: 'Low (Shade needed)',
      sunResAr: 'منخفضة (يحتاج ظل)',
      priceEn: 'Premium',
      priceAr: 'ممتاز',
      outdoorEn: 'No (Indoor only)',
      outdoorAr: 'لا (داخلي فقط)',
      shiftEn: 'Darkens rapidly in sun',
      shiftAr: 'يغمق لونه بسرعة مع الضوء',
    },
  ];

  // Tabbed Care Guidelines details
  const careGuides = [
    {
      titleEn: 'Daily Care',
      titleAr: 'العناية اليومية',
      descEn: 'Clean with a dry or slightly damp lint-free cloth. Wipe spills immediately. Avoid abrasive scrubbers, silicones, and harsh household chemicals, which can wear down the oil finish.',
      descAr: 'نظف بقطعة قماش ناعمة جافة أو مبللة قليلاً وخالية من الوبر. امسح السوائل المنسكبة فوراً. تجنب استخدام الإسفنج الكاشط، السيلكون، والمواد الكيميائية المنزلية القاسية التي قد تؤثر على الطبقة الزيتية.',
    },
    {
      titleEn: 'Dubai Climate',
      titleAr: 'مناخ دبي والرطوبة',
      descEn: 'All our lumber is kiln-dried to 8-10% humidity. However, solid wood behaves like a natural sponge. Keep relative indoor humidity between 35% and 55% to prevent contraction and wood movement.',
      descAr: 'جميع أخشابنا مجففة في أفران لتصل رطوبتها إلى ٨-١٠٪. ومع ذلك، يتصرف الخشب كإسفنجة طبيعية. حافظ على رطوبة الغرفة الداخلية بين ٣٥٪ و ٥٥٪ لمنع تمدد أو تقلص الخشب.',
    },
    {
      titleEn: 'Heat & UV',
      titleAr: 'الحماية من الحرارة والضوء',
      descEn: 'Avoid placing hot pots or mugs directly on the timber—always use felt or cork trivets. Keep wood furniture away from direct Gulf sun exposure to avoid color fading or splitting.',
      descAr: 'تجنب وضع الأواني الساخنة أو الأكواب مباشرة على الخشب — استخدم دائماً عوازل من اللباد أو الفلين. احرص على إبعاد قطع الأثاث عن أشعة الشمس المباشرة لتجنب بهتان اللون أو التشقق.',
    },
    {
      titleEn: 'Periodic Re-Oiling',
      titleAr: 'التزييت والصيانة الدورية',
      descEn: 'We finish our pieces with premium low-VOC hardwax oils. Re-apply a thin coat of natural furniture oil or wax once every 12 to 18 months to feed the wood pores and retain its matte glow.',
      descAr: 'نشطب قطعنا بزيوت شمعية فاخرة صديقة للبيئة. أعد تطبيق طبقة رقيقة من زيت الأثاث الطبيعي أو الشمع مرة كل ١٢ إلى ١٨ شهراً لتغذية مسام الخشب والحفاظ على توهجه الهادئ.',
    },
  ];

  const scrollToTimber = (id: string) => {
    const el = document.getElementById(`timber-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-16 mt-8 text-start">
      {/* 1. Timber selector swatches rail */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-10 py-5 px-4 bg-bg2/40 border border-line/20 rounded-[4px] backdrop-blur-sm max-w-[800px] mx-auto">
        {timbers.map((w) => (
          <button
            key={w.id}
            onClick={() => scrollToTimber(w.id)}
            className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div className="w-13 h-13 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-wood transition-all duration-300 relative shadow-md">
              <Image
                src={swatches[w.id] || swatches['Natural Oak']}
                alt={w.title}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <span className="text-[10px] md:text-xs font-semibold text-cream/70 group-hover:text-cream-bright transition-colors uppercase tracking-wider">
              {w.title.split(' ').pop()}
            </span>
          </button>
        ))}
      </div>

      {/* Comparison and Header Actions */}
      <div className="flex justify-center">
        <button
          onClick={() => setIsCompareOpen(true)}
          className="bg-transparent border border-wood text-wood hover:bg-wood/10 text-xs font-bold uppercase tracking-[0.08em] px-6 py-3.5 rounded-[2px] transition-colors cursor-pointer"
        >
          {isAr ? 'قارن خصائص الأخشاب' : 'Compare Timber Specs'}
        </button>
      </div>

      {/* 2. Main Timber Detail Grid */}
      <div className="space-y-20 mt-12">
        {timbers.map((w, index) => (
          <div
            id={`timber-${w.id}`}
            key={w.id}
            className={`grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 md:gap-14 items-center border-b border-line/20 pb-20 last:border-0 last:pb-0 scroll-mt-24 ${
              index % 2 === 1 ? 'md:flex-row-reverse' : ''
            }`}
          >
            {/* Image Column */}
            <div className="relative aspect-[4/3] rounded-[2px] overflow-hidden border border-cream/10 bg-bg2 group w-full shadow-lg">
              <Image
                src={w.image}
                alt={w.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent z-10"></div>
            </div>

            {/* Specs Details Column */}
            <div className="space-y-5 w-full">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-wood uppercase block mb-1.5">
                  {w.sub}
                </span>
                <h2 className="font-serif font-medium text-3xl text-cream-bright leading-none">
                  {w.title}
                </h2>
              </div>

              <p className="text-sm text-cream/75 leading-relaxed font-light">
                {w.desc}
              </p>

              {/* Janka Hardness Bar Visualizer */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold tracking-wider text-muted uppercase">
                  <span>{translations.janka}</span>
                  <span className="text-cream-bright font-mono">{w.jankaLabel}</span>
                </div>
                <div className="w-full h-1.5 bg-cream/10 rounded-full relative overflow-hidden">
                  <div
                    style={{ width: `${w.jankaPct}%` }}
                    className="h-full bg-wood rounded-full transition-all duration-1000"
                  ></div>
                </div>
              </div>

              {/* Detailed properties list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3.5 border-t border-line/20 text-xs">
                <div>
                  <span className="font-bold text-wood block uppercase tracking-wider mb-1">
                    {translations.durability}
                  </span>
                  <span className="text-cream/80 leading-relaxed font-light block">{w.properties}</span>
                </div>
                <div>
                  <span className="font-bold text-wood block uppercase tracking-wider mb-1">
                    {translations.uses}
                  </span>
                  <span className="text-cream/80 leading-relaxed font-light block">{w.uses}</span>
                </div>
              </div>

              {/* Call to Action pre-fill link */}
              <div className="pt-2">
                <Link
                  href={`/contact?timber=${w.id}`}
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.08em] text-wood hover:text-woodSoft uppercase group"
                >
                  {translations.getQuote} {isAr ? 'باستخدام' : 'with'} {w.title}
                  <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    {arrow}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Interactive Care Guidelines */}
      <div className="bg-bg2/30 border border-line/20 p-6 md:p-10 rounded-[4px] mt-16 space-y-6">
        <div className="text-center space-y-1.5 max-w-[500px] mx-auto">
          <span className="text-[10px] font-bold text-wood tracking-[0.2em] uppercase block">— {translations.care}</span>
          <h3 className="font-serif text-2xl text-cream-bright">
            {isAr ? 'دليل العناية بالخشب الصلب' : 'Solid Hardwood Care Guide'}
          </h3>
        </div>

        {/* Tab Headers */}
        <div className="flex flex-wrap justify-center border-b border-line/20 gap-1 sm:gap-2">
          {careGuides.map((guide, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-3 text-xs font-bold tracking-wider uppercase transition-all duration-200 border-b-2 cursor-pointer ${
                activeTab === idx
                  ? 'border-wood text-cream-bright'
                  : 'border-transparent text-muted hover:text-cream'
              }`}
            >
              {isAr ? guide.titleAr : guide.titleEn}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="min-h-[90px] py-4 max-w-[760px] mx-auto text-center sm:text-start transition-all duration-300">
          <p className="text-sm text-cream/80 leading-relaxed font-light">
            {isAr ? careGuides[activeTab].descAr : careGuides[activeTab].descEn}
          </p>
        </div>
      </div>

      {/* 4. Comparison Table Modal Backdrop */}
      {isCompareOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-pc-fade"
          onClick={() => setIsCompareOpen(false)}
        >
          <div
            className="bg-[#181310] border border-line/20 rounded-[4px] max-w-[900px] w-full p-6 space-y-6 overflow-x-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-line/20 pb-3">
              <h3 className="font-serif text-xl text-cream-bright">
                {isAr ? 'مصفوفة المقارنة الفنية' : 'Timber Performance Matrix'}
              </h3>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="text-muted hover:text-wood font-bold cursor-pointer text-sm"
              >
                ✕ {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-xs text-left min-w-[650px] border-collapse">
                <thead>
                  <tr className="border-b border-line/20 text-[#8A7E6B] font-bold uppercase tracking-wider">
                    <th className="py-3 px-2 text-start">{isAr ? 'نوع الخشب' : 'Timber'}</th>
                    <th className="py-3 px-2">{isAr ? 'الصلابة (جانكا)' : 'Hardness (Janka)'}</th>
                    <th className="py-3 px-2">{isAr ? 'تغير اللون' : 'Color Ageing'}</th>
                    <th className="py-3 px-2">{isAr ? 'مقاومة الشمس' : 'Sun Resilience'}</th>
                    <th className="py-3 px-2">{isAr ? 'فئة السعر' : 'Price Level'}</th>
                    <th className="py-3 px-2">{isAr ? 'ملائم للأماكن الخارجية' : 'Outdoor Use'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/10 font-light text-cream/90">
                  {comparisonMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-cream/[0.02] transition-colors">
                      <td className="py-4 px-2 font-bold text-cream-bright text-start">
                        {isAr ? row.nameAr : row.nameEn}
                      </td>
                      <td className="py-4 px-2 font-mono text-wood">{row.hardness}</td>
                      <td className="py-4 px-2">{isAr ? row.shiftAr : row.shiftEn}</td>
                      <td className="py-4 px-2">{isAr ? row.sunResAr : row.sunResEn}</td>
                      <td className="py-4 px-2">{isAr ? row.priceAr : row.priceEn}</td>
                      <td className="py-4 px-2">{isAr ? row.outdoorAr : row.outdoorEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[10px] text-faint italic leading-normal text-center">
              {isAr
                ? '* تعتمد تفاصيل المقارنة على أخشاب طبيعية خاضعة لتشطيب يدوي بالزيوت والشمع الطبيعي في ورشتنا.'
                : '* Performance ratings are based on solid kiln-dried wood hand-finished with low-VOC protective oils.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
