"use client";

import { useMemo, useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { Tag } from "@/components/ui/Tag";
import { blackBook } from "@/data/blackbook";
import { destinations } from "@/data/destinations";
import type { ImageRef, Theme } from "@/types/content";

const themeLabel: Record<Theme, string> = {
  restaurant: "Restaurants",
  bakery: "Bakeries",
  sauna: "Saunas",
  design: "Design",
  architecture: "Architecture",
  cabin: "Cabins",
  island: "Islands",
  gallery: "Galleries",
};

const placeName = (slug: string) => destinations.find((d) => d.slug === slug)?.name ?? slug;

/** Filter the Black Book by place and theme. Plain buttons, a live count, and a list. */
export function BlackBook({ themeImages }: { themeImages: Record<Theme, ImageRef[]> }) {
  const [place, setPlace] = useState<string>("all");
  const [theme, setTheme] = useState<Theme | "all">("all");

  const placeSlugs = useMemo(() => [...new Set(blackBook.map((b) => b.destinationSlug))], []);
  const themes = useMemo(() => [...new Set(blackBook.map((b) => b.theme))], []);
  const shown = blackBook.filter((b) => (place === "all" || b.destinationSlug === place) && (theme === "all" || b.theme === theme));

  const chip = "rounded-full border border-ink/30 px-3.5 py-1.5 font-sans text-sm hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-birch-50";

  return (
    <>
      <div className="space-y-5 border-y border-ink/15 py-6">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by place">
          <span className="meta w-20 text-stone">Place</span>
          <button type="button" aria-pressed={place === "all"} onClick={() => setPlace("all")} className={chip}>
            Everywhere
          </button>
          {placeSlugs.map((slug) => (
            <button key={slug} type="button" aria-pressed={place === slug} onClick={() => setPlace(slug)} className={chip}>
              {placeName(slug)}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Filter by theme">
          <div className="mb-3 flex items-center gap-2">
            <span className="meta w-20 text-stone">Theme</span>
            <button type="button" aria-pressed={theme === "all"} onClick={() => setTheme("all")} className={chip}>
              Everything
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {themes.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={theme === t}
                onClick={() => setTheme(theme === t ? "all" : t)}
                className="group relative aspect-[4/5] overflow-hidden bg-birch-200 text-left text-birch-50 outline-offset-2 aria-pressed:outline aria-pressed:outline-2 aria-pressed:outline-ink"
              >
                <Photo image={themeImages[t][0]} sizes="(min-width: 1024px) 12vw, (min-width: 640px) 24vw, 48vw" className="transition-transform duration-[1.2s] ease-light group-hover:scale-105" />
                <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgb(16_27_33/0.75))]" />
                <span className="absolute inset-x-3 bottom-3 font-sans text-sm">{themeLabel[t]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {theme !== "all" && (
        <div className="mt-8 grid grid-cols-12 gap-4">
          {themeImages[theme].map((img, i) => (
            <figure key={img.src} className={i === 0 ? "col-span-12 md:col-span-7" : "col-span-8 md:col-span-4 md:col-start-9 md:mt-12"}>
              <div className={`relative overflow-hidden bg-birch-200 ${i === 0 ? "aspect-[3/2]" : "aspect-[4/5]"}`}>
                <Photo image={img} sizes="(min-width: 768px) 50vw, 100vw" />
              </div>
            </figure>
          ))}
        </div>
      )}
      <p className="meta mt-6 text-stone" aria-live="polite">
        {shown.length} {shown.length === 1 ? "entry" : "entries"}
      </p>
      {shown.length === 0 ? (
        <p className="mt-8 text-stone">Nothing here yet for that combination. Ask us; the book is longer than the website.</p>
      ) : (
        <ul className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((b) => (
            <li key={b.id} className="border-t border-ink pt-4">
              <p className="meta flex flex-wrap items-center gap-2 text-stone">
                <span>{themeLabel[b.theme]}</span>
                <span aria-hidden>·</span>
                <span>{b.city}</span>
              </p>
              <h3 className="mt-3 font-sans text-xl">{b.name}</h3>
              <p className="mt-2">{b.note}</p>
              <Tag className="mt-4 text-stone">Placeholder, to be verified</Tag>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
