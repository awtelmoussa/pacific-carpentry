import { setRequestLocale, getTranslations } from 'next-intl/server';
import WorkMasonry from '@/components/WorkMasonry';
import BeforeAfterSlideshow from '@/components/BeforeAfterSlideshow';
import { prisma, mapDbProjectToProject } from '@/lib/prisma';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'أعمالنا | باسيفيك كاربنتري' : 'Our Work | Pacific Carpentry',
    description: locale === 'ar'
      ? 'استعرض مشاريعنا المعمارية المميزة، بما في ذلك المطابخ السكنية، ردهات الفنادق، والتجهيزات المكتبية في الإمارات.'
      : 'Explore our selected portfolio of woodwork installations, from custom residential furniture to luxury commercial and hotel fit-outs in the UAE.',
  };
}

export default async function OurWorkPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tWork = await getTranslations('work');
  const tNav = await getTranslations('nav');

  // Fetch projects from database
  const dbProjects = await prisma.project.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  const mappedProjects = dbProjects.map(mapDbProjectToProject);

  return (
    <div className="bg-bg text-cream min-h-screen">
      {/* HEADER */}
      <header
        className="pt-[calc(74px+48px)] md:pt-[calc(74px+clamp(48px,7vw,90px))] pb-[30px] md:pb-[46px] px-6 md:px-12 lg:px-[72px] max-w-[1280px] mx-auto text-start"
      >
        <span className="text-[12px] font-semibold tracking-[0.24em] text-wood uppercase">
          — {tNav('work')}
        </span>
        <h1 className="mt-4 mb-3 font-serif font-medium text-4xl sm:text-6xl md:text-[76px] leading-none text-cream-bright">
          {tWork('title')}
        </h1>
        <p className="margin-0 text-faint text-base max-w-[540px] leading-relaxed font-light">
          {tWork('sub')}
        </p>
      </header>

      {/* BEFORE / AFTER SLIDER SECTION */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] pb-12">
        <BeforeAfterSlideshow locale={locale} />
      </section>

      {/* MASONRY VIEW */}
      <WorkMasonry locale={locale} initialProjects={mappedProjects} />
    </div>
  );
}
