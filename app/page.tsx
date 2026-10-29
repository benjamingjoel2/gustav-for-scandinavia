import { CountryExplorer } from "@/components/home/CountryExplorer";
import { ExperienceRows } from "@/components/home/ExperienceRows";
import { FlightFreeBand } from "@/components/home/FlightFreeBand";
import { Intro } from "@/components/home/Intro";
import { JourneyRow } from "@/components/home/JourneyRow";
import { LightToday } from "@/components/home/LightToday";
import { Testimonials } from "@/components/home/Testimonials";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { LiveLight } from "@/components/light/LiveLight";
import { destinations } from "@/data/destinations";
import { destinationImage, journeyImage } from "@/data/images";
import { journeys } from "@/data/journeys";

export const revalidate = 600;

/** Rendered at most every ten minutes (ISR); the client takes over the clock after hydration. */
function renderedAt() {
  return Date.now();
}

export default function Home() {
  const now = renderedAt();
  return (
    <MotionProvider>
      <LiveLight initialNow={now} />
      <Intro />
      <JourneyRow images={Object.fromEntries(journeys.map((j) => [j.slug, journeyImage(j.slug)]))} />
      <CountryExplorer images={Object.fromEntries(destinations.map((d) => [d.slug, destinationImage(d.slug)]))} />
      <LightToday now={now} />
      <ExperienceRows />
      <FlightFreeBand />
      <Testimonials />
    </MotionProvider>
  );
}
