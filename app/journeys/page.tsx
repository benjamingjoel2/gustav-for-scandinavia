import type { Metadata } from "next";
import { PageHeader } from "@/components/editorial/PageHeader";
import { JourneyGrid } from "@/components/journeys/JourneyGrid";

export const metadata: Metadata = {
  title: "Journeys",
  description: "Eight private journeys through Norway, Sweden, Denmark and Finland, by train, boat and on foot. Each one can be changed, shortened or slowed down.",
  alternates: { canonical: "/journeys" },
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
      <div className="gutter pb-24">
        <JourneyGrid />
      </div>
    </div>
  );
}
