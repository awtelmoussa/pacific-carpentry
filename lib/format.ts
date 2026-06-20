// Pacific Carpentry — Currency formatting
// Ported from shared.js

const CURRENCY = { en: "AED", ar: "د.إ" };

export function fmt(price: number, locale: string): string {
  const n = Number(price).toLocaleString(locale === "ar" ? "ar-AE" : "en-US");
  return locale === "ar" ? `${n} ${CURRENCY.ar}` : `${CURRENCY.en} ${n}`;
}
