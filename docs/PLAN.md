# Gustav — Scandinavia, thoughtfully · Build plan (step 1)

## Context
Empty repo (`benjamingjoel2/gustav-for-scandinavia`, no commits). We're building the Gustav brand site from scratch: a calm, editorial travel site for slow journeys through Norway, Sweden, Denmark and Finland, with five signature features (live light, Light Calendar, Slow Route Builder, Black Book, Sápmi page). This plan covers the design system, the solar calculation, folder structure and data types. Nothing gets built until you OK it. Work goes on `claude/awesome-goldberg-ucfbom`, one commit per build step, one draft PR; each step checked in the dev server (Playwright screenshots, desktop + mobile) before moving on.

## Stack
- Next.js (current stable, App Router), TypeScript strict, Tailwind CSS v4 (tokens via `@theme` in `globals.css`), Framer Motion.
- MDX for the journal via `@next/mdx`; each post exports a typed `meta` object (no runtime frontmatter parsing).
- `next/font/google` (self-hosted at build, no layout shift).
- Vitest for `lib/` (solar, routing, currency); Playwright + axe-core for a11y smoke tests; Lighthouse CLI against Chromium in step 6.
- No runtime APIs, no database. Everything static/SSG except the enquiry API route; homepage uses ISR (`revalidate = 600`).

## Design system

**Palette** (Tailwind tokens; contrast checked to WCAG AA in step 2, adjusted if needed)
| Token | Hex | Use |
|---|---|---|
| `birch` | `#F3EFE6` | page background (warm white, not pure white) |
| `birch-200` | `#E6E0D2` | panels, cards, rules |
| `ink` | `#17221E` | body text (pine-black) |
| `pine` | `#1F3D32` | deep green: headings, footer, dark sections |
| `fjord` | `#5B6F7C` | blue-grey: secondary text, horizon line, map water |
| `fjord-100` | `#DCE3E6` | soft fills, sky |
| `oak` | `#A9804F` | warm accent: sun arcs, hover, prices |
| `lingon` | `#A8253A` | tiny accent only: focus dot, sun marker, "now" indicator |
| `polar` | `#0E1A20` | polar-night backgrounds (dark-season hero, night portions of arcs) |

**Type**
- Headings: **Schibsted Grotesk** (a grotesk with Norwegian roots; set large, tight: `tracking-[-0.03em]`, `leading-[0.95]` on display sizes).
- Long reading: **Newsreader** (soft, humanist serif; 18–20px, `leading-relaxed`, 62–68ch measure).
- Fluid scale via `clamp()`: display 3.5→7.5rem, h1 2.5→4.5rem, h2 1.75→2.75rem, body 1.0625→1.1875rem, small caps-style labels (grotesk, 0.75rem, `tracking-[0.12em]`, uppercase) for eyebrow text.

**Layout**
- 12-col grid, generous outer margins (`px-5` mobile → `px-[6vw]` desktop), asymmetric compositions (e.g. text on cols 2–6, image on 7–12 offset down; alternating). Max content width ~1440px; reading column ~680px.
- Big quiet photographs: full-bleed or 7/12 width, no overlays except a subtle bottom gradient where text sits on image.
- Vertical rhythm on an 8px base; sections separated by space and the horizon line, not boxes.

**Signature: the horizon line**
- `<Horizon />`: a single 1px `fjord` line, full bleed, appearing at consistent heights between sections so it reads as one line running through the site.
- `<SunPath lat lng month|date />`: on key sections the line becomes a chart of the sun's elevation over 24 h. The horizon *is* elevation 0°; the curve rises above for daylight (oak stroke) and dips below for night (fjord, dashed, low opacity). Summer in Tromsø: whole arc above the line. December in Tromsø: the arc never rises; a short shallow dip. Copenhagen in winter: a short, low hump. A small lingon dot marks "now" (homepage) or solar noon (calendar). Rendered as server SVG where static, client where animated.
- Respects `prefers-reduced-motion`; every SunPath has a text equivalent ("Daylight 4h 12m. Sunrise 10:41, sunset 14:53.").

**Logo**: "gustav" lowercase in Schibsted Grotesk Medium, tight tracking, with a small mark: a half-sun resting on a short horizon stroke (SVG, inherits `currentColor`; lingon variant for favicon).

**Motion**: Framer Motion only for opacity/translate fades (600–900 ms, `easeOut` curves like light shifting), SunPath morphs between months, and hero image crossfade. No parallax, no scroll-jacking. All disabled under reduced motion.

**Voice guardrails**: a `lib/voice.ts` banned-word list ("fairytale", "magical", "breathtaking", "winter wonderland", "hygge", "Viking") checked by a Vitest test across `/data` and `/content`.

## Solar calculation (`lib/solar.ts`, no API)
NOAA Solar Calculator algorithm (Jean Meeus, *Astronomical Algorithms*), pure TypeScript:
1. Julian day / Julian century from a UTC `Date`.
2. Geometric mean longitude & anomaly → equation of centre → apparent longitude → obliquity correction → **declination** and **equation of time**.
3. Hour angle for zenith 90.833° (refraction + solar disc). If `cos(H) > 1` → **polar night**; `< −1` → **midnight sun**.
4. Exports:
   - `getSunTimes(date, lat, lng)` → `{ sunrise, sunset, solarNoon, daylightMinutes, state: 'normal' | 'midnight-sun' | 'polar-night' }`
   - `getSolarElevation(date, lat, lng)` → degrees (for SunPath curves, sampled every 10 min)
   - `getSunPath(dateLocalDay, place)` → array of `{minuteOfDay, elevation}`
   - `getMonthLight(place, month)` → daylight on the 15th + min/max in month, plus derived state
   - `getPolarPeriods(place, year)` → midnight-sun and polar-night date ranges, **computed, not hardcoded**, so calendar, destination pages and FAQ all agree.
5. Local times rendered with `Intl.DateTimeFormat` using each place's IANA zone (`Europe/Oslo`, `Europe/Stockholm`, `Europe/Copenhagen`, `Europe/Helsinki`, `Arctic/Longyearbyen`, `Atlantic/Faroe`).
6. Tests against published values (±2 min): Stockholm 21 Jun ≈ 18h 37m; Copenhagen 21 Dec ≈ 7h 00m; Tromsø 21 Jun = midnight sun; Tromsø 21 Dec = polar night; Svalbard midnight-sun window ≈ 19/20 Apr–23 Aug.

**Live light on the homepage**: hero rotates every ~8 s through Tromsø, Stockholm, Copenhagen, Rovaniemi, Svalbard (pause on hover/focus; pause button; `aria-live="polite"` announces only on user action, not every rotation). Server renders with the ISR timestamp; a client effect recomputes on mount and every minute (initial state equals the server prop, so no hydration mismatch). Copy: "Right now in Tromsø: 4h 12m of daylight today." / "…the sun doesn't set today." / "…the sun doesn't rise today. The light is blue, and it's beautiful."
**Image set rule**: dark-season set when today's daylight at the featured place < 8 h (incl. polar night), light set otherwise. Threshold lives in `/config/site.ts`.

## Light Calendar
- Month slider (native `<input type="range">` styled, 1–12, arrow keys/Home/End work for free; plus prev/next buttons). Dragging morphs SunPath arcs for ~8 reference places stacked south→north on the horizon line.
- For each month: "what this light makes possible" moments from `/data/light-moments.ts` (aurora, midnight sun, golden evenings, autumn colours, Christmas markets, whale season…), each linking to matching journeys/experiences.
- Season facts verified against sources at content time and noted in data (`source` field). Working assumptions: aurora ~ mid/late Sep – late Mar above ~65°N (needs dark skies, so not during midnight sun); midnight sun windows computed per place (Tromsø ≈ 20 May–22 Jul, North Cape ≈ 14 May–29 Jul); winter whales off northern Norway ≈ Nov–Jan (to verify).
- Accessible fallback: a `<table>` of month × place daylight (also visible to everyone via a "Show as table" toggle), and the moments as a plain list.
- `<MiniLightCalendar place />` reused on destination pages and inline in the enquiry form.

## Slow Route Builder
- **Map**: static SVG of Norway, Sweden, Denmark, Finland (+ Faroes, Svalbard inset), generated once by `scripts/build-map.ts` from Natural Earth 1:50m (public domain) with `d3-geo` (Lambert conformal conic). Output committed to `components/route/map-paths.ts`; `d3-geo` is a dev dependency only. Places plotted with the same projection.
- **Interaction**: places are focusable `<button>`s in the SVG (Tab, Enter/Space to add/remove); selected stops listed alongside with up/down reorder and remove. Parallel checkbox list for screen readers and mobile.
- **Routing** (`lib/routing.ts`): graph of legs from `/data/routes.ts`; Dijkstra between consecutive stops. Cost = duration × mode weight; scenic legs get a discount; "Flight-free" removes flight legs and prefers rail/sea. Output: ordered legs with mode, approximate time, scenic highlight, notes; total travel time; and, with flight-free on, a short carbon note comparing against flying using approximate per-passenger-km factors in `/data/emissions.ts` (sources cited, clearly "approximate").
- Ends with "Ask us to plan this route." → `/enquire?route=…` pre-filled.
- Named scenic routes (~12): Oslo–Bergen railway, Flåm Railway, Hurtigruten/coastal voyage Bergen–Kirkenes, Narvik–Kiruna Ofoten/Malmbanan, Stockholm–Narvik night train, Helsinki–Rovaniemi night train, Copenhagen–Stockholm X2000/SJ, Oslo–Copenhagen overnight ferry, Stockholm–Helsinki/Turku ferry through the archipelago, Geirangerfjord ferry, Lofoten via Bodø–Moskenes ferry, Rauma Line, Gotland ferry, Copenhagen–Skagen rail, Faroes via Smyril Line (Hirtshals). All as editable estimates.

## Folder structure
```
app/
  layout.tsx  globals.css  page.tsx  not-found.tsx  sitemap.ts  robots.ts  opengraph-image.tsx
  journeys/page.tsx  journeys/[slug]/page.tsx
  destinations/page.tsx  destinations/[slug]/page.tsx
  experiences/page.tsx
  light-calendar/page.tsx
  route-builder/page.tsx
  black-book/page.tsx
  sapmi/page.tsx
  travelling-lighter/page.tsx
  about/page.tsx  faq/page.tsx  legal/page.tsx  enquire/page.tsx
  journal/page.tsx  journal/[slug]/page.tsx
  api/enquiry/route.ts            # validates (zod), console.log payload, TODO: CRM
components/
  brand/      Logo, SunMark
  horizon/    Horizon, SunPath
  layout/     Header, Footer, Nav, MobileNav, Section, Container
  ui/         Button, Tag, Price, CurrencySwitcher, Eyebrow, Figure, Accordion
  light/      LiveLight, LightCalendar, MiniLightCalendar, DaylightTable
  route/      RouteBuilder, ScandinaviaMap, RouteSummary, map-paths.ts
  journeys/   JourneyCard, DayByDay, DayLight
  blackbook/  BlackBookGrid, BlackBookFilters
  enquiry/    EnquiryForm
content/journal/*.mdx             # 4 starter posts
data/       countries.ts destinations.ts places.ts experiences.ts journeys.ts
            routes.ts emissions.ts blackbook.ts stays.ts testimonials.ts
            faq.ts light-moments.ts media.ts
config/     site.ts (brand, nav, company placeholders, thresholds)
            features.ts (etiasLive: false, …)  currency.ts (static editable rates)
lib/        solar.ts routing.ts currency.ts format.ts seo.ts voice.ts (+ *.test.ts)
types/      content.ts
scripts/    build-map.ts
tests/      a11y.spec.ts (Playwright + axe)
```

## Data types (`types/content.ts`, abridged)
```ts
type CountryId = 'norway' | 'sweden' | 'denmark' | 'finland';
type Mode = 'train' | 'night-train' | 'ferry' | 'coastal-ship' | 'car' | 'bus' | 'flight';
type Theme = 'restaurant' | 'design' | 'architecture' | 'sauna' | 'cabin' | 'island' | 'bakery' | 'gallery';
type Month = 1|2|3|4|5|6|7|8|9|10|11|12;

interface Place { id: string; name: string; lat: number; lng: number; tz: string; country: CountryId }
interface ImageRef { src: string; alt: string; credit: string; placeholder: true | false; season?: 'light' | 'dark' }
interface Country { id: CountryId; name: string; pitch: string; image: ImageRef }

interface Destination {
  slug: string; name: string; country: CountryId; placeId: string; region?: string;
  pitch: string;                // the honest pitch
  body: string[];               // short paragraphs
  bestMonths: Month[]; bestMonthsNote: string;
  experienceIds: string[]; journeySlugs: string[]; stayIds: string[];
  hero: ImageRef; gallery: ImageRef[];
}

interface Experience { id: string; name: string; summary: string; months: Month[]; seasonNote: string;
  destinationSlugs: string[]; image: ImageRef; seasonSource?: string }

interface JourneyDay { day: number; title: string; placeId: string; text: string;
  travel?: { from: string; to: string; mode: Mode; duration: string; scenic?: boolean };
  stayId?: string; experienceIds?: string[] }  // sunrise/sunset computed from placeId + chosen month
interface Journey { slug: string; title: string; strapline: string; days: JourneyDay[];
  bestMonths: Month[]; defaultMonth: Month; priceFromEUR: number; flightFree: boolean;
  destinationSlugs: string[]; hero: ImageRef }

interface Leg { id: string; from: string; to: string; mode: Mode; minutes: number;
  scenic?: boolean; name?: string; note?: string; seasonal?: Month[] }
interface SlowRoute { id: string; name: string; legIds: string[]; description: string }

interface BlackBookEntry { id: string; name: string; placeholder: true; city: string;
  country: CountryId; theme: Theme; note: string }
interface Stay { id: string; name: string; placeholder: true; destinationSlug: string; kind: string; note: string }
interface Testimonial { id: string; quote: string; attribution: string; placeholder: true }
interface LightMoment { id: string; label: string; months: Month[]; minLat?: number; maxLat?: number;
  text: string; journeySlugs: string[]; experienceIds: string[]; source?: string }
interface FaqItem { id: string; q: string; a: string; group: string; featureFlag?: keyof Features }
interface JournalMeta { slug: string; title: string; description: string; date: string; image: ImageRef }
```
`placeholder: true` is a literal type so placeholder entries can't silently pass as verified; UI shows a subtle "Placeholder" tag on Black Book, stays and testimonials.

## Cross-cutting
- **Currency**: prices stored in EUR; `CurrencyProvider` (client context, persisted in `localStorage`) converts with static rates in `/config/currency.ts` (EUR, NOK, SEK, DKK, GBP, USD), rounded to tidy numbers, labelled "approx."
- **Enquiry**: one calm page; multi-select destinations, month (with inline MiniLightCalendar), days, travellers, travel style, interests, comfort, name/email/phone, preferred contact, notes. Pre-fill from `?journey=` or `?route=`. Client + server validation (zod), honeypot field. Confirmation: "Thank you. We'll be in touch. Follow the light."
- **FAQ/Schengen**: EES in operation; ETIAS shown as "coming soon" (€20, expected 2027) driven by `features.etiasLive`; facts re-verified at content time.
- **SEO**: per-page `generateMetadata`, canonical URLs, OG images via `opengraph-image.tsx`, `sitemap.ts`, `robots.ts`, JSON-LD (`TravelAgency`, `TouristTrip` for journeys, `FAQPage`, `Article` for journal).
- **Images**: placeholder photography from Unsplash (free licence) via `next/image` with `remotePatterns`, credited in `/data/media.ts` and flagged for replacement with licensed photography. Each URL checked to resolve before use.
- **Footer**: company name, registration no., package travel protection (placeholder, mentions EU Package Travel Directive), legal links.
- **Content rules**: no fictional founder, no named staff, all partners/venues/stays are placeholders, Sápmi page written with care (Sámi-owned operators, reindeer herding basics, consent before photographing, don't wear gákti as costume, respect herding areas and calving season, placeholder partners only).

## Build order (each ends with dev-server check + commit + push)
1. ✅ This plan.
2. Scaffold, tokens, fonts, Logo, Horizon/SunPath, header/footer/nav, `lib/solar.ts` + tests.
3. Homepage with live light, hero image sets, featured journeys/destinations, testimonials.
4. Light Calendar + Slow Route Builder (map script, routing + tests).
5. Destinations, journeys, experiences, Black Book, Sápmi, Travelling lighter, About, journal, FAQ, Legal, enquiry + API.
6. Polish: a11y (axe, keyboard pass, screen-reader labels), SEO, Lighthouse (target ≥ 95 across categories), voice lint.
7. Deploy: push branch → Vercel preview from the Git integration; production after you merge to `main` (or via Vercel tooling if available in-session).

## Verification
- `npm run lint && npm run typecheck && npm test` (solar, routing, currency, voice tests).
- `npm run dev` + Playwright screenshots of each new page at 390px and 1440px, shared each step.
- Keyboard-only walk-through of Light Calendar, route builder and enquiry; axe scan with zero serious violations.
- `next build` passes; Lighthouse on the production build; POST to `/api/enquiry` logs the payload.
- Vercel preview URL loads all routes.

## Assumptions to confirm
- Placeholder photography from Unsplash is fine until real images arrive.
- Dark-season hero threshold: < 8 h daylight today.
- Single draft PR from `claude/awesome-goldberg-ucfbom`, with one commit per step.
