import { alternatesFor } from "@/lib/i18n-paths";
import type { Metadata } from "next";
import { RouteBuilder } from "@/components/route/RouteBuilder";
import { slowRouteImage } from "@/data/images";
import { slowRoutes } from "@/data/routes";

export const metadata: Metadata = {
  title: "Slow Route Builder",
  description:
    "Pick places across Norway, Sweden, Denmark and Finland and see how to join them by train, ferry, coastal ship or car. Flight-free by default.",
  alternates: alternatesFor("/route-builder"),
};

export default function RouteBuilderPage() {
  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <header className="gutter grid-12 gap-y-6 pb-12 pt-16 md:pt-24">
        <p className="eyebrow col-span-12 text-stone">Slow Route Builder</p>
        <h1 className="headline col-span-12 md:col-span-8">
          Pick the places. We&rsquo;ll find <em>the slow way between them.</em>
        </h1>
        <p className="col-span-12 text-stone md:col-span-4 md:self-end">
          Times are approximate, on board, and seasonal where noted. The scenic legs are the ones we&rsquo;d take even if we were in a hurry.
        </p>
      </header>
      <div className="gutter pb-24">
                  <RouteBuilder routeImages={Object.fromEntries(slowRoutes.map((r) => [r.id, slowRouteImage(r.id)]))} />
      </div>
    </div>
  );
}
