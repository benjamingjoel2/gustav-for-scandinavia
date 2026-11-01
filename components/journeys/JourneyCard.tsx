import Link from "next/link";
import { Price } from "@/components/ui/Currency";
import { Photo } from "@/components/ui/Photo";
import { ArrowLabel, Tag } from "@/components/ui/Tag";
import { formatMonths } from "@/lib/format";
import type { ImageRef, JourneySummary } from "@/types/content";

interface JourneyCardProps {
  journey: JourneySummary;
  image?: ImageRef;
  className?: string;
  /** "overlay": a tall photograph with the title and details laid over it, for dark showcase rows. */
  variant?: "default" | "overlay";
}

/** The image is passed in so client lists don't pull the whole photo catalogue into the browser. */
export function JourneyCard({ journey, image, className = "", variant = "default" }: JourneyCardProps) {
  if (variant === "overlay")
    return (
      <article className={className}>
        <Link href={`/journeys/${journey.slug}`} className="group relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden bg-polar text-birch-50">
          <Photo
            image={image}
            sizes="(min-width: 1280px) 30vw, (min-width: 640px) 46vw, 85vw"
            className="-z-20 transition-transform duration-[1.6s] ease-light group-hover:scale-[1.04]"
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-polar/90 via-polar/20 to-transparent" />
          <div className="p-6 md:p-8">
            <p className="meta text-birch-50/80">
              {journey.days} days
              {journey.flightFree && (
                <>
                  {" · "}
                  <span>Flight-free</span>
                </>
              )}
            </p>
            <h3 className="mt-3 font-serif text-[clamp(1.75rem,1.2rem+1.4vw,2.5rem)] font-light leading-[1.05] tracking-[-0.015em]">{journey.title}</h3>
            <p className="mt-4 flex items-center justify-between gap-4 font-sans text-sm text-birch-50/85">
              <Price eur={journey.priceFromEUR} />
              <span aria-hidden className="transition-transform duration-500 ease-light group-hover:translate-x-1">
                →
              </span>
            </p>
          </div>
          <span className="sr-only">: {journey.strapline}</span>
        </Link>
      </article>
    );

  return (
    <article className={className}>
      <Link href={`/journeys/${journey.slug}`} className="group relative block">
        <div className="relative aspect-[4/5] overflow-hidden bg-birch-200">
          <Photo
            image={image}
           
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 80vw"
            className="transition-transform duration-[1.6s] ease-light group-hover:scale-[1.03]"
          />
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1">
            <Tag className="bg-birch-50 text-ink">{journey.days} days</Tag>
            {journey.flightFree && <Tag className="bg-birch-50 text-ink">Flight-free</Tag>}
          </div>
        </div>
        <h3 className="mt-5 font-sans text-[1.75rem] font-normal leading-tight tracking-[-0.025em]">{journey.title}</h3>
        <div className="mt-3 grid grid-cols-2 gap-4 border-t border-current/25 pt-3">
          <p className="meta space-y-0.5">
            <span className="block">
              <Price eur={journey.priceFromEUR} />
            </span>
            <span className="block text-stone">Best {formatMonths(journey.bestMonths)}</span>
          </p>
          <p className="meta border-l border-current/25 pl-4 text-stone">{journey.stops.join(" · ")}</p>
        </div>
        <ArrowLabel className="mt-5">View journey</ArrowLabel>
        <span className="sr-only">: {journey.strapline}</span>
      </Link>
    </article>
  );
}
