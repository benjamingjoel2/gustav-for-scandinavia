import Image from "next/image";
import type { ImageRef } from "@/types/content";

interface PhotoProps {
  image?: ImageRef;
  sizes: string;
  className?: string;
  /** Use for the largest image in the first viewport. */
  eager?: boolean;
}

/** A photograph that fills its (relatively positioned) parent. Falls back to a quiet fjord tone. */
export function Photo({ image, sizes, className = "", eager = false }: PhotoProps) {
  if (!image) return <div aria-hidden className={`absolute inset-0 bg-fjord/40 ${className}`} />;
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      className={`object-cover ${className}`}
      style={{ objectPosition: image.focus ?? "50% 50%" }}
    />
  );
}
