import { SunPath } from "@/components/horizon/SunPath";
import { ArrowLink } from "@/components/ui/Links";
import { getPlace, type PlaceId } from "@/data/places";
import { localMinuteOfDay } from "@/lib/format";
import { formatDuration, formatTime, getLocalDate, getSunTimes } from "@/lib/solar";

const ids: PlaceId[] = ["copenhagen", "stockholm", "rovaniemi", "tromso", "svalbard"];

/** Five places, one day: today's sun paths stacked south to north. */
export function LightToday({ now }: { now: number }) {
  const date = new Date(now);
  return (
    <section aria-labelledby="light-today-title" className="bg-polar py-24 text-birch-50 md:py-32">
      <div className="gutter grid-12 gap-y-6">
        <p className="eyebrow col-span-12 text-birch-50/80">Today, south to north</p>
        <h2 id="light-today-title" className="headline col-span-12 md:col-span-8">
          The same day, <em>five different lights.</em>
        </h2>
        <p className="col-span-12 max-w-xl text-birch-50/80 md:col-span-4 md:self-end">
          Each line is the sun&rsquo;s height through today. Above the horizon, daylight. Below it, night. The dot is now.
        </p>
      </div>

      <ul className="mt-16 border-t border-birch-50/20">
        {ids.map((id) => {
          const place = getPlace(id);
          const day = getLocalDate(date, place.tz);
          const t = getSunTimes(day, place.lat, place.lng);
          return (
            <li key={id} className="grid border-b border-birch-50/20 md:grid-cols-12 md:items-center">
              <div className="gutter pt-5 md:col-span-3 md:py-6 md:pr-0">
                <p className="font-sans text-xl">{place.name}</p>
                <p className="meta mt-1 text-birch-50/80">
                  {t.state === "midnight-sun"
                    ? "Midnight sun"
                    : t.state === "polar-night"
                      ? "Polar night"
                      : `${formatDuration(t.daylightMinutes)} · ${formatTime(t.sunrise!, place.tz)}–${formatTime(t.sunset!, place.tz)}`}
                </p>
              </div>
              <SunPath place={place} day={day} markerMinute={localMinuteOfDay(date, place.tz)} height={72} labels={false} className="md:col-span-9" />
            </li>
          );
        })}
      </ul>

      <div className="gutter mt-12 flex flex-wrap items-center gap-6">
        <ArrowLink href="/light-calendar">Open the Light Calendar</ArrowLink>
        <p className="meta text-birch-50/80">Calculated from latitude and longitude. No forecasts, just geometry.</p>
      </div>
    </section>
  );
}
