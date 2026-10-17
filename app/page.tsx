import { SunPath, describeDay } from "@/components/horizon/SunPath";
import { DottedLink } from "@/components/ui/Links";
import { getPlace } from "@/data/places";
import { getLocalDate } from "@/lib/solar";

export const revalidate = 600;

// Step 2 shell: the hero composition. Live rotation and photography arrive in step 3.
export default function Home() {
  const place = getPlace("tromso");
  const now = new Date();
  const day = getLocalDate(now, place.tz);
  const local = new Intl.DateTimeFormat("en-GB", { timeZone: place.tz, hour: "numeric", minute: "numeric", hourCycle: "h23" })
    .format(now)
    .split(":")
    .map(Number);

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-[linear-gradient(180deg,#1d3040_0%,#4a6072_55%,#a88a6a_100%)] text-birch-50">
      <div className="gutter flex flex-1 flex-col justify-center pt-24">
        <h1 className="font-sans text-display font-light lowercase">
          gustav<span className="sr-only">. Scandinavia, thoughtfully.</span>
        </h1>
      </div>
      <SunPath place={place} day={day} markerMinute={local[0] * 60 + local[1]} height={120} className="text-birch-50" labels={false} />
      <div className="gutter flex flex-wrap items-end justify-between gap-6 pb-8 pt-6">
        <p className="meta max-w-md">{describeDay(place, day)}</p>
        <DottedLink href="#intro">Discover Gustav ↓</DottedLink>
      </div>
    </section>
  );
}
