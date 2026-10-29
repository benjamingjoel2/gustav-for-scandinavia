"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { SunPath } from "@/components/horizon/SunPath";
import { Photo } from "@/components/ui/Photo";
import { journeys } from "@/data/journeys";
import { momentsIn } from "@/data/light-moments";
import { calendarPlaceIds, getPlace, type PlaceId } from "@/data/places";
import { monthName } from "@/lib/format";
import { formatDuration, getSunTimes, type LocalDate } from "@/lib/solar";
import type { ImageRef } from "@/types/content";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";


const DAY_MS = 86_400_000;
const MONTH_STARTS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

function dayToDate(year: number, dayOfYear: number): LocalDate {
  const d = new Date(Date.UTC(year, 0, 1) + dayOfYear * DAY_MS);
  return { year, month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

function label(day: LocalDate) {
  return `${day.day} ${monthName(day.month, "long")}`;
}

function daylightText(placeId: PlaceId, day: LocalDate) {
  const place = getPlace(placeId);
  const t = getSunTimes(day, place.lat, place.lng);
  if (t.state === "midnight-sun") return "Midnight sun";
  if (t.state === "polar-night") return "Polar night";
  return formatDuration(t.daylightMinutes);
}

/**
 * Drag through the year and watch the light change, south to north.
 * Works with the slider's arrow keys (a day), Page Up/Down (a month), Home/End, or the month buttons.
 */
export function LightCalendar({ year, initialDay, momentImages }: { year: number; initialDay: number; momentImages: Record<string, ImageRef | undefined> }) {
  const reduceMotion = usePrefersReducedMotion();
  const [dayOfYear, setDayOfYear] = useState(initialDay);
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number | null>(null);
  const day = dayToDate(year, dayOfYear);
  const moments = momentsIn(day.month);

  useEffect(() => {
    if (!playing) return;
    let last = 0;
    const step = (t: number) => {
      if (t - last > 60) {
        last = t;
        setDayOfYear((d) => (d + 2) % 365);
      }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing]);

  const onSliderKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      const m = day.month - 1 + (e.key === "PageUp" ? 1 : -1);
      setDayOfYear(MONTH_STARTS[(m + 12) % 12] + 14);
    }
  };

  return (
    <div>
      <div className="gutter sticky top-16 z-20 border-b border-birch-50/15 bg-polar/95 pb-5 pt-6 backdrop-blur md:top-[4.5rem]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="font-sans text-title font-light" aria-hidden>
            {label(day)}
          </p>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="meta border border-birch-50/50 px-3 py-2 hover:border-birch-50"
            hidden={!!reduceMotion}
          >
            {playing ? "❚❚ Pause" : "▶ Play the year"}
          </button>
        </div>
        <label htmlFor="light-day" className="sr-only">
          Day of the year
        </label>
        <input
          id="light-day"
          type="range"
          min={0}
          max={364}
          step={1}
          value={dayOfYear}
          onChange={(e) => {
            setPlaying(false);
            setDayOfYear(Number(e.target.value));
          }}
          onKeyDown={onSliderKey}
          aria-valuetext={label(day)}
          className="mt-5 w-full cursor-ew-resize accent-[var(--color-oak)]"
        />
        <div className="mt-2 grid grid-cols-12" role="group" aria-label="Jump to month">
          {MONTH_STARTS.map((start, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setPlaying(false);
                setDayOfYear(start + 14);
              }}
              aria-pressed={day.month === i + 1}
              className="meta py-1 text-left text-birch-50/80 hover:text-birch-50 aria-pressed:text-birch-50"
            >
              <span aria-hidden>{monthName(i + 1).slice(0, 1)}</span>
              <span className="hidden sm:inline" aria-hidden>
                {monthName(i + 1).slice(1)}
              </span>
              <span className="sr-only">{monthName(i + 1, "long")}</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="border-b border-birch-50/15">
        {calendarPlaceIds.map((id) => {
          const place = getPlace(id);
          return (
            <li key={id} className="grid border-t border-birch-50/15 first:border-t-0 md:grid-cols-12 md:items-center">
              <div className="gutter flex items-baseline justify-between gap-4 pt-4 md:col-span-3 md:block md:py-4 md:pr-0">
                <p className="font-sans text-lg">{place.name}</p>
                <p className="meta text-birch-50/80 md:mt-1">
                  {place.lat.toFixed(1)}°N · {daylightText(id, day)}
                </p>
              </div>
              <SunPath place={place} day={day} height={84} labels={false} className="md:col-span-9" />
            </li>
          );
        })}
      </ul>

      <section aria-labelledby="moments-title" className="gutter py-16" aria-live="polite">
        <h2 id="moments-title" className="eyebrow text-birch-50/80">
          What {monthName(day.month, "long")}&rsquo;s light makes possible
        </h2>
        <ul className="mt-8 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {moments.map((m) => (
            <li key={m.id} className="border-t border-birch-50/25 pt-5">
              {momentImages[m.id] && (
                <div className="relative mb-5 aspect-[4/3] overflow-hidden bg-black/20">
                  <Photo image={momentImages[m.id]} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 100vw" />
                </div>
              )}
              <p className="meta text-oak">{m.where}</p>
              <h3 className="mt-3 font-serif text-2xl font-light">{m.label}</h3>
              <p className="mt-3 text-birch-50/85">{m.text}</p>
              <ul className="mt-4 space-y-1">
                {m.journeySlugs.map((slug) => {
                  const j = journeys.find((x) => x.slug === slug);
                  return j ? (
                    <li key={slug}>
                      <Link href={`/journeys/${slug}`} className="link-dotted">
                        {j.title} →
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
