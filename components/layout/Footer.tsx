import Link from "next/link";
import { SunMark } from "@/components/brand/SunMark";
import { CurrencySwitcher } from "@/components/ui/Currency";
import { PillLink } from "@/components/ui/Links";
import { legalNav, menuGroups, site } from "@/config/site";

export function Footer() {
  return (
    <footer className="overflow-hidden bg-pine text-birch-50">
      <div className="relative mt-16" aria-hidden>
        <div className="h-px bg-birch-50/35" />
        <SunMark className="absolute bottom-[-1.5px] left-1/2 h-4 w-auto -translate-x-1/2 text-oak" />
      </div>

      <div className="gutter grid-12 gap-y-14 py-16 md:py-24">
        <div className="col-span-12 lg:col-span-5">
          <p className="headline">
            Follow the <em>light.</em>
          </p>
          <p className="mt-6 max-w-sm text-birch-50/80">
            Tell us where, when and how slowly. We&rsquo;ll plan the rest and reply within two working days.
          </p>
          <PillLink href="/enquire" className="mt-8">
            Start planning
          </PillLink>
        </div>

        <nav aria-label="Footer" className="col-span-12 grid grid-cols-2 gap-x-6 gap-y-10 font-sans text-[0.9375rem] sm:grid-cols-4 lg:col-span-7">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <p className="meta mb-4 text-birch-50/80">{group.label}</p>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="underline-offset-4 hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="col-span-12 grid gap-8 border-t border-birch-50/20 pt-8 md:grid-cols-2">
          <div className="meta space-y-1 text-birch-50/80">
            {site.address.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="meta space-y-1 text-birch-50/80 md:text-right">
            <p>
              <a href={`mailto:${site.contact.email}`} className="hover:underline">
                {site.contact.email}
              </a>
            </p>
            <p>{site.contact.hours}</p>
          </div>
        </div>

        <div className="col-span-12 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-xs text-birch-50/80">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <CurrencySwitcher className="order-last ml-auto text-birch-50/80" />
          {legalNav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-birch-50 hover:underline">
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <p aria-hidden className="gutter -mb-[0.2em] select-none font-sans text-display font-light lowercase text-birch-50/90">
        gustav
      </p>
    </footer>
  );
}
