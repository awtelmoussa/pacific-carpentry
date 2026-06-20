'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { fmt } from '@/lib/format';
import { useCartStore } from '@/lib/cart';
import { createOrderAction } from '@/app/actions/storefrontActions';

interface CartViewClientProps {
  locale: string;
}

export default function CartViewClient({ locale }: CartViewClientProps) {
  const t = useTranslations('cart');
  const tCta = useTranslations('cta');
  const tContact = useTranslations('contact');
  const tDetail = useTranslations('detail');

  const { items, updateQty, removeItem, clearCart, subtotal } = useCartStore();

  const [step, setStep] = useState<'cart' | 'checkout' | 'done'>('cart');
  const [orderNo, setOrderNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Checkout form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const [isClient, setIsClient] = useState(false);

  // Sync with client state to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="text-center py-20 text-faint">
        {locale === 'ar' ? 'جاري التحميل...' : 'Loading cart...'}
      </div>
    );
  }

  const backArrow = locale === 'ar' ? '→' : '←';
  const inputClass = "w-full bg-cream/[0.04] border border-cream/16 text-cream text-[15px] p-3.5 rounded-[3px] outline-none focus:border-wood/70 transition-colors";

  const subtotalAmount = subtotal();
  const hasItems = items.length > 0;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await createOrderAction({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        locale: locale,
        subtotal: subtotalAmount,
        shipping: 0,
        total: subtotalAmount,
        items: items.map((it) => ({
          productId: it.productId,
          nameEn: it.nameEn,
          nameAr: it.nameAr,
          color: it.color,
          size: it.size,
          price: it.price,
          qty: it.qty,
        })),
      });

      if (res.success && res.orderNumber) {
        setOrderNo(res.orderNumber);
        clearCart();
        setStep('done');
      } else {
        setErrorMsg(res.error || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 1. EMPTY STATE
  if (!hasItems && step !== 'done') {
    return (
      <div className="text-center py-16 md:py-24 max-w-[540px] mx-auto">
        <h1 className="margin-0 mb-4 font-serif font-medium text-4xl sm:text-[56px] text-cream-bright leading-none">
          {t('title')}
        </h1>
        <p className="margin-0 mb-[30px] text-faint text-base">
          {t('empty')}
        </p>
        <Link
          href="/products"
          className="inline-block bg-wood hover:bg-woodSoft text-bg text-[13px] font-bold tracking-[0.1em] uppercase px-[36px] py-4 rounded-[2px] cursor-pointer transition-colors duration-250 hover:brightness-105"
        >
          {tCta('continue')}
        </Link>
      </div>
    );
  }

  // 2. ORDER CONFIRMATION / DONE STATE
  if (step === 'done') {
    return (
      <div className="text-center py-16 md:py-[100px] max-w-[540px] mx-auto text-start flex flex-col items-center">
        <span
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success text-bg font-bold text-3xl mb-6 select-none"
        >
          ✓
        </span>
        <h1 className="margin-0 mb-3 font-serif font-medium text-[34px] sm:text-[54px] text-cream-bright leading-none text-center">
          {t('placed')}
        </h1>
        <p className="margin-0 mb-2 text-cream/70 text-base leading-relaxed text-center">
          {t('placedSub')}
        </p>
        <p className="margin-0 mb-[30px] text-wood text-[15px] tracking-[0.06em] text-center">
          {t('orderNo')}: <strong className="font-semibold">{orderNo}</strong>
        </p>
        <Link
          href="/products"
          className="inline-block bg-wood hover:bg-woodSoft text-bg text-[13px] font-bold tracking-[0.1em] uppercase px-[36px] py-4 rounded-[2px] cursor-pointer transition-colors duration-250 hover:brightness-105"
        >
          {tCta('continue')}
        </Link>
      </div>
    );
  }

  return (
    <div className="text-start">
      <h1 className="margin-0 mb-6 md:mb-11 font-serif font-medium text-4xl sm:text-[64px] leading-none text-cream-bright">
        {step === 'checkout' ? tCta('checkout') : t('title')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-7 md:gap-14 items-start">
        {/* Left Side: Cart Items or Checkout Forms */}
        <div>
          {step === 'cart' ? (
            /* CART LINES */
            <div className="flex flex-col">
              {items.map((it, idx) => {
                const hexColor = it.colorHex || '#6B4226';
                const bgGrad = `radial-gradient(120% 100% at 35% 25%, ${hexColor}, #18120D 84%)`;
                const letter = it.nameEn.charAt(0);

                return (
                  <div
                    key={`${it.productId}-${it.color}-${it.size}`}
                    className="flex gap-4.5 py-[22px] border-b border-line items-center"
                  >
                    {/* Item thumbnail placeholder */}
                    <div
                      style={{ background: bgGrad }}
                      className="w-[90px] h-[108px] shrink-0 rounded-[3px] border border-line relative overflow-hidden"
                    >
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="font-serif text-[48px] text-white/5 select-none leading-none">
                          {letter}
                        </span>
                      </div>
                    </div>

                    {/* Item info details */}
                    <div className="flex-grow min-w-0 text-start">
                      <h3 className="margin-0 mb-1 font-serif font-semibold text-[21px] text-cream-bright leading-tight">
                        {locale === 'ar' ? it.nameAr : it.nameEn}
                      </h3>
                      <span className="text-[13px] text-faint">
                        {tDetail('color')}: {it.color} · {tDetail('size')}: {it.size}
                      </span>
                      
                      <div className="mt-3 flex items-center gap-4">
                        {/* Qty controller */}
                        <div className="flex items-center border border-cream/18 rounded-[2px]">
                          <button
                            onClick={() => updateQty(idx, it.qty - 1)}
                            className="bg-transparent border-none text-cream text-base w-8 h-[34px] cursor-pointer hover:bg-cream/[0.03]"
                          >
                            −
                          </button>
                          <span className="min-width-[26px] w-[26px] text-center text-[13.5px] font-semibold text-cream">
                            {it.qty}
                          </span>
                          <button
                            onClick={() => updateQty(idx, it.qty + 1)}
                            className="bg-transparent border-none text-cream text-base w-8 h-[34px] cursor-pointer hover:bg-cream/[0.03]"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(idx)}
                          className="bg-transparent border-none text-faint hover:text-cream text-[12.5px] tracking-[0.04em] cursor-pointer underline underline-offset-[3px] font-body"
                        >
                          {t('remove')}
                        </button>
                      </div>
                    </div>

                    {/* Item total price */}
                    <span className="font-serif text-[21px] font-semibold text-wood shrink-0 whitespace-nowrap">
                      {fmt(it.price * it.qty, locale)}
                    </span>
                  </div>
                );
              })}

              <Link
                href="/products"
                className="inline-flex items-center gap-2 mt-6 text-wood hover:text-woodSoft transition-colors text-[13px] font-semibold tracking-[0.06em] cursor-pointer"
              >
                <span>{backArrow}</span>
                <span>{tCta('continue')}</span>
              </Link>
            </div>
          ) : (
            /* CHECKOUT FORMS */
            <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-[30px]">
              {errorMsg && (
                <div className="border border-red-500/40 bg-red-500/[0.08] text-red-200 text-sm p-4 rounded-[3px] text-start">
                  {errorMsg}
                </div>
              )}

              {/* Contact & Delivery */}
              <div>
                <h2 className="margin-0 mb-4.5 font-serif font-semibold text-2xl text-cream-bright text-start">
                  {t('contactInfo')}
                </h2>
                <div className="flex flex-col gap-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <input
                      required
                      disabled={isLoading}
                      type="text"
                      placeholder={tContact('name')}
                      className={`${inputClass} disabled:opacity-50`}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                      required
                      disabled={isLoading}
                      type="email"
                      placeholder={tContact('email')}
                      className={`${inputClass} disabled:opacity-50`}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <input
                    required
                    disabled={isLoading}
                    type="tel"
                    placeholder={tContact('phone')}
                    className={`${inputClass} disabled:opacity-50`}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <input
                    required
                    disabled={isLoading}
                    type="text"
                    placeholder={locale === 'ar' ? 'عنوان التوصيل' : 'Delivery address'}
                    className={`${inputClass} disabled:opacity-50`}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h2 className="margin-0 mb-4.5 font-serif font-semibold text-2xl text-cream-bright text-start">
                  {t('payment')}
                </h2>
                <div className="flex flex-col gap-3.5">
                  <input
                    required
                    disabled={isLoading}
                    type="text"
                    placeholder={t('card')}
                    className={`${inputClass} disabled:opacity-50`}
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <input
                      required
                      disabled={isLoading}
                      type="text"
                      placeholder={t('expiry')}
                      className={`${inputClass} disabled:opacity-50`}
                      value={formData.expiry}
                      onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                    />
                    <input
                      required
                      disabled={isLoading}
                      type="text"
                      placeholder={t('cvc')}
                      className={`${inputClass} disabled:opacity-50`}
                      value={formData.cvc}
                      onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Back */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setStep('cart')}
                className="self-start bg-transparent border-none text-faint hover:text-cream text-[13px] cursor-pointer underline underline-offset-[3px] font-body disabled:opacity-50"
              >
                {backArrow} {t('title')}
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Order Summary Card */}
        <div
          className="border border-line bg-cream/[0.025] rounded-[4px] p-6 md:p-8"
        >
          <h2 className="margin-0 mb-5 font-serif font-semibold text-2xl text-cream-bright text-start">
            {t('summary')}
          </h2>
          
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between py-1 border-b border-line-soft text-[#B6A88F]">
              <span>{t('subtotal')}</span>
              <span className="text-cream font-medium">{fmt(subtotalAmount, locale)}</span>
            </div>
            
            <div className="flex justify-between py-1 border-b border-line-soft text-[#B6A88F]">
              <span>{t('shipping')}</span>
              <span className={step === 'checkout' ? 'text-cream font-medium' : 'text-faint text-xs font-light'}>
                {step === 'checkout' ? fmt(0, locale) : t('calc')}
              </span>
            </div>
            
            <div className="flex justify-between items-baseline pt-4.5 pb-5.5">
              <span className="text-[15px] font-semibold text-cream tracking-[0.04em]">
                {t('total')}
              </span>
              <span className="font-serif text-[30px] font-semibold text-wood leading-none">
                {fmt(subtotalAmount, locale)}
              </span>
            </div>
          </div>

          <button
            disabled={isLoading}
            onClick={
              step === 'cart'
                ? () => setStep('checkout')
                : (e) => {
                    // Trigger manual submit verification on checkout step
                    const form = document.querySelector('form');
                    if (form) {
                      form.requestSubmit();
                    }
                  }
            }
            className="w-full bg-wood hover:bg-woodSoft text-bg text-[13px] font-bold tracking-[0.1em] uppercase py-4 rounded-[2px] cursor-pointer transition-colors duration-250 hover:brightness-105 disabled:opacity-50"
          >
            {step === 'cart'
              ? tCta('checkout')
              : isLoading
              ? locale === 'ar'
                ? 'جاري تأكيد الطلب...'
                : 'Placing order...'
              : tCta('placeOrder')}
          </button>

          <div
            className="flex items-center justify-center gap-2 mt-4 text-faint-deep text-xs select-none"
          >
            <span className="text-wood font-medium">⛨</span>
            {t('secure')}
          </div>
        </div>
      </div>
    </div>
  );
}
