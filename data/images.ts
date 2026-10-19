import type { ImageRef, Theme } from "@/types/content";
import { editorialImages } from "./media-editorial";
import { destinationGallery } from "./media-gallery";
import { blackBookImages, momentImages, slowRouteImages } from "./media-extra";
import { destinationImages, experienceImages, journeyImages, type SourcedImage } from "./media-sourced";

function toRef(image: SourcedImage | undefined, focus?: string): ImageRef | undefined {
  if (!image) return undefined;
  return { src: image.src, alt: image.alt, credit: image.credit, creditUrl: image.creditUrl, placeholder: true, focus };
}

const refs = (images: SourcedImage[] | undefined) => (images ?? []).map((i) => toRef(i)!).filter(Boolean);

/** Journey slugs whose photo was sourced under a shorter key. */
const journeyKeys: Record<string, string> = {
  "three-capitals-by-train": "three-capitals-train",
  "a-nordic-christmas": "nordic-christmas",
  "flight-free-scandinavia": "flight-free",
};

export const destinationImage = (slug: string) => toRef(destinationImages[slug]);
export const experienceImage = (id: string) => toRef(experienceImages[id]);
export const journeyImage = (slug: string) => toRef(journeyImages[journeyKeys[slug] ?? slug]);

/** Black Book theme photographs (two per theme). */
export const themeImages = (theme: Theme) => refs(blackBookImages[theme]);
/** One per Light Calendar moment. */
export const momentImage = (id: string) => toRef(momentImages[id]);
/** One per named slow route. */
export const slowRouteImage = (id: string) => toRef(slowRouteImages[id]);
/** Editorial slots: "sapmi", "about", "home-intro", "journal:<slug>", … */
export const editorialImageSet = (key: string) => refs(editorialImages[key]);
/** Three more photographs per destination, for its gallery. */
export const galleryImages = (slug: string) => refs(destinationGallery[slug]);
