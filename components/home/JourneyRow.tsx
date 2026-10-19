"use client";

import { useRef } from "react";
import { JourneyCard } from "@/components/journeys/JourneyCard";
import { ArrowLink } from "@/components/ui/Links";
import { journeys } from "@/data/journeys";

/** Horizontally scrolling journey cards with mono details. */
export function JourneyRow() {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: direction * ((card?.clientWidth ?? 400) + 24), behavior: "smooth" });
  };

  return (
    <section aria-labelledby="journeys-title" className="py-24 md:py-32">
      <div className="gutter grid-12 items-end gap-y-6">
        <div className="col-span-12 md:col-span-8">
          <p className="eyebrow text-stone">Journeys</p>
          <h2 id="journeys-title" className="headline mt-4">
            Eight ways to go <em>slowly.</em>
          </h2>
        </div>
        <div className="col-span-12 flex items-center gap-3 md:col-span-4 md:justify-end">
          <ArrowLink href="/journeys">All journeys</ArrowLink>
          <div className="ml-auto flex gap-2 md:ml-4">
            <button type="button" onClick={() => scroll(-1)} aria-label="Previous journeys" className="flex size-10 items-center justify-center rounded-full border border-ink/40 hover:border-ink">
              ←
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label="Next journeys" className="flex size-10 items-center justify-center rounded-full border border-ink/40 hover:border-ink">
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
          <li key={j.slug} className="w-[80vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw] xl:w-[26vw]">
            <JourneyCard journey={j} />
          </li>
        ))}
      </ul>
    </section>
  );
}
