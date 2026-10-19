import type { ReactNode } from "react";

/** Standard page opening: eyebrow, serif headline with an italic accent, and a short aside. */
export function PageHeader({ eyebrow, title, aside, tone = "light" }: { eyebrow: string; title: ReactNode; aside?: ReactNode; tone?: "light" | "dark" }) {
  return (
    <header className="gutter grid-12 gap-y-6 pb-12 pt-16 md:pt-24">
      <p className={`eyebrow col-span-12 ${tone === "dark" ? "text-birch-50/80" : "text-stone"}`}>{eyebrow}</p>
      <h1 className="headline col-span-12 md:col-span-8">{title}</h1>
      {aside && <div className={`col-span-12 md:col-span-4 md:self-end ${tone === "dark" ? "text-birch-50/80" : "text-stone"}`}>{aside}</div>}
    </header>
  );
}
