import type { Place } from "@/types/content";
import { monthName } from "@/lib/format";
import { formatDuration, getSunTimes } from "@/lib/solar";

/**
 * Twelve bars: daylight on the 15th of each month at one place. A table underneath for screen readers.
 */
export function MiniLightCalendar({ place, year, highlight, className = "" }: { place: Place; year: number; highlight?: number; className?: string }) {
  const months = Array.from({ length: 12 }, (_, i) => {
    const t = getSunTimes({ year, month: i + 1, day: 15 }, place.lat, place.lng);
    return { month: i + 1, minutes: t.daylightMinutes, state: t.state };
  });
  return (
    <figure className={className}>
      <div aria-hidden className="grid h-28 grid-cols-12 items-end gap-1 border-b border-current/40">
        {months.map((m) => (
          <div key={m.month} className="relative h-full">
            <div
              className={`absolute inset-x-0 bottom-0 ${m.month === highlight ? "bg-lingon" : m.state === "midnight-sun" ? "bg-oak" : "bg-current opacity-30"}`}
              style={{ height: `${Math.max(1.5, (m.minutes / 1440) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div aria-hidden className="mt-1 grid grid-cols-12 gap-1">
        {months.map((m) => (
          <span key={m.month} className={`meta text-center text-[0.625rem] ${m.month === highlight ? "" : "opacity-60"}`}>
            {monthName(m.month).slice(0, 1)}
          </span>
        ))}
      </div>
      <figcaption className="meta mt-3 opacity-70">Daylight on the 15th of each month, {place.name}</figcaption>
      <table className="sr-only">
        <caption>Daylight in {place.name} on the 15th of each month</caption>
        <tbody>
          {months.map((m) => (
            <tr key={m.month}>
              <th scope="row">{monthName(m.month, "long")}</th>
              <td>{m.state === "midnight-sun" ? "Midnight sun" : m.state === "polar-night" ? "Polar night" : formatDuration(m.minutes)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
