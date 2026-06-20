'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { submitContactAction } from '@/app/actions/storefrontActions';

interface ContactFormProps {
  locale: string;
}

export default function ContactForm({ locale }: ContactFormProps) {
  const t = useTranslations('contact');
  const tCta = useTranslations('cta');

  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await submitContactAction({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        body: formData.message,
      });

      if (res.success) {
        setSent(true);
      } else {
        setErrorMsg(res.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const labelClass = "text-xs font-semibold tracking-[0.08em] uppercase text-muted text-start mb-2 block";
  const inputClass = "w-full bg-cream/[0.04] border border-cream/16 text-cream text-[15px] p-3.5 rounded-[3px] outline-none focus:border-wood/70 transition-colors";

  if (sent) {
    return (
      <div
        className="border border-success/40 bg-success/[0.07] rounded-[4px] p-10 flex flex-col items-start gap-3.5 text-start"
      >
        <span
          className="flex items-center justify-center w-12 h-12 rounded-full bg-success text-bg font-bold text-2xl select-none"
        >
          ✓
        </span>
        <p className="margin-0 font-serif text-[26px] text-cream-bright leading-snug">
          {t('sent')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
      {errorMsg && (
        <div className="border border-red-500/40 bg-red-500/[0.08] text-red-200 text-sm p-4 rounded-[3px] text-start">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
        <div>
          <label className={labelClass}>{t('name')}</label>
          <input
            required
            disabled={isLoading}
            type="text"
            className={`${inputClass} disabled:opacity-50`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>{t('email')}</label>
          <input
            required
            disabled={isLoading}
            type="email"
            className={`${inputClass} disabled:opacity-50`}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
        <div>
          <label className={labelClass}>{t('phone')}</label>
          <input
            disabled={isLoading}
            type="tel"
            className={`${inputClass} disabled:opacity-50`}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>{t('subject')}</label>
          <input
            required
            disabled={isLoading}
            type="text"
            className={`${inputClass} disabled:opacity-50`}
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>{t('message')}</label>
        <textarea
          required
          disabled={isLoading}
          rows={6}
          className={`${inputClass} resize-y min-h-[130px] disabled:opacity-50`}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="self-start bg-wood hover:bg-woodSoft text-bg text-[13px] font-bold tracking-[0.1em] uppercase px-9 py-4 rounded-[2px] cursor-pointer transition-colors duration-250 hover:brightness-105 disabled:opacity-50"
      >
        {isLoading
          ? locale === 'ar'
            ? 'جاري الإرسال...'
            : 'Sending...'
          : tCta('sendMessage')}
      </button>
    </form>
  );
}
