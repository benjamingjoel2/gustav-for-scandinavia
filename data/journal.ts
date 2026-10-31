import type { JournalMeta } from "@/types/content";
import { destinationImage, experienceImage } from "./images";

/** Journal posts live in content/journal/<slug>.mdx; this is their order and slugs. */
export const journalSlugs = ["midnight-sun-or-northern-lights", "oslo-to-bergen-why-the-train-wins", "sauna-like-a-finn", "scandinavia-without-flying"] as const;

export type JournalSlug = (typeof journalSlugs)[number];

export async function loadPost(slug: JournalSlug) {
  const mod = await import(`../content/journal/${slug}.mdx`);
  return { Content: mod.default, meta: mod.meta as JournalMeta };
}

export async function allPosts() {
  const posts = await Promise.all(journalSlugs.map(async (slug) => ({ slug, ...(await loadPost(slug)) })));
  return posts.sort((a, b) => b.meta.date.localeCompare(a.meta.date));
}

/** "experience:sauna" or "destination:bergen" → image */
export function journalImage(key: string) {
  const [kind, id] = key.split(":");
  return kind === "experience" ? experienceImage(id) : destinationImage(id);
}
