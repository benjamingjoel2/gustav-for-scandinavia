import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { destinations } from "@/data/destinations";
import { journalSlugs } from "@/data/journal";
import { journeys } from "@/data/journeys";

const staticPaths = ["", "/journeys", "/destinations", "/experiences", "/light-calendar", "/route-builder", "/black-book", "/sapmi", "/travelling-lighter", "/about", "/journal", "/enquire", "/faq", "/legal"];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  return [
    ...staticPaths.map((p) => ({ url: url(p), changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...journeys.map((j) => ({ url: url(`/journeys/${j.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...destinations.map((d) => ({ url: url(`/destinations/${d.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...journalSlugs.map((s) => ({ url: url(`/journal/${s}`), changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
