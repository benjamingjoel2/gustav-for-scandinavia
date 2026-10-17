/** The thin line that runs through the site. Full bleed by default; inherits currentColor. */
export function Horizon({ className = "", inset = false }: { className?: string; inset?: boolean }) {
  return (
    <div aria-hidden className={inset ? `gutter ${className}` : className}>
      <div className="h-px w-full bg-current opacity-35" />
    </div>
  );
}
