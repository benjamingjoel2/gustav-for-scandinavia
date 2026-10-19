import { describe, expect, it } from "vitest";
import { formatDuration, formatTime, getPolarPeriods, getSunPath, getSunTimes } from "./solar";

const STOCKHOLM = { lat: 59.3293, lng: 18.0686, tz: "Europe/Stockholm" };
const COPENHAGEN = { lat: 55.6761, lng: 12.5683, tz: "Europe/Copenhagen" };
const TROMSO = { lat: 69.6496, lng: 18.956, tz: "Europe/Oslo" };
const LONGYEARBYEN = { lat: 78.2232, lng: 15.6267, tz: "Arctic/Longyearbyen" };

describe("getSunTimes", () => {
  it("Stockholm midsummer is about 18h 37m", () => {
    const t = getSunTimes({ year: 2026, month: 6, day: 21 }, STOCKHOLM.lat, STOCKHOLM.lng);
    expect(t.state).toBe("normal");
    expect(Math.abs(t.daylightMinutes - (18 * 60 + 37))).toBeLessThanOrEqual(3);
    expect(formatTime(t.sunrise!, STOCKHOLM.tz)).toMatch(/^03:(2\d|3[0-4])$/);
    expect(formatTime(t.sunset!, STOCKHOLM.tz)).toMatch(/^22:(0\d|1[0-2])$/);
  });

  it("Copenhagen midwinter is about 7h 0m", () => {
    const t = getSunTimes({ year: 2026, month: 12, day: 21 }, COPENHAGEN.lat, COPENHAGEN.lng);
    expect(Math.abs(t.daylightMinutes - 7 * 60)).toBeLessThanOrEqual(4);
  });

  it("Tromsø has midnight sun in June and polar night in December", () => {
    expect(getSunTimes({ year: 2026, month: 6, day: 21 }, TROMSO.lat, TROMSO.lng).state).toBe("midnight-sun");
    expect(getSunTimes({ year: 2026, month: 12, day: 21 }, TROMSO.lat, TROMSO.lng).state).toBe("polar-night");
  });
});

describe("getPolarPeriods", () => {
  it("Tromsø midnight sun runs roughly 20 May – 22 July", () => {
    const [ms] = getPolarPeriods(TROMSO.lat, TROMSO.lng, 2026)["midnight-sun"];
    expect(ms.start.month).toBe(5);
    expect(ms.start.day).toBeGreaterThanOrEqual(17);
    expect(ms.start.day).toBeLessThanOrEqual(22);
    expect(ms.end.month).toBe(7);
    expect(ms.end.day).toBeGreaterThanOrEqual(20);
    expect(ms.end.day).toBeLessThanOrEqual(25);
  });

  it("Longyearbyen midnight sun runs roughly 19 April – 23 August", () => {
    const [ms] = getPolarPeriods(LONGYEARBYEN.lat, LONGYEARBYEN.lng, 2026)["midnight-sun"];
    expect(ms.start).toMatchObject({ month: 4 });
    expect(ms.start.day).toBeGreaterThanOrEqual(17);
    expect(ms.start.day).toBeLessThanOrEqual(21);
    expect(ms.end).toMatchObject({ month: 8 });
    expect(ms.end.day).toBeGreaterThanOrEqual(21);
    expect(ms.end.day).toBeLessThanOrEqual(25);
  });

  it("Stockholm has neither", () => {
    const p = getPolarPeriods(STOCKHOLM.lat, STOCKHOLM.lng, 2026);
    expect(p["midnight-sun"]).toHaveLength(0);
    expect(p["polar-night"]).toHaveLength(0);
  });
});

describe("getSunPath", () => {
  it("peaks near local solar noon and crosses the horizon at sunrise", () => {
    const path = getSunPath({ year: 2026, month: 3, day: 20 }, STOCKHOLM);
    const peak = path.reduce((a, b) => (b.elevation > a.elevation ? b : a));
    // Solar noon in Stockholm in March is about 12:00–12:10 CET.
    expect(peak.minute).toBeGreaterThanOrEqual(11 * 60 + 40);
    expect(peak.minute).toBeLessThanOrEqual(12 * 60 + 30);
    expect(peak.elevation).toBeGreaterThan(30);
    expect(path[0].elevation).toBeLessThan(0);
  });

  it("stays below the horizon all day in Tromsø at midwinter", () => {
    const path = getSunPath({ year: 2026, month: 12, day: 21 }, TROMSO);
    expect(Math.max(...path.map((p) => p.elevation))).toBeLessThan(0);
  });
});

describe("formatDuration", () => {
  it("formats minutes as hours and minutes", () => {
    expect(formatDuration(252)).toBe("4h 12m");
    expect(formatDuration(0)).toBe("0h 0m");
  });
});
