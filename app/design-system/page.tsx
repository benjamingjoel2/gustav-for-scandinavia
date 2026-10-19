import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { Horizon } from "@/components/horizon/Horizon";
import { SunPath } from "@/components/horizon/SunPath";
import { Section } from "@/components/layout/Section";
import { ArrowLink, DottedLink, PillLink } from "@/components/ui/Links";
import { Tag } from "@/components/ui/Tag";
import { getPlace, type PlaceId } from "@/data/places";
import { countryTone, toneClasses } from "@/lib/tones";

export const metadata: Metadata = { title: "Design system", robots: { index: false } };

const swatches = [
  ["birch", "#F3EFE6", "Page"],
  ["birch-50", "#FBF9F4", "Raised"],
  ["ink", "#1B2420", "Text"],
  ["pine", "#2E4639", "Sweden · footer"],
  ["fjord", "#4A6072", "Norway"],
  ["heather", "#8A5666", "Denmark"],
  ["lichen", "#5F6B53", "Finland"],
  ["oak", "#A57D4E", "Sun arcs"],
  ["lingon", "#A3263A", "Call to action"],
  ["polar", "#101B21", "Polar night"],
] as const;

const arcs: PlaceId[] = ["copenhagen", "stockholm", "rovaniemi", "tromso", "svalbard"];

export default function DesignSystem() {
  return (
    <div className="pt-28">
      <div className="gutter pb-16">
        <p className="eyebrow text-stone">Gustav · design system</p>
        <h1 className="mt-4 font-sans text-title font-light">Warm, tactile, quiet.</h1>
        <p className="lede mt-6 max-w-2xl">
          Three voices: a light grotesk for <em>scale</em>, a soft serif for <em>stories</em>, a mono for <em>facts</em>.
        </p>
      </div>
      <Horizon />

      <div className="gutter grid-12 gap-y-10 py-16">
        <h2 className="eyebrow col-span-12 text-stone">Colour</h2>
        {swatches.map(([name, hex, use]) => (
          <div key={name} className="col-span-6 sm:col-span-4 lg:col-span-2">
            <div className="aspect-[4/5] border border-ink/10" style={{ background: `var(--color-${name})` }} />
            <p className="mt-3 font-sans text-sm">{name}</p>
            <p className="meta text-stone">
              {hex} · {use}
            </p>
          </div>
        ))}
      </div>
      <Horizon />

      <div className="gutter space-y-12 py-16">
        <h2 className="eyebrow text-stone">Type</h2>
        <p className="font-sans text-display font-light lowercase">gustav</p>
        <p className="font-sans text-title font-light">Lofoten in March</p>
        <p className="headline max-w-3xl">
          Oslo to Bergen takes seven hours. <em>That&rsquo;s the point.</em>
        </p>
        <p className="lede max-w-2xl">
          In June, Tromsø forgets to get dark. <em>You&rsquo;ll forget to sleep.</em>
        </p>
        <div className="prose-gustav">
          <p>
            We don&rsquo;t promise the northern lights. We put you where your chances are best: far enough north, away from town light, in the dark months
            between September and March, with a warm cabin to wait in.
          </p>
          <p>Sauna, cold water, repeat. Locals call it maintenance.</p>
        </div>
        <p className="meta">69.65°N 18.96°E · 12 days · from €6,400 · flight-free</p>
        <div className="flex flex-wrap gap-2">
          <Tag>Sauna</Tag>
          <Tag>Design</Tag>
          <Tag>Placeholder</Tag>
        </div>
      </div>
      <Horizon />

      <div className="gutter flex flex-wrap items-center gap-8 py-16">
        <h2 className="eyebrow w-full text-stone">Actions</h2>
        <PillLink href="/enquire">Ask us to plan this</PillLink>
        <ArrowLink href="/journeys">View journey</ArrowLink>
        <DottedLink href="/light-calendar">Open the Light Calendar →</DottedLink>
        <span className="text-[2.5rem]">
          <Logo />
        </span>
      </div>

      <div className="grid md:grid-cols-4">
        {(Object.entries(countryTone) as [string, keyof typeof toneClasses][]).map(([country, tone]) => (
          <Section key={country} tone={tone} className="flex aspect-square flex-col justify-between p-8 md:aspect-[3/4]">
            <p className="eyebrow">{country}</p>
            <div>
              <p className="headline capitalize">{country}</p>
              <ArrowLink href={`/destinations`} className="mt-6">
                Explore
              </ArrowLink>
            </div>
          </Section>
        ))}
      </div>

      <Section tone="polar" className="py-16">
        <div className="gutter">
          <h2 className="eyebrow text-birch-50/80">The horizon line · sun path on the 21st</h2>
        </div>
        {(["June", "December"] as const).map((label) => (
          <div key={label} className="mt-10">
            <p className="gutter meta text-birch-50/80">{label}</p>
            {arcs.map((id) => {
              const place = getPlace(id);
              return (
                <div key={id} className="mt-6">
                  <p className="gutter meta">{place.name}</p>
                  <SunPath place={place} day={{ year: 2026, month: label === "June" ? 6 : 12, day: 21 }} height={110} markerMinute={12 * 60} />
                </div>
              );
            })}
          </div>
        ))}
      </Section>
    </div>
  );
}
