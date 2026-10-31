import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { destinations } from "@/data/destinations";
import { journalSlugs } from "@/data/journal";
import { journeys } from "@/data/journeys";
import { LOCALES, languageAlternates, localePath } from "@/lib/i18n-paths";

const staticPaths = ["", "/journeys", "/destinations", "/experiences", "/light-calendar", "/route-builder", "/black-book", "/sapmi", "/travelling-lighter", "/about", "/journal", "/enquire", "/faq", "/privacy", "/terms", "/cookies"];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  const entries = [
    ...staticPaths.map((p) => ({ url: url(p), changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...journeys.map((j) => ({ url: url(`/journeys/${j.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...destinations.map((d) => ({ url: url(`/destinations/${d.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...journalSlugs.map((s) => ({ url: url(`/journal/${s}`), changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
  // Every page in every language, each with its hreflang alternates.
  return entries.flatMap((e) => {
    const path = e.url.slice(site.url.length) || "/";
    const languages = Object.fromEntries(Object.entries(languageAlternates(path)).map(([k, v]) => [k, url(v === "/" ? "" : v)]));
    return LOCALES.map((l) => {
      const p = localePath(path, l);
      return { ...e, url: url(p === "/" ? "" : p), alternates: { languages } };
    });
  });
}
