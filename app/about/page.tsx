import type { Metadata } from "next";
import { EditorialPage } from "@/components/editorial/EditorialPage";
import { ArrowLink } from "@/components/ui/Links";
import { editorialImageSet } from "@/data/images";
import Content, { meta } from "@/content/pages/about.mdx";

export const metadata: Metadata = { title: meta.title, description: meta.description, alternates: { canonical: "/about" } };

export default function Page() {
  // Low sun over the lake leads; the quieter details follow.
  const about = editorialImageSet("about");
  const [hero, ...gallery] = [about[3], about[0], about[1], about[2]].filter(Boolean);
  return (
    <EditorialPage eyebrow="About" title={meta.title} lede={meta.description} hero={hero} gallery={gallery}
      aside={
          <div className="flex flex-col items-start gap-6 border-t border-ink/15 pt-6">
            <p className="meta text-stone">Start here</p>
            <ArrowLink href="/journeys">Journeys</ArrowLink>
            <ArrowLink href="/enquire">Enquire</ArrowLink>
          </div>
      }>
      <Content />
    </EditorialPage>
  );
}
