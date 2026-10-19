import type { Leg, SlowRoute } from "@/types/content";

/*
 * Connections between places. Times are editable estimates (typical scheduled journey time on board, rounded),
 * not timetables; check operators before relying on them. Legs work in both directions.
 */
export const legs: Leg[] = [
  // Denmark
  { id: "cph-ode", from: "copenhagen", to: "odense", mode: "train", minutes: 75 },
  { id: "cph-skagen", from: "copenhagen", to: "skagen", mode: "train", minutes: 330, note: "Change in Aalborg and Frederikshavn." },
  { id: "skagen-hirtshals", from: "skagen", to: "hirtshals", mode: "car", minutes: 50 },
  { id: "ode-hirtshals", from: "odense", to: "hirtshals", mode: "train", minutes: 240, note: "Via Aalborg and Hjørring." },
  { id: "hirtshals-torshavn", from: "hirtshals", to: "torshavn", mode: "ferry", minutes: 2160, scenic: true, name: "North Atlantic ferry", note: "About a day and a half at sea, cabins on board." },
  { id: "cph-torshavn-air", from: "copenhagen", to: "torshavn", mode: "flight", minutes: 125 },
  // Denmark – Sweden – Norway
  { id: "cph-gbg", from: "copenhagen", to: "gothenburg", mode: "train", minutes: 220, note: "Across the Øresund Bridge." },
  { id: "cph-sthlm", from: "copenhagen", to: "stockholm", mode: "train", minutes: 315 },
  { id: "cph-oslo-ferry", from: "copenhagen", to: "oslo", mode: "ferry", minutes: 1035, scenic: true, name: "Overnight ferry", note: "Leaves Copenhagen in the afternoon, sails up the Oslofjord at breakfast." },
  { id: "cph-oslo-air", from: "copenhagen", to: "oslo", mode: "flight", minutes: 70 },
  { id: "cph-sthlm-air", from: "copenhagen", to: "stockholm", mode: "flight", minutes: 70 },
  { id: "gbg-oslo", from: "gothenburg", to: "oslo", mode: "train", minutes: 225, note: "Along the Bohuslän coast." },
  { id: "sthlm-oslo", from: "stockholm", to: "oslo", mode: "train", minutes: 340 },
  { id: "sthlm-oslo-air", from: "stockholm", to: "oslo", mode: "flight", minutes: 60 },
  // Sweden
  { id: "sthlm-visby", from: "stockholm", to: "visby", mode: "ferry", minutes: 270, note: "Train to Nynäshamn, then about three hours by ferry." },
  { id: "sthlm-kiruna", from: "stockholm", to: "kiruna", mode: "night-train", minutes: 960, scenic: true, name: "Night train to Lapland", note: "Sleeper cabins; you wake up north of the Arctic Circle." },
  { id: "sthlm-kiruna-air", from: "stockholm", to: "kiruna", mode: "flight", minutes: 95 },
  { id: "kiruna-abisko", from: "kiruna", to: "abisko", mode: "train", minutes: 80, scenic: true },
  { id: "abisko-narvik", from: "abisko", to: "narvik", mode: "train", minutes: 100, scenic: true, name: "Ofoten Line", note: "Down from the mountains to the fjord, one of Europe's most northerly railways." },
  // Sweden – Finland
  { id: "sthlm-hel-ferry", from: "stockholm", to: "helsinki", mode: "ferry", minutes: 975, scenic: true, name: "Overnight archipelago ferry", note: "Through the Stockholm and Åland archipelagos at dusk." },
  { id: "sthlm-turku-ferry", from: "stockholm", to: "turku", mode: "ferry", minutes: 660, scenic: true, name: "Archipelago ferry", note: "Day or night sailing via Åland." },
  { id: "sthlm-hel-air", from: "stockholm", to: "helsinki", mode: "flight", minutes: 55 },
  { id: "kiruna-rovaniemi", from: "kiruna", to: "rovaniemi", mode: "car", minutes: 380, note: "Across the Torne valley border." },
  // Finland
  { id: "turku-hel", from: "turku", to: "helsinki", mode: "train", minutes: 120 },
  { id: "hel-rov", from: "helsinki", to: "rovaniemi", mode: "night-train", minutes: 720, scenic: true, name: "Night train to Lapland", note: "Sleeper and car carrier; Rovaniemi by morning." },
  { id: "hel-rov-air", from: "helsinki", to: "rovaniemi", mode: "flight", minutes: 85 },
  { id: "rov-saariselka", from: "rovaniemi", to: "saariselka", mode: "bus", minutes: 210 },
  { id: "hel-saariselka-air", from: "helsinki", to: "saariselka", mode: "flight", minutes: 105, note: "To Ivalo, then 30 minutes by road." },
  { id: "hel-savonlinna", from: "helsinki", to: "savonlinna", mode: "train", minutes: 255, note: "Change at Parikkala." },
  { id: "saariselka-northcape", from: "saariselka", to: "north-cape", mode: "car", minutes: 330, note: "Through Karasjok and along the Porsangerfjord." },
  { id: "saariselka-kirkenes", from: "saariselka", to: "kirkenes", mode: "car", minutes: 240 },
  // Norway: rail
  { id: "oslo-bergen", from: "oslo", to: "bergen", mode: "train", minutes: 420, scenic: true, name: "Bergen Line", note: "Over the Hardangervidda plateau, the highest mainline railway in northern Europe." },
  { id: "oslo-flam", from: "oslo", to: "flam", mode: "train", minutes: 345, scenic: true, name: "Bergen Line and Flåm Railway", note: "Change at Myrdal for the steep branch line down to the fjord." },
  { id: "flam-bergen-rail", from: "flam", to: "bergen", mode: "train", minutes: 165, scenic: true, name: "Flåm Railway and Bergen Line", note: "Up to Myrdal, then west to Bergen." },
  { id: "oslo-trondheim", from: "oslo", to: "trondheim", mode: "train", minutes: 400, scenic: true, name: "Dovre Line" },
  { id: "trondheim-bodo", from: "trondheim", to: "bodo", mode: "night-train", minutes: 600, scenic: true, name: "Nordland Line", note: "Crosses the Arctic Circle; take the day train in summer for the view." },
  { id: "oslo-alesund", from: "oslo", to: "alesund", mode: "train", minutes: 510, scenic: true, name: "Rauma Line", note: "Train to Åndalsnes through the Romsdal valley, then about two hours by bus." },
  { id: "oslo-bergen-air", from: "oslo", to: "bergen", mode: "flight", minutes: 50 },
  { id: "oslo-tromso-air", from: "oslo", to: "tromso", mode: "flight", minutes: 115 },
  { id: "oslo-bodo-air", from: "oslo", to: "bodo", mode: "flight", minutes: 90 },
  { id: "oslo-alesund-air", from: "oslo", to: "alesund", mode: "flight", minutes: 55 },
  { id: "oslo-svalbard-air", from: "oslo", to: "svalbard", mode: "flight", minutes: 190, note: "Svalbard can only sensibly be reached by air." },
  { id: "tromso-svalbard-air", from: "tromso", to: "svalbard", mode: "flight", minutes: 100, note: "Svalbard can only sensibly be reached by air." },
  // Norway: fjords and coast
  { id: "flam-bergen-boat", from: "flam", to: "bergen", mode: "ferry", minutes: 330, scenic: true, name: "Sognefjord express boat", note: "Through the Nærøyfjord and Sognefjord. Runs in the summer season.", seasonal: [5, 6, 7, 8, 9] },
  { id: "bergen-alesund", from: "bergen", to: "alesund", mode: "coastal-ship", minutes: 780, scenic: true, name: "Coastal voyage", note: "Overnight on the coastal ship that runs the length of Norway." },
  { id: "alesund-geiranger", from: "alesund", to: "geiranger", mode: "ferry", minutes: 200, scenic: true, name: "Geirangerfjord ferry", note: "Road to Hellesylt, then an hour by ferry into the Geirangerfjord.", seasonal: [5, 6, 7, 8, 9] },
  { id: "geiranger-oslo", from: "geiranger", to: "oslo", mode: "car", minutes: 420, note: "Over the mountains to Otta, then the train south." },
  { id: "alesund-trondheim", from: "alesund", to: "trondheim", mode: "coastal-ship", minutes: 780, scenic: true, name: "Coastal voyage" },
  { id: "trondheim-bodo-ship", from: "trondheim", to: "bodo", mode: "coastal-ship", minutes: 1440, scenic: true, name: "Coastal voyage", note: "Across the Arctic Circle by sea." },
  { id: "bodo-lofoten", from: "bodo", to: "svolvaer", mode: "ferry", minutes: 210, scenic: true, name: "Lofoten ferry", note: "Across the Vestfjord to the islands; the coastal ship calls at Svolvær too." },
  { id: "lofoten-narvik", from: "svolvaer", to: "narvik", mode: "bus", minutes: 255, scenic: true, note: "Along the islands and over the bridges to the mainland." },
  { id: "lofoten-tromso", from: "svolvaer", to: "tromso", mode: "coastal-ship", minutes: 1050, scenic: true, name: "Coastal voyage", note: "Through the Raftsund, past the Trollfjord." },
  { id: "narvik-tromso", from: "narvik", to: "tromso", mode: "bus", minutes: 250 },
  { id: "abisko-tromso", from: "abisko", to: "tromso", mode: "car", minutes: 190 },
  { id: "tromso-northcape", from: "tromso", to: "north-cape", mode: "coastal-ship", minutes: 1050, scenic: true, name: "Coastal voyage", note: "To Honningsvåg, then a short drive to the cape." },
  { id: "northcape-kirkenes", from: "north-cape", to: "kirkenes", mode: "coastal-ship", minutes: 780, scenic: true, name: "Coastal voyage" },
];

/** Named slow routes worth the time. Each can be loaded into the builder. */
export const slowRoutes: SlowRoute[] = [
  { id: "bergen-line", name: "The Bergen Line", stops: ["oslo", "bergen"], description: "Seven hours over the Hardangervidda plateau. That's the point." },
  { id: "flam-and-the-fjord", name: "Down to the fjord", stops: ["oslo", "flam", "bergen"], description: "The Bergen Line, the Flåm Railway, and a boat through the Nærøyfjord to Bergen." },
  { id: "coastal-north", name: "Up the coast by ship", stops: ["bergen", "alesund", "trondheim", "bodo", "svolvaer", "tromso", "north-cape"], description: "The coastal voyage, port by port, from Bergen to the top of Norway." },
  { id: "night-train-lapland", name: "Night train into Swedish Lapland", stops: ["stockholm", "kiruna", "abisko"], description: "Fall asleep in Stockholm, wake up among birch and snow." },
  { id: "ofoten", name: "Mountains to the sea", stops: ["abisko", "narvik", "svolvaer"], description: "The Ofoten Line down to Narvik, then out along the islands to Lofoten." },
  { id: "lapland-finland", name: "Night train to Rovaniemi", stops: ["helsinki", "rovaniemi", "saariselka"], description: "Helsinki to the Arctic Circle overnight, then north to the fells." },
  { id: "archipelago-crossing", name: "Across the archipelago", stops: ["stockholm", "turku", "helsinki"], description: "A day at sea through thousands of islands, then the train along the coast." },
  { id: "three-capitals", name: "Three capitals by rail and sea", stops: ["copenhagen", "stockholm", "oslo"], description: "Two good trains and no airports." },
  { id: "oslofjord-ferry", name: "Copenhagen to Oslo by sea", stops: ["copenhagen", "oslo"], description: "Dinner in the Kattegat, breakfast in the Oslofjord." },
  { id: "rauma-geiranger", name: "The Rauma Line to Geiranger", stops: ["oslo", "alesund", "geiranger"], description: "Through the Romsdal valley to the coast, then into the Geirangerfjord by ferry." },
  { id: "arctic-circle-rail", name: "Over the Arctic Circle by train", stops: ["oslo", "trondheim", "bodo", "svolvaer"], description: "Norway's longest railway, then the ferry to Lofoten." },
  { id: "faroes-by-sea", name: "To the Faroes by sea", stops: ["copenhagen", "hirtshals", "torshavn"], description: "Rail to the top of Jutland, then a day and a half on the North Atlantic." },
];
