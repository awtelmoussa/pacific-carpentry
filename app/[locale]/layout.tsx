import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ContactWidget from '@/components/ContactWidget';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <div className="bg-bg text-cream font-body min-h-screen flex flex-col antialiased selection:bg-wood selection:text-bg">
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Nav locale={locale} />
        <main className="flex-grow">{children}</main>
        <Footer locale={locale} />
        <ContactWidget locale={locale} />
      </NextIntlClientProvider>
    </div>
  );
}
