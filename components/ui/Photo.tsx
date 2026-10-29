import { preload } from "react-dom";
import { PHOTO_FALLBACK_WIDTH, PHOTO_WIDTHS } from "@/lib/photo-widths";
import type { ImageRef } from "@/types/content";

interface PhotoProps {
  image?: ImageRef;
  sizes: string;
  className?: string;
  /** Use for the largest image in the first viewport. */
  eager?: boolean;
}

const UNSPLASH = /^https:\/\/images\.unsplash\.com\/photo-([\w-]+)$/;

/**
 * A photograph that fills its (relatively positioned) parent. Unsplash photos are served from
 * public/photos (built by scripts/build-photos.ts), with a tiny blurred copy behind them while they load.
 * Falls back to a quiet fjord tone.
 */
const photoId = (image: ImageRef) => image.src.match(UNSPLASH)?.[1];
const avifSrcSet = (id: string) => PHOTO_WIDTHS.map((w) => `/photos/${id}-${w}.avif ${w}w`).join(", ");

/** Ask the browser to fetch a photo ahead of time, e.g. the opening photograph or a carousel's next slide. */
export function preloadPhoto(image: ImageRef, sizes: string, fetchPriority: "high" | "low") {
  const id = photoId(image);
  if (id) preload(`/photos/${id}-${PHOTO_WIDTHS[0]}.avif`, { as: "image", imageSrcSet: avifSrcSet(id), imageSizes: sizes, type: "image/avif", fetchPriority });
}

export function Photo({ image, sizes, className = "", eager = false }: PhotoProps) {
  if (!image) return <div aria-hidden className={`absolute inset-0 bg-fjord/40 ${className}`} />;

  const id = photoId(image);
  const position = image.focus ?? "50% 50%";
  // Let the browser start on the opening photograph before it has parsed the rest of the page.
  if (eager) preloadPhoto(image, sizes, "high");
  return (
    <picture>
      {id && <source type="image/avif" srcSet={avifSrcSet(id)} sizes={sizes} />}
      <img
        src={id ? `/photos/${id}-${PHOTO_FALLBACK_WIDTH}.jpg` : image.src}
        alt={image.alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
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
