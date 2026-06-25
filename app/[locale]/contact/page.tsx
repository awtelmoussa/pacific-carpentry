import { setRequestLocale, getTranslations } from 'next-intl/server';
import BespokeConfigurator from '@/components/BespokeConfigurator';
import FaqAccordion from '@/components/FaqAccordion';
import { Link } from '@/i18n/routing';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'طلب تفصيلي | باسيفيك كاربنتري' : 'Bespoke Request | Pacific Carpentry',
    description: locale === 'ar'
      ? 'اطلب تصميم وتصنيع أثاث خشبي صلب مخصص من ورشتنا في دبي.'
      : 'Commission a custom timber design and heirloom-grade furniture from our Dubai carpentry workshop.',
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tContact = await getTranslations('contact');
  const tNav = await getTranslations('nav');
  const tFaq = await getTranslations('faq');

  const faqItems = [
    { q: tFaq('q1'), a: tFaq('a1') },
    { q: tFaq('q2'), a: tFaq('a2') },
    { q: tFaq('q3'), a: tFaq('a3') },
    { q: tFaq('q4'), a: tFaq('a4') },
    { q: tFaq('q5'), a: tFaq('a5') },
  ];

  const cards = [
    {
      label: tContact('visit'),
      line1: locale === 'ar' ? 'ورشة باسيفيك، القوز' : 'Pacific Workshop, Al Quoz',
      line2: locale === 'ar' ? 'دبي، الإمارات' : 'Dubai, UAE',
    },
    {
      label: tContact('call'),
      line1: '+971 4 000 0000',
      line2: tContact('hours'),
    },
    {
      label: tContact('write'),
      line1: 'hello@pacificcarpentry.ae',
      line2: locale === 'ar' ? 'نرد خلال يوم عمل' : 'We reply within a day',
    },
  ];

  return (
    <div className="bg-bg text-cream font-body min-h-screen">
      {/* HEADER */}
      <header
        className="pt-[calc(74px+48px)] md:pt-[calc(74px+clamp(48px,7vw,90px))] pb-[30px] md:pb-[46px] px-6 md:px-12 lg:px-[72px] max-w-[1280px] mx-auto text-start"
      >
        <span className="text-[12px] font-semibold tracking-[0.24em] text-wood uppercase">
          — {tNav('contact')}
        </span>
        <h1 className="mt-4 mb-3 font-serif font-medium text-4xl sm:text-6xl md:text-[76px] leading-[1.02] text-cream-bright whitespace-pre-line animate-pc-fade">
          {tContact('title')}
        </h1>
        <p className="margin-0 text-faint text-base max-w-[640px] leading-relaxed font-light">
          {tContact('sub')}{' '}
          <Link href="/requests" className="text-wood hover:underline font-normal">
            {locale === 'ar' ? 'تتبع طلبك المخصص هنا.' : 'Track your custom commission here.'}
          </Link>
        </p>
      </header>

      {/* CONFIGURATOR SECTION */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] pb-[24px]">
        <BespokeConfigurator locale={locale} />
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] pb-[48px] md:pb-[64px]">
        <FaqAccordion
          title={tFaq('title')}
          sub={tFaq('sub')}
          items={faqItems}
        />
      </section>

      {/* CONTACT INFO SECTION */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] pb-[70px] md:pb-[120px] grid grid-cols-1 lg:grid-cols-[1.5fr_0.9fr] gap-9 md:gap-[56px] items-start">
        {/* Left: Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {cards.map((c, i) => (
            <div
              key={i}
              className="border border-cream/10 bg-cream/[0.025] rounded-[4px] p-6 text-start"
            >
              <span className="block text-[11px] font-semibold tracking-[0.16em] text-wood uppercase mb-2.5">
                {c.label}
              </span>
              <span className="block text-[16px] text-cream-bright leading-normal font-medium">
                {c.line1}
              </span>
              <span className="block text-[13.5px] text-faint mt-1.5 font-light">
                {c.line2}
              </span>
            </div>
          ))}
        </div>
        {/* Right: Map */}
        <div
          className="relative aspect-[3/1.2] sm:aspect-[4/1.2] lg:aspect-[2.3/1.2] w-full border border-cream/10 rounded-[4px] overflow-hidden bg-gradient-to-br from-[#241D16] to-[#1A140F] flex items-center justify-center"
        >
          {/* Grid background lines */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg,rgba(237,230,216,0.05) 0px,rgba(237,230,216,0.05) 1px,transparent 1px,transparent 26px), repeating-linear-gradient(90deg,rgba(237,230,216,0.05) 0px,rgba(237,230,216,0.05) 1px,transparent 1px,transparent 26px)',
            }}
          ></div>
          <span className="absolute text-wood font-bold select-none scale-150 animate-pulse">
            ✦
          </span>
          <span className="absolute bottom-3 right-3.5 text-[10px] tracking-[0.12em] text-cream/40 uppercase select-none">
            {locale === 'ar' ? 'خريطة' : 'map'}
          </span>
        </div>
      </section>
    </div>
  );
}
