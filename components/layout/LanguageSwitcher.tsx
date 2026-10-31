"use client";
// i18n-skip-strings

import { usePathname } from "next/navigation";
import { locale } from "@/lib/locale";
import { LOCALES, LOCALE_LABELS, localePath } from "@/lib/i18n-paths";

const NAV_LABEL = { en: "Language", fr: "Langue", de: "Sprache", es: "Idioma" } as const;

/** EN · FR · DE · ES: plain links to the same page in each language. No automatic redirects. */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname() || "/";
  return (
    <nav aria-label={NAV_LABEL[locale]} className={`flex items-center font-mono text-xs uppercase tracking-[0.1em] ${className}`}>
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className="px-1 opacity-50">
              ·
            </span>
          )}
          {l === locale ? (
            <span aria-current="true" lang={l} title={LOCALE_LABELS[l]} className="border-b border-current px-0.5">
              {l.toUpperCase()}
            </span>
          ) : (
            <a
              href={localePath(pathname, l)}
              hrefLang={l}
              lang={l}
              title={LOCALE_LABELS[l]}
              className="px-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              {l.toUpperCase()}
            </a>
          )}
        </span>
      ))}
    </nav>
  );
}
