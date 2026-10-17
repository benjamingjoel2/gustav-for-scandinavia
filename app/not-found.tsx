import { SunPath } from "@/components/horizon/SunPath";
import { ArrowLink } from "@/components/ui/Links";
import { getPlace } from "@/data/places";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col justify-center bg-polar pt-16 text-birch-50">
      <div className="gutter">
        <p className="eyebrow text-birch-50/60">404</p>
        <h1 className="headline mt-4 max-w-2xl">
          This page is in <em>polar night.</em>
        </h1>
        <p className="mt-6 max-w-md text-birch-50/80">It doesn&rsquo;t exist, or it moved. The light comes back; this page might not.</p>
      </div>
      <SunPath place={getPlace("svalbard")} day={{ year: 2026, month: 12, day: 21 }} height={90} labels={false} className="my-12" />
      <div className="gutter flex flex-wrap gap-6">
        <ArrowLink href="/">Home</ArrowLink>
        <ArrowLink href="/journeys">Journeys</ArrowLink>
      </div>
    </div>
  );
}
