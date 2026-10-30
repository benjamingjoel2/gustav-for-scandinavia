import type { Metadata } from "next";
import { EditorialPage } from "@/components/editorial/EditorialPage";
import { LegalBody } from "@/components/legal/LegalBody";
import { getLegalPage } from "@/lib/legal";

const page = getLegalPage("terms");

export const metadata: Metadata = { title: page.title, description: page.lede, alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <EditorialPage eyebrow="Legal" title={page.title} lede={page.lede}>
      <LegalBody page={page} />
    </EditorialPage>
  );
}
