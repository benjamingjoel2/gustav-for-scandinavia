"use client";

import { LazyMotion, domAnimation } from "framer-motion";

/** Loads only the animation features we use (fades), keeping Framer Motion's share of the bundle small. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
