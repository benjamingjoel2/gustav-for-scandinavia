import Link from "next/link";
import { Price } from "@/components/ui/Currency";
import { Photo } from "@/components/ui/Photo";
import { ArrowLabel, Tag } from "@/components/ui/Tag";
import { formatMonths } from "@/lib/format";
import type { ImageRef, JourneySummary } from "@/types/content";

/** The image is passed in so client lists don't pull the whole photo catalogue into the browser. */
export function JourneyCard({ journey, image, className = "" }: { journey: JourneySummary; image?: ImageRef; className?: string }) {
  return (
    <article className={className}>
      <Link href={`/journeys/${journey.slug}`} className="group relative block">
        <div className="relative aspect-[4/5] overflow-hidden bg-birch-200">
          <Photo
            image={image}
            ratio="4:5"
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
