import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { CurrencySwitcher } from "@/components/ui/Currency";
import { PillLink } from "@/components/ui/Links";
import { Photo } from "@/components/ui/Photo";
import { legalNav, menuGroups, site } from "@/config/site";
import { destinationImage } from "@/data/images";

export function Footer() {
  return (
    <footer className="bg-polar text-birch-50">
      {/* Closing invitation over a full-bleed photograph. */}
      <section className="relative isolate flex min-h-[70svh] items-end overflow-hidden md:min-h-[85svh]">
        <Photo image={destinationImage("geirangerfjord")} sizes="100vw" className="-z-20" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-polar via-polar/45 to-polar/5" />
        <div className="gutter w-full pb-16 pt-32 md:pb-24">
          <p className="headline max-w-4xl text-[clamp(3rem,1.5rem+6vw,7.5rem)] leading-[0.95]">
            Follow the <em>light.</em>
          </p>
          <p className="mt-6 max-w-md font-sans text-lg leading-relaxed text-birch-50/85">
            Tell us where, when and how slowly. We&rsquo;ll plan the rest and reply within two working days.
          </p>
          <PillLink href="/enquire" className="mt-10 px-7 py-3.5 text-base">
            Start planning
          </PillLink>
        </div>
      </section>

      <div className="gutter pb-10 pt-16 md:pt-20">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-4">
            <Link href="/" aria-label={site.name} className="inline-block">
              <Logo className="text-3xl" />
            </Link>
            <address className="font-sans text-sm not-italic leading-relaxed text-birch-50/70">
              {site.address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <p className="font-sans text-sm leading-relaxed text-birch-50/70">
              <a href={`mailto:${site.contact.email}`} className="text-birch-50 underline-offset-4 hover:underline">
                {site.contact.email}
              </a>
              <span className="block">{site.contact.hours}</span>
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 font-sans text-[0.9375rem] sm:grid-cols-4 lg:col-span-8">
            {menuGroups.map((group) => (
              <div key={group.label}>
                <p className="eyebrow mb-5 text-birch-50/50">{group.label}</p>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="text-birch-50/90 underline-offset-4 transition-colors hover:text-birch-50 hover:underline">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-birch-50/15 pt-8 font-sans text-xs text-birch-50/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p>© {new Date().getFullYear()} {site.name}</p>
            {legalNav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-birch-50 hover:underline">
                {item.label}
              </Link>
            ))}
          </div>
          <CurrencySwitcher />
        </div>
      </div>
    </footer>
  );
}
