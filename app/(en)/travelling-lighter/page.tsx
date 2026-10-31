import { alternatesFor } from "@/lib/i18n-paths";
import type { Metadata } from "next";
import { EditorialPage } from "@/components/editorial/EditorialPage";
import { ArrowLink } from "@/components/ui/Links";
import { editorialImageSet, slowRouteImage } from "@/data/images";
import type { ImageRef } from "@/types/content";
import Content, { meta } from "@/content/pages/travelling-lighter.mdx";

export const metadata: Metadata = { title: meta.title, description: meta.description, alternates: alternatesFor("/travelling-lighter") };

export default function Page() {
  const [hero, ...gallery] = [...editorialImageSet("travelling-lighter"), ...["bergen-line", "three-capitals", "oslofjord-ferry"].map(slowRouteImage)].filter((x): x is ImageRef => !!x);
  return (
    <EditorialPage eyebrow="Travelling lighter" title={meta.title} lede={meta.description} hero={hero} gallery={gallery}
      aside={
          <div className="flex flex-col items-start gap-6 border-t border-ink/15 pt-6">
            <p className="meta text-stone">Try it</p>
            <p className="text-[0.9375rem]">The route builder is flight-free by default and shows a rough estimate for every route.</p>
            <ArrowLink href="/route-builder">Build a slow route</ArrowLink>
          </div>
      }>
      <Content />
    </EditorialPage>
  );
}
