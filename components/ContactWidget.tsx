'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface ContactWidgetProps {
  locale: string;
}

export default function ContactWidget({ locale }: ContactWidgetProps) {
  const t = useTranslations('contactWidget');
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Close the popup menu if user clicks outside of the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const phoneNumber = '971508269785'; // Placeholder UAE phone number
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(t('inquiry'))}`;
  const callUrl = `tel:+${phoneNumber}`;

  // Positioning class based on LTR/RTL text direction
  const positionClass = locale === 'ar' ? 'left-6' : 'right-6';

  return (
    <div
      ref={widgetRef}
      className={`fixed bottom-6 z-45 flex flex-col items-end ${positionClass} font-body select-none`}
    >
      {/* Contact Options Card */}
      <div
        className={`mb-4 w-72 bg-bg2/95 backdrop-blur-md border border-line rounded-[3px] shadow-[0_12px_36px_rgba(0,0,0,0.35)] transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        {/* Header Block */}
        <div className="p-4 border-b border-line/70 text-start">
          <h4 className="font-serif font-semibold text-base text-cream-bright leading-tight">
            {t('title')}
          </h4>
          <span className="text-[10px] font-semibold text-wood tracking-[0.05em] uppercase flex items-center gap-1.5 mt-1.5">
            <span className="inline-block w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
            {t('status')}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="p-3.5 flex flex-col gap-2">
          {/* WhatsApp Chat Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center justify-center gap-2.5 bg-[#183526] hover:bg-[#204733] border border-wood/35 hover:border-wood/60 text-cream text-[13px] font-semibold tracking-[0.03em] py-3 rounded-[2px] transition-all duration-200"
          >
            {/* WhatsApp Logo SVG */}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[#25D366]"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.37 5.378 0 12.003 0c3.21.001 6.228 1.248 8.498 3.52 2.27 2.272 3.515 5.29 3.515 8.501 0 6.633-5.375 12.004-12.007 12.004-1.997 0-3.955-.496-5.7-1.442L0 24zm6.59-4.846c1.6.95 3.1 1.45 4.8 1.45 5.4 0 9.8-4.4 9.8-9.8s-4.4-9.8-9.8-9.8c-5.4 0-9.8 4.4-9.8 9.8 0 1.8.5 3.5 1.5 5l-.3 1 1.7-.5z" />
            </svg>
            {t('chat')}
          </a>

          {/* Direct Call Button */}
          <a
            href={callUrl}
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center justify-center gap-2.5 bg-cream/[0.03] hover:bg-cream/[0.07] border border-line hover:border-cream/35 text-cream text-[13px] font-semibold tracking-[0.03em] py-3 rounded-[2px] transition-all duration-200"
          >
            {/* Phone Icon SVG */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-wood"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {t('call')}
          </a>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#183526] hover:bg-[#1f4230] border border-wood/35 hover:border-wood/60 text-cream rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer relative group"
        aria-label="Contact Options"
      >
        {/* Toggle icon: WhatsApp logo or Close icon */}
        <div className="absolute inset-0 flex items-center justify-center transition-all duration-300">
          {isOpen ? (
            /* Close Icon (X) */
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pc-fade"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            /* WhatsApp Icon */
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[#25D366] transition-transform duration-300 group-hover:scale-110"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
          )}
        </div>
      </button>
    </div>
  );
}
