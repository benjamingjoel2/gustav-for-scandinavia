"use client";

import { LazyMotion } from "framer-motion";

const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * Animation features (fades) load after the page has rendered, so they don't hold up the first paint.
 * Only pages that animate use this provider.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
