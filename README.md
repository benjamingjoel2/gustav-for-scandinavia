# Gustav — Scandinavia, thoughtfully

Private journeys through Norway, Sweden, Denmark and Finland. *Follow the light.*

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · MDX. No database and no external APIs: sunrise and sunset are calculated in `lib/solar.ts`.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint && npm run typecheck && npm test
npm run test:a11y    # Playwright + axe against a running server (BASE_URL, default http://localhost:3000)
npm run build
```

## Where things live

| What | Where |
|---|---|
| Brand settings, nav, business address, dark-season threshold | `config/site.ts` |
| Feature toggles (ETIAS "coming soon" → live) | `config/features.ts` |
| Currency rates (editable, approximate) | `config/currency.ts` |
| Places and coordinates | `data/places.ts` |
| Destinations, details, countries | `data/destinations.ts`, `data/destination-details.ts`, `data/countries.ts` |
| Journeys and day-by-day itineraries | `data/journeys.ts`, `data/itineraries.ts` |
| Route legs and named slow routes (editable time estimates) | `data/routes.ts` |
| Emission factors for the route builder | `data/emissions.ts` |
| Experiences, Black Book, stays, FAQ, light moments | `data/*.ts` |
| Privacy Policy, Booking Terms, Cookie Policy (`/privacy`, `/terms`, `/cookies`) | `data/legal.ts`, `lib/legal.ts` |
| Photography (Unsplash placeholders; credits kept in the data, not shown) | `data/media.ts`, `data/media-sourced.ts` |
| Journal posts and long-form pages (MDX) | `content/journal/`, `content/pages/` |
| Design tokens | `app/globals.css` (`@theme`) |

Everything marked `placeholder: true` (Black Book entries, stays) and the `[Placeholder]` Sámi partners on `/sapmi` must be replaced or verified before launch (see `IMAGES-NEEDED.md`). Have a lawyer review `/privacy`, `/terms` and `/cookies`, and confirm the business address (MESH Nationaltheatret, Tordenskiolds gate 2, 0160 Oslo) and `gustav@tourground.com`. By the owner's rule the site shows no phone, WhatsApp, social links, licence or guarantee numbers, team bios or testimonials.

## Notes

- **Map**: `components/route/map-data.ts` is generated from Natural Earth 1:50m (public domain) by `npm run build:map`.
- **Enquiries** go to `app/api/enquiry/route.ts`, which validates and logs them. Connecting a CRM is a TODO there.
- **Photos** are served from `public/photos`, not from Unsplash. After adding or changing a photo in `data/`, run `npm run build:photos` and commit the new files (`lib/photos.test.ts` fails until you do).
- **Domain**: the site lives at https://gustav.tourground.com (DNS for tourground.com is on Vercel). `NEXT_PUBLIC_SITE_URL` overrides it.
- **Brand voice** is checked by `lib/voice.test.ts` (no "magical", "breathtaking", "hygge"…).

## Languages (EN, FR, DE, ES)

English is the source and lives in `app/(en)`. `scripts/i18n.mjs` (run automatically before `dev` and `build`) writes a translated copy of the route tree to `app/fr`, `app/de`, `app/es` and of the shared code to `i18n/gen/<locale>/`, replacing every English string with its translation from `i18n/<locale>.json` (keyed by the English text) and prefixing internal links. Long-form MDX is translated by hand in `i18n/content/<locale>/content/...`. No translation library ships to the browser; every locale is pre-rendered.

- Add or change English copy, then run `node scripts/i18n.mjs --missing` and add the listed strings to the three dictionaries (the build fails on a missing string).
- The header and menu carry an EN · FR · DE · ES selector that links to the same page in each language. Canonical and hreflang come from `alternatesFor()` in `lib/i18n-paths.ts`; the sitemap lists every page in every language.
- `/design-system` is internal and stays English-only.
