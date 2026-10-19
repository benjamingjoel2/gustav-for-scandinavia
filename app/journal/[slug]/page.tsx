import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialPage } from "@/components/editorial/EditorialPage";
import { JsonLd } from "@/components/editorial/JsonLd";
import { Photo } from "@/components/ui/Photo";
import { ArrowLink } from "@/components/ui/Links";
import { site } from "@/config/site";
import { journalImage, journalSlugs, loadPost, type JournalSlug } from "@/data/journal";

export const dynamicParams = false;

export function generateStaticParams() {
  return journalSlugs.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

async function get(slug: string) {
  if (!journalSlugs.includes(slug as JournalSlug)) notFound();
  return loadPost(slug as JournalSlug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { meta } = await get((await params).slug);
  const image = journalImage(meta.image);
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/journal/${(await params).slug}` },
    openGraph: { type: "article", publishedTime: meta.date, images: image ? [`${image.src}?w=1200&q=70&auto=format&fit=crop`] : undefined },
  };
}

export default async function JournalPost({ params }: Props) {
  const { slug } = await params;
  const { Content, meta } = await get(slug);
  const image = journalImage(meta.image);
  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(meta.date));
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: meta.title,
          description: meta.description,
          datePublished: meta.date,
          author: { "@type": "Organization", name: site.name },
          publisher: { "@type": "Organization", name: site.name },
          mainEntityOfPage: `${site.url}/journal/${slug}`,
        }}
      />
      <EditorialPage
        eyebrow="Journal"
        title={meta.title}
        lede={meta.description}
        meta={
          <>
            {date} · {meta.readingMinutes} min read
          </>
        }
        aside={
          <div className="flex flex-col items-start gap-6 border-t border-ink/15 pt-6 md:sticky md:top-28">
            {image && (
              <figure className="w-full">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Photo image={image} sizes="(min-width: 768px) 25vw, 100vw" />
                </div>
                <figcaption className="meta mt-2 text-stone">{image.credit}</figcaption>
              </figure>
            )}
            <ArrowLink href="/enquire">Plan a journey</ArrowLink>
          </div>
        }
      >
        <Content />
      </EditorialPage>
    </>
  );
}
