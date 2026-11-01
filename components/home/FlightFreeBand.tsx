import { GhostLink } from "@/components/ui/Links";
import { Photo } from "@/components/ui/Photo";
import { experienceImage } from "@/data/images";

export function FlightFreeBand() {
  return (
    <section aria-labelledby="flight-free-title" className="relative isolate flex min-h-[75svh] items-end overflow-hidden bg-polar text-birch-50">
      <Photo image={experienceImage("coastal-voyage")} sizes="100vw" className="-z-20" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(16_27_33/0.85)_0%,rgb(16_27_33/0.55)_45%,rgb(16_27_33/0.1)_100%)]" />
      <div className="gutter grid-12 w-full gap-y-6 pb-16 pt-32 md:pb-24">
        <p className="eyebrow col-span-12 text-birch-50/80">Travelling lighter</p>
        <h2 id="flight-free-title" className="col-span-12 max-w-4xl font-serif text-[clamp(2.5rem,1.6rem+3.6vw,5rem)] font-light leading-[1] tracking-[-0.02em] md:col-span-9">
          From Copenhagen to the Arctic <em>without leaving the ground.</em>
        </h2>
        <p className="col-span-12 font-sans text-lg leading-relaxed text-birch-50/85 md:col-span-6">
          Flight-free is a setting in our route builder, not a slogan. Rail and sea reach almost everywhere we go. Where flying is the only sensible
          option, as it is for Svalbard, we will say so.
        </p>
        <div className="col-span-12 mt-4 flex flex-wrap gap-3">
          <GhostLink href="/route-builder">Build a slow route</GhostLink>
          <GhostLink href="/travelling-lighter" className="border-transparent">
            Our approach to travelling lighter →
          </GhostLink>
        </div>
      </div>
    </section>
  );
}
