import type { JourneySummary } from "@/types/content";

// Summaries for cards. Day-by-day itineraries arrive with the journey pages.
export const journeys: JourneySummary[] = [
  { slug: "fjords-slowly", title: "Fjords, Slowly", strapline: "Oslo to Bergen by rail, then into the fjords by boat, train and on foot.", days: 10, priceFromEUR: 5400, bestMonths: [5, 6, 7, 8, 9], flightFree: true, stops: ["Oslo", "Flåm", "Nærøyfjord", "Balestrand", "Bergen"] },
  { slug: "arctic-winter-light", title: "The Arctic in Winter Light", strapline: "Blue noons, long evenings and your best chances of the aurora.", days: 8, priceFromEUR: 5900, bestMonths: [1, 2, 3, 11, 12], flightFree: false, stops: ["Tromsø", "Lyngen", "Senja"] },
  { slug: "midnight-sun-lofoten", title: "Midnight Sun to Lofoten", strapline: "North by coastal ship, with the sun circling overhead all night.", days: 11, priceFromEUR: 6800, bestMonths: [6, 7], flightFree: false, stops: ["Bodø", "Lofoten", "Vesterålen", "Tromsø"] },
  { slug: "three-capitals-by-train", title: "Three Capitals by Train", strapline: "Copenhagen, Stockholm and Oslo, joined by rail and a night ferry.", days: 9, priceFromEUR: 4200, bestMonths: [5, 6, 7, 8, 9, 12], flightFree: true, stops: ["Copenhagen", "Stockholm", "Oslo"] },
  { slug: "lapland-three-borders", title: "Lapland, Three Borders", strapline: "Swedish, Finnish and Norwegian Lapland in one winter loop, with Sámi hosts.", days: 10, priceFromEUR: 6400, bestMonths: [1, 2, 3], flightFree: false, stops: ["Kiruna", "Abisko", "Kilpisjärvi", "Saariselkä"] },
  { slug: "archipelago-summer", title: "Archipelago Summer", strapline: "Island to island off Stockholm and Turku, by ferry, bicycle and small boat.", days: 9, priceFromEUR: 4600, bestMonths: [6, 7, 8], flightFree: true, stops: ["Stockholm", "Sandhamn", "Åland", "Turku", "Helsinki"] },
  { slug: "a-nordic-christmas", title: "A Nordic Christmas", strapline: "Markets, candlelight and a quiet cabin, from Copenhagen to Lapland.", days: 8, priceFromEUR: 5200, bestMonths: [12], flightFree: false, stops: ["Copenhagen", "Stockholm", "Rovaniemi"] },
  { slug: "flight-free-scandinavia", title: "Flight-Free Scandinavia", strapline: "From Copenhagen to the Arctic and back without leaving the ground.", days: 16, priceFromEUR: 8200, bestMonths: [6, 7, 8], flightFree: true, stops: ["Copenhagen", "Stockholm", "Abisko", "Narvik", "Lofoten", "Bergen", "Oslo"] },
];
