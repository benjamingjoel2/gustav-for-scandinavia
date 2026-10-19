import type { CountryId } from "@/types/content";

export type Tone = "birch" | "birch-50" | "pine" | "fjord" | "lichen" | "heather" | "polar";

/** Background + text classes for colour-blocked sections. */
export const toneClasses: Record<Tone, string> = {
  birch: "bg-birch text-ink",
  "birch-50": "bg-birch-50 text-ink",
  pine: "bg-pine text-birch-50",
  fjord: "bg-fjord text-birch-50",
  lichen: "bg-lichen text-birch-50",
  heather: "bg-heather text-birch-50",
  polar: "bg-polar text-birch-50",
};

/** Each country has its own colour, used for its blocks, map pins and calendar lines. */
export const countryTone: Record<CountryId, Tone> = {
  norway: "fjord",
  sweden: "pine",
  denmark: "heather",
  finland: "lichen",
};
