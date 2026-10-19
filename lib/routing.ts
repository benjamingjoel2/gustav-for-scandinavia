import { kgCO2ePerPassengerKm, SURFACE_DETOUR } from "@/data/emissions";
import { places } from "@/data/places";
import { legs as allLegs } from "@/data/routes";
import type { Leg, Mode, Month } from "@/types/content";

export interface RouteOptions {
  /** Prefer rail and sea; fly only where there is no surface route. */
  flightFree: boolean;
  /** Skip seasonal legs that don't run this month. */
  month?: Month;
}

export interface PlannedLeg extends Leg {
  /** Direction travelled (legs are stored one way but run both). */
  start: string;
  end: string;
}

export interface Segment {
  from: string;
  to: string;
  legs: PlannedLeg[];
  /** Other direct connections between the same two stops, e.g. the slower boat. */
  alternatives: PlannedLeg[];
}

export interface PlannedRoute {
  segments: Segment[];
  /** Stops with no connection at all. */
  unreachable: { from: string; to: string }[];
  totalMinutes: number;
  /** Rough emissions for this route and for flying each stop-to-stop hop instead, in kg CO2e per person. */
  emissions: { route: number; flying: number };
  usesFlight: boolean;
}

const AIRPORT_MINUTES = 150; // check-in, security, transfers
const OVERNIGHT: Mode[] = ["night-train", "ferry", "coastal-ship"];

/** How much a leg "costs" when choosing between routes. Lower is better. */
export function legCost(leg: Leg, options: RouteOptions): number {
  let cost = leg.minutes;
  if (leg.mode === "flight") {
    cost += AIRPORT_MINUTES;
    // Flight-free still allows a flight when nothing else connects (Svalbard), but only as a last resort.
    if (options.flightFree) cost = cost * 20 + 10_000;
  }
  if (OVERNIGHT.includes(leg.mode) && leg.minutes >= 600) cost *= 0.55; // you sleep through most of it
  if (leg.scenic) cost *= 0.8; // the view is part of the trip
  return cost;
}

function runs(leg: Leg, month?: Month) {
  return !month || !leg.seasonal || leg.seasonal.includes(month);
}

/** Cheapest path between two places (Dijkstra over the leg graph, both directions). */
export function findPath(from: string, to: string, options: RouteOptions, legs: Leg[] = allLegs): PlannedLeg[] | null {
  if (from === to) return [];
  const usable = legs.filter((l) => runs(l, options.month));
  const dist = new Map<string, number>([[from, 0]]);
  const prev = new Map<string, PlannedLeg>();
  const queue = new Set<string>([from]);
  const done = new Set<string>();

  while (queue.size) {
    let current = "";
    let best = Infinity;
    for (const node of queue) {
      const d = dist.get(node)!;
      if (d < best) {
        best = d;
        current = node;
      }
    }
    queue.delete(current);
    if (current === to) break;
    done.add(current);

    for (const leg of usable) {
      const next = leg.from === current ? leg.to : leg.to === current ? leg.from : null;
      if (!next || done.has(next)) continue;
      const d = best + legCost(leg, options);
      if (d < (dist.get(next) ?? Infinity)) {
        dist.set(next, d);
        prev.set(next, { ...leg, start: current, end: next });
        queue.add(next);
      }
    }
  }

  if (!prev.has(to)) return null;
  const path: PlannedLeg[] = [];
  for (let node = to; node !== from; node = prev.get(node)!.start) path.unshift(prev.get(node)!);
  return path;
}

function haversineKm(a: string, b: string): number {
  const p = places.find((x) => x.id === a)!;
  const q = places.find((x) => x.id === b)!;
  const rad = Math.PI / 180;
  const dLat = (q.lat - p.lat) * rad;
  const dLng = (q.lng - p.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(p.lat * rad) * Math.cos(q.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function legEmissions(leg: PlannedLeg): number {
  const km = haversineKm(leg.start, leg.end) * (leg.mode === "flight" ? 1 : SURFACE_DETOUR);
  return km * kgCO2ePerPassengerKm[leg.mode];
}

/** Plan a route through stops in the given order. */
export function planRoute(stops: string[], options: RouteOptions): PlannedRoute {
  const segments: Segment[] = [];
  const unreachable: PlannedRoute["unreachable"] = [];
  let flying = 0;
  for (let i = 0; i < stops.length - 1; i++) {
    const [from, to] = [stops[i], stops[i + 1]];
    const path = findPath(from, to, options);
    if (path) {
      const chosen = new Set(path.map((l) => l.id));
      const alternatives = allLegs
        .filter((l) => !chosen.has(l.id) && runs(l, options.month) && !(options.flightFree && l.mode === "flight"))
        .filter((l) => (l.from === from && l.to === to) || (l.from === to && l.to === from))
        .map((l) => ({ ...l, start: from, end: to }));
      segments.push({ from, to, legs: path, alternatives });
    }
    else unreachable.push({ from, to });
    flying += haversineKm(from, to) * kgCO2ePerPassengerKm.flight;
  }
  const legs = segments.flatMap((s) => s.legs);
  return {
    segments,
    unreachable,
    totalMinutes: legs.reduce((sum, l) => sum + l.minutes, 0),
    emissions: { route: Math.round(legs.reduce((sum, l) => sum + legEmissions(l), 0)), flying: Math.round(flying) },
    usesFlight: legs.some((l) => l.mode === "flight"),
  };
}
