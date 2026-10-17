"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import { menuGroups, overlayHeaderRoutes, primaryNav, site } from "@/config/site";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a, button")?.focus();
    const button = menuButton.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel.current) {
        const focusable = panel.current.querySelectorAll<HTMLElement>("a, button");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  const overlay = overlayHeaderRoutes.includes(pathname) && !scrolled;

  return (
    <>
      <a href="#main" className="sr-only z-[60] bg-birch-50 px-4 py-2 font-sans text-sm focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-40 font-sans transition-colors duration-700 ease-light ${
          overlay ? "bg-transparent text-birch-50" : "border-b border-ink/10 bg-birch/95 text-ink backdrop-blur-sm"
        }`}
      >
        <div className="gutter flex h-16 items-center gap-6 md:h-[4.5rem]">
          <Link href="/" aria-label={`${site.name}, home`} className={`text-[1.65rem] transition-opacity duration-500 ${overlay && pathname === "/" ? "opacity-0 focus-visible:opacity-100" : "opacity-100"}`}>
            <Logo />
          </Link>
          <nav aria-label="Primary" className="hidden flex-1 justify-between px-[4vw] lg:flex">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                className="text-[0.9375rem] underline-offset-[0.4em] hover:underline aria-[current=page]:underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex items-center gap-2 px-2 py-2 font-mono text-xs uppercase tracking-[0.1em]"
            >
              Menu
              <span aria-hidden className="flex w-4 flex-col gap-[3px]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-2/3 bg-current" />
              </span>
            </button>
            <Link href="/enquire" className="rounded-full bg-lingon px-4 py-2 text-sm font-medium text-birch-50 transition-colors duration-500 hover:bg-lingon-deep">
              Enquire
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            ref={panel}
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            className="fixed inset-0 z-50 overflow-y-auto bg-pine font-sans text-birch-50"
          >
            <div className="gutter flex h-16 items-center md:h-[4.5rem]">
              <Link href="/" className="text-[1.65rem]" onClick={() => setOpen(false)}>
                <Logo />
              </Link>
              <button type="button" onClick={() => setOpen(false)} className="ml-auto px-2 py-2 font-mono text-xs uppercase tracking-[0.1em]">
                Close ✕
              </button>
            </div>
            <div aria-hidden className="h-px bg-birch-50/30" />
            <nav aria-label="Site" className="gutter grid-12 gap-y-12 py-14 md:py-20">
              {menuGroups.map((group) => (
                <div key={group.label} className="col-span-12 sm:col-span-6 lg:col-span-3">
                  <p className="meta mb-5 text-birch-50/80">{group.label}</p>
                  <ul className="space-y-3">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} onClick={() => setOpen(false)} className="font-serif text-3xl font-light tracking-tight hover:italic md:text-4xl">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
            <div className="gutter pb-12">
              <p className="lede italic text-birch-50/80">{site.promise}</p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
