// i18n-skip-strings
/** Languages and URL helpers. English lives at the root, the others under /fr, /de, /es (see scripts/i18n.mjs). */
import { locale } from "./locale";

export const LOCALES = ["en", "fr", "de", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_LABELS: Record<Locale, string> = { en: "English", fr: "Français", de: "Deutsch", es: "Español" };
export const OG_LOCALES: Record<Locale, string> = { en: "en_GB", fr: "fr_FR", de: "de_DE", es: "es_ES" };
/** Locale used for Intl number and date formatting. */
export const INTL_LOCALES: Record<Locale, string> = { en: "en-GB", fr: "fr-FR", de: "de-DE", es: "es-ES" };
export const intlLocale = INTL_LOCALES[locale];

/** "/fr/journeys/x" -> "/journeys/x" */
export function stripLocale(path: string): string {
  const m = path.match(/^\/(fr|de|es)(?=\/|$|\?|#)/);
  if (!m) return path || "/";
  const rest = path.slice(m[0].length);
  return rest.startsWith("/") ? rest : "/" + rest;
}

/** The same page in another language. */
export function localePath(path: string, l: Locale): string {
  const base = stripLocale(path);
  if (l === DEFAULT_LOCALE) return base;
  return base === "/" ? `/${l}` : `/${l}${base}`;
}

/** hreflang alternates for a page (path in any language). */
export function languageAlternates(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of LOCALES) out[l] = localePath(path, l);
  out["x-default"] = localePath(path, DEFAULT_LOCALE);
  return out;
}

/** Canonical (this language) plus hreflang alternates, for `metadata.alternates`. */
export function alternatesFor(path: string) {
  return { canonical: localePath(path, locale), languages: languageAlternates(path) };
}
