import { Photo } from "@/components/ui/Photo";
import { DottedLink } from "@/components/ui/Links";
import { experienceImage } from "@/data/images";

const rows = [
  {
    id: "northern-lights",
    eyebrow: "Northern lights · September to March",
    title: (
      <>
        We don&rsquo;t promise the <em>northern lights.</em>
      </>
    ),
    text: "We put you where your chances are best: far enough north, away from town light, in the dark months, with a warm cabin to wait in and a guide who will drive inland when the coast clouds over.",
    link: { href: "/experiences#northern-lights", label: "Northern lights, honestly →" },
  },
  {
    id: "sauna",
    eyebrow: "Sauna and cold water",
    title: (
      <>
        Sauna, cold water, <em>repeat.</em>
      </>
    ),
    text: "Locals call it maintenance. From the public saunas on Helsinki's waterfront to a smoke sauna by a lake in the east, we will find you the real thing, and the right lake to jump into afterwards.",
    link: { href: "/experiences#sauna", label: "Sauna like a Finn →" },
  },
  {
    id: "sleeper-train",
    eyebrow: "Rail and sea",
    title: (
      <>
        The best way from Oslo to Bergen takes seven hours. <em>That&rsquo;s the point.</em>
      </>
    ),
    text: "Mountain plateau, frozen lakes, a branch line down to the fjord. Scandinavia's railways and coastal ships are not the slow option; they are the view. Build a route and see how far they reach.",
    link: { href: "/route-builder", label: "Open the Slow Route Builder →" },
  },
];

/** Alternating image and text, one idea per row. */
export function ExperienceRows() {
  return (
    <section aria-labelledby="experiences-title" className="bg-birch-50 py-24 md:py-32">
      <div className="gutter">
        <p className="eyebrow text-stone">Experiences</p>
        <h2 id="experiences-title" className="headline mt-4 max-w-3xl">
          What Scandinavians <em>actually</em> do.
        </h2>
      </div>
      <div className="mt-16 space-y-20 md:space-y-28">
        {rows.map((row, i) => (
          <article key={row.id} className="gutter grid-12 items-center gap-y-8">
            <div className={`relative col-span-12 aspect-[4/3] overflow-hidden md:col-span-7 ${i % 2 ? "md:order-2 md:col-start-6" : ""}`}>
              <Photo image={experienceImage(row.id)} ratio="4:3" sizes="(min-width: 768px) 58vw, 100vw" />
            </div>
            <div className={`col-span-12 md:col-span-4 ${i % 2 ? "md:order-1 md:col-start-1" : "md:col-start-9"}`}>
              <p className="eyebrow text-stone">{row.eyebrow}</p>
              <h3 className="headline mt-4 text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)]">{row.title}</h3>
              <p className="mt-5">{row.text}</p>
              <DottedLink href={row.link.href} className="mt-6">
                {row.link.label}
              </DottedLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
