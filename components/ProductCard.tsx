'use client';

import { Product, minPrice, catName } from '@/lib/data';
import { fmt } from '@/lib/format';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  locale: string;
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  const t = useTranslations('products');
  const tCta = useTranslations('cta');

  const primaryColorHex = product.colors[0]?.hex || '#2A2219';
  const backgroundGradient = {
    background: `linear-gradient(150deg, ${primaryColorHex}3d, #1C1712 78%)`,
  };

  const initialLetter = product.name.en.charAt(0);
  const formattedPrice = fmt(minPrice(product), locale);
  const categoryLabel = catName(product.cat, locale);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col text-decoration-none font-body transition-card hover:-translate-y-1.5 cursor-pointer"
    >
      {/* Image Area with Grain & Watermark */}
      <div
        style={product.images && product.images.length > 0 ? {} : backgroundGradient}
        className="relative aspect-[4/5] overflow-hidden border border-cream/[0.08] bg-cover bg-center"
      >
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name[locale as 'en' | 'ar']}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            priority={false}
          />
        ) : (
          <>
            {/* Grain overlay */}
            <div
              style={{
                backgroundImage:
                  'repeating-linear-gradient(92deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 7px)',
              }}
              className="absolute inset-0 opacity-50 pointer-events-none"
            ></div>

            {/* Large watermark letter */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-serif text-[120px] font-semibold text-white/5 select-none leading-none">
                {initialLetter}
              </span>
            </div>
          </>
        )}

        {/* Category label top-left */}
        <span className="absolute top-[14px] left-[14px] text-[10.5px] font-semibold tracking-[0.16em] uppercase text-cream/70">
          {categoryLabel}
        </span>

        {/* Placeholder image label bottom-right */}
        <span className="absolute bottom-[12px] right-[14px] text-[10px] tracking-[0.1em] text-cream/30 uppercase select-none">
          {locale === 'ar' ? 'صورة' : 'image'}
        </span>

        {/* Hover overlay with "Explore" text */}
        <div className="absolute inset-0 flex items-end justify-center pb-[22px] bg-gradient-to-t from-bg/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350">
          <span className="border border-cream/60 text-cream text-[11px] font-semibold tracking-[0.14em] uppercase px-5 py-2.5 bg-bg/40 backdrop-blur-sm">
            {tCta('explore')}
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="pt-4 px-0.5 flex flex-col gap-1">
        <div className="flex justify-between items-baseline gap-3">
          <h3 className="margin-0 font-serif font-semibold text-2xl text-cream group-hover:text-wood-soft transition-colors duration-200 leading-tight">
            {product.name[locale as 'en' | 'ar']}
          </h3>
        </div>
        <span className="text-[13px] text-faint leading-normal">
          {product.tagline[locale as 'en' | 'ar']}
        </span>
        <span className="text-[13.5px] text-wood font-semibold tracking-[0.02em] mt-0.5">
          {t('from')} {formattedPrice}
        </span>
      </div>
    </Link>
  );
}
