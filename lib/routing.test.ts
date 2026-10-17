import { describe, expect, it } from "vitest";
import { places } from "@/data/places";
import { legs, slowRoutes } from "@/data/routes";
import { findPath, planRoute } from "./routing";

const ids = (path: ReturnType<typeof findPath>) => path?.map((l) => l.id);

describe("route data", () => {
  it("only references known places", () => {
    const known = new Set<string>(places.map((p) => p.id));
    for (const leg of legs) {
      expect(known.has(leg.from), leg.id).toBe(true);
      expect(known.has(leg.to), leg.id).toBe(true);
    }
    for (const route of slowRoutes) for (const stop of route.stops) expect(known.has(stop), route.id).toBe(true);
  });

  it("every slow route can be travelled without flying", () => {
    for (const route of slowRoutes) {
      const plan = planRoute(route.stops, { flightFree: true, month: 7 });
      expect(plan.unreachable, route.id).toEqual([]);
      expect(plan.usesFlight, route.id).toBe(false);
    }
  });
});

describe("findPath", () => {
  it("takes the Bergen Line from Oslo to Bergen when flight-free", () => {
    expect(ids(findPath("oslo", "bergen", { flightFree: true }))).toEqual(["oslo-bergen"]);
  });

  it("flies Oslo to Tromsø when flights are allowed, and goes by land and sea when not", () => {
    expect(findPath("oslo", "tromso", { flightFree: false })?.every((l) => l.mode === "flight")).toBe(true);
    expect(findPath("oslo", "tromso", { flightFree: true })?.some((l) => l.mode === "flight")).toBe(false);
  });

  it("still reaches Svalbard by air when flight-free, as there is no other way", () => {
    const path = findPath("tromso", "svalbard", { flightFree: true });
    expect(path?.map((l) => l.mode)).toEqual(["flight"]);
  });

  it("offers the summer fjord boat as an alternative, but not in January", () => {
    const july = planRoute(["flam", "bergen"], { flightFree: true, month: 7 }).segments[0];
    expect(july.alternatives.map((l) => l.id)).toContain("flam-bergen-boat");
    const january = planRoute(["flam", "bergen"], { flightFree: true, month: 1 }).segments[0];
    expect(january.legs.map((l) => l.id)).toEqual(["flam-bergen-rail"]);
    expect(january.alternatives).toEqual([]);
  });

  it("travels legs in both directions", () => {
    const path = findPath("bergen", "oslo", { flightFree: true });
    expect(path?.[0]).toMatchObject({ id: "oslo-bergen", start: "bergen", end: "oslo" });
  });
});

describe("planRoute", () => {
  it("adds up time and compares emissions with flying", () => {
    const plan = planRoute(["copenhagen", "stockholm", "oslo"], { flightFree: true });
    expect(plan.totalMinutes).toBe(315 + 340);
    expect(plan.emissions.route).toBeLessThan(plan.emissions.flying);
  });
});
