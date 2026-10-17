import type { Place } from "@/types/content";

/** Every point on the map: destinations, light reference points and route stops. */
export const places = [
  // Norway
  { id: "oslo", name: "Oslo", country: "norway", lat: 59.9139, lng: 10.7522, tz: "Europe/Oslo" },
  { id: "bergen", name: "Bergen", country: "norway", lat: 60.3913, lng: 5.3221, tz: "Europe/Oslo" },
  { id: "flam", name: "Flåm", country: "norway", lat: 60.8628, lng: 7.1137, tz: "Europe/Oslo" },
  { id: "geiranger", name: "Geiranger", country: "norway", lat: 62.1008, lng: 7.2059, tz: "Europe/Oslo" },
  { id: "svolvaer", name: "Lofoten", country: "norway", lat: 68.2342, lng: 14.5683, tz: "Europe/Oslo" },
  { id: "tromso", name: "Tromsø", country: "norway", lat: 69.6496, lng: 18.956, tz: "Europe/Oslo" },
  { id: "north-cape", name: "North Cape", country: "norway", lat: 71.1725, lng: 25.7841, tz: "Europe/Oslo" },
  { id: "alesund", name: "Ålesund", country: "norway", lat: 62.4722, lng: 6.1495, tz: "Europe/Oslo" },
  { id: "trondheim", name: "Trondheim", country: "norway", lat: 63.4305, lng: 10.3951, tz: "Europe/Oslo" },
  { id: "bodo", name: "Bodø", country: "norway", lat: 67.2804, lng: 14.4049, tz: "Europe/Oslo" },
  { id: "narvik", name: "Narvik", country: "norway", lat: 68.4385, lng: 17.4273, tz: "Europe/Oslo" },
  { id: "kirkenes", name: "Kirkenes", country: "norway", lat: 69.7271, lng: 30.0451, tz: "Europe/Oslo" },
  { id: "svalbard", name: "Svalbard", country: "norway", lat: 78.2232, lng: 15.6267, tz: "Arctic/Longyearbyen" },
  // Sweden
  { id: "stockholm", name: "Stockholm", country: "sweden", lat: 59.3293, lng: 18.0686, tz: "Europe/Stockholm" },
  { id: "gothenburg", name: "Gothenburg", country: "sweden", lat: 57.7089, lng: 11.9746, tz: "Europe/Stockholm" },
  { id: "abisko", name: "Abisko", country: "sweden", lat: 68.3495, lng: 18.8312, tz: "Europe/Stockholm" },
  { id: "kiruna", name: "Kiruna", country: "sweden", lat: 67.8558, lng: 20.2253, tz: "Europe/Stockholm" },
  { id: "visby", name: "Visby", country: "sweden", lat: 57.6348, lng: 18.2948, tz: "Europe/Stockholm" },
  // Denmark
  { id: "copenhagen", name: "Copenhagen", country: "denmark", lat: 55.6761, lng: 12.5683, tz: "Europe/Copenhagen" },
  { id: "skagen", name: "Skagen", country: "denmark", lat: 57.7209, lng: 10.5839, tz: "Europe/Copenhagen" },
  { id: "odense", name: "Odense", country: "denmark", lat: 55.4038, lng: 10.4024, tz: "Europe/Copenhagen" },
  { id: "hirtshals", name: "Hirtshals", country: "denmark", lat: 57.5881, lng: 9.9599, tz: "Europe/Copenhagen" },
  { id: "torshavn", name: "Tórshavn", country: "denmark", lat: 62.0107, lng: -6.7741, tz: "Atlantic/Faroe" },
  // Finland
  { id: "helsinki", name: "Helsinki", country: "finland", lat: 60.1699, lng: 24.9384, tz: "Europe/Helsinki" },
  { id: "turku", name: "Turku", country: "finland", lat: 60.4518, lng: 22.2666, tz: "Europe/Helsinki" },
  { id: "rovaniemi", name: "Rovaniemi", country: "finland", lat: 66.5039, lng: 25.7294, tz: "Europe/Helsinki" },
  { id: "saariselka", name: "Saariselkä", country: "finland", lat: 68.4205, lng: 27.4119, tz: "Europe/Helsinki" },
  { id: "savonlinna", name: "Savonlinna", country: "finland", lat: 61.8686, lng: 28.8867, tz: "Europe/Helsinki" },
] as const satisfies readonly Place[];

export type PlaceId = (typeof places)[number]["id"];

export function getPlace(id: PlaceId): Place {
  return places.find((p) => p.id === id)!;
}

/** Rotating order for the homepage live light. */
export const liveLightPlaceIds: PlaceId[] = ["tromso", "stockholm", "copenhagen", "rovaniemi", "svalbard"];
