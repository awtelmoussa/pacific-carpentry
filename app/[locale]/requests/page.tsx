'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function RequestsLookupPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string || 'en';
  
  const [refNo, setRefNo] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRef = refNo.trim().toUpperCase();
    if (!cleanRef) {
      setErrorMsg(locale === 'ar' ? 'يرجى إدخال رقم المرجع.' : 'Please enter a reference number.');
      return;
    }
    
    // Simple regex check to validate format (e.g. REQ-12345)
    if (!/^REQ-\d+$/.test(cleanRef)) {
      setErrorMsg(locale === 'ar' ? 'تنسيق الرقم المرجعي غير صالح (مثال: REQ-12345).' : 'Invalid reference format (example: REQ-12345).');
      return;
    }
    
    router.push(`/${locale}/requests/${cleanRef}`);
  };

  return (
    <div className="bg-bg text-cream font-body min-h-screen pt-[calc(74px+80px)] pb-20 px-6 flex items-center justify-center">
      <div className="max-w-[480px] w-full bg-cream/[0.015] border border-cream/10 p-8 md:p-10 rounded-[4px] text-center space-y-6 animate-pc-fade">
        <div className="w-14 h-14 rounded-full border border-wood text-wood flex items-center justify-center text-2xl font-serif mx-auto select-none">
          ✦
        </div>
        
        <div className="space-y-2">
          <h1 className="font-serif font-medium text-2xl sm:text-3xl text-cream-bright">
            {locale === 'ar' ? 'تتبع طلبك التفصيلي' : 'Track Your Commission'}
          </h1>
          <p className="text-xs text-faint font-light leading-relaxed max-w-[360px] mx-auto">
            {locale === 'ar'
              ? 'أدخل رقم مرجع الطلب (مثال: REQ-12345) الذي تم تزويدك به للتحقق من حالة التصنيع أو إتمام الدفع.'
              : 'Enter the request reference number (example: REQ-12345) provided to check your build status or complete payments.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="border border-red-500/40 bg-red-500/[0.08] text-red-200 text-xs p-3 rounded text-start">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1.5 text-start">
            <input
              type="text"
              placeholder="REQ-XXXXX"
              value={refNo}
              onChange={(e) => {
                setRefNo(e.target.value);
                setErrorMsg('');
              }}
              className="w-full bg-cream/[0.04] border border-cream/15 text-cream text-[15px] p-4 rounded-[2px] tracking-wider text-center font-mono uppercase outline-none focus:border-wood/70 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-wood hover:bg-woodSoft text-bg text-xs font-bold uppercase py-4 rounded-[2px] transition-colors cursor-pointer"
          >
            {locale === 'ar' ? 'تتبع الطلب الآن' : 'Track Status'}
          </button>
        </form>
      </div>
    </div>
  );
}
