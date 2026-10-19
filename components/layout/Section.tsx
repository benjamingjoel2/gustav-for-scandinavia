import { toneClasses, type Tone } from "@/lib/tones";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: Tone;
  as?: "section" | "div" | "article" | "aside";
}

export function Section({ tone = "birch", as: Tag = "section", className = "", children, ...props }: SectionProps) {
  return (
    <Tag {...props} className={`${toneClasses[tone]} ${className}`}>
      {children}
    </Tag>
  );
}
