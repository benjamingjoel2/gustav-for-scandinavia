import { intlLocale } from "@/lib/i18n-paths";
import type { LegalPage } from "@/data/legal";

const fmt = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString(intlLocale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Body of the Privacy, Booking Terms and Cookie Policy pages. Text lives in data/legal.ts (static, trusted HTML). */
export function LegalBody({ page }: { page: LegalPage }) {
  return (
    <div className="[&_a]:underline [&_a]:decoration-dotted [&_a]:underline-offset-4 [&_li]:mt-2 [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-5 [&_table]:mt-2 [&_table]:w-full [&_table]:border-collapse [&_th]:border-b [&_th]:py-2 [&_th]:pr-4 [&_th]:text-left [&_td]:border-b [&_td]:py-2 [&_td]:pr-4 [&_td]:align-top [&_.legal-table-wrap]:overflow-x-auto">
      <p className="meta text-stone">
        Last updated <time dateTime={page.updated}>{fmt(page.updated)}</time>
      </p>
      {page.sections.map((s) => (
        <section key={s.h}>
          <h2 className="headline mt-14 text-[clamp(1.6rem,1.2rem+1.4vw,2.3rem)]">{s.h}</h2>
          {s.p.map((t, i) => (/^<(ul|div|table|p)[ >]/.test(t) ? <div key={i} className="mt-5" dangerouslySetInnerHTML={{ __html: t }} /> : <p key={i} className="mt-5" dangerouslySetInnerHTML={{ __html: t }} />))}
        </section>
      ))}
    </div>
  );
}
