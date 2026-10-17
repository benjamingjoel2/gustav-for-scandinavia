import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/editorial/JsonLd";
import { SunPath } from "@/components/horizon/SunPath";
import { JourneyCard } from "@/components/journeys/JourneyCard";
import { MiniLightCalendar } from "@/components/light/MiniLightCalendar";
import { modeLabel } from "@/components/route/modes";
import { ArrowLink, DottedLink, PillLink } from "@/components/ui/Links";
import { Photo } from "@/components/ui/Photo";
import { Tag } from "@/components/ui/Tag";
import { site } from "@/config/site";
import { blackBook } from "@/data/blackbook";
import { countries } from "@/data/countries";
import { destinationDetails } from "@/data/destination-details";
import { destinations } from "@/data/destinations";
import { experiences } from "@/data/experiences";
import { destinationImage } from "@/data/images";
import { itineraries } from "@/data/itineraries";
import { journeys } from "@/data/journeys";
import { getPlace, places, type PlaceId } from "@/data/places";
import { stays } from "@/data/stays";
import { formatCoords, formatMonths, monthName } from "@/lib/format";
import { planRoute } from "@/lib/routing";
import { formatDuration, getLocalDate, getPolarPeriods, type DateRange } from "@/lib/solar";
import { countryTone, toneClasses } from "@/lib/tones";

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

type Props = { params: Promise<{ slug: string }> };

function find(slug: string) {
  const destination = destinations.find((d) => d.slug === slug);
  const detail = destinationDetails[slug];
  if (!destination || !detail) notFound();
  return { destination, detail };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destination } = find((await params).slug);
  const image = destinationImage(destination.slug);
  return {
    title: destination.name,
    description: destination.pitch,
    alternates: { canonical: `/destinations/${destination.slug}` },
    openGraph: { images: image ? [`${image.src}?w=1200&q=70&auto=format&fit=crop`] : undefined },
  };
}

const nameOf = (id: string) => places.find((p) => p.id === id)?.name ?? id;
const range = (r: DateRange) => `${r.start.day} ${monthName(r.start.month)} – ${r.end.day} ${monthName(r.end.month)}`;

function today() {
  return new Date();
}

export default async function DestinationPage({ params }: Props) {
  const { destination, detail } = find((await params).slug);
  const place = getPlace(destination.placeId as PlaceId);
  const country = countries.find((c) => c.id === destination.country)!;
  const tone = toneClasses[countryTone[destination.country]];
  const image = destinationImage(destination.slug);
  const now = today();
  const year = now.getFullYear();
  const day = getLocalDate(now, place.tz);
  const polar = getPolarPeriods(place.lat, place.lng, year);
  const route = planRoute(detail.slowWay.stops, { flightFree: true });
  const picks = blackBook.filter((b) => b.destinationSlug === destination.slug);
  const placeStays = stays.filter((s) => s.destinationSlug === destination.slug);
  const relatedJourneys = journeys.filter((j) => itineraries[j.slug]?.destinationSlugs.includes(destination.slug));
  const relatedExperiences = experiences.filter((e) => e.destinationSlugs.includes(destination.slug));
  const polarNight = polar["polar-night"];

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TouristDestination",
          name: destination.name,
          description: destination.pitch,
          geo: { "@type": "GeoCoordinates", latitude: place.lat, longitude: place.lng },
          containedInPlace: { "@type": "Country", name: country.name },
          provider: { "@type": "TravelAgency", name: site.name },
        }}
      />
      <header className="relative isolate flex min-h-[80svh] flex-col justify-end overflow-hidden bg-polar text-birch-50">
        <div className="absolute inset-0 -z-10">
          <Photo image={image} sizes="100vw" eager />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(16_27_33/0.4)_0%,rgb(16_27_33/0)_40%,rgb(16_27_33/0.7)_100%)]" />
        </div>
        <div className="gutter pb-10 pt-32">
          <p className="eyebrow text-birch-50/80">
            <Link href={`/destinations#${country.id}`} className="hover:underline">
              {country.name}
            </Link>{" "}
            · {destination.region}
          </p>
          <h1 className="mt-4 font-sans text-title font-light">{destination.name}</h1>
          <p className="meta mt-6">
            {formatCoords(place.lat, place.lng)} · Best {formatMonths(destination.bestMonths)}
          </p>
          {image && <p className="meta mt-2 text-[0.625rem] text-birch-50/50">Photo: {image.credit}</p>}
        </div>
      </header>

      <section className="gutter grid-12 gap-y-10 py-20 md:py-28">
        <p className="lede col-span-12 md:col-span-5">{destination.pitch}</p>
        <div className="prose-gustav col-span-12 md:col-span-6 md:col-start-7">
          {detail.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section aria-labelledby="light-title" className="bg-polar py-20 text-birch-50 md:py-28">
        <div className="gutter grid-12 gap-y-10">
          <div className="col-span-12 md:col-span-5">
            <p className="eyebrow text-birch-50/60">The light</p>
            <h2 id="light-title" className="headline mt-4">
              {destination.name}, <em>through the year.</em>
            </h2>
            <dl className="mt-8 space-y-4">
              <div>
                <dt className="meta text-oak">Summer</dt>
                <dd className="mt-1">{detail.light.summer}</dd>
              </div>
              <div>
                <dt className="meta text-oak">Winter</dt>
                <dd className="mt-1">{detail.light.winter}</dd>
              </div>
              {polar["midnight-sun"].length > 0 && (
                <div>
                  <dt className="meta text-birch-50/60">Midnight sun {year}</dt>
                  <dd className="meta mt-1">{polar["midnight-sun"].map(range).join(", ")}</dd>
                </div>
              )}
              {polarNight.length > 0 && (
                <div>
                  <dt className="meta text-birch-50/60">Polar night</dt>
                  <dd className="meta mt-1">{range({ start: polarNight.at(-1)!.start, end: polarNight[0].end })}</dd>
                </div>
              )}
            </dl>
            <DottedLink href="/light-calendar" className="mt-8">
              Compare with other places in the Light Calendar →
            </DottedLink>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <MiniLightCalendar place={place} year={year} highlight={day.month} />
          </div>
        </div>
        <div className="mt-14">
          <p className="gutter meta text-birch-50/60">Today in {place.name}</p>
          <SunPath place={place} day={day} height={110} />
        </div>
      </section>

      <section aria-labelledby="slow-title" className={`py-20 md:py-28 ${tone}`}>
        <div className="gutter grid-12 gap-y-10">
          <div className="col-span-12 md:col-span-5">
            <p className="eyebrow opacity-75">Getting there slowly</p>
            <h2 id="slow-title" className="headline mt-4">
              From {nameOf(detail.slowWay.stops[0])}, <em>the slow way.</em>
            </h2>
            <p className="mt-6 opacity-90">{detail.slowWay.text}</p>
            <ArrowLink href={`/route-builder?stops=${detail.slowWay.stops.join(",")}`} className="mt-8">
              Open in the route builder
            </ArrowLink>
          </div>
          <ol className="col-span-12 border-t border-current/30 md:col-span-6 md:col-start-7">
            {route.segments.flatMap((s) => s.legs).map((leg, i) => (
              <li key={`${leg.id}-${i}`} className="border-b border-current/30 py-4">
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="meta w-24 opacity-75">{modeLabel[leg.mode]}</span>
                  <span className="font-sans">
                    {nameOf(leg.start)} → {nameOf(leg.end)}
                  </span>
                  <span className="meta">≈ {formatDuration(leg.minutes)}</span>
                  {leg.scenic && <Tag>Scenic</Tag>}
                </p>
                {leg.name && <p className="mt-1 text-[0.9375rem] opacity-80 sm:pl-[6.75rem]">{leg.name}</p>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {picks.length > 0 && (
        <section aria-labelledby="picks-title" className="gutter py-20 md:py-28">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="picks-title" className="headline">
              From the <em>Black Book.</em>
            </h2>
            <DottedLink href="/black-book">The full Black Book →</DottedLink>
          </div>
          <ul className="mt-10 grid gap-x-8 gap-y-10 border-t border-ink/15 pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {picks.map((b) => (
              <li key={b.id}>
                <p className="meta flex gap-2 text-stone">
                  <span>{b.theme}</span> · <span>{b.city}</span>
                </p>
                <h3 className="mt-2 font-sans text-lg">
                  {b.name} <Tag className="ml-1 align-middle text-stone">Placeholder</Tag>
                </h3>
                <p className="mt-2">{b.note}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(relatedExperiences.length > 0 || placeStays.length > 0) && (
        <section className="gutter grid-12 gap-y-12 border-t border-ink/15 py-20 md:py-28">
          {relatedExperiences.length > 0 && (
            <div className="col-span-12 md:col-span-6">
              <h2 className="eyebrow text-stone">Things to do here</h2>
              <ul className="mt-6 border-t border-ink/15">
                {relatedExperiences.map((e) => (
                  <li key={e.id} className="border-b border-ink/15">
                    <Link href={`/experiences#${e.id}`} className="flex items-baseline justify-between gap-4 py-3 hover:opacity-70">
                      <span className="font-sans">{e.name}</span>
                      <span className="meta text-stone">{e.seasonNote}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {placeStays.length > 0 && (
            <div className="col-span-12 md:col-span-5 md:col-start-8">
              <h2 className="eyebrow text-stone">Where we might put you</h2>
              <ul className="mt-6 space-y-6 border-t border-ink/15 pt-6">
                {placeStays.map((s) => (
                  <li key={s.id}>
                    <p className="font-sans text-lg">
                      {s.name} <Tag className="ml-1 align-middle text-stone">Placeholder</Tag>
                    </p>
                    <p className="meta mt-1 text-stone">{s.kind}</p>
                    <p className="mt-2">{s.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {relatedJourneys.length > 0 && (
        <section aria-labelledby="journeys-title" className="bg-birch-50 py-20 md:py-28">
          <div className="gutter">
            <h2 id="journeys-title" className="headline">
              Journeys that <em>come here.</em>
            </h2>
            <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {relatedJourneys.map((j) => (
                <li key={j.slug}>
                  <JourneyCard journey={j} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="bg-pine py-20 text-birch-50 md:py-24">
        <div className="gutter flex flex-wrap items-end justify-between gap-8">
          <h2 className="headline max-w-2xl">
            Ask us about {destination.name}. <em>We&rsquo;ll suggest the month.</em>
          </h2>
          <PillLink href={`/enquire?route=${destination.placeId}`}>Ask us to plan this</PillLink>
        </div>
      </section>
    </article>
  );
}
