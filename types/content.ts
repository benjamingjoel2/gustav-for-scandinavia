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
