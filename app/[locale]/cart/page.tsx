import { setRequestLocale } from 'next-intl/server';
import CartViewClient from '@/components/CartViewClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'سلة التسوق | باسيفيك كاربنتري' : 'Your Cart | Pacific Carpentry',
    description: locale === 'ar'
      ? 'راجع القطع المحددة في سلة التسوق الخاصة بك وتابع إلى الدفع الآمن لتأكيد طلبك المخصص.'
      : 'Review the items in your shopping cart and proceed to secure checkout to complete your custom furniture order.',
  };
}

export default async function CartPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="bg-bg text-cream min-h-screen">
      <div
        className="max-w-[1180px] mx-auto px-5 md:px-[64px] pt-[calc(74px+40px)] md:pt-[calc(74px+72px)] pb-[70px] md:pb-[110px]"
      >
        <CartViewClient locale={locale} />
      </div>
    </div>
  );
}
