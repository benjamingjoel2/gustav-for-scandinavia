import type { Destination } from "@/types/content";

// Pitches are short and honest. Full pages (light, routes, Black Book, stays) arrive with the destination pages.
export const destinations: Destination[] = [
  // Norway
  { slug: "oslo", name: "Oslo", country: "norway", placeId: "oslo", region: "Eastern Norway", pitch: "A capital on a fjord, with a sauna on the harbour and forest at the end of the metro line.", bestMonths: [5, 6, 7, 8, 9, 12] },
  { slug: "bergen", name: "Bergen", country: "norway", placeId: "bergen", region: "Western Norway", pitch: "Seven hills, a wooden wharf and a famous amount of rain. Pack a good coat; it's worth it.", bestMonths: [5, 6, 7, 8, 9] },
  { slug: "geirangerfjord", name: "Geirangerfjord", country: "norway", placeId: "geiranger", region: "Western Norway", pitch: "Steep walls, waterfalls and old farms on ledges. Arrive early or late, when the cruise ships have gone.", bestMonths: [5, 6, 7, 8, 9] },
  { slug: "naeroyfjord", name: "Nærøyfjord", country: "norway", placeId: "flam", region: "Western Norway", pitch: "One of the narrowest fjords in the world, best seen slowly from a quiet boat or a kayak.", bestMonths: [5, 6, 7, 8, 9] },
  { slug: "lofoten", name: "Lofoten", country: "norway", placeId: "svolvaer", region: "Northern Norway", pitch: "Granite peaks straight out of the sea, red cabins on stilts, and beaches that would be famous if the water were warmer.", bestMonths: [2, 3, 6, 7, 8, 9] },
  { slug: "tromso", name: "Tromsø", country: "norway", placeId: "tromso", region: "Northern Norway", pitch: "A small Arctic city with a big appetite for the outdoors. In June it forgets to get dark.", bestMonths: [1, 2, 3, 6, 7, 10, 11, 12] },
  { slug: "north-cape", name: "The North Cape", country: "norway", placeId: "north-cape", region: "Finnmark", pitch: "The edge of the mainland. Wind, a cliff, the Barents Sea, and on a clear summer night, the sun at midnight.", bestMonths: [6, 7, 8] },
  { slug: "svalbard", name: "Svalbard", country: "norway", placeId: "svalbard", region: "The high Arctic", pitch: "Halfway between Norway and the North Pole. Glaciers, polar bears you hope to see from a boat, and four months of daylight.", bestMonths: [3, 4, 6, 7, 8] },
  // Sweden
  { slug: "stockholm", name: "Stockholm and the archipelago", country: "sweden", placeId: "stockholm", region: "Eastern Sweden", pitch: "A city on fourteen islands, and thirty thousand more beyond it. Take the boat out and keep going.", bestMonths: [5, 6, 7, 8, 12] },
  { slug: "gothenburg", name: "Gothenburg and the West Coast", country: "sweden", placeId: "gothenburg", region: "Western Sweden", pitch: "Seafood, smooth granite skerries and fishing villages painted white and red.", bestMonths: [5, 6, 7, 8, 9] },
  { slug: "swedish-lapland", name: "Swedish Lapland", country: "sweden", placeId: "abisko", region: "Abisko and Kiruna", pitch: "Mountains, birch forest and some of the clearest skies in Europe. The night train from Stockholm gets you there.", bestMonths: [1, 2, 3, 6, 7, 9] },
  { slug: "gotland", name: "Gotland", country: "sweden", placeId: "visby", region: "The Baltic", pitch: "A medieval walled town, limestone sea stacks and long, quiet roads. Summer here is unhurried.", bestMonths: [5, 6, 7, 8, 9] },
  // Denmark
  { slug: "copenhagen", name: "Copenhagen", country: "denmark", placeId: "copenhagen", region: "Zealand", pitch: "Swim in the harbour, cycle everywhere, eat very well. A city that makes good design look easy.", bestMonths: [5, 6, 7, 8, 9, 12] },
  { slug: "skagen", name: "Skagen", country: "denmark", placeId: "skagen", region: "Northern Jutland", pitch: "Where two seas meet at the top of Denmark. Painters came for the light; it's still here.", bestMonths: [5, 6, 7, 8, 9] },
  { slug: "funen", name: "Funen and the islands", country: "denmark", placeId: "odense", region: "Southern Denmark", pitch: "Farm shops, castles, and small islands reached by small ferries. Denmark at bicycle speed.", bestMonths: [5, 6, 7, 8, 9] },
  { slug: "faroe-islands", name: "The Faroe Islands", country: "denmark", placeId: "torshavn", region: "North Atlantic", pitch: "Eighteen green islands in the North Atlantic. Weather that changes by the minute, and you will not mind.", bestMonths: [5, 6, 7, 8] },
  // Finland
  { slug: "helsinki", name: "Helsinki", country: "finland", placeId: "helsinki", region: "Southern Finland", pitch: "A calm capital on the Baltic. Public saunas, good architecture, and islands a short ferry away.", bestMonths: [5, 6, 7, 8, 12] },
  { slug: "finnish-lapland", name: "Finnish Lapland", country: "finland", placeId: "saariselka", region: "Rovaniemi and Saariselkä", pitch: "Fells, forest and long, quiet snow. Aurora season runs well into March, and so does the cross-country skiing.", bestMonths: [1, 2, 3, 9, 12] },
  { slug: "lakeland", name: "The Lakeland", country: "finland", placeId: "savonlinna", region: "Eastern Finland", pitch: "Tens of thousands of lakes, a lakeside sauna at nearly every cabin, and summer evenings that last.", bestMonths: [6, 7, 8] },
];

export function destinationsIn(country: Destination["country"]) {
  return destinations.filter((d) => d.country === country);
}
