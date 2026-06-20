'use client';

import { useState, useEffect } from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';

interface BeforeAfterSlideshowProps {
  locale: string;
}

export default function BeforeAfterSlideshow({ locale }: BeforeAfterSlideshowProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 'dining-table',
      titleEn: 'Oakline Dining Table',
      titleAr: 'طاولة طعام أوكلاين',
      descEn: 'A 3-meter solid oak dining table. Proportioned, structural joinery aligned, and hand-rubbed with matte oil for Al Barari residential dining room.',
      descAr: 'طاولة طعام من البلوط الصلب بطول ٣ أمتار. نسب متناسقة وتعشيق إنشائي متين بتشطيب زيتي لغرفة طعام في فيلا البراري.',
      beforeImage: 'https://images.unsplash.com/photo-1503387762-592dec58ef4e?auto=format&fit=crop&w=1200&q=80',
      afterImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'pivot-door',
      titleEn: 'Harbor Pivot Door',
      titleAr: 'باب هاربور المحوري',
      descEn: 'Concealed pivot hinge blueprints vs the final oversized Burmese Teak entrance door installed in Emirates Hills.',
      descAr: 'مخططات نظام المفصلات المحورية المخفية مقارنة بالباب الضخم النهائي المنفذ من خشب التيك البورمي في تلال الإمارات.',
      beforeImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
      afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'sideboard',
      titleEn: 'Monterey Sideboard',
      titleAr: 'خزانة مونتيري الجانبية',
      descEn: 'Dovetailed drawer joinery details and grain-matched front boards, engineered in CAD and built in solid American Walnut.',
      descAr: 'تفاصيل تعشيق الأدراج الغنفرية وتناسق عروق الخشب للواجهة، مصممة هندسياً ومنفذة بالكامل من خشب الجوز الأمريكي الصلب.',
      beforeImage: 'https://images.unsplash.com/photo-1522204523234-e7251e77af70?auto=format&fit=crop&w=1200&q=80',
      afterImage: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'villa-kitchen',
      titleEn: 'Al Barari Villa Kitchen',
      titleAr: 'مطبخ فيلا البراري',
      descEn: 'Premium custom cabinetry and hardwood central island layout, draft-planned and crafted for Al Barari residence.',
      descAr: 'خزائن مخصصة فاخرة وتصميم جزيرة وسطية من الخشب الصلب، تم تخطيطها وصنعها لفيلا سكنية في البراري.',
      beforeImage: 'https://images.unsplash.com/photo-1503387762-592dec58ef4e?auto=format&fit=crop&w=1200&q=80',
      afterImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'staircase',
      titleEn: 'Floating Oak Staircase',
      titleAr: 'درج بلوط طافٍ',
      descEn: 'Engineered floating wood treads with concealed steel reinforcement, designed and custom-installed in Jumeirah.',
      descAr: 'درجات خشبية طائرة مصممة هندسياً مع تدعيم فولاذي مخفي، تم تصميمها وتركيبها خصيصاً في جميرا.',
      beforeImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
      afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'library-walls',
      titleEn: 'Private Library Walls',
      titleAr: 'جدران مكتبة خاصة',
      descEn: 'Floor-to-ceiling solid Walnut bookshelf unit featuring integrated ambient LED lighting and hidden joinery.',
      descAr: 'وحدة مكتبة من خشب الجوز الصلب من الأرض إلى السقف تتميز بإضاءة LED مدمجة ووصلات خشبية مخفية.',
      beforeImage: 'https://images.unsplash.com/photo-1522204523234-e7251e77af70?auto=format&fit=crop&w=1200&q=80',
      afterImage: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  // Auto-slide effect that pauses when the user hovers/interacts with the component
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeIdx, isPaused, slides.length]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-8 md:gap-14 items-center bg-cream/[0.015] border border-cream/10 p-6 md:p-10 rounded-[3px] w-full text-start"
    >
      {/* Slide Text Details */}
      <div className="flex flex-col justify-between h-full space-y-6">
        <div className="space-y-4">
          <span className="text-[11px] font-bold tracking-[0.2em] text-wood uppercase block">
            {locale === 'ar' ? 'من المخطط إلى الواقع' : 'Draft to Reality'}
          </span>
          
          {/* CSS Grid for stacked layers to prevent height-collapse & layout shifts */}
          <div className="grid grid-cols-1 grid-rows-1 min-h-[140px] w-full overflow-hidden">
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                className={`col-start-1 row-start-1 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col space-y-3 ${
                  idx === activeIdx
                    ? 'opacity-100 translate-y-0 z-10 pointer-events-auto'
                    : 'opacity-0 -translate-y-3 z-0 pointer-events-none'
                }`}
              >
                <h2 className="font-serif font-semibold text-2xl md:text-3xl text-cream-bright leading-tight">
                  {locale === 'ar' ? slide.titleAr : slide.titleEn}
                </h2>
                <p className="text-xs text-cream/70 leading-relaxed font-light">
                  {locale === 'ar' ? slide.descAr : slide.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        <div className="flex items-center gap-2.5 pt-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 cursor-pointer ${
                idx === activeIdx
                  ? 'bg-wood border-wood scale-110'
                  : 'bg-transparent border-cream/30 hover:border-cream/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Slide Interactive Sliders Container */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              idx === activeIdx
                ? 'opacity-100 z-10 pointer-events-auto scale-100'
                : 'opacity-0 z-0 pointer-events-none scale-[0.98]'
            }`}
          >
            <BeforeAfterSlider
              beforeImage={slide.beforeImage}
              afterImage={slide.afterImage}
              beforeLabel={locale === 'ar' ? 'مخطط ثلاثي الأبعاد' : '3D CAD Design'}
              afterLabel={locale === 'ar' ? 'القطعة المنفذة' : 'Completed Heirloom'}
              aspectRatioClass="w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
