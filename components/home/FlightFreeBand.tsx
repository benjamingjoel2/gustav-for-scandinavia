import { ArrowLink, DottedLink } from "@/components/ui/Links";

const stops = ["Copenhagen", "Stockholm", "Abisko", "Narvik", "Lofoten", "Bergen", "Oslo"];

export function FlightFreeBand() {
  return (
    <section aria-labelledby="flight-free-title" className="bg-fjord py-24 text-birch-50 md:py-32">
      <div className="gutter grid-12 gap-y-8">
        <p className="eyebrow col-span-12 text-birch-50/80">Travelling lighter</p>
        <h2 id="flight-free-title" className="headline col-span-12 md:col-span-8">
          From Copenhagen to the Arctic <em>without leaving the ground.</em>
        </h2>
        <p className="col-span-12 text-birch-50/85 md:col-span-6">
          Flight-free is a setting in our route builder, not a slogan. Rail and sea reach almost everywhere we go. Where flying is the only sensible
          option, as it is for Svalbard, we will say so.
        </p>
      </div>

      <div className="relative mt-16" aria-hidden>
        <div className="h-px bg-birch-50/45" />
        <ol className="gutter -mt-[5px] flex justify-between">
          {stops.map((s) => (
            <li key={s} className="flex flex-col items-center gap-3">
              <span className="size-2.5 rounded-full border border-birch-50 bg-fjord" />
              <span className="meta hidden text-birch-50/80 sm:block">{s}</span>
            </li>
          ))}
        </ol>
      </div>
      <p className="sr-only">Example flight-free route: {stops.join(", ")}.</p>

      <div className="gutter mt-14 flex flex-wrap items-center gap-6">
        <ArrowLink href="/route-builder">Build a slow route</ArrowLink>
        <DottedLink href="/travelling-lighter">Our approach to travelling lighter →</DottedLink>
      </div>
    </section>
  );
}
