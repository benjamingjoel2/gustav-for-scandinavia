import { DottedLink } from "@/components/ui/Links";
import { Photo } from "@/components/ui/Photo";
import { editorialImageSet } from "@/data/images";

const facts = [
  ["How", "By train, boat and on foot. Flights only where they make sense."],
  ["Where", "Norway, Sweden, Denmark and Finland. Nineteen places we know well."],
  ["When", "Planned around the light: midnight sun, polar night, and the months between."],
];

export function Intro() {
  const [tall, wide] = editorialImageSet("home-intro");
  return (
    <section id="intro" aria-labelledby="intro-title" className="gutter grid-12 scroll-mt-20 gap-y-10 py-24 md:py-36">
      <p className="eyebrow col-span-12 text-stone">Private journeys through Scandinavia and Finland</p>
      <h2 id="intro-title" className="headline col-span-12 max-w-4xl md:col-span-9">
        Scandinavia is best experienced <em>slowly</em>, by train, boat and on foot, following the light.
      </h2>

      {tall && (
        <figure className="col-span-8 md:col-span-4 md:mt-8">
          <div className="relative aspect-[4/5] overflow-hidden bg-birch-200">
            <Photo image={tall} sizes="(min-width: 768px) 33vw, 66vw" />
          </div>
          <figcaption className="meta mt-2 text-stone">{tall.credit}</figcaption>
        </figure>
      )}

      <div className="col-span-12 md:col-span-6 md:col-start-6 md:mt-8 lg:col-span-5 lg:col-start-7">
        <div className="prose-gustav">
          <p>
            Gustav plans private journeys for people who would rather see one fjord properly than five from a coach window. We choose the route, the
            trains and boats, the cabins and small hotels, and the season, so the light does what you came for.
          </p>
          <p>No crowds, no fuss. A plan that leaves room to stay another hour.</p>
        </div>
        <DottedLink href="/about" className="mt-8">
          How we travel →
        </DottedLink>
        {wide && (
          <figure className="mt-12">
            <div className="relative aspect-[3/2] overflow-hidden bg-birch-200">
              <Photo image={wide} sizes="(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw" />
            </div>
            <figcaption className="meta mt-2 text-stone">{wide.credit}</figcaption>
          </figure>
        )}
      </div>

      <dl className="col-span-12 mt-6 grid gap-x-8 gap-y-6 border-t border-ink/15 pt-6 md:grid-cols-3">
        {facts.map(([term, detail]) => (
          <div key={term}>
            <dt className="meta text-stone">{term}</dt>
            <dd className="mt-2 font-sans text-[0.9375rem] leading-relaxed">{detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
