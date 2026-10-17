import Image from "next/image";
import type { ImageRef } from "@/types/content";

interface PhotoProps {
  image?: ImageRef;
  sizes: string;
  className?: string;
  /** Use for the largest image in the first viewport. */
  eager?: boolean;
  /** Crop on the image CDN to the frame's aspect ratio, e.g. "4:5", so it isn't upscaled to fill. */
  ratio?: string;
}

/** A photograph that fills its (relatively positioned) parent. Falls back to a quiet fjord tone. */
export function Photo({ image, sizes, className = "", eager = false, ratio }: PhotoProps) {
  if (!image) return <div aria-hidden className={`absolute inset-0 bg-fjord/40 ${className}`} />;
  return (
    <Image
      src={ratio && image.src.startsWith("https://images.unsplash.com/") ? `${image.src}?ar=${ratio}` : image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      className={`object-cover ${className}`}
      style={{ objectPosition: image.focus ?? "50% 50%" }}
    />
  );
}
