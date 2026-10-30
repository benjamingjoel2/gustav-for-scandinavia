import type { ImageRef } from "@/types/content";
import { Photo } from "./Photo";

/**
 * Three to four photographs in an asymmetric arrangement: a wide lead image, a tall one offset below,
 * and smaller companions. Credits sit underneath in the data voice.
 */
export function Gallery({ images, className = "" }: { images: ImageRef[]; className?: string }) {
  const [a, b, c, d] = images;
  if (!a) return null;
  return (
    <div className={`grid-12 gap-y-6 ${className}`}>
      <figure className="col-span-12 md:col-span-7">
        <div className="relative aspect-[3/2] overflow-hidden bg-birch-200">
          <Photo image={a} sizes="(min-width: 768px) 58vw, 100vw" />
        </div>
      </figure>
      {b && (
        <figure className="col-span-8 col-start-5 md:col-span-4 md:col-start-9 md:mt-24">
          <div className="relative aspect-[4/5] overflow-hidden bg-birch-200">
            <Photo image={b} sizes="(min-width: 768px) 33vw, 66vw" />
          </div>
        </figure>
      )}
      {c && (
        <figure className={`col-span-12 md:col-span-5 md:col-start-2 ${d ? "" : "md:-mt-12"}`}>
          <div className="relative aspect-[4/3] overflow-hidden bg-birch-200">
            <Photo image={c} sizes="(min-width: 768px) 42vw, 100vw" />
          </div>
        </figure>
      )}
      {d && (
        <figure className="col-span-10 md:col-span-4 md:col-start-8 md:mt-16">
          <div className="relative aspect-[1/1] overflow-hidden bg-birch-200">
            <Photo image={d} sizes="(min-width: 768px) 33vw, 83vw" />
          </div>
        </figure>
      )}
    </div>
  );
}
