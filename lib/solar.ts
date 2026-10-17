/**
 * Solar calculations after the NOAA Solar Calculator (Jean Meeus, Astronomical Algorithms).
 * Accurate to about a minute for sunrise and sunset at Nordic latitudes. No external API.
 */

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;
const DAY_MS = 86_400_000;

/** Sun is "up" when its geometric centre is 0.833° below the horizon (refraction + solar disc). */
export const HORIZON_DEPRESSION = 0.833;

export type DayState = "normal" | "midnight-sun" | "polar-night";

export interface SunTimes {
  /** Undefined when the sun does not rise or set on this day. */
  sunrise?: Date;
  sunset?: Date;
  solarNoon: Date;
  daylightMinutes: number;
  state: DayState;
}

export interface LocalDate {
  year: number;
  month: number; // 1–12
  day: number;
}

interface SolarParams {
  declination: number; // radians
  equationOfTime: number; // minutes
}

function julianCentury(ms: number): number {
  const jd = ms / DAY_MS + 2440587.5;
  return (jd - 2451545) / 36525;
}

function solarParams(ms: number): SolarParams {
  const T = julianCentury(ms);
  const L0 = (((280.46646 + T * (36000.76983 + T * 0.0003032)) % 360) + 360) % 360;
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  const C =
    Math.sin(M * RAD) * (1.914602 - T * (0.004817 + 0.000014 * T)) +
    Math.sin(2 * M * RAD) * (0.019993 - 0.000101 * T) +
    Math.sin(3 * M * RAD) * 0.000289;
  const omega = 125.04 - 1934.136 * T;
  const lambda = L0 + C - 0.00569 - 0.00478 * Math.sin(omega * RAD);
  const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60;
  const eps = eps0 + 0.00256 * Math.cos(omega * RAD);
  const declination = Math.asin(Math.sin(eps * RAD) * Math.sin(lambda * RAD));
  const y = Math.tan((eps / 2) * RAD) ** 2;
  const equationOfTime =
    4 *
    DEG *
    (y * Math.sin(2 * L0 * RAD) -
      2 * e * Math.sin(M * RAD) +
      4 * e * y * Math.sin(M * RAD) * Math.cos(2 * L0 * RAD) -
      0.5 * y * y * Math.sin(4 * L0 * RAD) -
      1.25 * e * e * Math.sin(2 * M * RAD));
  return { declination, equationOfTime };
}

/** Solar elevation in degrees at an instant (geometric, without refraction). */
export function getSolarElevation(date: Date, lat: number, lng: number): number {
  const ms = date.getTime();
  const { declination, equationOfTime } = solarParams(ms);
  const utcMinutes = ((ms % DAY_MS) + DAY_MS) % DAY_MS / 60_000;
  const trueSolarTime = (((utcMinutes + equationOfTime + 4 * lng) % 1440) + 1440) % 1440;
  const hourAngle = trueSolarTime / 4 - 180;
  const cosZenith =
    Math.sin(lat * RAD) * Math.sin(declination) +
    Math.cos(lat * RAD) * Math.cos(declination) * Math.cos(hourAngle * RAD);
  return 90 - Math.acos(Math.min(1, Math.max(-1, cosZenith))) * DEG;
}

/** Calendar date at a place, in its own time zone. */
export function getLocalDate(date: Date, timeZone: string): LocalDate {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

/** UTC offset of a time zone at an instant, in minutes (e.g. 120 for CEST). */
export function getTimeZoneOffset(date: Date, timeZone: string): number {
  const name = new Intl.DateTimeFormat("en-GB", { timeZone, timeZoneName: "longOffset" })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName")?.value;
  const match = name?.match(/GMT([+-])(\d{2}):?(\d{2})?/);
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3] ?? 0));
}

/** Sunrise, sunset and day length for a calendar day at a place. */
export function getSunTimes(day: LocalDate, lat: number, lng: number): SunTimes {
  const dayStartUtc = Date.UTC(day.year, day.month - 1, day.day);
  // Refine solar noon once using the parameters at the approximate noon.
  let noonMinutes = 720 - 4 * lng - solarParams(dayStartUtc + (720 - 4 * lng) * 60_000).equationOfTime;
  const noon = solarParams(dayStartUtc + noonMinutes * 60_000);
  noonMinutes = 720 - 4 * lng - noon.equationOfTime;
  const solarNoon = new Date(dayStartUtc + noonMinutes * 60_000);

  const cosHourAngle =
    Math.cos((90 + HORIZON_DEPRESSION) * RAD) / (Math.cos(lat * RAD) * Math.cos(noon.declination)) -
    Math.tan(lat * RAD) * Math.tan(noon.declination);

  if (cosHourAngle > 1) return { solarNoon, daylightMinutes: 0, state: "polar-night" };
  if (cosHourAngle < -1) return { solarNoon, daylightMinutes: 1440, state: "midnight-sun" };

  const halfDay = 4 * Math.acos(cosHourAngle) * DEG; // minutes
  return {
    sunrise: new Date(solarNoon.getTime() - halfDay * 60_000),
    sunset: new Date(solarNoon.getTime() + halfDay * 60_000),
    solarNoon,
    daylightMinutes: Math.round(2 * halfDay),
    state: "normal",
  };
}

export interface SunPathPoint {
  /** Minutes after local midnight. */
  minute: number;
  /** Elevation relative to the visible horizon, in degrees (0 = sunrise/sunset). */
  elevation: number;
}

/** The sun's elevation across a local calendar day, sampled every `step` minutes. */
export function getSunPath(
  day: LocalDate,
  place: { lat: number; lng: number; tz: string },
  step = 10,
): SunPathPoint[] {
  const approxMidnight = Date.UTC(day.year, day.month - 1, day.day);
  const offset = getTimeZoneOffset(new Date(approxMidnight + 12 * 3_600_000), place.tz);
  const localMidnight = approxMidnight - offset * 60_000;
  const points: SunPathPoint[] = [];
  for (let minute = 0; minute <= 1440; minute += step) {
    const elevation = getSolarElevation(new Date(localMidnight + minute * 60_000), place.lat, place.lng);
    points.push({ minute, elevation: elevation + HORIZON_DEPRESSION });
  }
  return points;
}

export interface DateRange {
  start: LocalDate;
  end: LocalDate;
}

/** Midnight-sun and polar-night periods for a place in a given year, computed day by day. */
export function getPolarPeriods(lat: number, lng: number, year: number) {
  const ranges: Record<"midnight-sun" | "polar-night", DateRange[]> = {
    "midnight-sun": [],
    "polar-night": [],
  };
  let current: { state: DayState; start: LocalDate; end: LocalDate } | null = null;
  for (let t = Date.UTC(year, 0, 1); t < Date.UTC(year + 1, 0, 1); t += DAY_MS) {
    const d = new Date(t);
    const day = { year, month: d.getUTCMonth() + 1, day: d.getUTCDate() };
    const { state } = getSunTimes(day, lat, lng);
    if (current && current.state === state) {
      current.end = day;
      continue;
    }
    if (current && current.state !== "normal") ranges[current.state].push({ start: current.start, end: current.end });
    current = { state, start: day, end: day };
  }
  if (current && current.state !== "normal") ranges[current.state].push({ start: current.start, end: current.end });
  return ranges;
}

/** "4h 12m" */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (m === 60) return `${h + 1}h 0m`;
  return `${h}h ${m}m`;
}

/** "09:41" in the place's own time zone. */
export function formatTime(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }).format(date);
}
