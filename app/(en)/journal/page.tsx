import { alternatesFor, intlLocale } from "@/lib/i18n-paths";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Photo } from "@/components/ui/Photo";
import { allPosts, journalImage } from "@/data/journal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on travelling slowly through Scandinavia and Finland: light, trains, sauna, and how to do it without flying.",
  alternates: alternatesFor("/journal"),
};

const date = (iso: string) => new Intl.DateTimeFormat(intlLocale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));

export default async function JournalIndex() {
  const posts = await allPosts();
  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <PageHeader eyebrow="Journal" title={<>Notes from <em>the north.</em></>} aside={<p>Practical, unhurried, and occasionally opinionated.</p>} />
      <ul className="gutter grid gap-x-8 gap-y-16 pb-24 md:grid-cols-2">
        {posts.map((post, i) => (
          <li key={post.slug} className={i === 0 ? "md:col-span-2" : ""}>
            <Link href={`/journal/${post.slug}`} className="group grid gap-6 md:grid-cols-2 md:items-end">
              <div className={`relative overflow-hidden bg-birch-200 ${i === 0 ? "aspect-[3/2] md:col-span-1" : "aspect-[4/3] md:col-span-2"}`}>
                <Photo image={journalImage(post.meta.image)} eager={i === 0} sizes="(min-width: 768px) 50vw, 100vw" className="transition-transform duration-[1.6s] ease-light group-hover:scale-[1.03]" />
              </div>
              <div className={i === 0 ? "" : "md:col-span-2"}>
                <p className="meta text-stone">
                  {date(post.meta.date)} · {post.meta.readingMinutes} min read
                </p>
                <h2 className={`mt-3 font-serif font-light tracking-tight group-hover:italic ${i === 0 ? "text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] leading-tight" : "text-[1.75rem] leading-snug"}`}>{post.meta.title}</h2>
                <p className="mt-3 max-w-xl text-stone">{post.meta.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
