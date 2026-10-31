import { currencies, type Currency } from "@/config/currency";
import { intlLocale } from "@/lib/i18n-paths";
import { locale } from "@/lib/locale";

export function convertFromEUR(amountEUR: number, currency: Currency): number {
  const { rate, round } = currencies[currency];
  return Math.round((amountEUR * rate) / round) * round;
}

export function formatPrice(amountEUR: number, currency: Currency): string {
  return new Intl.NumberFormat(locale === "en" ? currencies[currency].locale : intlLocale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(convertFromEUR(amountEUR, currency));
}
