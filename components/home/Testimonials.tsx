import { Tag } from "@/components/ui/Tag";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  const [first, ...rest] = testimonials;
  return (
    <section aria-labelledby="words-title" className="gutter py-24 md:py-32">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="eyebrow text-stone">From travellers</p>
          <h2 id="words-title" className="headline mt-4">
            In their <em>words.</em>
          </h2>
        </div>
        <Tag className="text-stone">Placeholder quotes, not real reviews</Tag>
      </div>
      <div className="grid-12 mt-14 gap-y-12">
        <figure className="col-span-12 lg:col-span-8">
          <blockquote className="lede text-[clamp(1.5rem,1.1rem+1.6vw,2.4rem)]">&ldquo;{first.quote}&rdquo;</blockquote>
          <figcaption className="meta mt-5 text-stone">
            {first.from} · {first.journey}
          </figcaption>
        </figure>
        <ul className="col-span-12 grid gap-x-8 gap-y-10 border-t border-ink/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((t) => (
            <li key={t.id}>
              <figure>
                <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="meta mt-4 text-stone">
                  {t.from} · {t.journey}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
