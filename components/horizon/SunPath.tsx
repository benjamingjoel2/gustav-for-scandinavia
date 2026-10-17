import { formatDuration, formatTime, getSunPath, getSunTimes, type LocalDate } from "@/lib/solar";
import type { Place } from "@/types/content";

const W = 1440;
const H = 200;
const HORIZON_Y = 128;
const PX_PER_DEG = 1.9; // 60° fills the space above the line
const MIN_ELEVATION = -36; // night is drawn but kept quiet

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function y(elevation: number) {
  return HORIZON_Y - Math.max(elevation, MIN_ELEVATION) * PX_PER_DEG;
}

export function describeDay(place: Place, day: LocalDate): string {
  const t = getSunTimes(day, place.lat, place.lng);
  const date = `${day.day} ${MONTHS[day.month - 1]}`;
  if (t.state === "midnight-sun") return `${place.name}, ${date}: the sun does not set.`;
  if (t.state === "polar-night") return `${place.name}, ${date}: the sun does not rise.`;
  return `${place.name}, ${date}: ${formatDuration(t.daylightMinutes)} of daylight. Sunrise ${formatTime(t.sunrise!, place.tz)}, sunset ${formatTime(t.sunset!, place.tz)}.`;
}

interface SunPathProps {
  place: Place;
  day: LocalDate;
  /** Minutes after local midnight to mark with a dot (e.g. "now"). */
  markerMinute?: number;
  labels?: boolean;
  className?: string;
  /** Height of the drawing in px. */
  height?: number;
}

/**
 * The horizon line as a chart: the sun's elevation over 24 hours.
 * Above the line is daylight; below it, night. Midnight sun never touches the line; polar night never rises above it.
 */
export function SunPath({ place, day, markerMinute, labels = true, className = "", height = 160 }: SunPathProps) {
  const points = getSunPath(day, place, 10);
  const d = points.map((p, i) => `${i ? "L" : "M"}${((p.minute / 1440) * W).toFixed(1)},${y(p.elevation).toFixed(1)}`).join("");
  const times = getSunTimes(day, place.lat, place.lng);
  const id = `sp-${place.id}-${day.year}${day.month}${day.day}`;

  const marker =
    markerMinute === undefined
      ? undefined
      : (() => {
          const i = Math.min(points.length - 1, Math.round(markerMinute / 10));
          return { left: (markerMinute / 1440) * 100, top: (y(points[i].elevation) / H) * 100, up: points[i].elevation > 0 };
        })();

  const crossing = (date?: Date) => {
    if (!date) return undefined;
    const parts = formatTime(date, place.tz).split(":").map(Number);
    return Math.min(94, Math.max(6, ((parts[0] * 60 + parts[1]) / 1440) * 100));
  };
  const rise = crossing(times.sunrise);
  const set = crossing(times.sunset);

  return (
    <figure className={`relative ${className}`}>
      <div className="relative" style={{ height }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <defs>
            <clipPath id={`${id}-day`}>
              <rect x="0" y="-50" width={W} height={HORIZON_Y + 50} />
            </clipPath>
            <clipPath id={`${id}-night`}>
              <rect x="0" y={HORIZON_Y} width={W} height={H} />
            </clipPath>
          </defs>
          <path d={d} fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 5" vectorEffect="non-scaling-stroke" clipPath={`url(#${id}-night)`} />
          <path d={`${d}L${W},${HORIZON_Y}L0,${HORIZON_Y}Z`} fill="var(--color-oak)" fillOpacity="0.12" clipPath={`url(#${id}-day)`} />
          <path d={d} fill="none" stroke="var(--color-oak)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" clipPath={`url(#${id}-day)`} />
          <line x1="0" x2={W} y1={HORIZON_Y} y2={HORIZON_Y} stroke="currentColor" strokeOpacity="0.45" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
        {marker && (
          <span
            aria-hidden
            className={`absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${marker.up ? "bg-lingon" : "border border-current bg-transparent"}`}
            style={{ left: `${marker.left}%`, top: `${marker.top}%` }}
          />
        )}
        {labels && rise !== undefined && set !== undefined && (
          <>
            <span aria-hidden className="meta absolute -translate-x-1/2 pt-2 opacity-70" style={{ left: `${rise}%`, top: `${(HORIZON_Y / H) * 100}%` }}>
              ↑ {formatTime(times.sunrise!, place.tz)}
            </span>
            <span aria-hidden className="meta absolute -translate-x-1/2 pt-2 opacity-70" style={{ left: `${set}%`, top: `${(HORIZON_Y / H) * 100}%` }}>
              ↓ {formatTime(times.sunset!, place.tz)}
            </span>
          </>
        )}
      </div>
      <figcaption className="sr-only">{describeDay(place, day)}</figcaption>
    </figure>
  );
}
