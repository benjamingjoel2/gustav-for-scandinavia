import type { ImageRef } from "@/types/content";
import type { PlaceId } from "./places";

const unsplash = (id: string, alt: string, credit: string, slug: string, focus?: string): ImageRef => ({
  src: `https://images.unsplash.com/photo-${id}`,
  alt,
  credit: `${credit} / Unsplash`,
  creditUrl: `https://unsplash.com/photos/${slug}`,
  placeholder: true,
  focus,
});

/** Homepage live light: a light-season and a dark-season photograph for each featured place. */
export const heroImages: Partial<Record<PlaceId, { light: ImageRef; dark: ImageRef }>> = {
  tromso: {
    light: unsplash("1536415674649-19c6de404a9a", "Two red boathouses on a pale beach below low mountains, northern Norway", "Thomas Claeys", "two-houses-beside-body-of-water-under-clear-blue-sky-during-daytime-SrbXjbo-XbQ", "50% 60%"),
    dark: unsplash("1594590717245-18d55d1d2d67", "Green northern lights over snowy hills and a dark fjord near Tromsø", "Tatiana Zanon", "snow-covered-mountain-near-body-of-water-during-night-time-nTGXxj2mS3c", "50% 40%"),
  },
  stockholm: {
    light: unsplash("1508738102835-f1fe48178e7b", "A granite island in morning mist with a white boat moored alongside, Stockholm archipelago", "Max Hermansson", "aerial-photo-of-white-yacht-dock-beside-gray-and-green-island-with-mist-at-daytime-3AsAVTBIw5I"),
    dark: unsplash("1725136400179-e7d6e4393700", "Low winter sun on Riddarholmen and the old town across dark water, Stockholm", "Hanlin Sun", "a-view-of-a-city-and-a-body-of-water-0goC5S7d5ag", "50% 65%"),
  },
  copenhagen: {
    light: unsplash("1551651767-d5ffbdd04b83", "Painted townhouses and wooden boats reflected in the still canal at Nyhavn, Copenhagen", "Ava Coploff", "boats-in-canal-in-denmark-during-daytime-tcE9zSc2SU8", "50% 55%"),
    dark: unsplash("1672771558124-a9d55ac41132", "The dome of Frederik's Church against a blue dusk sky, Copenhagen", "Jacco Rienks", "a-view-of-a-building-with-a-dome-at-dusk-gADWKbgEhBk", "50% 70%"),
  },
  rovaniemi: {
    light: unsplash("1667831086121-827c2f049cc7", "A wooden boardwalk across a summer bog of yellow grasses, Finnish Lapland", "Oona Ahonen", "a-path-through-a-field-of-yellow-flowers-CjUGEk4RWTY", "50% 70%"),
    dark: unsplash("1644063414496-5e48002d614b", "Low sun through haze over a frozen, snow-laden spruce forest, Finnish Lapland", "Saad Chaudhry", "the-sun-is-setting-over-a-snowy-forest-hGucewUxQ3Q", "50% 30%"),
  },
  svalbard: {
    light: unsplash("1705830667500-07dd6a10db19", "Summer tundra, sea ice and glaciated peaks, Svalbard", "Jacek Urbanski", "a-mountain-range-with-icebergs-in-the-distance-EY8ncxHXO28", "50% 45%"),
    dark: unsplash("1629206881868-cb28914973d9", "A snow-covered mountain mirrored in still, dark blue water, Svalbard", "Lloyd Woodham", "snow-covered-mountain-near-body-of-water-bAmmMSPDqxg", "50% 50%"),
  },
};
