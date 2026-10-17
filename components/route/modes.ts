import type { Mode } from "@/types/content";

export const modeLabel: Record<Mode, string> = {
  train: "Train",
  "night-train": "Night train",
  ferry: "Ferry",
  "coastal-ship": "Coastal ship",
  car: "Car",
  bus: "Bus",
  flight: "Flight",
};

/** SVG stroke dash pattern per mode, so the map reads without colour. */
export const modeDash: Record<Mode, string | undefined> = {
  train: undefined,
  "night-train": undefined,
  ferry: "6 5",
  "coastal-ship": "6 5",
  car: "1.5 5",
  bus: "1.5 5",
  flight: "2 8",
};
