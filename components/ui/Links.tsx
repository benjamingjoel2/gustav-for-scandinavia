import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type LinkProps = Omit<ComponentProps<typeof Link>, "children"> & { children: ReactNode; className?: string };

/** Primary call to action: the lingonberry pill. Use once or twice per view. */
export function PillLink({ className = "", children, ...props }: LinkProps) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center rounded-full bg-lingon px-5 py-2.5 font-sans text-sm font-medium tracking-wide text-birch-50 transition-colors duration-500 ease-light hover:bg-lingon-deep ${className}`}
    >
      {children}
    </Link>
  );
}

/** Secondary action over a photograph: an outlined pill in the surrounding text colour. */
export function GhostLink({ className = "", children, ...props }: LinkProps) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center rounded-full border border-current/60 px-7 py-3.5 font-sans text-base font-medium tracking-wide backdrop-blur-sm transition-colors duration-500 ease-light hover:border-current hover:bg-current/10 ${className}`}
    >
      {children}
    </Link>
  );
}

/** Secondary action: a plain text link with an arrow (no boxed label or circle, owner rule). */
export function ArrowLink({ className = "", children, ...props }: LinkProps) {
  return (
    <Link
      {...props}
      className={`group inline-flex items-center gap-2 py-2 font-mono text-xs uppercase tracking-[0.08em] underline decoration-current/40 underline-offset-[6px] transition-colors duration-500 ease-light hover:decoration-current ${className}`}
    >
      {children}
      <span aria-hidden className="transition-transform duration-500 ease-light group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

/** Quiet inline link with a dotted underline. */
export function DottedLink({ className = "", children, ...props }: LinkProps) {
  return (
    <Link {...props} className={`link-dotted inline-flex items-center gap-2 ${className}`}>
      {children}
    </Link>
  );
}
