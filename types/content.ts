export type CountryId = "norway" | "sweden" | "denmark" | "finland";

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface Place {
  id: string;
  name: string;
  country: CountryId;
  lat: number;
  lng: number;
  /** IANA time zone, used for local sunrise and sunset. */
  tz: string;
}

export interface ImageRef {
  src: string;
  alt: string;
  /** "Name / Unsplash" */
  credit: string;
  creditUrl?: string;
  /** Stock placeholder, to be replaced with licensed photography. */
  placeholder: boolean;
  /** CSS object-position, e.g. "50% 70%". */
  focus?: string;
}

export interface Country {
  id: CountryId;
  name: string;
  /** One honest line. */
  pitch: string;
}

export interface Destination {
  slug: string;
  name: string;
  country: CountryId;
  /** Where its light is calculated. */
  placeId: string;
  /** e.g. "Western Norway" */
  region: string;
  /** The honest pitch, one or two sentences. */
  pitch: string;
  bestMonths: Month[];
}

export interface JourneySummary {
  slug: string;
  title: string;
  strapline: string;
  days: number;
  priceFromEUR: number;
  bestMonths: Month[];
  flightFree: boolean;
  /** Stops, in order, for cards: "Oslo · Bergen · Flåm" */
  stops: string[];
}

export interface Testimonial {
  id: string;
  quote: string;
  /** Anonymous: "Travellers from Melbourne" */
  from: string;
  journey: string;
  placeholder: true;
}

export type Mode = "train" | "night-train" | "ferry" | "coastal-ship" | "car" | "bus" | "flight";

/** One connection between two places. Times are editable estimates, door to door on the vehicle. */
export interface Leg {
  id: string;
  from: string;
  to: string;
  mode: Mode;
  minutes: number;
  /** Worth taking for the view alone. */
  scenic?: boolean;
  /** e.g. "Bergen Line" */
  name?: string;
  note?: string;
  /** Months it runs, if seasonal. */
  seasonal?: Month[];
}

/** A named slow route: a sequence of stops. */
export interface SlowRoute {
  id: string;
  name: string;
  stops: string[];
  description: string;
}

/** Something the light makes possible in certain months. */
export interface LightMoment {
  id: string;
  label: string;
  months: Month[];
  /** Where: "Above the Arctic Circle" */
  where: string;
  text: string;
  journeySlugs: string[];
  /** Experience ids (see /experiences). */
  experienceIds: string[];
  /** Where the season was checked. */
  source?: string;
}

export type Theme = "restaurant" | "bakery" | "sauna" | "design" | "architecture" | "cabin" | "island" | "gallery";

export interface Experience {
  /** Also the anchor on /experiences. */
  id: string;
  name: string;
  /** One honest line. */
  summary: string;
  /** Two or three short paragraphs. */
  body: string[];
  months: Month[];
  /** e.g. "Late September to late March" */
  seasonNote: string;
  destinationSlugs: string[];
  journeySlugs: string[];
  source?: string;
}

/** PLACEHOLDER venue until verified. */
export interface BlackBookEntry {
  id: string;
  name: string;
  placeholder: true;
  /** Display location, e.g. "Copenhagen, Nørrebro" */
  city: string;
  destinationSlug: string;
  country: CountryId;
  theme: Theme;
  /** One or two sentences in Gustav's voice. */
  note: string;
}

/** PLACEHOLDER stay until verified. */
export interface Stay {
  id: string;
  name: string;
  placeholder: true;
  destinationSlug: string;
  /** e.g. "Fjord-side hotel", "Wilderness cabin" */
  kind: string;
  note: string;
}

export interface DestinationDetail {
  /** Three or four short paragraphs. */
  body: string[];
  /** How to get there slowly: from a hub, as stops for the route builder (place ids) and a sentence. */
  slowWay: { stops: string[]; text: string };
  /** Seasonal notes for the light section: one short line each for "summer" and "winter". */
  light: { summer: string; winter: string };
}

export interface JourneyDay {
  /** e.g. "1" or "2–3" */
  day: string;
  title: string;
  /** Where you sleep; sunrise and sunset are calculated for this place. */
  placeId: string;
  text: string;
  /** How you travel to this day's place, if you move. */
  travel?: { mode: Mode; duration: string; note?: string; scenic?: boolean };
  stayId?: string;
  experienceIds?: string[];
}

export interface Itinerary {
  intro: string[];
  /** The month used to calculate the light on each day. */
  defaultMonth: Month;
  destinationSlugs: string[];
  experienceIds: string[];
  included: string[];
  days: JourneyDay[];
}

export interface FaqItem {
  id: string;
  group: "Planning" | "Light and weather" | "Getting around" | "Money" | "Entry and documents" | "Families" | "Booking";
  q: string;
  /** Plain text; paragraphs separated by blank lines. */
  a: string;
}

export interface JournalMeta {
  title: string;
  description: string;
  /** ISO date */
  date: string;
  /** Key in data/media-sourced experienceImages or destinationImages, e.g. "experience:sauna" */
  image: string;
  readingMinutes: number;
}
