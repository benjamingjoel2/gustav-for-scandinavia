/** Widths of the self-hosted AVIF copies in public/photos (see scripts/build-photos.ts). */
export const PHOTO_WIDTHS = [640, 960, 1280, 1920] as const;

/** Width of the single JPEG copy for browsers without AVIF. */
export const PHOTO_FALLBACK_WIDTH = 1280;
