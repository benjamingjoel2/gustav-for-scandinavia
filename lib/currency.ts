import { currencies, type Currency } from "@/config/currency";

export function convertFromEUR(amountEUR: number, currency: Currency): number {
  const { rate, round } = currencies[currency];
  return Math.round((amountEUR * rate) / round) * round;
}

export function formatPrice(amountEUR: number, currency: Currency): string {
  return new Intl.NumberFormat(currencies[currency].locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(convertFromEUR(amountEUR, currency));
}
