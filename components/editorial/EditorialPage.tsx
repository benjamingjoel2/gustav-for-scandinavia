import type { ReactNode } from "react";
import { Horizon } from "@/components/horizon/Horizon";

/** Long-form page: title, a lede, and a reading column. Used for MDX pages and journal posts. */
export function EditorialPage({ eyebrow, title, lede, meta, children, aside }: { eyebrow: string; title: string; lede?: string; meta?: ReactNode; children: ReactNode; aside?: ReactNode }) {
  return (
    <article className="pt-16 md:pt-[4.5rem]">
      <header className="gutter grid-12 gap-y-6 pb-12 pt-16 md:pt-24">
        <p className="eyebrow col-span-12 text-stone">{eyebrow}</p>
        <h1 className="col-span-12 font-sans text-title font-light md:col-span-10">{title}</h1>
        {lede && <p className="lede col-span-12 max-w-3xl text-ink/80 md:col-span-8">{lede}</p>}
        {meta && <div className="meta col-span-12 text-stone">{meta}</div>}
      </header>
      <Horizon />
      <div className="gutter grid-12 gap-y-12 py-16 md:py-20">
        <div className="col-span-12 max-w-[68ch] md:col-span-8 lg:col-span-7 lg:col-start-2">{children}</div>
        {aside && <aside className="col-span-12 md:col-span-4 lg:col-span-3 lg:col-start-10">{aside}</aside>}
      </div>
    </article>
  );
}
