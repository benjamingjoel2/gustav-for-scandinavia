import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { countries } from "@/data/countries";
import { destinationsIn } from "@/data/destinations";
import { destinationImage } from "@/data/images";
import type { CountryId } from "@/types/content";

/** The photograph that stands for each country on the homepage. */
const coverSlug: Record<CountryId, string> = {
  norway: "lofoten",
  sweden: "swedish-lapland",
  denmark: "copenhagen",
  finland: "lakeland",
};

/** Four tall photographs, one per country, each opening that country on the destinations page. */
export function CountryTiles() {
  return (
    <section aria-labelledby="where-title" className="py-24 md:py-32">
      <div className="gutter">
        <p className="eyebrow text-stone">Where Gustav goes</p>
        <h2 id="where-title" className="mt-4 font-serif text-[clamp(2.5rem,1.6rem+3.6vw,5rem)] font-light leading-[1] tracking-[-0.02em]">
          Four countries, <em>one north.</em>
        </h2>
      </div>
      <ul className="gutter mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {countries.map((country) => (
          <li key={country.id}>
            <Link
              href={`/destinations#${country.id}`}
              className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden bg-polar text-birch-50 lg:aspect-[3/5]"
            >
              <Photo
                image={destinationImage(coverSlug[country.id])}
                sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw"
                className="-z-20 transition-transform duration-[1.6s] ease-light group-hover:scale-[1.05]"
              />
              <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-polar/85 via-polar/10 to-transparent" />
              <div className="p-6">
                <h3 className="font-serif text-[clamp(2rem,1.5rem+1.5vw,2.75rem)] font-light leading-none">{country.name}</h3>
                <p className="meta mt-3 text-birch-50/80">{destinationsIn(country.id).length} places →</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
