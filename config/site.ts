export const site = {
  name: "Gustav",
  tagline: "Scandinavia, thoughtfully",
  promise: "Follow the light.",
  description:
    "Private journeys through Norway, Sweden, Denmark and Finland. Slowly, by train, boat and on foot, following the light.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gustav.travel",
  locale: "en_GB",
  contact: {
    email: "hello@example.com", // TODO: real address
    phone: "+00 000 000 000", // TODO: real number
    whatsapp: "+00 000 000 000",
    hours: "Mon–Fri, 09.00–17.00 CET",
  },
  company: {
    legalName: "[Company name] AS", // placeholder
    registration: "Org. no. [000 000 000]", // placeholder
    address: "[Street], [Postcode] [City], Norway", // placeholder
    packageProtection:
      "Package travel protected under the EU Package Travel Directive (2015/2302). Guarantee provider: [placeholder]. Certificate no. [placeholder].",
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
  { label: "Terms & conditions", href: "/legal#terms" },
  { label: "Privacy", href: "/legal#privacy" },
  { label: "Cookies", href: "/legal#cookies" },
  { label: "Package travel", href: "/legal#package-travel" },
];

/** Routes whose first section is a full-bleed photograph; the header sits on top of it. */
export const overlayHeaderRoutes = ["/"];
