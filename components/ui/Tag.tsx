/** A small boxed label, e.g. a theme or "Placeholder". */
export function Tag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`meta inline-block border border-current/50 px-1.5 py-0.5 text-[0.625rem] leading-tight ${className}`}>{children}</span>;
}

/** Looks like ArrowLink, for use inside a larger link. */
export function ArrowLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span aria-hidden className={`inline-flex items-stretch font-mono text-xs uppercase tracking-[0.08em] ${className}`}>
      <span className="flex items-center border border-current/60 px-4 py-2.5">{children}</span>
      <span className="-ml-px flex aspect-square items-center justify-center rounded-full border border-current/60 px-2.5 transition-transform duration-500 ease-light group-hover:translate-x-1">
        →
      </span>
    </span>
  );
}
