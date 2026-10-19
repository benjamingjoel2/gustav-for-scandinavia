import type { Metadata } from "next";
import { EditorialPage } from "@/components/editorial/EditorialPage";
import { ArrowLink } from "@/components/ui/Links";
import { editorialImageSet } from "@/data/images";
import Content, { meta } from "@/content/pages/sapmi.mdx";

export const metadata: Metadata = { title: meta.title, description: meta.description, alternates: { canonical: "/sapmi" } };

export default function Page() {
  const [hero, ...gallery] = editorialImageSet("sapmi");
  return (
    <EditorialPage eyebrow="Travelling in Sápmi" title={meta.title} lede={meta.description} hero={hero} gallery={gallery}
      aside={
          <div className="flex flex-col items-start gap-6 border-t border-ink/15 pt-6">
            <p className="meta text-stone">Sámi partners</p>
            <p className="text-[0.9375rem]">Every partner named on this site is a placeholder while we verify ownership and consent. We only work with Sámi-owned experiences.</p>
            <ArrowLink href="/experiences#reindeer">Reindeer, with Sámi hosts</ArrowLink>
          </div>
      }>
      <Content />
    </EditorialPage>
  );
}
