"use client";

import { useState } from "react";
import { journeys } from "@/data/journeys";
import { JourneyCard } from "./JourneyCard";

const filters = [
  { id: "all", label: "All", test: () => true },
  { id: "flight-free", label: "Flight-free", test: (j: (typeof journeys)[number]) => j.flightFree },
  { id: "winter", label: "Winter light", test: (j: (typeof journeys)[number]) => j.bestMonths.some((m) => [11, 12, 1, 2, 3].includes(m)) },
  { id: "summer", label: "Summer light", test: (j: (typeof journeys)[number]) => j.bestMonths.some((m) => [5, 6, 7, 8].includes(m)) },
] as const;

export function JourneyGrid() {
  const [active, setActive] = useState<(typeof filters)[number]["id"]>("all");
  const shown = journeys.filter(filters.find((f) => f.id === active)!.test);
  return (
    <>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter journeys">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={active === f.id}
            onClick={() => setActive(f.id)}
            className="rounded-full border border-ink/30 px-4 py-1.5 font-sans text-sm hover:border-ink aria-pressed:border-pine aria-pressed:bg-pine aria-pressed:text-birch-50"
          >
            {f.label}
          </button>
        ))}
        <p className="meta ml-auto text-stone" aria-live="polite">
          {shown.length} {shown.length === 1 ? "journey" : "journeys"}
        </p>
      </div>
      <ul className="mt-10 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((j) => (
          <li key={j.slug}>
            <JourneyCard journey={j} />
          </li>
        ))}
      </ul>
    </>
  );
}
