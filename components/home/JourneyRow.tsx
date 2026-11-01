"use client";

import { useRef } from "react";
import { JourneyCard } from "@/components/journeys/JourneyCard";
import { ArrowLink } from "@/components/ui/Links";
import { journeys } from "@/data/journeys";
import type { ImageRef } from "@/types/content";

/** Dark showcase band of tall, photo-led journey cards that scroll sideways. */
export function JourneyRow({ images }: { images: Record<string, ImageRef | undefined> }) {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: direction * ((card?.clientWidth ?? 400) + 24), behavior: "smooth" });
  };

  return (
    <section aria-labelledby="journeys-title" className="bg-polar py-24 text-birch-50 md:py-32">
      <div className="gutter grid-12 items-end gap-y-6">
        <div className="col-span-12 md:col-span-8">
          <p className="eyebrow text-birch-50/70">Journeys</p>
          <h2 id="journeys-title" className="mt-4 font-serif text-[clamp(2.5rem,1.6rem+3.6vw,5rem)] font-light leading-[1] tracking-[-0.02em]">
            Eight ways to go <em>slowly.</em>
          </h2>
        </div>
        <div className="col-span-12 flex items-center gap-3 md:col-span-4 md:justify-end">
          <ArrowLink href="/journeys">All journeys</ArrowLink>
          <div className="ml-auto flex gap-2 md:ml-4">
            <button type="button" onClick={() => scroll(-1)} aria-label="Previous journeys" className="flex size-10 items-center justify-center rounded-full border border-birch-50/40 hover:border-birch-50">
              ←
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label="Next journeys" className="flex size-10 items-center justify-center rounded-full border border-birch-50/40 hover:border-birch-50">
              →
            </button>
          </div>
        </div>
      </div>
      <ul
        ref={track}
        className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[clamp(1.25rem,5vw,5.5rem)] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollPaddingInline: "clamp(1.25rem, 5vw, 5.5rem)" }}
      >
        {journeys.map((j) => (
          <li key={j.slug} className="w-[85vw] shrink-0 snap-start sm:w-[46vw] lg:w-[34vw] xl:w-[30vw]">
            <JourneyCard journey={j} image={images[j.slug]} variant="overlay" />
          </li>
        ))}
      </ul>
    </section>
  );
}
