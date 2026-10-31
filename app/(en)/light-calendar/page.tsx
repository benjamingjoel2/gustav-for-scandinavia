import { alternatesFor } from "@/lib/i18n-paths";
import type { Metadata } from "next";
import { LightCalendar } from "@/components/light/LightCalendar";
import { ArrowLink } from "@/components/ui/Links";
import { momentImage } from "@/data/images";
import { lightMoments } from "@/data/light-moments";
import { calendarPlaceIds, getPlace } from "@/data/places";
import { monthName } from "@/lib/format";
import { formatDuration, getPolarPeriods, getSunTimes, type DateRange } from "@/lib/solar";

export const metadata: Metadata = {
  title: "The Light Calendar",
  description:
    "Drag through the year and watch daylight change across Scandinavia and Finland: midnight sun, polar night, and the months between. Calculated from latitude and longitude.",
  alternates: alternatesFor("/light-calendar"),
};

export const revalidate = 86400;

function today() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const dayOfYear = Math.min(364, Math.floor((now.getTime() - Date.UTC(year, 0, 1)) / 86_400_000));
  return { year, dayOfYear };
}

const range = (r: DateRange) => `${r.start.day} ${monthName(r.start.month)} – ${r.end.day} ${monthName(r.end.month)}`;

export default function LightCalendarPage() {
  const { year, dayOfYear } = today();
  return (
    <div className="bg-polar pt-16 text-birch-50 md:pt-[4.5rem]">
      <header className="gutter grid-12 gap-y-6 pb-12 pt-16 md:pt-24">
        <p className="eyebrow col-span-12 text-birch-50/80">The Light Calendar</p>
        <h1 className="headline col-span-12 md:col-span-8">
          Plan by the light, <em>not the calendar.</em>
        </h1>
        <p className="col-span-12 text-birch-50/80 md:col-span-4 md:self-end">
          Each line is the sun&rsquo;s height over one day, south to north. Above the horizon is daylight. Drag through the year: the arcs rise
          into midnight sun and sink into polar night.
        </p>
      </header>

      <LightCalendar year={year} initialDay={dayOfYear} momentImages={Object.fromEntries(lightMoments.map((m) => [m.id, momentImage(m.id)]))} />

      <section aria-labelledby="table-title" className="gutter border-t border-birch-50/15 py-16">
        <h2 id="table-title" className="headline text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)]">
          The same, <em>as a table.</em>
        </h2>
        <p className="mt-4 max-w-xl text-birch-50/75">Daylight on the 15th of each month, and this year&rsquo;s midnight sun and polar night, calculated for each place.</p>
        <div className="mt-8 overflow-x-auto" tabIndex={0} role="region" aria-labelledby="table-title">
          <table className="w-full min-w-[56rem] border-collapse text-left">
            <caption className="sr-only">Daylight on the 15th of each month, {year}</caption>
            <thead>
              <tr className="meta text-birch-50/80">
                <th scope="col" className="py-2 pr-4 font-normal">
                  Place
                </th>
                {Array.from({ length: 12 }, (_, i) => (
                  <th key={i} scope="col" className="py-2 pr-2 font-normal">
                    {monthName(i + 1)}
                  </th>
                ))}
                <th scope="col" className="py-2 font-normal">
                  Midnight sun
                </th>
                <th scope="col" className="py-2 font-normal">
                  Polar night
                </th>
              </tr>
            </thead>
            <tbody>
              {calendarPlaceIds.map((id) => {
                const place = getPlace(id);
                const periods = getPolarPeriods(place.lat, place.lng, year);
                return (
                  <tr key={id} className="border-t border-birch-50/15 align-top">
                    <th scope="row" className="py-3 pr-4 font-sans font-normal">
                      {place.name}
                    </th>
                    {Array.from({ length: 12 }, (_, i) => {
                      const t = getSunTimes({ year, month: i + 1, day: 15 }, place.lat, place.lng);
                      return (
                        <td key={i} className="meta py-3 pr-2 text-birch-50/85">
                          {t.state === "midnight-sun" ? "24h" : t.state === "polar-night" ? "0h" : formatDuration(t.daylightMinutes)}
                        </td>
                      );
                    })}
                    <td className="meta py-3 pr-3 text-birch-50/85">{periods["midnight-sun"].map(range).join(", ") || "—"}</td>
                    <td className="meta py-3 text-birch-50/85">
                      {periods["polar-night"].length ? `${range({ start: periods["polar-night"].at(-1)!.start, end: periods["polar-night"][0].end })}` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="meta mt-6 text-birch-50/80">
          Sunrise and sunset use the standard NOAA solar calculation, with the sun counted as up while any of it is above the horizon. Mountains
          and weather have their own opinions.
        </p>
        <div className="mt-12 flex flex-wrap gap-6">
          <ArrowLink href="/journeys">Journeys by season</ArrowLink>
          <ArrowLink href="/enquire">Ask us when to go</ArrowLink>
        </div>
      </section>
    </div>
  );
}
