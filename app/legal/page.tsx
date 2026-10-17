import type { Metadata } from "next";
import { EditorialPage } from "@/components/editorial/EditorialPage";
import Content, { meta } from "@/content/pages/legal.mdx";

export const metadata: Metadata = { title: meta.title, description: meta.description, alternates: { canonical: "/legal" } };

export default function Page() {
  return (
    <EditorialPage eyebrow="Legal" title={meta.title} lede={meta.description}>
      <Content />
    </EditorialPage>
  );
}
