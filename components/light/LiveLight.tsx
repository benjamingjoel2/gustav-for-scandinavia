"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { SunPath } from "@/components/horizon/SunPath";
import { DottedLink } from "@/components/ui/Links";
import { Photo } from "@/components/ui/Photo";
import { site } from "@/config/site";
import { heroImages } from "@/data/media";
import { getPlace, liveLightPlaceIds } from "@/data/places";
import { formatCoords, localMinuteOfDay } from "@/lib/format";
import { HORIZON_DEPRESSION, formatDuration, formatTime, getLocalDate, getSolarElevation, getSunTimes } from "@/lib/solar";

const ROTATE_MS = 8000;
const EASE = [0.22, 0.61, 0.36, 1] as const;

function lightAt(index: number, now: number) {
  const place = getPlace(liveLightPlaceIds[index]);
  const date = new Date(now);
  const day = getLocalDate(date, place.tz);
  const times = getSunTimes(day, place.lat, place.lng);
  // Dark-season photographs in the dark months, and whenever the sun is down there right now.
  const sunDown = getSolarElevation(date, place.lat, place.lng) < -HORIZON_DEPRESSION;
  const dark = sunDown || times.daylightMinutes < site.darkSeasonThresholdMinutes;
  const image = heroImages[liveLightPlaceIds[index]]?.[dark ? "dark" : "light"];
  return { place, day, times, dark, image, minute: localMinuteOfDay(date, place.tz) };
}

function Sentence({ name, times }: { name: string; times: ReturnType<typeof getSunTimes> }) {
  if (times.state === "midnight-sun")
    return (
      <>
        Right now in {name}: <em>the sun doesn&rsquo;t set</em> today.
      </>
    );
  if (times.state === "polar-night")
    return (
      <>
        Right now in {name}: <em>the sun doesn&rsquo;t rise</em> today. Around noon, the light turns blue.
      </>
    );
  return (
    <>
      Right now in {name}: <em>{formatDuration(times.daylightMinutes)}</em> of daylight today.
    </>
  );
}

/**
 * Homepage hero. Rotates through five places, showing today's real daylight, calculated from latitude and longitude.
 * `initialNow` comes from the server so the first client render matches; the clock then updates every minute.
 */
export function LiveLight({ initialNow }: { initialNow: number }) {
  const reduceMotion = useReducedMotion();
  const [now, setNow] = useState(initialNow);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const clock = setInterval(tick, 60_000);
    return () => {
      clearTimeout(first);
      clearInterval(clock);
    };
  }, []);

  const rotating = !paused && !hovering && !reduceMotion;
  useEffect(() => {
    if (!rotating) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % liveLightPlaceIds.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [rotating]);

  const { place, day, times, image, minute } = lightAt(index, now);
  useEffect(() => {
    const onLoad = () => setLoaded(true);
    if (document.readyState === "complete") {
      const id = setTimeout(onLoad);
      return () => clearTimeout(id);
    }
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
  // Once the page has loaded, fetch the next slide's photograph ahead of time, so it is ready when the slide changes.
  const upcoming = lightAt((index + 1) % liveLightPlaceIds.length, now).image;

  const choose = (i: number) => {
    setIndex(i);
    setPaused(true);
    const next = lightAt(i, now);
    setAnnouncement(
      next.times.state === "normal"
        ? `${next.place.name}: ${formatDuration(next.times.daylightMinutes)} of daylight today.`
        : `${next.place.name}: ${next.times.state === "midnight-sun" ? "the sun doesn't set today" : "the sun doesn't rise today"}.`,
    );
  };

  const fade = { duration: reduceMotion ? 0 : 1.4, ease: EASE };

  return (
    <section
      aria-label="Live light"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-polar text-birch-50"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
    >
      <AnimatePresence initial={false}>
        {image && (
          <m.div key={image.src} className="absolute inset-0 -z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fade}>
            <Photo image={image} sizes="100vw" eager={index === 0} />
          </m.div>
        )}
      </AnimatePresence>
      {loaded && upcoming && upcoming.src !== image?.src && (
        <div className="absolute inset-0 -z-20 opacity-0">
          <Photo image={upcoming} sizes="100vw" background />
        </div>
      )}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(16_27_33/0.45)_0%,rgb(16_27_33/0.05)_35%,rgb(16_27_33/0.25)_55%,rgb(16_27_33/0.8)_100%)]" />

      <div className="gutter pt-24 md:pt-28">
        <h1 className="font-sans text-display font-light lowercase">
          gustav<span className="sr-only"> — {site.tagline}</span>
        </h1>
      </div>

      <div className="flex-1" />

      <AnimatePresence mode="wait" initial={false}>
        <m.div key={place.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.6, ease: EASE }}>
          <SunPath place={place} day={day} markerMinute={minute} height={110} labels={false} />
        </m.div>
      </AnimatePresence>

      <div className="gutter grid-12 gap-y-6 pb-8 pt-6 md:pb-10">
        <div className="col-span-12 lg:col-span-8">
          <p className="lede text-balance" aria-live="off">
            <Sentence name={place.name} times={times} />
          </p>
          <p className="meta mt-3 text-birch-50/80">
            {formatCoords(place.lat, place.lng)}
            {times.sunrise && times.sunset && (
              <>
                {" · "}Sunrise {formatTime(times.sunrise, place.tz)} · Sunset {formatTime(times.sunset, place.tz)}
              </>
            )}
            {" · "}
            {formatTime(new Date(now), place.tz)} local
          </p>
        </div>

        <div className="col-span-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 lg:col-span-4 lg:flex-col lg:items-end lg:justify-end">
          <DottedLink href="#intro">Discover Gustav ↓</DottedLink>
        </div>

        <div className="col-span-12 flex flex-wrap items-center gap-x-1 gap-y-2 border-t border-birch-50/25 pt-4">
          <ul className="flex flex-wrap gap-x-1 gap-y-2" aria-label="Choose a place">
            {liveLightPlaceIds.map((id, i) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => choose(i)}
                  aria-pressed={i === index}
                  className="meta border border-transparent px-2.5 py-1.5 text-birch-50/80 transition-colors duration-500 hover:text-birch-50 aria-pressed:border-birch-50/60 aria-pressed:text-birch-50"
                >
                  {getPlace(id).name}
                </button>
              </li>
            ))}
          </ul>
          {!reduceMotion && (
            <button type="button" onClick={() => setPaused((p) => !p)} className="meta ml-auto px-2.5 py-1.5 text-birch-50/80 hover:text-birch-50">
              {paused ? "▶ Play" : "❚❚ Pause"}
              <span className="sr-only"> rotating places</span>
            </button>
          )}
          {image && (
            <a href={image.creditUrl} className="meta w-full text-[0.625rem] text-birch-50/80 hover:text-birch-50 sm:ml-4 sm:w-auto" rel="noopener">
              Photo: {image.credit}
            </a>
          )}
        </div>
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>
      </div>
    </section>
  );
}
