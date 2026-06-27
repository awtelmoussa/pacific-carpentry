import { setRequestLocale, getTranslations } from 'next-intl/server';
import SectionHeader from '@/components/SectionHeader';
import MaterialsClient from '@/components/MaterialsClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function MaterialsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('materials');
  const tCta = await getTranslations('cta');
  const tDetail = await getTranslations('detail');

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

  const translations = {
    janka: t('janka'),
    durability: t('durability'),
    uses: t('uses'),
    care: t('care'),
    getQuote: tCta('getQuote'),
    back: tDetail('back'),
  };

  return (
    <div className="bg-bg text-cream min-h-screen pt-28 pb-20">
      <div className="max-w-[1080px] mx-auto px-6 md:px-12">
        <SectionHeader
          kicker={locale === 'ar' ? 'أخشابنا الفاخرة' : 'Premium Materials'}
          title={t('title')}
          subtitle={t('sub')}
        />

        <MaterialsClient
          locale={locale}
          timbers={timbers}
          translations={translations}
        />
      </div>
    </div>
  );
}
