import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import ProductsCatalog from '@/components/ProductsCatalog';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'المجموعة الكاملة | باسيفيك كاربنتري' : 'The Collection | Pacific Carpentry',
    description: locale === 'ar' 
      ? 'تصفح مجموعتنا الفريدة من طاولات الطعام الفاخرة والكراسي والأبواب المحورية المصنوعة يدويًا في دبي.' 
      : 'Browse our collection of solid-timber dining tables, chairs, bespoke cabinets, pivot doors, and shelving made to order in Dubai.',
  };
}

import { prisma, mapDbProductToProduct } from '@/lib/prisma';

export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tProducts = await getTranslations('products');
  const tNav = await getTranslations('nav');

  // Fetch products from database
  const dbProducts = await prisma.product.findMany({
    include: { colors: true, sizes: true },
    orderBy: { sortOrder: 'asc' },
  });
  const mappedProducts = dbProducts.map(mapDbProductToProduct);

  return (
    <div className="bg-bg text-cream min-h-screen">
      {/* HEADER */}
      <header
        className="pt-[calc(74px+48px)] md:pt-[calc(74px+clamp(48px,7vw,90px))] pb-[34px] md:pb-[52px] px-6 md:px-12 lg:px-[72px] max-w-[1280px] mx-auto text-start"
      >
        <span className="text-[12px] font-semibold tracking-[0.24em] text-wood uppercase">
          — {tNav('products')}
        </span>
        <h1 className="mt-4 mb-3 font-serif font-medium text-4xl sm:text-6xl md:text-[76px] leading-none text-cream-bright">
          {tProducts('title')}
        </h1>
        <p className="margin-0 text-faint text-base max-w-[520px] leading-relaxed font-light">
          {tProducts('sub')}
        </p>
      </header>

      {/* CATALOG CONTAINER (with Suspense for search params) */}
      <Suspense
        fallback={
          <div className="text-center py-20 text-faint font-body">
            {locale === 'ar' ? 'جاري التحميل...' : 'Loading collection...'}
          </div>
        }
      >
        <ProductsCatalog locale={locale} initialProducts={mappedProducts} />
      </Suspense>
    </div>
  );
}
