import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/editorial/JsonLd";
import { SunPath } from "@/components/horizon/SunPath";
import { JourneyCard } from "@/components/journeys/JourneyCard";
import { ScandinaviaMap } from "@/components/route/ScandinaviaMap";
import { modeLabel } from "@/components/route/modes";
import { Price } from "@/components/ui/Currency";
import { ArrowLink, PillLink } from "@/components/ui/Links";
import { Photo } from "@/components/ui/Photo";
import { Tag } from "@/components/ui/Tag";
import { site } from "@/config/site";
import { destinations } from "@/data/destinations";
import { experiences } from "@/data/experiences";
import { destinationImage, experienceImage, galleryImages, journeyImage } from "@/data/images";
import { itineraries } from "@/data/itineraries";
import { journeys } from "@/data/journeys";
import { getPlace, type PlaceId } from "@/data/places";
import { stays } from "@/data/stays";
import { formatMonths, monthName } from "@/lib/format";
import type { ImageRef, JourneyDay } from "@/types/content";
import { planRoute } from "@/lib/routing";
import { formatDuration, formatTime, getSunTimes, type LocalDate } from "@/lib/solar";

export const dynamicParams = false;

export function generateStaticParams() {
  return journeys.map((j) => ({ slug: j.slug }));
}

type Props = { params: Promise<{ slug: string }> };

function find(slug: string) {
  const journey = journeys.find((j) => j.slug === slug);
  const itinerary = itineraries[slug];
  if (!journey || !itinerary) notFound();
  return { journey, itinerary };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { journey } = find((await params).slug);
  const image = journeyImage(journey.slug);
  return {
    title: journey.title,
    description: `${journey.strapline} ${journey.days} days, private, from €${journey.priceFromEUR.toLocaleString("en")}.`,
    alternates: { canonical: `/journeys/${journey.slug}` },
    openGraph: { images: image ? [`${image.src}?w=1200&q=70&auto=format&fit=crop`] : undefined },
  };
}

/**
 * A photograph for each day: from the place you sleep (its hero, then its gallery) or the day's experience,
 * never the same one twice in a journey.
 */
function dayImages(days: JourneyDay[], heroSrc?: string): (ImageRef | undefined)[] {
  const used = new Set<string>(heroSrc ? [heroSrc] : []);
  return days.map((d, i) => {
    const destination = destinations.find((x) => x.placeId === d.placeId);
    const placePool = destination ? [destinationImage(destination.slug), ...galleryImages(destination.slug)] : [];
    const experiencePool = (d.experienceIds ?? []).map(experienceImage);
    const pool = (i % 2 ? [...experiencePool, ...placePool] : [...placePool, ...experiencePool]).filter((x): x is ImageRef => !!x);
    const pick = pool.find((x) => !used.has(x.src));
    if (pick) used.add(pick.src);
    return pick;
  });
}

/** The first night of a "2–3" day label. */
const firstDay = (label: string) => Number(label.split(/[–-]/)[0]);

function dayLight(placeId: string, day: LocalDate) {
  const place = getPlace(placeId as PlaceId);
  const t = getSunTimes(day, place.lat, place.lng);
  if (t.state === "midnight-sun") return { place, day, text: "Midnight sun: the sun doesn't set" };
  if (t.state === "polar-night") return { place, day, text: "Polar night: the sun doesn't rise" };
  return { place, day, text: `Sunrise ${formatTime(t.sunrise!, place.tz)} · Sunset ${formatTime(t.sunset!, place.tz)} · ${formatDuration(t.daylightMinutes)} of daylight` };
}

export default async function JourneyPage({ params }: Props) {
  const { journey, itinerary } = find((await params).slug);
  const image = journeyImage(journey.slug);
  const year = new Date().getFullYear();
  const startDay = 10; // light is shown as if leaving on the 10th of the journey's month
  const sleeps = itinerary.days.map((d) => d.placeId).filter((id, i, all) => id !== all[i - 1]);
  const plan = planRoute(sleeps, { flightFree: journey.flightFree, month: itinerary.defaultMonth });
  const enquire = `/enquire?journey=${journey.slug}`;
  const photos = dayImages(itinerary.days, image?.src);
  const related = journeys.filter((j) => j.slug !== journey.slug && j.bestMonths.some((m) => journey.bestMonths.includes(m))).slice(0, 3);

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          name: journey.title,
          description: journey.strapline,
          touristType: "Private travellers",
          provider: { "@type": "TravelAgency", name: site.name, url: site.url },
          offers: { "@type": "Offer", price: journey.priceFromEUR, priceCurrency: "EUR", description: "Price from, per person" },
          itinerary: { "@type": "ItemList", itemListElement: itinerary.days.map((d, i) => ({ "@type": "ListItem", position: i + 1, name: `Day ${d.day}: ${d.title}` })) },
        }}
      />

      <header className="relative isolate flex min-h-[88svh] flex-col justify-end overflow-hidden bg-polar text-birch-50">
        <div className="absolute inset-0 -z-10">
          <Photo image={image} sizes="100vw" eager />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(16_27_33/0.4)_0%,rgb(16_27_33/0)_35%,rgb(16_27_33/0.75)_100%)]" />
        </div>
        <div className="gutter grid-12 gap-y-6 pb-10 pt-32">
          <p className="eyebrow col-span-12 text-birch-50/80">
            Journey · {journey.days} days{journey.flightFree ? " · Flight-free" : ""}
          </p>
          <h1 className="col-span-12 font-sans text-title font-light md:col-span-9">{journey.title}</h1>
          <p className="lede col-span-12 max-w-2xl md:col-span-7">{journey.strapline}</p>
          <div className="col-span-12 mt-4 flex flex-wrap items-center gap-6">
            <PillLink href={enquire}>Start from this journey</PillLink>
            <p className="meta">
              <Price eur={journey.priceFromEUR} /> per person · Best {formatMonths(journey.bestMonths)}
            </p>
          </div>
          {image && <p className="meta col-span-12 text-[0.625rem] text-birch-50/80">Photo: {image.credit}</p>}
        </div>
      </header>

      <section className="gutter grid-12 gap-y-12 py-20 md:py-28">
        <div className="col-span-12 md:col-span-6 lg:col-span-5">
          <div className="prose-gustav">
            {itinerary.intro.map((p, i) => (
              <p key={i} className={i === 0 ? "lede" : ""}>
                {p}
              </p>
            ))}
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink/15 pt-6">
            <div>
              <dt className="meta text-stone">Length</dt>
              <dd className="mt-1 font-sans">{journey.days} days</dd>
            </div>
            <div>
              <dt className="meta text-stone">Price</dt>
              <dd className="mt-1 font-sans">
                <Price eur={journey.priceFromEUR} /> pp
              </dd>
            </div>
            <div>
              <dt className="meta text-stone">Best months</dt>
              <dd className="mt-1 font-sans">{formatMonths(journey.bestMonths)}</dd>
            </div>
            <div>
              <dt className="meta text-stone">Travel</dt>
              <dd className="mt-1 font-sans">{journey.flightFree ? "Flight-free" : "Mostly rail and sea"}</dd>
            </div>
          </dl>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-6 lg:col-start-7">
          <ScandinaviaMap stops={sleeps} legs={plan.segments.flatMap((s) => s.legs)} />
          <p className="meta mt-3 text-stone">The route, roughly. Scenic legs in oak.</p>
        </div>
      </section>

      <section aria-labelledby="days-title" className="bg-birch-50 py-20 md:py-28">
        <div className="gutter grid-12 gap-y-4">
          <p className="eyebrow col-span-12 text-stone">Day by day</p>
          <h2 id="days-title" className="headline col-span-12 md:col-span-8">
            The days, <em>and the light on each.</em>
          </h2>
          <p className="col-span-12 text-stone md:col-span-4 md:self-end">
            Light shown for a departure on {startDay} {monthName(itinerary.defaultMonth, "long")}, calculated for where you sleep.
          </p>
        </div>
        <ol className="mt-14 border-t border-ink/15">
          {itinerary.days.map((d, dayIndex) => {
            const photo = photos[dayIndex];
            const offset = firstDay(d.day) - 1;
            const date = new Date(Date.UTC(year, itinerary.defaultMonth - 1, startDay + offset));
            const light = dayLight(d.placeId, { year, month: date.getUTCMonth() + 1, day: date.getUTCDate() });
            const stay = stays.find((s) => s.id === d.stayId);
            const exps = experiences.filter((e) => d.experienceIds?.includes(e.id));
            return (
              <li key={d.day} className="border-b border-ink/15">
                <div className="gutter grid-12 gap-y-4 pt-8">
                  <p className="meta col-span-12 text-stone md:col-span-2">Day {d.day}</p>
                  <div className="col-span-12 md:col-span-6">
                    <h3 className="font-serif text-2xl font-light">{d.title}</h3>
                    <p className="mt-3">{d.text}</p>
                    {d.travel && (
                      <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="meta text-stone">{modeLabel[d.travel.mode]}</span>
                        <span className="meta">{d.travel.duration}</span>
                        {d.travel.scenic && <Tag className="text-oak-deep">Scenic</Tag>}
                        {d.travel.note && <span className="w-full text-[0.9375rem] text-stone">{d.travel.note}</span>}
                      </p>
                    )}
                  </div>
                  <div className="col-span-12 space-y-3 md:col-span-3 md:col-start-10">
                    {photo && (
                      <div className="relative aspect-[4/3] overflow-hidden bg-birch-200">
                        <Photo image={photo} sizes="(min-width: 768px) 25vw, 100vw" />
                      </div>
                    )}
                    {stay && (
                      <p className="text-[0.9375rem]">
                        <span className="meta block text-stone">Stay</span>
                        {stay.name} <Tag className="ml-1 text-stone">Placeholder</Tag>
                      </p>
                    )}
                    {exps.length > 0 && (
                      <p className="text-[0.9375rem]">
                        <span className="meta block text-stone">Experiences</span>
                        {exps.map((e, i) => (
                          <span key={e.id}>
                            {i > 0 && ", "}
                            <Link href={`/experiences#${e.id}`} className="link-dotted text-[0.9375rem]">
                              {e.name}
                            </Link>
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <SunPath place={light.place} day={light.day} height={48} labels={false} className="text-ink" />
                  <p className="gutter meta pb-4 pt-1 text-stone">
                    {light.place.name} · {light.text}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="gutter grid-12 gap-y-12 py-20 md:py-28">
        <div className="col-span-12 md:col-span-5">
          <h2 className="eyebrow text-stone">Included</h2>
          <ul className="mt-6 space-y-3 border-t border-ink/15 pt-6">
            {itinerary.included.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="text-oak">—</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.9375rem] text-stone">International travel to and from Scandinavia is not included; we will help you arrive by rail if you want to.</p>
        </div>
        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <h2 className="eyebrow text-stone">Places on this journey</h2>
          <ul className="mt-6 border-t border-ink/15">
            {destinations
              .filter((d) => itinerary.destinationSlugs.includes(d.slug))
              .map((d) => (
                <li key={d.slug} className="border-b border-ink/15">
                  <Link href={`/destinations/${d.slug}`} className="flex items-baseline justify-between gap-4 py-3 hover:opacity-70">
                    <span className="font-sans text-lg">{d.name}</span>
                    <span className="meta text-stone">{d.region}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </section>

      <section className="bg-pine py-20 text-birch-50 md:py-28">
        <div className="gutter grid-12 items-end gap-y-8">
          <h2 className="headline col-span-12 md:col-span-7">
            Ask us to plan this. <em>Then make it yours.</em>
          </h2>
          <div className="col-span-12 flex flex-wrap items-center gap-6 md:col-span-5 md:justify-end">
            <PillLink href={enquire}>Start from this journey</PillLink>
            <ArrowLink href="/route-builder">Build your own</ArrowLink>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="gutter py-20 md:py-28">
          <h2 id="related-title" className="eyebrow text-stone">
            In the same season
          </h2>
          <ul className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((j) => (
              <li key={j.slug}>
                <JourneyCard journey={j} image={journeyImage(j.slug)} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
