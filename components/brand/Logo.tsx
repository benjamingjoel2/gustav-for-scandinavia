import { SunMark } from "./SunMark";

/** "gustav" in lowercase with the sun-on-the-horizon mark. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-end gap-[0.3em] font-sans font-normal lowercase leading-none tracking-[-0.04em] ${className}`}>
      <SunMark className="mb-[0.12em] h-[0.55em] w-auto" />
      <span>gustav</span>
    </span>
  );
}
