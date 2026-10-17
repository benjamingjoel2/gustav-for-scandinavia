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

/** Secondary action: a hairline label with a round arrow beside it. */
export function ArrowLink({ className = "", children, ...props }: LinkProps) {
  return (
    <Link {...props} className={`group inline-flex items-stretch font-mono text-xs uppercase tracking-[0.08em] ${className}`}>
      <span className="flex items-center border border-current/60 px-4 py-2.5 transition-colors duration-500 ease-light group-hover:border-current">
        {children}
      </span>
      <span
        aria-hidden
        className="-ml-px flex aspect-square items-center justify-center rounded-full border border-current/60 px-2.5 transition-transform duration-500 ease-light group-hover:translate-x-1 group-hover:border-current"
      >
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
