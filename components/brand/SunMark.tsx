/** A half sun resting on the horizon. Inherits currentColor. */
export function SunMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 28 16"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
    >
      <path d="M7 13a7 7 0 0 1 14 0" fill="currentColor" />
      <path d="M0 13.5h28" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}
