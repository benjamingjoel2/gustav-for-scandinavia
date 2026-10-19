// Editorial placeholder photography for Gustav, sourced from Unsplash (non-premium, Unsplash License).
// Each entry was visually checked.

import type { SourcedImage } from "./media-sourced";

const u = (
  id: string,
  slug: string,
  alt: string,
  photographer: string,
  orientation: SourcedImage["orientation"] = "landscape",
): SourcedImage => ({
  id,
  src: `https://images.unsplash.com/photo-${id}`,
  alt,
  credit: `${photographer} / Unsplash`,
  creditUrl: `https://unsplash.com/photos/${slug}`,
  orientation,
});

/** Keyed by page/slot. */
export const editorialImages: Record<string, SourcedImage[]> = {
  "sapmi": [
    u("1649751655743-afba82e6e203", "a-group-of-animals-walking-across-a-snow-covered-field-TrPwD7wfrG0", "Small group of reindeer walking in single file across a wide snowy slope", "Fredrik Solli Wandem"),
    u("1748870578221-827dd7facf90", "a-reindeer-grazes-amongst-trees-in-the-forest--Lb8hFT4G4Y", "Pale reindeer with a red collar grazing on the forest floor between tree trunks", "Majkl Velner"),
    u("1599728779904-448a831701cb", "a-flag-flying-in-the-wind-with-a-blue-sky-in-the-background-cWL0SNSqiGs", "Sámi flag in red, blue, green and yellow flying from a pole against a clear blue sky", "Thom Reijnders"),
  ],
  "travelling-lighter": [
    u("1749045418640-0b36dd5f1986", "a-bicycle-rests-by-a-tranquil-lake-AxfLIsChl9Y", "Bicycle leaning against a bench on a jetty by a lake with birch-lined shores", "Arpit Sharma"),
  ],
  "about": [
    u("1755912551967-1c6006e8a009", "a-solitary-boathouse-on-calm-water-at-dusk-YWH-SQ9s1Ao", "Wooden boathouse at the end of a long jetty on still water at dusk", "Iain"),
    u("1573987033487-f2cf1a9ffd34", "white-ceramic-coffee-cup-on-saucer-near-window-p5C7y-IGa_k", "Cup of coffee on a windowsill with a snow-covered tree outside the glass", "Mekht", "portrait"),
    u("1452421822248-d4c2b47f0c81", "flat-ray-photography-of-book-pencil-camera-and-with-lens-3OiYMgDKJ6k", "Open notebook and pencil on an old map with a film camera, glasses and photographs", "Dariusz Sankowski"),
    u("1735835042917-2f53fd2d0465", "WLpOmI14XPA", "Low sun on the horizon over a snow-covered frozen lake", "Ale"),
  ],
  "home-intro": [
    u("1742728572950-585516ec2425", "cozy-rustic-room-with-a-lantern-and-window-N_sK_EtNmWY", "Wood-panelled cabin room with a hanging lantern and daylight through a small-paned window", "Kristīne Kozaka", "portrait"),
    u("1784397971786-4d67c4a5198a", "people-walk-on-a-vast-sandy-beach-with-overcast-mountains-IKlmZ3GpDB8", "Two small figures walking along a wide pale beach below overcast mountains", "Ashutosh Gupta"),
  ],
  "enquire": [
    u("1759502165774-560b7f02ff6e", "view-of-a-fjord-and-mountains-from-a-window-yJlpsJ3zb0M", "Large window looking out over a fjord and green mountainsides from a quiet room", "the iop"),
  ],
  "faq": [
    u("1674499025947-011f47386c0e", "xhHebwH-AiA", "Seat-side window of a train looking out over flat snowy country", "Sebastian Enrique"),
  ],
  "journeys-hero": [
    u("1732269988777-5dd1dce00cd0", "a-long-road-with-a-mountain-in-the-background-DVSAyvVkFaM", "Empty road curving up a narrow valley between rocky slopes towards snow-streaked peaks", "Vidar Nordli-Mathisen"),
  ],
  "black-book-hero": [
    u("1699559510594-12624b72312c", "a-cup-of-coffee-and-some-pastries-on-a-table-G36pUixWrOA", "Cup of milky coffee on a café table among buns and pastries", "simon follin"),
  ],
  "journal:midnight-sun-or-northern-lights": [
    u("1643611657752-fb0ce6989d88", "a-cabin-in-the-snow-under-a-green-aurora-bore-InET0AwCX48", "Green aurora over a snow-covered wooden cabin with one lit window", "Hendrik Morkel"),
  ],
  "journal:oslo-to-bergen-why-the-train-wins": [
    u("1554209780-e6944354fec8", "brown-house-on-field-filled-with-snow-8T-rW1pk4fY", "Snow-covered station building and tracks on an open mountain plateau, Finse", "Sindre Bøyum"),
    u("1752836984460-9fffb7e3f47d", "snow-capped-mountains-and-a-lake-framed-by-windows-kwLc2ebmV1w", "Snow-patched mountains and a lake seen through train windows", "Sylwia Bartyzel"),
  ],
  "journal:sauna-like-a-finn": [
    u("1743286159555-ea765c1bc5e6", "a-sauna-with-rocks-a-bucket-and-wood-NRZ1bc4h9ME", "Dim sauna with a heap of stove stones, a wooden bucket and lit wooden benches", "Anne Nygård"),
  ],
  "journal:scandinavia-without-flying": [
    u("1743947830163-27abdc527c1d", "two-beds-inside-a-train-cabin-zsBEekyptsA", "Two made-up berths facing each other in a sleeper train compartment", "Aryaman Agarwal"),
  ],
};
