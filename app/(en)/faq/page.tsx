import { alternatesFor } from "@/lib/i18n-paths";
import type { Metadata } from "next";
import { WideImage } from "@/components/ui/WideImage";
import { editorialImageSet } from "@/data/images";
import { JsonLd } from "@/components/editorial/JsonLd";
import { PageHeader } from "@/components/editorial/PageHeader";
import { ArrowLink } from "@/components/ui/Links";
import { Tag } from "@/components/ui/Tag";
import { features } from "@/config/features";
import { faq } from "@/data/faq";
import type { FaqItem } from "@/types/content";

export const metadata: Metadata = {
  title: "FAQ",
  description: "When to go, northern lights chances, midnight sun dates, the cold, trains and boats, flight-free travel, money, entry rules (EES and ETIAS), children, deposits.",
  alternates: alternatesFor("/faq"),
};

const GROUPS: FaqItem["group"][] = ["Planning", "Light and weather", "Getting around", "Money", "Entry and documents", "Families", "Booking"];

/** Show the ETIAS answer that matches the config toggle. */
const visible = faq.filter((item) => (item.id === "etias" ? !features.etiasLive : item.id === "etias-live" ? features.etiasLive : true));

export default function FaqPage() {
  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: visible.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
        }}
      />
      <PageHeader eyebrow="FAQ" title={<>Good questions, <em>plain answers.</em></>} aside={<p>If yours isn&rsquo;t here, ask us. We&rsquo;d rather you did.</p>} />
      <WideImage image={editorialImageSet("faq")[0]} className="mb-14" />
      <div className="gutter grid-12 gap-y-16 pb-24">
        <nav aria-label="FAQ topics" className="col-span-12 md:col-span-3">
          <ul className="space-y-2 md:sticky md:top-28">
            {GROUPS.filter((g) => visible.some((i) => i.group === g)).map((g) => (
              <li key={g}>
                <a href={`#${g.toLowerCase().replace(/\s+/g, "-")}`} className="link-dotted">
                  {g}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="col-span-12 space-y-16 md:col-span-8 md:col-start-5">
          {GROUPS.map((group) => {
            const items = visible.filter((i) => i.group === group);
            if (!items.length) return null;
            return (
              <section key={group} id={group.toLowerCase().replace(/\s+/g, "-")} aria-labelledby={`h-${group}`} className="scroll-mt-28">
                <h2 id={`h-${group}`} className="eyebrow text-stone">
                  {group}
                </h2>
                <div className="mt-4 border-t border-ink/15">
                  {items.map((item) => (
                    <details key={item.id} id={item.id} className="group scroll-mt-28 border-b border-ink/15">
                      <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-5 font-serif text-xl font-light [&::-webkit-details-marker]:hidden">
                        <span>
                          {item.q}
                          {item.id === "etias" && <Tag className="ml-3 align-middle text-oak-deep">Coming soon</Tag>}
                        </span>
                        <span aria-hidden className="font-sans text-base text-stone transition-transform duration-300 group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <div className="space-y-4 pb-6 text-ink/85">
                        {item.a.split(/\n\n+/).map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            );
          })}
          <ArrowLink href="/enquire">Ask us something else</ArrowLink>
        </div>
      </div>
    </div>
  );
}
