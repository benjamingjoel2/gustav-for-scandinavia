import { alternatesFor } from "@/lib/i18n-paths";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Photo } from "@/components/ui/Photo";
import { countries } from "@/data/countries";
import { destinationsIn } from "@/data/destinations";
import { destinationImage } from "@/data/images";
import { formatMonths } from "@/lib/format";
import { countryTone, toneClasses } from "@/lib/tones";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Nineteen places across Norway, Sweden, Denmark and Finland: fjords, the Arctic, archipelagos, Lapland, and four calm capitals.",
  alternates: alternatesFor("/destinations"),
};

export default function DestinationsPage() {
  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <PageHeader
        eyebrow="Destinations"
        title={
          <>
            Four countries, <em>nineteen places we know well.</em>
          </>
        }
        aside={<p>Each country keeps its colour across the site. Each place has its own light through the year, and a slow way to get there.</p>}
      />
      {countries.map((country) => (
        <section key={country.id} id={country.id} aria-labelledby={`${country.id}-title`} className={`scroll-mt-16 py-20 md:py-28 ${toneClasses[countryTone[country.id]]}`}>
          <div className="gutter grid-12 gap-y-6">
            <h2 id={`${country.id}-title`} className="col-span-12 font-sans text-title font-light md:col-span-5">
              {country.name}
            </h2>
            <p className="lede col-span-12 opacity-90 md:col-span-6 md:col-start-7 md:self-end">{country.pitch}</p>
          </div>
          <ul className="gutter mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {destinationsIn(country.id).map((d) => (
              <li key={d.slug}>
                <Link href={`/destinations/${d.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/10">
                    <Photo image={destinationImage(d.slug)} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw" className="transition-transform duration-[1.6s] ease-light group-hover:scale-[1.03]" />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4 border-b border-current/30 pb-3">
                    <h3 className="font-sans text-xl">{d.name}</h3>
                    <span className="meta opacity-90">Best {formatMonths(d.bestMonths)}</span>
                  </div>
                  <p className="mt-3 opacity-90">{d.pitch}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
