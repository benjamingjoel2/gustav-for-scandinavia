import { places } from "@/data/places";
import type { PlannedLeg } from "@/lib/routing";
import { MAP_HEIGHT, MAP_SRC, MAP_WIDTH, mapPoints } from "./map-data";
import { modeDash } from "./modes";

/** Places labelled on the map at all times; others show their name on hover, focus or selection. */
const ALWAYS_LABELLED = new Set(["oslo", "bergen", "stockholm", "copenhagen", "helsinki", "tromso", "svalbard", "svolvaer", "rovaniemi", "torshavn"]);

interface MapProps {
  stops: string[];
  legs: PlannedLeg[];
  /** Without it the map is a picture: only the stops are shown, nothing is clickable. */
  onToggle?: (id: string) => void;
}

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

function legPath(leg: PlannedLeg) {
  const a = mapPoints[leg.start];
  const b = mapPoints[leg.end];
  if (leg.mode !== "flight") return `M${a.x},${a.y}L${b.x},${b.y}`;
  // Flights arc gently, so they read as "not on the ground".
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - Math.hypot(b.x - a.x, b.y - a.y) * 0.2;
  return `M${a.x},${a.y}Q${mx},${my} ${b.x},${b.y}`;
}

export function ScandinaviaMap({ stops, legs, onToggle }: MapProps) {
  return (
    <div className="relative overflow-hidden" style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}>
      {/* The outlines are a static, cached file; only the route is drawn per page. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG, no resizing needed */}
      <img src={MAP_SRC} alt="" aria-hidden width={MAP_WIDTH} height={MAP_HEIGHT} className="absolute inset-0 h-full w-full" />
      <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="absolute inset-0 h-full w-full" aria-hidden>
        {legs.map((leg, i) => (
          <path
            key={`${leg.id}-${i}`}
            d={legPath(leg)}
            fill="none"
            stroke={leg.scenic ? "var(--color-oak-deep)" : "var(--color-ink)"}
            strokeWidth={leg.mode === "flight" ? 1.5 : 2.5}
            strokeDasharray={modeDash[leg.mode]}
            strokeLinecap="round"
          />
        ))}
      </svg>

      {!onToggle &&
        stops.map((id, i) => {
          const point = mapPoints[id];
          const name = places.find((p) => p.id === id)?.name;
          return (
            <span key={id} aria-hidden className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: pct(point.x, MAP_WIDTH), top: pct(point.y, MAP_HEIGHT) }}>
              <span className="flex size-5 items-center justify-center rounded-full bg-lingon font-mono text-[0.625rem] text-birch-50">{i + 1}</span>
              <span className="absolute left-full top-1/2 -translate-y-1/2 whitespace-nowrap pl-1 font-sans text-xs font-medium">{name}</span>
            </span>
          );
        })}

      {onToggle && places.map((p) => {
        const point = mapPoints[p.id];
        const order = stops.indexOf(p.id);
        const selected = order >= 0;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onToggle(p.id)}
            aria-pressed={selected}
            className="group absolute -translate-x-1/2 -translate-y-1/2 p-[7px]"
            style={{ left: pct(point.x, MAP_WIDTH), top: pct(point.y, MAP_HEIGHT) }}
          >
            <span
              className={`flex items-center justify-center rounded-full border transition-all duration-300 ${
                selected ? "size-5 border-lingon bg-lingon font-mono text-[0.625rem] text-birch-50" : "size-2.5 border-ink bg-birch-50 group-hover:size-3.5 group-focus-visible:size-3.5"
              }`}
            >
              <span aria-hidden>{selected ? order + 1 : null}</span>
            </span>
            {!selected && <span className="sr-only">Add </span>}
            <span
              className={`pointer-events-none absolute left-full top-1/2 -translate-y-1/2 whitespace-nowrap pl-0.5 font-sans text-xs ${
                selected || ALWAYS_LABELLED.has(p.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
              } ${selected ? "font-medium" : "text-ink/80"}`}
            >
              {p.name}
            </span>
            {selected && <span className="sr-only">, stop {order + 1}. Press to remove</span>}
          </button>
        );
      })}
    </div>
  );
}
