// OpenNext adapter config for Cloudflare (https://opennext.js.org/cloudflare).
// Vercel ignores this file; `next build` is unchanged.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

const cloudflareConfig = defineCloudflareConfig({
  // Pages are prerendered at build time and the site has no ISR, so prerendered
  // pages are served read-only from the static assets.
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});

// `npm run build` runs the i18n script before `next build`, exactly as on Vercel.
const config = { ...cloudflareConfig, buildCommand: "npm run build" };

export default config;
