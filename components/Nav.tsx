'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useCartStore } from '@/lib/cart';
import Image from 'next/image';

interface NavProps {
  locale: string;
}

export default function Nav({ locale }: NavProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Sync theme setting on mount
  useEffect(() => {
    const isLight = document.documentElement.classList.contains('light');
    setTheme(isLight ? 'light' : 'dark');
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  // Sync count and subscribe on client to avoid hydration mismatch
  useEffect(() => {
    // Set initial cart count after mounting
    const initialCount = useCartStore.getState().items.reduce((sum, item) => sum + item.qty, 0);
    setCartCount(initialCount);

    // Subscribe to cart store changes
    const unsubscribe = useCartStore.subscribe((state) => {
      const count = state.items.reduce((sum, item) => sum + item.qty, 0);
      setCartCount(count);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const toggleLang = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    const targetPath = pathname || '/';
    router.replace(targetPath, { locale: nextLocale });
  };

  const navLinks = [
    { href: '/', label: t('home'), activeKey: '/' },
    { href: '/materials', label: t('materials'), activeKey: '/materials' },
    { href: '/visualize', label: t('showroom'), activeKey: '/visualize' },
    { href: '/contact', label: t('contact'), activeKey: '/contact' },
    { href: '/work', label: t('work'), activeKey: '/work' },
    { href: '/about', label: t('about'), activeKey: '/about' },
  ];

  const isActive = (linkHref: string) => {
    if (!pathname) return false;
    if (linkHref === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(linkHref);
  };

  return (
    <>
      <nav
        style={{
          backgroundColor: scrolled
            ? 'var(--color-nav-bg-scrolled)'
            : 'var(--color-nav-bg-normal)',
        }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-3 md:px-12 h-[74px] backdrop-blur-md border-b border-line transition-colors duration-300"
      >
        {/* Logo Monogram & Wordmark */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
          <Image
            src="/logo.jpg"
            alt="Pacific Carpentry Logo"
            width={46}
            height={46}
            className="object-contain transition-all duration-200 logo-img-theme"
            priority={true}
          />
          <span className="hidden sm:flex flex-col leading-none">
            <span className="text-cream font-semibold text-[15px] tracking-[0.16em]">
              PACIFIC
            </span>
            <span className="text-muted font-medium text-[9.5px] tracking-[0.42em] mt-[3px]">
              CARPENTRY
            </span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13.5px] font-medium tracking-[0.03em] whitespace-nowrap transition-colors duration-200 font-body ${active ? 'text-cream font-semibold' : 'text-muted hover:text-cream'
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Action Buttons: i18n & Cart & Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="border border-line hover:border-wood/75 text-cream hover:text-wood p-1.5 sm:p-2 rounded-[2px] transition-all duration-200 cursor-pointer flex items-center justify-center"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              /* Moon Icon */
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              /* Sun Icon */
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="border border-line hover:border-wood/75 hover:text-wood text-cream font-semibold text-[11px] sm:text-xs tracking-[0.05em] sm:tracking-[0.08em] px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-[2px] transition-all duration-200 cursor-pointer"
          >
            {locale === 'ar' ? 'English' : 'العربية'}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-cream hover:text-wood transition-colors p-1.5 cursor-pointer"
            aria-label="Toggle Menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer menu */}
      {menuOpen && (
        <div className="fixed inset-0 top-[74px] bg-bg z-40 flex flex-col p-6 md:hidden border-t border-line transition-all duration-300">
          <div className="flex flex-col gap-2 font-body mt-4">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-2xl font-light py-4 border-b border-line-soft transition-colors ${active ? 'text-wood border-wood/30' : 'text-cream hover:text-wood'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
