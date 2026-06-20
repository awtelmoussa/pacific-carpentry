import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SectionHeader from '@/components/SectionHeader';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function MaterialsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('materials');
  const tCta = await getTranslations('cta');

  const arrow = locale === 'ar' ? '←' : '→';

  // Timber details list with Janka hardness values and image assets
  const timbers = [
    {
      id: 'Walnut',
      title: t('walnutTitle'),
      sub: t('walnutSub'),
      desc: t('walnutDesc'),
      properties: t('walnutProperties'),
      uses: t('walnutUses'),
      janka: 1010, // lbf Janka scale
      jankaLabel: '1,010 lbf',
      jankaPct: 50, // relative percentage of scale (500 to 1800)
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'Premium Teak',
      title: t('teakTitle'),
      sub: t('teakSub'),
      desc: t('teakDesc'),
      properties: t('teakProperties'),
      uses: t('teakUses'),
      janka: 1155,
      jankaLabel: '1,155 lbf',
      jankaPct: 60,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'Natural Oak',
      title: t('oakTitle'),
      sub: t('oakSub'),
      desc: t('oakDesc'),
      properties: t('oakProperties'),
      uses: t('oakUses'),
      janka: 1360,
      jankaLabel: '1,360 lbf',
      jankaPct: 75,
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'Hard Maple',
      title: t('mapleTitle'),
      sub: t('mapleSub'),
      desc: t('mapleDesc'),
      properties: t('mapleProperties'),
      uses: t('mapleUses'),
      janka: 1450,
      jankaLabel: '1,450 lbf',
      jankaPct: 82,
      image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'American Cherry',
      title: t('cherryTitle'),
      sub: t('cherrySub'),
      desc: t('cherryDesc'),
      properties: t('cherryProperties'),
      uses: t('cherryUses'),
      janka: 950,
      jankaLabel: '950 lbf',
      jankaPct: 45,
      image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="bg-bg text-cream min-h-screen pt-28 pb-20">
      <div className="max-w-[1080px] mx-auto px-6 md:px-12">
        <SectionHeader
          kicker={locale === 'ar' ? 'أخشابنا الفاخرة' : 'Premium Materials'}
          title={t('title')}
          subtitle={t('sub')}
        />

        {/* Timber Grid Cards */}
        <div className="space-y-16 mt-12">
          {timbers.map((w, index) => (
            <div
              key={w.id}
              className={`grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 md:gap-14 items-center border-b border-line/30 pb-16 last:border-0 last:pb-0 ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Image Column */}
              <div className="relative aspect-[4/3] rounded-[3px] overflow-hidden border border-cream/10 bg-bg2 group w-full">
                <img
                  src={w.image}
                  alt={w.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent"></div>
              </div>

              {/* Specs Details Column */}
              <div className="text-start space-y-5 w-full">
                <div>
                  <span className="text-[11px] font-bold tracking-[0.2em] text-wood uppercase block mb-2">
                    {w.sub}
                  </span>
                  <h2 className="font-serif font-semibold text-3xl text-cream-bright leading-none">
                    {w.title}
                  </h2>
                </div>

                <p className="text-sm text-cream/75 leading-relaxed font-light">
                  {w.desc}
                </p>

                {/* Janka Hardness Bar Visualizer */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold tracking-wider text-muted uppercase">
                    <span>{t('janka')}</span>
                    <span className="text-cream-bright font-mono">{w.jankaLabel}</span>
                  </div>
                  <div className="w-full h-2 bg-cream/10 rounded-full relative overflow-hidden">
                    <div
                      style={{ width: `${w.jankaPct}%` }}
                      className="h-full bg-wood rounded-full transition-all duration-1000"
                    ></div>
                  </div>
                </div>

                {/* Detailed properties list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-line/20 text-xs">
                  <div>
                    <span className="font-bold text-wood block uppercase tracking-wider mb-1">
                      {t('durability')}
                    </span>
                    <span className="text-cream/80 leading-relaxed font-light block">{w.properties}</span>
                  </div>
                  <div>
                    <span className="font-bold text-wood block uppercase tracking-wider mb-1">
                      {t('uses')}
                    </span>
                    <span className="text-cream/80 leading-relaxed font-light block">{w.uses}</span>
                  </div>
                </div>

                {/* Call to Action pre-fill link */}
                <div className="pt-4">
                  <Link
                    href={`/contact?timber=${w.id}`}
                    className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.08em] text-wood hover:text-woodSoft uppercase group"
                  >
                    {tCta('getQuote')} with {w.title}
                    <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                      {arrow}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
