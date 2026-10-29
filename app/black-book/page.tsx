import type { Metadata } from "next";
import { BlackBook } from "@/components/blackbook/BlackBook";
import { PageHeader } from "@/components/editorial/PageHeader";
import { WideImage } from "@/components/ui/WideImage";
import { editorialImageSet, themeImages } from "@/data/images";
import type { Theme } from "@/types/content";

const THEMES: Theme[] = ["restaurant", "bakery", "sauna", "design", "architecture", "cabin", "island", "gallery"];

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
      <WideImage image={editorialImageSet("black-book-hero")[0]} className="mb-14" />
      <div className="gutter pb-24">
        <BlackBook themeImages={Object.fromEntries(THEMES.map((t) => [t, themeImages(t)])) as Record<Theme, ReturnType<typeof themeImages>>} />
      </div>
    </div>
  );
}
