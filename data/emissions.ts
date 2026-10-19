import type { Mode } from "@/types/content";

/**
 * Approximate greenhouse gas emissions per passenger-kilometre, in kg CO2e.
 * After the UK government's 2024 conversion factors (DESNZ), with Nordic rail adjusted for its largely hydro and
 * wind-powered electricity. Real figures vary a lot by operator, load and vessel; treat these as rough guides only.
 */
export const kgCO2ePerPassengerKm: Record<Mode, number> = {
  train: 0.01,
  "night-train": 0.015,
  bus: 0.03,
  car: 0.09, // average car, two people sharing
  ferry: 0.12, // varies widely; foot passengers lower, cabins higher
  "coastal-ship": 0.25, // coastal voyages are not low-carbon; we say so
  flight: 0.2, // short-haul, including non-CO2 effects
};

/** Surface routes are longer than the straight line between two points. */
export const SURFACE_DETOUR = 1.25;
