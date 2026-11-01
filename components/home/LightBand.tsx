import { GhostLink } from "@/components/ui/Links";
import { Photo } from "@/components/ui/Photo";
import { experienceImage } from "@/data/images";

/** Full-bleed photograph introducing the Light Calendar: what the season does, not the data behind it. */
export function LightBand() {
  return (
    <section aria-labelledby="light-title" className="relative isolate flex min-h-[80svh] items-center overflow-hidden bg-polar text-birch-50">
      <Photo image={experienceImage("midnight-sun")} sizes="100vw" className="-z-20" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-polar/80 via-polar/35 to-transparent" />
      <div className="gutter w-full py-24">
        <p className="eyebrow text-birch-50/80">The Light Calendar</p>
        <h2 id="light-title" className="mt-5 max-w-3xl font-serif text-[clamp(2.5rem,1.6rem+3.6vw,5rem)] font-light leading-[1] tracking-[-0.02em]">
          Midnight sun or northern lights. <em>Choose your light.</em>
        </h2>
        <p className="mt-6 max-w-md font-sans text-lg leading-relaxed text-birch-50/85">
          The same fjord is a different journey in June and in January. We plan the season first, then everything else.
        </p>
        <GhostLink href="/light-calendar" className="mt-10">
          Open the Light Calendar
        </GhostLink>
      </div>
    </section>
  );
}
