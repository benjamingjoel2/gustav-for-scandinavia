import { alternatesFor } from "@/lib/i18n-paths";
import type { Metadata } from "next";
import { WideImage } from "@/components/ui/WideImage";
import { editorialImageSet, journeyImage } from "@/data/images";
import { journeys } from "@/data/journeys";
import { PageHeader } from "@/components/editorial/PageHeader";
import { JourneyGrid } from "@/components/journeys/JourneyGrid";

export const metadata: Metadata = {
  title: "Journeys",
  description: "Eight private journeys through Norway, Sweden, Denmark and Finland, by train, boat and on foot. Each one can be changed, shortened or slowed down.",
  alternates: alternatesFor("/journeys"),
};

export default function JourneysPage() {
  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <PageHeader
        eyebrow="Journeys"
        title={
          <>
            Eight starting points. <em>Every one can change.</em>
          </>
        }
        aside={<p>These are journeys we know work. Treat them as a first draft: we will move days, swap stays and change the season around you.</p>}
      />
      <WideImage image={editorialImageSet("journeys-hero")[0]} className="mb-14" />
      <div className="gutter pb-24">
        <JourneyGrid images={Object.fromEntries(journeys.map((j) => [j.slug, journeyImage(j.slug)]))} />
      </div>
    </div>
  );
}
