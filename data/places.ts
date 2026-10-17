import type { Place } from "@/types/content";

export const places = [
  { id: "oslo", name: "Oslo", country: "norway", lat: 59.9139, lng: 10.7522, tz: "Europe/Oslo" },
  { id: "bergen", name: "Bergen", country: "norway", lat: 60.3913, lng: 5.3221, tz: "Europe/Oslo" },
  { id: "tromso", name: "Tromsø", country: "norway", lat: 69.6496, lng: 18.956, tz: "Europe/Oslo" },
  { id: "svalbard", name: "Svalbard", country: "norway", lat: 78.2232, lng: 15.6267, tz: "Arctic/Longyearbyen" },
  { id: "stockholm", name: "Stockholm", country: "sweden", lat: 59.3293, lng: 18.0686, tz: "Europe/Stockholm" },
  { id: "copenhagen", name: "Copenhagen", country: "denmark", lat: 55.6761, lng: 12.5683, tz: "Europe/Copenhagen" },
  { id: "helsinki", name: "Helsinki", country: "finland", lat: 60.1699, lng: 24.9384, tz: "Europe/Helsinki" },
  { id: "rovaniemi", name: "Rovaniemi", country: "finland", lat: 66.5039, lng: 25.7294, tz: "Europe/Helsinki" },
] as const satisfies readonly Place[];

export type PlaceId = (typeof places)[number]["id"];

export function getPlace(id: PlaceId): Place {
  return places.find((p) => p.id === id)!;
}

/** Rotating order for the homepage live light. */
export const liveLightPlaceIds: PlaceId[] = ["tromso", "stockholm", "copenhagen", "rovaniemi", "svalbard"];
