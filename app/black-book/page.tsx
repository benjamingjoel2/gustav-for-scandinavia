import type { Metadata } from "next";
import { BlackBook } from "@/components/blackbook/BlackBook";
import { PageHeader } from "@/components/editorial/PageHeader";

export const metadata: Metadata = {
  title: "Gustav's Black Book",
  description: "The places Scandinavians actually love: New Nordic restaurants, bakeries, saunas, design, architecture, cabins, islands and galleries.",
  alternates: { canonical: "/black-book" },
};

export default function BlackBookPage() {
  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <PageHeader
        eyebrow="Gustav's Black Book"
        title={
          <>
            Where Scandinavians <em>actually</em> go.
          </>
        }
        aside={
          <p>
            Cardamom buns at seven, a public sauna on the harbour, an island with one café. Every name here is a placeholder while we verify it; the
            kind of place is real.
          </p>
        }
      />
      <div className="gutter pb-24">
        <BlackBook />
      </div>
    </div>
  );
}
