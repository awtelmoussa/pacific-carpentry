'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CATEGORIES, minPrice, Product } from '@/lib/data';
import ProductCard from '@/components/ProductCard';

interface ProductsCatalogProps {
  locale: string;
  initialProducts: Product[];
}

export default function ProductsCatalog({ locale, initialProducts }: ProductsCatalogProps) {
  const t = useTranslations('products');
  const tNav = useTranslations('nav');
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial category from search query parameter
  const initialCat = searchParams.get('cat') || 'all';

  const [activeCat, setActiveCat] = useState(initialCat);
  const [activeSort, setActiveSort] = useState('featured');

  // Keep state in sync with URL queries if they change
  useEffect(() => {
    const catQuery = searchParams.get('cat') || 'all';
    setActiveCat(catQuery);
  }, [searchParams]);

  const handleCategoryChange = (catId: string) => {
    setActiveCat(catId);
    // Update URL query parameter
    if (catId === 'all') {
      router.push('/products', { scroll: false });
    } else {
      router.push(`/products?cat=${catId}`, { scroll: false });
    }
  };

  // Filter products by category
  const filteredProducts = initialProducts.filter(
    (p) => activeCat === 'all' || p.cat === activeCat
  );

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (activeSort === 'low') {
      return minPrice(a) - minPrice(b);
    }
    if (activeSort === 'high') {
      return minPrice(b) - minPrice(a);
    }
    // 'featured' remains default (unsorted seed order)
    return 0;
  });

  const categoriesList = [
    { id: 'all', label: t('all') },
    ...CATEGORIES.map((c) => ({
      id: c.id,
      label: c[locale as 'en' | 'ar'],
    })),
  ];

  return (
    <div className="bg-bg text-cream font-body">
      {/* FILTER & SORT TOOLBAR */}
      <div
        className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] flex flex-col md:flex-row justify-between items-start md:items-center gap-5 border-b border-line pb-5.5"
      >
        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2.5">
          {categoriesList.map((f) => {
            const isActive = activeCat === f.id;
            return (
              <button
                key={f.id}
                onClick={() => handleCategoryChange(f.id)}
                className={`text-[12.5px] tracking-[0.06em] px-[17px] py-[9px] rounded-[40px] whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-wood border border-wood text-bg font-semibold'
                    : 'bg-transparent border border-cream/16 text-faint hover:border-wood/55 hover:text-cream-bright'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Sort select */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          <span className="text-[12.5px] text-faint tracking-[0.04em]">
            {t('sort')}
          </span>
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value)}
            className="bg-surface border border-cream/16 text-cream text-[13px] px-3 py-2 rounded-[2px] outline-none cursor-pointer focus:border-wood/50"
          >
            <option value="featured">{t('sortFeatured')}</option>
            <option value="low">{t('sortLow')}</option>
            <option value="high">{t('sortHigh')}</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS GRID / EMPTY STATE */}
      <section
        className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] py-[34px] md:py-[52px] pb-[70px] md:pb-[120px]"
      >
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-[38px]">
            {sortedProducts.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        ) : (
          <p className="text-faint text-base py-16 text-center">
            {t('empty')}
          </p>
        )}
      </section>
    </div>
  );
}
