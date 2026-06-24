import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SectionHeader from '@/components/SectionHeader';
import { prisma, mapDbProjectToProject } from '@/lib/prisma';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tHome = await getTranslations('home');
  const tCta = await getTranslations('cta');
  const tNav = await getTranslations('nav');
  const tAbout = await getTranslations('about');
  const tProcess = await getTranslations('process');
  const tTestimonials = await getTranslations('testimonials');

  const arrow = locale === 'ar' ? '←' : '→';
  const woodHexes = ["#6B4226", "#3A2A1B", "#C99A63", "#4A3526", "#5A4030", "#2C2824"];


  // Query database for projects
  const dbProjects = await prisma.project.findMany({
    orderBy: { sortOrder: 'asc' },
    take: 3,
  });

  const mappedProjects = dbProjects.map(mapDbProjectToProject);

  const homeProjects = mappedProjects.map((p: { en: string; ar: string; cat: { en: string; ar: string }; year: string; images: string[] }, i: number) => ({
    name: p[locale as 'en' | 'ar'],
    cat: p.cat[locale as 'en' | 'ar'],
    year: p.year,
    images: p.images || [],
    grad: `radial-gradient(120% 100% at 35% 25%, ${woodHexes[i % woodHexes.length]}, #1A140F 82%)`,
  }));

  return (
    <div className="bg-bg text-cream overflow-x-hidden min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-screen min-h-[620px] flex items-end overflow-hidden">
        {/* Background Auto-Playing Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-35 pointer-events-none"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Pattern overlay */}
        <div className="absolute inset-0 z-1 bg-[repeating-linear-gradient(94deg,rgba(0,0,0,0.18)_0px,rgba(0,0,0,0.18)_2px,transparent_2px,transparent_9px)] opacity-50"></div>
        {/* Dark gradient fade-in overlay */}
        <div className="absolute inset-0 z-1 bg-gradient-to-t from-bg via-bg/35 to-bg/55"></div>
        
        {/* Workshop video notice top-center */}
        <div className="absolute top-[96px] left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 border border-solid border-cream/20 bg-bg2/40 backdrop-blur-sm px-3.5 py-1.5 rounded-[3px] text-cream/70 text-xs tracking-[0.08em] whitespace-nowrap">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wood opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-wood"></span>
          </span>
          {tHome('videoNote')}
        </div>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] pb-[60px] md:pb-[110px]">
          <div className="animate-pc-fade max-w-[780px] text-start">
            <span className="inline-block text-[12.5px] font-semibold tracking-[0.28em] text-wood uppercase mb-5">
              {tHome('kicker')}
            </span>
            <h1 className="margin-0 font-serif font-medium text-[46px] sm:text-[68px] md:text-[96px] lg:text-[104px] leading-[0.98] tracking-[-0.01em] text-cream-bright whitespace-pre-line">
              {tHome('heroTitle')}
            </h1>
            <p className="mt-[26px] mb-0 text-[15px] sm:text-lg md:text-[19px] leading-[1.65] text-cream/70 max-w-[540px] font-light font-body">
              {tHome('heroSub')}
            </p>
            <div className="flex flex-wrap gap-3.5 mt-[38px]">
              <Link
                href="/contact"
                className="bg-wood hover:bg-woodSoft text-bg text-[13px] font-semibold tracking-[0.1em] uppercase px-8 py-4 rounded-[2px] transition-colors duration-250 cursor-pointer"
              >
                {tCta('getQuote')}
              </Link>
              <Link
                href="/work"
                className="border border-cream/40 hover:border-cream/85 text-cream hover:text-white text-[13px] font-semibold tracking-[0.1em] uppercase px-8 py-4 rounded-[2px] transition-colors duration-250 cursor-pointer"
              >
                {tNav('work')}
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator bob */}
        <div className="absolute bottom-[26px] left-1/2 -translate-x-1/2 z-10 text-cream/50 animate-pc-scroll">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </section>


      {/* RECENT WORK SECTION */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] pt-[70px] md:pt-[130px]">
        <SectionHeader
          kicker={tNav('work')}
          title={tHome('workTitle')}
          subtitle={tHome('workSub')}
          viewAllLink="/work"
          viewAllText={tCta('viewAll')}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {homeProjects.map((w, index) => (
            <Link
              key={index}
              href="/work"
              className="relative block aspect-[4/5] overflow-hidden rounded-[3px] border border-cream/[0.08] group cursor-pointer"
            >
              {w.images && w.images.length > 0 ? (
                <Image
                  src={w.images[0]}
                  alt={w.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-600 ease-out group-hover:scale-[1.06]"
                  priority={false}
                />
              ) : (
                <>
                  {/* Background gradient block representing project timber */}
                  <div
                    style={{ background: w.grad }}
                    className="absolute inset-0 transition-transform duration-600 ease-out group-hover:scale-[1.06]"
                  ></div>
                  {/* Pattern details overlay */}
                  <div
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(90deg,rgba(0,0,0,0.16) 0px,rgba(0,0,0,0.16) 1px,transparent 1px,transparent 8px)',
                    }}
                    className="absolute inset-0 opacity-45 pointer-events-none"
                  ></div>
                </>
              )}
              {/* Bottom shadows overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#100D0A]/85 via-transparent to-transparent"></div>
              
              {/* Metadata content */}
              <div className="absolute bottom-0 left-0 right-0 p-[22px] transition-opacity duration-300 opacity-90 group-hover:opacity-100 text-start">
                <span className="text-[10.5px] font-semibold tracking-[0.16em] text-wood uppercase">
                  {w.cat} · {w.year}
                </span>
                <h3 className="mt-2 mb-0 font-serif font-semibold text-2xl text-cream-bright leading-none">
                  {w.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PROCESS TIMELINE SECTION */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] pt-[70px] md:pt-[130px]">
        <SectionHeader
          kicker={locale === 'ar' ? 'خطوات العمل' : 'Our Workflow'}
          title={tProcess('title')}
          subtitle={tProcess('sub')}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <div className="bg-cream/[0.015] border border-cream/10 p-6 rounded-[3px] space-y-3 hover:border-wood/30 transition-colors text-start">
            <span className="text-2xl font-serif font-bold text-wood block">01</span>
            <h3 className="font-serif font-semibold text-lg text-cream-bright">{tProcess('step1Title')}</h3>
            <p className="text-xs text-cream/70 leading-relaxed font-light">{tProcess('step1Desc')}</p>
          </div>
          <div className="bg-cream/[0.015] border border-cream/10 p-6 rounded-[3px] space-y-3 hover:border-wood/30 transition-colors text-start">
            <span className="text-2xl font-serif font-bold text-wood block">02</span>
            <h3 className="font-serif font-semibold text-lg text-cream-bright">{tProcess('step2Title')}</h3>
            <p className="text-xs text-cream/70 leading-relaxed font-light">{tProcess('step2Desc')}</p>
          </div>
          <div className="bg-cream/[0.015] border border-cream/10 p-6 rounded-[3px] space-y-3 hover:border-wood/30 transition-colors text-start">
            <span className="text-2xl font-serif font-bold text-wood block">03</span>
            <h3 className="font-serif font-semibold text-lg text-cream-bright">{tProcess('step3Title')}</h3>
            <p className="text-xs text-cream/70 leading-relaxed font-light">{tProcess('step3Desc')}</p>
          </div>
          <div className="bg-cream/[0.015] border border-cream/10 p-6 rounded-[3px] space-y-3 hover:border-wood/30 transition-colors text-start">
            <span className="text-2xl font-serif font-bold text-wood block">04</span>
            <h3 className="font-serif font-semibold text-lg text-cream-bright">{tProcess('step4Title')}</h3>
            <p className="text-xs text-cream/70 leading-relaxed font-light">{tProcess('step4Desc')}</p>
          </div>
        </div>
      </section>

      {/* ABOUT TEASER SECTION */}
      <section className="mt-[70px] md:mt-[130px] bg-bg2 border-y border-cream/7">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] py-14 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-9 md:gap-20 items-center">
          <div className="text-start">
            <span className="text-[12px] font-semibold tracking-[0.22em] text-wood uppercase">— {tAbout('kicker')}</span>
            <h2 className="mt-4 mb-5 font-serif font-medium text-3xl md:text-[46px] leading-[1.08] text-cream-bright">
              {tHome('aboutTitle')}
            </h2>
            <p className="mb-8 text-cream/70 text-[16px] leading-[1.75] max-w-[480px] font-light">
              {tHome('aboutBody')}
            </p>
            
            {/* Stats list */}
            <div className="flex gap-6 md:gap-[56px] mb-[34px]">
              <div>
                <div className="font-serif text-[46px] font-semibold text-wood leading-none">20+</div>
                <div className="text-[12.5px] text-faint tracking-[0.06em] mt-1">{tHome('statYears')}</div>
              </div>
              <div>
                <div className="font-serif text-[46px] font-semibold text-wood leading-none">1,400+</div>
                <div className="text-[12.5px] text-faint tracking-[0.06em] mt-1">{tHome('statPieces')}</div>
              </div>
              <div>
                <div className="font-serif text-[46px] font-semibold text-wood leading-none">300+</div>
                <div className="text-[12.5px] text-faint tracking-[0.06em] mt-1">{tHome('statClients')}</div>
              </div>
            </div>

            <Link
              href="/about"
              className="inline-block border border-cream/40 hover:border-cream/85 text-cream hover:text-white text-[13px] font-semibold tracking-[0.1em] uppercase px-[30px] py-3.5 rounded-[2px] transition-colors duration-250 cursor-pointer"
            >
              {tCta('learnMore')}
            </Link>
          </div>

          {/* About graphic placeholder */}
          <div className="relative aspect-[4/5] rounded-[3px] overflow-hidden border border-cream/10 bg-[radial-gradient(120%_100%_at_30%_20%,#3A2A1B,#1C1712_80%)]">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(88deg,rgba(255,255,255,0.04)_0px,rgba(255,255,255,0.04)_1px,transparent_1px,transparent_9px)] opacity-60"></div>
            <span className="absolute bottom-4 right-4 text-[10px] tracking-[0.12em] text-cream/35 select-none uppercase">
              {locale === 'ar' ? 'صورة' : 'image'}
            </span>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] pt-[70px] md:pt-[130px]">
        <SectionHeader
          kicker={locale === 'ar' ? 'آراء العملاء' : 'Social Proof'}
          title={tTestimonials('title')}
          subtitle={tTestimonials('sub')}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-cream/[0.015] border border-cream/10 p-7 rounded-[3px] flex flex-col justify-between text-start relative overflow-hidden group">
            <span className="absolute top-4 right-6 text-7xl font-serif text-wood/10 pointer-events-none select-none">“</span>
            <p className="text-sm text-cream/80 leading-relaxed italic font-light z-10">
              {tTestimonials('review1Text')}
            </p>
            <div className="mt-6 pt-4 border-t border-line/20 z-10">
              <div className="font-serif font-semibold text-cream-bright text-base">{tTestimonials('review1Author')}</div>
              <div className="text-[11px] text-faint tracking-wider mt-0.5 uppercase">{tTestimonials('review1Loc')}</div>
            </div>
          </div>

          <div className="bg-cream/[0.015] border border-cream/10 p-7 rounded-[3px] flex flex-col justify-between text-start relative overflow-hidden group">
            <span className="absolute top-4 right-6 text-7xl font-serif text-wood/10 pointer-events-none select-none">“</span>
            <p className="text-sm text-cream/80 leading-relaxed italic font-light z-10">
              {tTestimonials('review2Text')}
            </p>
            <div className="mt-6 pt-4 border-t border-line/20 z-10">
              <div className="font-serif font-semibold text-cream-bright text-base">{tTestimonials('review2Author')}</div>
              <div className="text-[11px] text-faint tracking-wider mt-0.5 uppercase">{tTestimonials('review2Loc')}</div>
            </div>
          </div>

          <div className="bg-cream/[0.015] border border-cream/10 p-7 rounded-[3px] flex flex-col justify-between text-start relative overflow-hidden group">
            <span className="absolute top-4 right-6 text-7xl font-serif text-wood/10 pointer-events-none select-none">“</span>
            <p className="text-sm text-cream/80 leading-relaxed italic font-light z-10">
              {tTestimonials('review3Text')}
            </p>
            <div className="mt-6 pt-4 border-t border-line/20 z-10">
              <div className="font-serif font-semibold text-cream-bright text-base">{tTestimonials('review3Author')}</div>
              <div className="text-[11px] text-faint tracking-wider mt-0.5 uppercase">{tTestimonials('review3Loc')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER BAND */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] py-[80px] md:py-[140px] text-center flex flex-col items-center">
        <span className="text-[12px] font-semibold tracking-[0.22em] text-wood uppercase">— {tNav('contact')}</span>
        <h2 className="mt-4 mb-4 font-serif font-medium text-[34px] sm:text-[48px] md:text-[68px] leading-[1.04] text-cream-bright max-w-[760px]">
          {tHome('ctaTitle')}
        </h2>
        <p className="mb-[36px] text-cream/70 text-base md:text-[17px] leading-relaxed max-w-[480px] font-light">
          {tHome('ctaSub')}
        </p>
        <Link
          href="/contact"
          className="inline-block bg-wood hover:bg-woodSoft text-bg text-[13px] font-semibold tracking-[0.1em] uppercase px-10 py-4.5 rounded-[2px] transition-colors duration-250 cursor-pointer"
        >
          {tCta('getQuote')}
        </Link>
      </section>
    </div>
  );
}
