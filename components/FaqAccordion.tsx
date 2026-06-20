'use client';

import { useState } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  title: string;
  sub: string;
  items: FaqItem[];
}

export default function FaqAccordion({ title, sub, items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="border border-cream/10 bg-cream/[0.015] rounded-[4px] p-6 md:p-8 space-y-6 text-start">
      <div>
        <h2 className="font-serif text-2xl text-cream-bright mb-2">{title}</h2>
        <p className="text-xs text-muted font-light">{sub}</p>
      </div>

      <div className="divide-y divide-line/35">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-4 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                className="w-full flex justify-between items-center text-left gap-4 py-2 font-serif text-cream hover:text-cream-bright font-medium text-base sm:text-[17px] cursor-pointer transition-colors border-none bg-transparent outline-none focus:text-wood"
              >
                <span className="text-start">{item.q}</span>
                <span className={`text-wood transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                  ＋
                </span>
              </button>
              <div
                style={{
                  maxHeight: isOpen ? '240px' : '0px',
                  opacity: isOpen ? 1 : 0,
                }}
                className="overflow-hidden transition-all duration-300 ease-in-out"
              >
                <p className="text-xs text-cream/70 leading-relaxed font-light mt-2.5 pb-2">
                  {item.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
