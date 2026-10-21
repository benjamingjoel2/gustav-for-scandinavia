"use client";

/** Unsplash resizes on its own CDN; local images are served as they are. */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("https://images.unsplash.com/")) {
    const join = src.includes("?") ? "&" : "?";
    return `${src}${join}w=${width}&q=${quality ?? 65}&auto=format&fit=crop`;
  }
  return src;
}
