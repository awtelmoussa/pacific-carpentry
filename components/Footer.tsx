'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const tFooter = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tCart = useTranslations('cart');
  const tContact = useTranslations('contact');

  return (
    <footer
      className="bg-[#100D0A] border-t border-line text-muted py-12 md:py-20 px-6 md:px-12 lg:px-[72px]"
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex flex-col leading-none">
            <span className="text-cream font-semibold text-[17px] tracking-[0.16em]">
              PACIFIC
            </span>
            <span className="text-muted font-medium text-[10px] tracking-[0.42em] mt-1">
              CARPENTRY
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-[280px] text-faint">
            {tFooter('tagline')}
          </p>
        </div>

        {/* Builds Column */}
        <div>
          <h4 className="text-cream text-xs font-semibold tracking-[0.14em] uppercase mb-4 md:mb-5">
            {tNav('contact')}
          </h4>
          <div className="flex flex-col gap-3">
            <Link
              href="/contact"
              className="text-sm text-faint hover:text-cream transition-colors duration-200"
            >
              {tNav('contact')}
            </Link>
            <Link
              href="/materials"
              className="text-sm text-faint hover:text-cream transition-colors duration-200"
            >
              {tNav('materials')}
            </Link>
            <Link
              href="/work"
              className="text-sm text-faint hover:text-cream transition-colors duration-200"
            >
              {tNav('work')}
            </Link>
          </div>
        </div>

        {/* Company Column */}
        <div>
          <h4 className="text-cream text-xs font-semibold tracking-[0.14em] uppercase mb-4 md:mb-5">
            {tFooter('company')}
          </h4>
          <div className="flex flex-col gap-3">
            <Link
              href="/about"
              className="text-sm text-faint hover:text-cream transition-colors duration-200"
            >
              {tNav('about')}
            </Link>
            <Link
              href="/contact"
              className="text-sm text-faint hover:text-cream transition-colors duration-200"
            >
              {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </Link>
          </div>
        </div>

        {/* Newsletter Column */}
        <div>
          <h4 className="text-cream text-xs font-semibold tracking-[0.14em] uppercase mb-4 mb-3">
            {tFooter('newsletter')}
          </h4>
          <p className="text-[13px] leading-relaxed mb-4 text-faint">
            {tFooter('newsletterSub')}
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2"
          >
            <input
              type="email"
              placeholder={tContact('email')}
              className="flex-grow min-w-0 bg-cream/[0.04] border border-cream/15 text-cream text-[13px] px-3.5 py-2.5 rounded-[2px] outline-none focus:border-wood/50 transition-colors"
            />
            <button
              type="submit"
              className="bg-wood hover:bg-woodSoft text-bg text-[12px] font-semibold tracking-[0.04em] px-4 rounded-[2px] cursor-pointer whitespace-nowrap transition-colors duration-200"
            >
              {tFooter('subscribe')}
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div
        className="max-w-[1200px] mx-auto mt-12 md:mt-16 pt-6 border-t border-cream/[0.08] flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-start"
      >
        <span className="text-[12.5px] text-faint-deep">
          © {new Date().getFullYear()} Pacific Carpentry. {tFooter('rights')}
        </span>
        <span className="text-[12.5px] text-faint-deep">
          {tFooter('made')}
        </span>
      </div>
    </footer>
  );
}
