import { CountryTiles } from "@/components/home/CountryTiles";
import { ExperienceRows } from "@/components/home/ExperienceRows";
import { FlightFreeBand } from "@/components/home/FlightFreeBand";
import { Intro } from "@/components/home/Intro";
import { JourneyRow } from "@/components/home/JourneyRow";
import { LightBand } from "@/components/home/LightBand";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { LiveLight } from "@/components/light/LiveLight";
import { journeyImage } from "@/data/images";
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
      <CountryTiles />
      <LightBand />
      <ExperienceRows />
      <FlightFreeBand />
    </MotionProvider>
  );
}
