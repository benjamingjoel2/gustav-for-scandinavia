import { preload } from "react-dom";
import { PHOTO_FALLBACK_WIDTH, PHOTO_WIDTHS } from "@/lib/photo-widths";
import type { ImageRef } from "@/types/content";

interface PhotoProps {
  image?: ImageRef;
  sizes: string;
  className?: string;
  /** Use for the largest image in the first viewport. */
  eager?: boolean;
  /** Load quietly in the background and hide from assistive tech, e.g. the next slide of a carousel. */
  background?: boolean;
}

const UNSPLASH = /^https:\/\/images\.unsplash\.com\/photo-([\w-]+)$/;

/**
 * A photograph that fills its (relatively positioned) parent. Unsplash photos are served from
 * public/photos (built by scripts/build-photos.ts), with a tiny blurred copy behind them while they load.
 * Falls back to a quiet fjord tone.
 */
export function Photo({ image, sizes, className = "", eager = false, background = false }: PhotoProps) {
  if (!image) return <div aria-hidden className={`absolute inset-0 bg-fjord/40 ${className}`} />;

  const id = image.src.match(UNSPLASH)?.[1];
  const position = image.focus ?? "50% 50%";
  const avifSet = id && PHOTO_WIDTHS.map((w) => `/photos/${id}-${w}.avif ${w}w`).join(", ");
  // Let the browser start on the opening photograph before it has parsed the rest of the page.
  if (eager && avifSet) preload(`/photos/${id}-${PHOTO_WIDTHS[0]}.avif`, { as: "image", imageSrcSet: avifSet, imageSizes: sizes, type: "image/avif", fetchPriority: "high" });
  return (
    <picture>
      {avifSet && <source type="image/avif" srcSet={avifSet} sizes={sizes} />}
      <img
        src={id ? `/photos/${id}-${PHOTO_FALLBACK_WIDTH}.jpg` : image.src}
        alt={background ? "" : image.alt}
        aria-hidden={background || undefined}
        loading={eager || background ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : background ? "low" : undefined}
        decoding={eager ? "sync" : "async"}
        className={`absolute inset-0 h-full w-full bg-fjord/40 bg-cover object-cover ${className}`}
        style={{
          objectPosition: position,
          backgroundPosition: position,
          backgroundImage: id ? `url(/photos/${id}-blur.webp)` : undefined,
        }}
      />
    </picture>
  );
}
