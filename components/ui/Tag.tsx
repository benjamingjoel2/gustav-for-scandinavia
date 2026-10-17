/** A small boxed label, e.g. a theme or "Placeholder". */
export function Tag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`meta inline-block border border-current/50 px-1.5 py-0.5 text-[0.625rem] ${className}`}>{children}</span>;
}
