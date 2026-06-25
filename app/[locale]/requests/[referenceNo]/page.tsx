import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { fmt } from '@/lib/format';

interface PageProps {
  params: Promise<{ locale: string; referenceNo: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { referenceNo } = await params;
  return {
    title: `Bespoke Request ${referenceNo} | Pacific Carpentry`,
  };
}

export default async function RequestStatusPage({ params }: PageProps) {
  const { locale, referenceNo } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('bespokeStatus');

  const request = await prisma.bespokeRequest.findUnique({
    where: { referenceNo },
  });

  if (!request) {
    notFound();
  }

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'UNDER_REVIEW':
        return 1;
      case 'QUOTED':
        return 2;
      case 'APPROVED':
        return 3;
      case 'IN_PRODUCTION':
        return 4;
      case 'COMPLETED':
        return 5;
      case 'CANCELLED':
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(request.status);
  const steps = [
    { label: locale === 'ar' ? 'بانتظار المراجعة' : 'Pending', desc: t('underReview') },
    { label: locale === 'ar' ? 'قيد المراجعة' : 'Under Review', desc: t('underReview') },
    { label: locale === 'ar' ? 'تم التسعير' : 'Quoted', desc: locale === 'ar' ? 'تم تجهيز عرض السعر بانتظار الدفع لبدء العمل.' : 'Quote is ready. Awaiting payment to begin.' },
    { label: locale === 'ar' ? 'تمت الموافقة' : 'Approved', desc: locale === 'ar' ? 'تم تأكيد الدفع والموافقة على العمل.' : 'Payment confirmed, request approved.' },
    { label: locale === 'ar' ? 'قيد التصنيع' : 'In Production', desc: t('paidSuccess') },
    { label: locale === 'ar' ? 'اكتمل العمل' : 'Completed', desc: locale === 'ar' ? 'اكتمل تصنيع طلبك وجاهز للتسليم.' : 'Your commission is complete and ready.' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return locale === 'ar' ? 'بانتظار المراجعة' : 'Pending Review';
      case 'UNDER_REVIEW':
        return locale === 'ar' ? 'قيد المراجعة الفنية' : 'Under Technical Review';
      case 'QUOTED':
        return locale === 'ar' ? 'تم تقديم عرض السعر' : 'Quote Ready';
      case 'APPROVED':
        return locale === 'ar' ? 'تمت الموافقة' : 'Approved';
      case 'IN_PRODUCTION':
        return locale === 'ar' ? 'قيد التصنيع بالورشة' : 'In Workshop Production';
      case 'COMPLETED':
        return locale === 'ar' ? 'جاهز للتسليم' : 'Completed & Ready';
      case 'CANCELLED':
        return locale === 'ar' ? 'ملغي' : 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="bg-bg text-cream font-body min-h-screen pt-[calc(74px+48px)] pb-20 px-6 md:px-12 lg:px-[72px]">
      <div className="max-w-[860px] mx-auto space-y-9 text-start">
        
        {/* Header section */}
        <div className="border-b border-line pb-6 space-y-2.5">
          <span className="text-xs font-semibold tracking-[0.24em] text-wood uppercase block">
            — {t('title')}
          </span>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
            <h1 className="font-serif font-medium text-3xl sm:text-4xl text-cream-bright leading-none">
              {t('reference')}: <span className="text-wood font-mono tracking-wider">{request.referenceNo}</span>
            </h1>
            <span className="text-xs text-faint font-light">
              {locale === 'ar' ? 'تاريخ الطلب' : 'Submitted'}:{' '}
              {new Date(request.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <p className="text-faint text-sm max-w-[580px] leading-relaxed font-light mt-1">
            {t('sub')}
          </p>
        </div>

        {/* Progress Tracker Timeline */}
        {request.status !== 'CANCELLED' && (
          <div className="bg-cream/[0.015] border border-cream/10 rounded p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-line-soft">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">{t('status')}</span>
              <span className="bg-wood/10 text-wood text-[11px] font-bold px-2.5 py-0.5 rounded border border-wood/20">
                {getStatusBadge(request.status)}
              </span>
            </div>
            
            {/* Visual Steps Tracker */}
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 pt-2">
              {/* Desktop connecting lines */}
              <div className="absolute top-[14px] left-4 right-4 h-0.5 bg-line-soft hidden md:block z-0">
                <div
                  className="h-full bg-wood transition-all duration-500"
                  style={{ width: `${(Math.max(0, currentStep) / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>

              {steps.map((st, idx) => {
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;
                const isFuture = idx > currentStep;
                
                return (
                  <div key={idx} className="relative z-10 flex md:flex-col items-center md:text-center gap-3.5 md:gap-2.5 flex-1 w-full">
                    {/* Circle Indicator */}
                    <div
                      className={`w-7.5 h-7.5 rounded-full flex items-center justify-center font-bold text-[11px] border shrink-0 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-wood border-wood text-bg'
                          : isActive
                          ? 'bg-[#15110D] border-wood text-wood shadow-[0_0_12px_rgba(194,150,91,0.25)]'
                          : 'bg-[#15110D] border-line-soft text-faint'
                      }`}
                    >
                      {isCompleted ? '✓' : `0${idx + 1}`}
                    </div>
                    {/* Step details */}
                    <div className="text-start md:text-center">
                      <span
                        className={`block text-xs font-semibold tracking-wide ${
                          isActive ? 'text-cream-bright font-bold' : isCompleted ? 'text-cream/80' : 'text-faint'
                        }`}
                      >
                        {st.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Active stage details text */}
            {currentStep >= 0 && (
              <div className="bg-cream/[0.025] border border-line-soft p-4 rounded text-xs text-cream/70 leading-relaxed font-light text-start">
                <span className="font-semibold text-cream-bright block mb-1">
                  {steps[currentStep].label}
                </span>
                {request.paymentStatus === 'PAID' && currentStep === 4 ? t('paidSuccess') : steps[currentStep].desc}
              </div>
            )}
          </div>
        )}

        {/* Pricing / Payment Action Block */}
        {request.status === 'QUOTED' && (
          <div className="border border-wood/30 bg-wood/[0.04] p-6 md:p-8 rounded-[4px] space-y-5 text-start">
            <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-wood border-b border-wood/20 pb-2.5">
              {t('payment')}
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs text-faint uppercase tracking-wider block">{t('price')}</span>
                <span className="text-3xl font-serif font-bold text-cream-bright">
                  {request.quotePrice ? fmt(request.quotePrice, locale) : '—'}
                </span>
              </div>

              {request.paymentStatus === 'PENDING' && request.ziinaPaymentUrl ? (
                <a
                  href={request.ziinaPaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-wood hover:bg-woodSoft text-bg text-[13px] font-bold uppercase tracking-[0.06em] px-8 py-4 rounded-[2px] transition-colors cursor-pointer text-center block"
                >
                  {t('payButton')}
                </a>
              ) : request.paymentStatus === 'PAID' ? (
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase border border-emerald-500/20 px-5 py-3 rounded">
                  {locale === 'ar' ? 'تم الدفع بالكامل' : 'Paid in Full'}
                </span>
              ) : (
                <span className="text-xs text-faint italic font-light">
                  {locale === 'ar' ? 'رابط الدفع قيد التجهيز...' : 'Payment link is being set up...'}
                </span>
              )}
            </div>
            {request.paymentStatus === 'PENDING' && (
              <p className="text-[11px] text-faint leading-relaxed font-light">
                {locale === 'ar' 
                  ? '* سيتم تحويلك إلى بوابة الدفع الآمنة "زينة" (Ziina) لإتمام الدفع بواسطة Apple Pay أو البطاقة الائتمانية. فور الدفع، سيتم تحديث حالة طلبك وتوجيهه إلى ورشة النجارة.'
                  : '* You will be redirected to the secure Ziina payment gateway to complete your transfer via Apple Pay, Google Pay, or Card. Once completed, your request is approved for bench crafting.'}
              </p>
            )}
          </div>
        )}

        {/* Specifications List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[#8A7E6B] border-b border-line pb-2">
            {t('specifications')}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-line-soft bg-cream/[0.01] p-4.5 rounded">
              <span className="block text-[10px] text-faint uppercase tracking-wider mb-1">{t('category')}</span>
              <span className="text-sm font-semibold text-cream-bright">{request.category}</span>
            </div>
            <div className="border border-line-soft bg-cream/[0.01] p-4.5 rounded">
              <span className="block text-[10px] text-faint uppercase tracking-wider mb-1">{t('timber')}</span>
              <span className="text-sm font-semibold text-cream-bright">{request.timber}</span>
            </div>
            <div className="border border-line-soft bg-cream/[0.01] p-4.5 rounded">
              <span className="block text-[10px] text-faint uppercase tracking-wider mb-1">{t('dimensions')}</span>
              <span className="text-sm font-semibold font-mono text-cream-bright">{request.dimensions}</span>
            </div>
          </div>

          {request.notes && (
            <div className="border border-line-soft bg-cream/[0.01] p-5 rounded text-start space-y-2 mt-4">
              <span className="block text-[10px] text-faint uppercase tracking-wider">{t('notes')}</span>
              <p className="text-xs text-cream/70 leading-relaxed font-light whitespace-pre-wrap">
                {request.notes}
              </p>
            </div>
          )}

          {/* Slabs / Reference drawings */}
          {request.images && request.images.length > 0 && (
            <div className="space-y-3 mt-4">
              <span className="block text-[10px] text-faint uppercase tracking-wider text-start">
                {locale === 'ar' ? 'رسومات ومخططات مرجعية' : 'Reference Drawings & Images'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {request.images.map((imgUrl, idx) => (
                  <a
                    key={idx}
                    href={imgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square border border-line-soft rounded overflow-hidden hover:border-wood transition-colors block bg-cream/[0.01]"
                  >
                    <img
                      src={imgUrl}
                      alt={`Reference ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
