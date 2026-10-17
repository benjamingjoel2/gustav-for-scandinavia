/** "69.65°N 18.96°E" */
export function formatCoords(lat: number, lng: number): string {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(2)}°${ns} ${Math.abs(lng).toFixed(2)}°${ew}`;
}

/** Minutes after local midnight at an instant, in a time zone. */
export function localMinuteOfDay(date: Date, timeZone: string): number {
  const [h, m] = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .format(date)
    .split(":")
    .map(Number);
  return h * 60 + m;
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function monthName(month: number, style: "short" | "long" = "short"): string {
  return style === "short"
    ? MONTHS_SHORT[month - 1]
    : new Intl.DateTimeFormat("en-GB", { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2026, month - 1, 1)));
}

/** [11, 12, 1, 2, 3] → "Nov–Mar"; [2, 3, 6, 7, 8] → "Feb–Mar, Jun–Aug" */
export function formatMonths(months: readonly number[]): string {
  if (months.length === 0) return "";
  if (months.length === 12) return "All year";
  const set = new Set(months);
  // Start each run at a month whose predecessor is not included, so ranges can wrap past December.
  const starts = [...set].filter((m) => !set.has(m === 1 ? 12 : m - 1)).sort((a, b) => a - b);
  return starts
    .map((start) => {
      let end = start;
      while (set.has(end === 12 ? 1 : end + 1) && (end === 12 ? 1 : end + 1) !== start) end = end === 12 ? 1 : end + 1;
      return start === end ? MONTHS_SHORT[start - 1] : `${MONTHS_SHORT[start - 1]}–${MONTHS_SHORT[end - 1]}`;
    })
    .join(", ");
}
