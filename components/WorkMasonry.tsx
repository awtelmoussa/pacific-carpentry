'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Project } from '@/lib/data';

interface WorkMasonryProps {
  locale: string;
  initialProjects: Project[];
}

export default function WorkMasonry({ locale, initialProjects }: WorkMasonryProps) {
  const t = useTranslations('work');
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    { id: 'all', label: t('all') },
    { id: 'Residential', label: t('filterRes') },
    { id: 'Hospitality', label: t('filterHos') },
    { id: 'Commercial', label: t('filterCom') },
  ];

  // Colors and ratios for portfolio placeholder blocks
  const woodHexes = ["#6B4226", "#3A2A1B", "#5A4030", "#4A3526", "#2C2824", "#C99A63"];
  const ratios = ["aspect-[4/5]", "aspect-[4/3]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]", "aspect-[4/3]"];

  const filteredProjects = initialProjects.filter(
    (p) => activeFilter === 'all' || p.cat.en === activeFilter
  );

  return (
    <div className="bg-bg text-cream font-body">
      {/* FILTER PILLS TOOLBAR */}
      <div
        className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] pb-[28px] md:pb-[42px] flex flex-wrap gap-2.5 border-b border-line"
      >
        {categories.map((c) => {
          const isActive = activeFilter === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveFilter(c.id)}
              className={`text-[12.5px] tracking-[0.06em] px-[17px] py-[9px] rounded-[40px] whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-wood border border-wood text-bg font-semibold'
                  : 'bg-transparent border border-cream/16 text-faint hover:border-wood/55 hover:text-cream-bright'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* MASONRY PORTFOLIO */}
      <section
        className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-[72px] py-[28px] md:py-[44px] pb-[70px] md:pb-[120px]"
      >
        <div className="columns-1 sm:columns-2 md:columns-3 gap-[18px]">
          {filteredProjects.map((p, i) => {
            const ratioClass = ratios[i % ratios.length];
            const woodColor = woodHexes[i % woodHexes.length];
            const backgroundGradient = {
              background: `radial-gradient(120% 100% at 35% 25%, ${woodColor}, #16110C 84%)`,
            };

            return (
              <Link
                key={p.id}
                href="/contact"
                className="relative block break-inside-avoid mb-[18px] rounded-[4px] overflow-hidden border border-cream/[0.08] group cursor-pointer"
              >
                <div className={`${ratioClass} relative overflow-hidden bg-cover bg-center`}>
                  {p.images && p.images.length > 0 ? (
                    <img
                      src={p.images[0]}
                      alt={p[locale as 'en' | 'ar']}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                  ) : (
                    <>
                      {/* Visual gradient representing wood joinery */}
                      <div
                        style={backgroundGradient}
                        className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      ></div>
                      
                      {/* Pattern lines overlay */}
                      <div
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(90deg,rgba(0,0,0,0.16) 0px,rgba(0,0,0,0.16) 1px,transparent 1px,transparent 8px)',
                        }}
                        className="absolute inset-0 opacity-45 pointer-events-none"
                      ></div>
                    </>
                  )}
                  
                  {/* Shadow vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100D0A]/85 via-transparent to-transparent"></div>
                  
                  {/* Image Note */}
                  <span className="absolute top-[14px] right-[16px] text-[9.5px] tracking-[0.12em] text-cream/40 select-none uppercase">
                    {locale === 'ar' ? 'صورة' : 'image'}
                  </span>

                  {/* Caption details overlay */}
                  <div
                    className="absolute bottom-0 left-0 right-0 p-[22px] transition-opacity duration-300 opacity-92 group-hover:opacity-100 text-start"
                  >
                    <span className="text-[10.5px] font-semibold tracking-[0.16em] text-wood uppercase">
                      {p.cat[locale as 'en' | 'ar']} · {p.year}
                    </span>
                    <h3 className="mt-2 mb-0 font-serif font-semibold text-[25px] text-cream-bright leading-tight">
                      {p[locale as 'en' | 'ar']}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
