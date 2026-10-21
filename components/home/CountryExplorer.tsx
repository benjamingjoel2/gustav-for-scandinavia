"use client";

import Link from "next/link";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useRef, useState, type KeyboardEvent } from "react";
import { Photo } from "@/components/ui/Photo";
import { ArrowLink } from "@/components/ui/Links";
import { countries } from "@/data/countries";
import { destinationsIn } from "@/data/destinations";
import { getPlace, type PlaceId } from "@/data/places";
import { formatCoords, formatMonths } from "@/lib/format";
import { countryTone, toneClasses } from "@/lib/tones";
import type { CountryId, ImageRef } from "@/types/content";

/**
 * Colour-blocked destinations: pick a country (the block takes its colour),
 * then hover or focus a place to bring up its photograph.
 */
export function CountryExplorer({ images }: { images: Record<string, ImageRef | undefined> }) {
  const reduceMotion = useReducedMotion();
  const [country, setCountry] = useState<CountryId>("norway");
  const list = destinationsIn(country);
  const [activeSlug, setActiveSlug] = useState(list[0].slug);
  const active = list.find((d) => d.slug === activeSlug) ?? list[0];
  const place = getPlace(active.placeId as PlaceId);
  const image = images[active.slug];
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (id: CountryId) => {
    setCountry(id);
    setActiveSlug(destinationsIn(id)[0].slug);
  };

  const onTabKey = (e: KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? countries.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const index = (next + countries.length) % countries.length;
    select(countries[index].id);
    tabs.current[index]?.focus();
  };

  const info = countries.find((c) => c.id === country)!;

  return (
    <section aria-labelledby="where-title" className={`transition-colors duration-700 ease-light ${toneClasses[countryTone[country]]}`}>
      <div className="gutter grid-12 gap-y-10 py-20 md:py-28">
        <div className="col-span-12 lg:col-span-5">
          <p className="eyebrow opacity-90">Where Gustav goes</p>
          <h2 id="where-title" className="headline mt-4">
            Four countries, <em>one north.</em>
          </h2>

          <div role="tablist" aria-label="Countries" className="mt-10 flex flex-wrap gap-x-1 gap-y-2">
            {countries.map((c, i) => (
              <button
                key={c.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`tab-${c.id}`}
                aria-selected={c.id === country}
                aria-controls="country-panel"
                tabIndex={c.id === country ? 0 : -1}
                onClick={() => select(c.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className="rounded-full border border-current/40 px-4 py-1.5 font-sans text-sm transition-colors aria-selected:border-current aria-selected:bg-birch-50 aria-selected:text-ink"
              >
                {c.name}
              </button>
            ))}
          </div>

          <div id="country-panel" role="tabpanel" aria-labelledby={`tab-${country}`}>
            <p className="lede mt-8 max-w-md opacity-90">{info.pitch}</p>
            <ul className="mt-8 border-t border-current/30">
              {list.map((d, i) => (
                <li key={d.slug} className="border-b border-current/30">
                  <Link
                    href={`/destinations/${d.slug}`}
                    onMouseEnter={() => setActiveSlug(d.slug)}
                    onFocus={() => setActiveSlug(d.slug)}
                    aria-current={d.slug === active.slug ? "true" : undefined}
                    className="group flex items-baseline gap-4 py-3 opacity-90 transition-opacity duration-500 hover:opacity-100 focus-visible:opacity-100 aria-[current=true]:opacity-100 aria-[current=true]:[&_.font-sans]:italic"
                  >
                    <span className="meta w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-sans text-lg">{d.name}</span>
                    <span className="meta ml-auto hidden text-right sm:block">{d.region}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <ArrowLink href={`/destinations#${country}`} className="mt-8">
              All of {info.name}
            </ArrowLink>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <div className="relative aspect-[4/3] overflow-hidden bg-black/10 lg:sticky lg:top-24 lg:aspect-[4/5]">
            <AnimatePresence initial={false}>
              <m.div
                key={active.slug}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <Photo image={image} sizes="(min-width: 1024px) 45vw, 100vw" />
              </m.div>
            </AnimatePresence>
          </div>
          <div className="mt-4 flex flex-wrap justify-between gap-2">
            <p className="meta">
              {active.name} · {formatCoords(place.lat, place.lng)}
            </p>
            <p className="meta opacity-90">Best {formatMonths(active.bestMonths)}</p>
          </div>
          <p className="mt-3 max-w-lg opacity-90">{active.pitch}</p>
        </div>
      </div>
    </section>
  );
}
