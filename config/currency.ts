/** Static, editable conversion rates from EUR. Prices are shown as approximate. Last reviewed: October 2026. */
export const currencies = {
  EUR: { rate: 1, round: 50, locale: "en-IE" },
  NOK: { rate: 11.6, round: 500, locale: "nb-NO" },
  SEK: { rate: 11.0, round: 500, locale: "sv-SE" },
  DKK: { rate: 7.46, round: 500, locale: "da-DK" },
  GBP: { rate: 0.87, round: 50, locale: "en-GB" },
  USD: { rate: 1.16, round: 50, locale: "en-US" },
} as const;

export type Currency = keyof typeof currencies;
export const currencyCodes = Object.keys(currencies) as Currency[];
