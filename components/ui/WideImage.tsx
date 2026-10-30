import type { ImageRef } from "@/types/content";
import { Photo } from "./Photo";

/** A full-bleed photograph band, used under page headers. */
export function WideImage({ image, eager = true, className = "" }: { image?: ImageRef; eager?: boolean; className?: string }) {
  if (!image) return null;
  return (
    <figure className={className}>
      <div className="relative aspect-[16/10] max-h-[70svh] w-full overflow-hidden bg-birch-200 md:aspect-[21/9]">
        <Photo image={image} sizes="100vw" eager={eager} />
      </div>
    </figure>
  );
}
