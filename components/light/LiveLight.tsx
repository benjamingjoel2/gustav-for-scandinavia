"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { GhostLink, PillLink } from "@/components/ui/Links";
import { Photo, preloadPhoto } from "@/components/ui/Photo";
import { site } from "@/config/site";
import { heroImages } from "@/data/media";
import { getPlace, liveLightPlaceIds } from "@/data/places";
import { HORIZON_DEPRESSION, formatDuration, getLocalDate, getSolarElevation, getSunTimes } from "@/lib/solar";

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
  return { place, times, image };
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
 * Homepage hero: full-screen photographs rotating through five places, with today's real daylight there
 * (calculated from latitude and longitude) as a quiet caption.
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

  const { place, times, image } = lightAt(index, now);
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
  useEffect(() => {
    if (loaded && upcoming) preloadPhoto(upcoming, "100vw", "low");
  }, [loaded, upcoming]);

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
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-polar text-birch-50"
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
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(16_27_33/0.5)_0%,rgb(16_27_33/0.05)_30%,rgb(16_27_33/0.2)_55%,rgb(16_27_33/0.85)_100%)]" />

      <div className="gutter pb-8 pt-40 md:pb-10">
        <p className="eyebrow text-birch-50/85">Private journeys through Scandinavia and Finland</p>
        <h1 className="mt-6 max-w-5xl text-balance font-serif text-[clamp(3.25rem,1.5rem+7vw,9rem)] font-light leading-[0.92] tracking-[-0.03em]">
          The North, <em>slowly.</em>
          <span className="sr-only">
            {" "}
            {site.name}: {site.tagline}
          </span>
        </h1>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <PillLink href="/journeys" className="px-7 py-3.5 text-base">
            Explore journeys
          </PillLink>
          <GhostLink href="/enquire">Plan a journey</GhostLink>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-birch-50/25 pt-5 md:mt-24">
          <AnimatePresence mode="wait" initial={false}>
            <m.p
              key={place.id}
              aria-live="off"
              className="font-sans text-[0.9375rem] text-birch-50/90 [&_em]:not-italic [&_em]:text-birch-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.6, ease: EASE }}
            >
              <Sentence name={place.name} times={times} />
            </m.p>
          </AnimatePresence>
          <ul className="flex flex-wrap gap-x-1 gap-y-2 md:ml-auto" aria-label="Choose a place">
            {liveLightPlaceIds.map((id, i) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => choose(i)}
                  aria-pressed={i === index}
                  className="meta border-b border-transparent px-2 py-1.5 text-birch-50/70 transition-colors duration-500 hover:text-birch-50 aria-pressed:border-birch-50 aria-pressed:text-birch-50"
                >
                  {getPlace(id).name}
                </button>
              </li>
            ))}
            {!reduceMotion && (
              <li>
                <button type="button" onClick={() => setPaused((p) => !p)} className="meta px-2 py-1.5 text-birch-50/70 hover:text-birch-50">
                  {paused ? "▶ Play" : "❚❚ Pause"}
                  <span className="sr-only"> rotating places</span>
                </button>
              </li>
            )}
          </ul>
        </div>
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>
      </div>
    </section>
  );
}
