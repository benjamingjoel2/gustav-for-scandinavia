import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/editorial/PageHeader";
import { DottedLink } from "@/components/ui/Links";
import { Photo } from "@/components/ui/Photo";
import { destinations } from "@/data/destinations";
import { experiences } from "@/data/experiences";
import { experienceImage } from "@/data/images";
import { journeys } from "@/data/journeys";
import { monthName } from "@/lib/format";

export const metadata: Metadata = {
  title: "Experiences",
  description: "Northern lights, midnight sun, fjords, coastal voyages, huskies, reindeer with Sámi hosts, winter whales, New Nordic food, sauna, archipelagos, cabins and sleeper trains.",
  alternates: { canonical: "/experiences" },
};

/** Twelve small marks: which months each experience is in season. */
function Season({ months }: { months: number[] }) {
  return (
    <div className="mt-5">
      <div aria-hidden className="grid grid-cols-12 gap-0.5">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="text-center">
            <div className={`h-1.5 ${months.includes(i + 1) ? "bg-oak" : "bg-ink/10"}`} />
            <span className="meta mt-1 block text-[0.5625rem] text-stone">{monthName(i + 1).slice(0, 1)}</span>
          </div>
        ))}
      </div>
      <p className="sr-only">In season: {months.map((m) => monthName(m, "long")).join(", ")}.</p>
    </div>
  );
}

export default function ExperiencesPage() {
  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <PageHeader
        eyebrow="Experiences"
        title={
          <>
            Fifteen things worth <em>the journey north.</em>
          </>
        }
        aside={<p>What Scandinavians actually do, when they do it, and where. Some are seasonal; none are guaranteed by the weather.</p>}
      />
      <nav aria-label="Experiences" className="gutter pb-12">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {experiences.map((e) => (
            <li key={e.id}>
              <a href={`#${e.id}`} className="link-dotted">
                {e.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="space-y-20 pb-24 md:space-y-28">
        {experiences.map((e, i) => (
          <article key={e.id} id={e.id} aria-labelledby={`${e.id}-title`} className="gutter grid-12 scroll-mt-24 items-start gap-y-8 border-t border-ink/15 pt-12">
            <div className={`relative col-span-12 aspect-[4/3] overflow-hidden bg-birch-200 md:col-span-7 ${i % 2 ? "md:order-2 md:col-start-6" : ""}`}>
              <Photo image={experienceImage(e.id)} ratio="4:3" sizes="(min-width: 768px) 58vw, 100vw" eager={i === 0} />
            </div>
            <div className={`col-span-12 md:col-span-4 ${i % 2 ? "md:order-1 md:col-start-1" : "md:col-start-9"}`}>
              <p className="eyebrow text-stone">{e.seasonNote}</p>
              <h2 id={`${e.id}-title`} className="headline mt-4 text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)]">
                {e.name}
              </h2>
              <p className="lede mt-4 text-[1.25rem]">{e.summary}</p>
              <div className="mt-4 space-y-4">
                {e.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
              <Season months={e.months} />
              <div className="mt-6 space-y-2 text-[0.9375rem]">
                {e.destinationSlugs.length > 0 && (
                  <p>
                    <span className="meta mr-2 text-stone">Where</span>
                    {e.destinationSlugs.map((slug, k) => {
                      const d = destinations.find((x) => x.slug === slug);
                      return d ? (
                        <span key={slug}>
                          {k > 0 && ", "}
                          <Link href={`/destinations/${slug}`} className="link-dotted text-[0.9375rem]">
                            {d.name}
                          </Link>
                        </span>
                      ) : null;
                    })}
                  </p>
                )}
                {e.journeySlugs.slice(0, 2).map((slug) => {
                  const j = journeys.find((x) => x.slug === slug);
                  return j ? (
                    <DottedLink key={slug} href={`/journeys/${slug}`} className="mr-5">
                      {j.title} →
                    </DottedLink>
                  ) : null;
                })}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
