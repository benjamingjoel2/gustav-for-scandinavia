import type { ImageRef } from "@/types/content";

// Destination, experience and journey photographs are being sourced; until then sections show a quiet fallback tone.
const none: Record<string, ImageRef> = {};

export const destinationImage = (slug: string): ImageRef | undefined => none[slug];
export const experienceImage = (id: string): ImageRef | undefined => none[id];
export const journeyImage = (slug: string): ImageRef | undefined => none[slug];
