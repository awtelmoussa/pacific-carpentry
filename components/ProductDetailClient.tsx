'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Product, catName, PRODUCTS } from '@/lib/data';
import { fmt } from '@/lib/format';
import { useCartStore } from '@/lib/cart';
import ProductCard from '@/components/ProductCard';

interface ProductDetailClientProps {
  product: Product;
  locale: string;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  locale,
  relatedProducts,
}: ProductDetailClientProps) {
  const t = useTranslations('detail');
  const tCta = useTranslations('cta');

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const currentColor = product.colors[selectedColorIndex];
  const currentSize = product.sizes[selectedSizeIndex];
  const currentPrice = currentSize.price;

  const handleColorChange = (index: number) => {
    setSelectedColorIndex(index);
    setAdded(false);
  };

  const handleSizeChange = (index: number) => {
    setSelectedSizeIndex(index);
    setAdded(false);
  };

  const handleIncrement = () => {
    setQuantity((q) => q + 1);
    setAdded(false);
  };

  const handleDecrement = () => {
    setQuantity((q) => Math.max(1, q - 1));
    setAdded(false);
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      slug: product.id,
      nameEn: product.name.en,
      nameAr: product.name.ar,
      color: currentColor[locale as 'en' | 'ar'],
      colorHex: currentColor.hex,
      size: currentSize[locale as 'en' | 'ar'],
      price: currentPrice,
      qty: quantity,
    });
    setAdded(true);
  };

  const initialLetter = product.name.en.charAt(0);
  const heroGrad = `radial-gradient(120% 100% at 32% 24%, ${currentColor.hex}66, #18120D 82%)`;
  const backArrow = locale === 'ar' ? '→' : '←';

  const woodHexes = ["#6B4226", "#3A2A1B", "#5A4030", "#2C2824"];
  const thumbs = woodHexes.map((h) => ({
    grad: `radial-gradient(120% 100% at 35% 25%, ${h}, #18120D 85%)`,
  }));

  const assurances = [
    { icon: "✦", text: t('made') },
    { icon: "✦", text: t('ships') },
    { icon: "✦", text: t('crafted') },
  ];

  return (
    <div className="bg-bg text-cream font-body min-h-screen">
      {/* Back button */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] pt-[calc(74px+24px)] md:pt-[calc(74px+44px)] pb-1 text-start">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-faint hover:text-cream transition-colors duration-200 text-sm tracking-[0.04em] cursor-pointer"
        >
          <span>{backArrow}</span>
          <span>{t('back')}</span>
        </Link>
      </div>

      {/* Main product detail section */}
      <section
        className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] py-6 md:py-9 pb-14 md:pb-24 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 lg:gap-[72px] items-start"
      >
        {/* Left Column: Image Gallery */}
        <div>
          {/* Main Hero block representation */}
          <div
            style={product.images && product.images.length > 0 ? {} : { background: heroGrad }}
            className="relative aspect-square rounded-[4px] overflow-hidden border border-cream/10 bg-cover bg-center"
          >
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0]} alt={product.name[locale as 'en' | 'ar']} className="w-full h-full object-cover" />
            ) : (
              <>
                <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.04)_0px,rgba(255,255,255,0.04)_1px,transparent_1px,transparent_9px)] opacity-60 pointer-events-none"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="font-serif text-[180px] font-semibold text-white/5 select-none leading-none">
                    {initialLetter}
                  </span>
                </div>
                <span className="absolute bottom-4 right-4 text-[10.5px] tracking-[0.12em] text-cream/35 select-none uppercase">
                  {locale === 'ar' ? 'صورة' : 'image'}
                </span>
              </>
            )}
          </div>

          {/* Thumbnails grid */}
          <div className="grid grid-cols-4 gap-3 mt-3">
            {product.images && product.images.length > 0 && (
              <div
                className="aspect-square rounded-[3px] border border-wood cursor-pointer overflow-hidden"
              >
                <img src={product.images[0]} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
            )}
            {(product.images && product.images.length > 0 ? thumbs.slice(1) : thumbs).map((th, index) => (
              <div
                key={index}
                style={{ background: th.grad }}
                className="aspect-square rounded-[3px] border border-cream/12 hover:border-wood/60 cursor-pointer transition-colors duration-200"
              ></div>
            ))}
          </div>
        </div>

        {/* Right Column: Configurations */}
        <div className="text-start">
          <span className="text-[11.5px] font-semibold tracking-[0.18em] text-wood uppercase">
            {catName(product.cat, locale)}
          </span>
          <h1 className="mt-3 mb-2 font-serif font-medium text-[34px] sm:text-[46px] md:text-[56px] leading-[1.02] text-cream-bright">
            {product.name[locale as 'en' | 'ar']}
          </h1>
          <p className="margin-0 text-faint text-[15.5px] mb-4">
            {product.tagline[locale as 'en' | 'ar']}
          </p>
          <div className="font-serif text-[32px] font-semibold text-wood tracking-[0.01em] pb-5 border-b border-line">
            {fmt(currentPrice, locale)}
          </div>

          {/* Color/Finish Selector */}
          <div className="mt-[26px]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">
                {t('color')}
              </span>
              <span className="text-sm text-cream font-medium">
                {currentColor[locale as 'en' | 'ar']}
              </span>
            </div>
            <div className="flex gap-3">
              {product.colors.map((c, i) => {
                const isSelected = i === selectedColorIndex;
                return (
                  <button
                    key={i}
                    onClick={() => handleColorChange(i)}
                    title={c[locale as 'en' | 'ar']}
                    className={`bg-transparent rounded-full p-[3px] cursor-pointer w-[40px] h-[40px] flex items-center justify-center transition-colors duration-200 ${
                      isSelected ? 'border border-wood' : 'border border-cream/20'
                    }`}
                  >
                    <span
                      style={{ backgroundColor: c.hex }}
                      className="block w-full h-full rounded-full"
                    ></span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector */}
          <div className="mt-[26px]">
            <span className="block text-xs font-semibold tracking-[0.12em] text-muted uppercase mb-3">
              {t('size')}
            </span>
            <div className="flex flex-col gap-2">
              {product.sizes.map((s, i) => {
                const isSelected = i === selectedSizeIndex;
                return (
                  <button
                    key={i}
                    onClick={() => handleSizeChange(i)}
                    className={`flex justify-between items-center gap-4 px-4.5 py-3.5 border rounded-[3px] cursor-pointer transition-all duration-200 text-cream font-body text-start ${
                      isSelected
                        ? 'border-wood bg-wood/[0.08]'
                        : 'border-cream/16 bg-transparent hover:border-wood/30'
                    }`}
                  >
                    <span className="text-[14.5px] font-medium">{s[locale as 'en' | 'ar']}</span>
                    <span
                      className={`text-[14.5px] font-semibold ${
                        isSelected ? 'text-wood' : 'text-faint'
                      }`}
                    >
                      {fmt(s.price, locale)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Request Bespoke Quote Link */}
          <div className="mt-7">
            <Link
              href={`/contact?cat=${product.cat}&timber=${currentColor.en}&size=${currentSize.en}`}
              className="w-full bg-wood hover:bg-woodSoft text-bg text-[13px] font-bold tracking-[0.15em] uppercase h-[52px] rounded-[2px] cursor-pointer transition-colors duration-250 flex items-center justify-center gap-2 text-decoration-none"
            >
              {locale === 'ar' ? 'طلب تسعيرة تفصيلية' : 'Request a Bespoke Quote'}
            </Link>
          </div>

          {/* Trust Assurances */}
          <div className="mt-[30px] flex flex-col gap-3.5 pt-6 border-t border-line">
            {assurances.map((a, index) => (
              <div key={index} className="flex items-center gap-3 text-cream/80 text-[13.5px]">
                <span className="text-wood shrink-0">{a.icon}</span>
                <span>{a.text}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mt-[26px] pt-6 border-t border-line">
            <span className="block text-xs font-semibold tracking-[0.12em] text-muted uppercase mb-3">
              {t('desc')}
            </span>
            <p className="margin-0 text-cream/80 text-[15px] leading-relaxed font-light">
              {product.desc[locale as 'en' | 'ar']}
            </p>
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] pb-14 md:pb-24">
        <h2 className="margin-0 mb-6 md:mb-10 font-serif font-medium text-2xl md:text-[42px] text-cream-bright text-start">
          {t('related')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-[30px]">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
