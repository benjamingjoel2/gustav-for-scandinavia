import { CountryExplorer } from "@/components/home/CountryExplorer";
import { ExperienceRows } from "@/components/home/ExperienceRows";
import { FlightFreeBand } from "@/components/home/FlightFreeBand";
import { Intro } from "@/components/home/Intro";
import { JourneyRow } from "@/components/home/JourneyRow";
import { LightToday } from "@/components/home/LightToday";
import { Testimonials } from "@/components/home/Testimonials";
import { LiveLight } from "@/components/light/LiveLight";

export const revalidate = 600;

/** Rendered at most every ten minutes (ISR); the client takes over the clock after hydration. */
function renderedAt() {
  return Date.now();
}

export default function Home() {
  const now = renderedAt();
  return (
    <>
      <LiveLight initialNow={now} />
      <Intro />
      <JourneyRow />
      <CountryExplorer />
      <LightToday now={now} />
      <ExperienceRows />
      <FlightFreeBand />
      <Testimonials />
    </>
  );
}
