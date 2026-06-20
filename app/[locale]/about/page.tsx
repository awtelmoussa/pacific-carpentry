import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'قصتنا | باسيفيك كاربنتري' : 'About Us | Pacific Carpentry',
    description: locale === 'ar'
      ? 'تعرف على التزامنا بالنجارة التقليدية والخشب الصلب عالي الجودة والتشطيبات الآمنة بيئيًا في ورشتنا بدبي.'
      : 'Learn about our passion for traditional joinery, sustainably sourced solid hardwoods, and custom heirloom furniture made in Dubai.',
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tAbout = await getTranslations('about');
  const tHome = await getTranslations('home');
  const tCta = await getTranslations('cta');
  const tNav = await getTranslations('nav');

  const values = [
    { num: '01', title: tAbout('b1Title'), body: tAbout('b1') },
    { num: '02', title: tAbout('b2Title'), body: tAbout('b2') },
    { num: '03', title: tAbout('b3Title'), body: tAbout('b3') },
  ];

  return (
    <div className="bg-bg text-cream font-body overflow-x-hidden min-h-screen">
      {/* ABOUT HERO */}
      <section
        className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] pt-[calc(74px+48px)] md:pt-[calc(74px+96px)] pb-[50px] md:pb-[80px] grid grid-cols-1 md:grid-cols-2 gap-9 md:gap-20 items-center"
      >
        <div className="text-start">
          <span className="text-[12px] font-semibold tracking-[0.24em] text-wood uppercase">
            — {tAbout('kicker')}
          </span>
          <h1 className="mt-[18px] mb-6 font-serif font-medium text-[38px] sm:text-[54px] md:text-[72px] leading-[1.02] text-cream-bright whitespace-pre-line">
            {tAbout('title')}
          </h1>
          <p className="margin-0 text-[#B6A88F] text-[16px] sm:text-[19px] leading-relaxed font-light">
            {tAbout('lead')}
          </p>
        </div>

        {/* Graphic placeholder */}
        <div
          className="relative aspect-[4/5] border border-cream/10 rounded-[4px] overflow-hidden bg-[radial-gradient(120%_100%_at_30%_20%,#3A2A1B,#1A140F_82%)]"
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(88deg,rgba(255,255,255,0.04)_0px,rgba(255,255,255,0.04)_1px,transparent_1px,transparent_9px)] opacity-60"></div>
          <span className="absolute bottom-4 right-4 text-[10px] tracking-[0.12em] text-cream/35 select-none uppercase">
            {locale === 'ar' ? 'صورة' : 'image'}
          </span>
        </div>
      </section>

      {/* VALUES BAND */}
      <section className="bg-bg2 border-y border-cream/7">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] py-14 md:py-24 text-start">
          <span className="text-[12px] font-semibold tracking-[0.22em] text-wood uppercase">
            — {tAbout('valuesTitle')}
          </span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-14 mt-8 md:mt-12">
            {values.map((v) => (
              <div key={v.num}>
                <span className="font-serif text-[40px] font-semibold text-wood/50 leading-none">
                  {v.num}
                </span>
                <h3 className="mt-3.5 mb-3 font-serif font-semibold text-[27px] text-cream-bright leading-none">
                  {v.title}
                </h3>
                <p className="margin-0 text-cream/70 text-[15px] leading-relaxed font-light">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] py-16 md:py-[130px] text-center flex flex-col items-center">
        <h2 className="margin-0 mb-4 font-serif font-medium text-3xl sm:text-[46px] md:text-[58px] leading-[1.05] text-cream-bright max-w-[680px]">
          {tHome('ctaTitle')}
        </h2>
        <p className="margin-0 mb-8 text-cream/70 text-base leading-relaxed max-w-[460px] font-light">
          {tHome('ctaSub')}
        </p>
        <div className="flex flex-wrap gap-3.5 justify-center">
          <Link
            href="/contact"
            className="border border-cream/40 hover:border-cream/85 text-cream hover:text-white text-[13px] font-semibold tracking-[0.1em] uppercase px-8 py-4 rounded-[2px] transition-colors duration-250 cursor-pointer"
          >
            {tNav('contact')}
          </Link>
        </div>
      </section>
    </div>
  );
}
