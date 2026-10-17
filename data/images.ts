import type { ImageRef } from "@/types/content";
import { destinationImages, experienceImages, journeyImages, type SourcedImage } from "./media-sourced";

function toRef(image: SourcedImage | undefined, focus?: string): ImageRef | undefined {
  if (!image) return undefined;
  return { src: image.src, alt: image.alt, credit: image.credit, creditUrl: image.creditUrl, placeholder: true, focus };
}

/** Journey slugs whose photo was sourced under a shorter key. */
const journeyKeys: Record<string, string> = {
  "three-capitals-by-train": "three-capitals-train",
  "a-nordic-christmas": "nordic-christmas",
  "flight-free-scandinavia": "flight-free",
};

export const destinationImage = (slug: string) => toRef(destinationImages[slug]);
export const experienceImage = (id: string) => toRef(experienceImages[id]);
export const journeyImage = (slug: string) => toRef(journeyImages[journeyKeys[slug] ?? slug]);
