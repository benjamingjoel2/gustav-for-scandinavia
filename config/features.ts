export const features = {
  /** ETIAS has not launched yet (expected 2027). Flip to true when it goes live. */
  etiasLive: false,
} as const;

export type Features = typeof features;
