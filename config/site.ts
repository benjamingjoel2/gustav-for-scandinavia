export const site = {
  name: "Gustav",
  tagline: "Scandinavia, thoughtfully",
  promise: "Follow the light.",
  description:
    "Private journeys through Norway, Sweden, Denmark and Finland. Slowly, by train, boat and on foot, following the light.",
  // NEXT_PUBLIC_SITE_URL overrides the domain, e.g. for a staging copy.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL ? "https://gustav.tourground.com" : "http://localhost:3000"),
  locale: "en_GB",
  contact: {
    email: "gustav@tourground.com",
    hours: "Mon–Fri, 09.00–17.00 CET",
  },
  /** Business address: MESH Nationaltheatret, Oslo (premium coworking, owner-approved arrangement). No phone by design. */
  address: {
    lines: ["MESH Nationaltheatret", "Tordenskiolds gate 2", "0160 Oslo", "Norway"],
    postal: { streetAddress: "Tordenskiolds gate 2", postalCode: "0160", addressLocality: "Oslo", addressCountry: "NO" },
  },
  /** Below this many minutes of daylight today (or while the sun is down), the homepage hero uses the dark-season photographs. */
  darkSeasonThresholdMinutes: 8 * 60,
} as const;

export interface NavItem {
  label: string;
  href: string;
}

/** Spread across the top of the page, Alma-style. */
export const primaryNav: NavItem[] = [
  { label: "Journeys", href: "/journeys" },
  { label: "Destinations", href: "/destinations" },
  { label: "Experiences", href: "/experiences" },
  { label: "Light Calendar", href: "/light-calendar" },
  { label: "Route Builder", href: "/route-builder" },
];

/** Full menu panel, grouped. */
export const menuGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Travel",
    items: [
      { label: "Journeys", href: "/journeys" },
      { label: "Destinations", href: "/destinations" },
      { label: "Experiences", href: "/experiences" },
    ],
  },
  {
    label: "Plan",
    items: [
      { label: "The Light Calendar", href: "/light-calendar" },
      { label: "Slow Route Builder", href: "/route-builder" },
      { label: "Gustav's Black Book", href: "/black-book" },
    ],
  },
  {
    label: "Read",
    items: [
      { label: "Travelling in Sápmi", href: "/sapmi" },
      { label: "Travelling lighter", href: "/travelling-lighter" },
      { label: "Journal", href: "/journal" },
    ],
  },
  {
    label: "Gustav",
    items: [
      { label: "About", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Enquire", href: "/enquire" },
    ],
  },
];

export const legalNav: NavItem[] = [
  { label: "Booking terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
];

/** Routes whose first section is a full-bleed photograph; the header sits on top of it. */
export const overlayHeaderRoutes = ["/"];
