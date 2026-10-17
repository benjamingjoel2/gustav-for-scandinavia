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
