import { getLocale } from 'next-intl/server';
import { Cormorant_Garamond, Manrope, Amiri, Tajawal } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import CustomCursor from '@/components/CustomCursor';

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/logo.jpg', type: 'image/jpeg' }
    ],
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-tajawal',
  display: 'swap',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${cormorant.variable} ${manrope.variable} ${amiri.variable} ${tajawal.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  if (theme === 'light') {
                     document.documentElement.classList.add('light');
                     document.documentElement.classList.remove('dark');
                  } else {
                     document.documentElement.classList.add('dark');
                     document.documentElement.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
