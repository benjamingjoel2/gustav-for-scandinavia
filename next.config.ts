import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  // One root layout per language (app/(en), app/fr, app/de, app/es), so unmatched URLs need a global 404.
  experimental: { globalNotFound: true },
  // The single /legal page became /privacy, /terms and /cookies.
  async redirects() {
    return [{ source: "/legal", destination: "/terms", permanent: true }];
  },
  async headers() {
    // Photo files never change under the same name (scripts/build-photos.ts), so browsers and the CDN can keep them.
    return [{ source: "/photos/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }];
  },
};

// Plugins are named as strings so Turbopack can load them.
const withMDX = createMDX({ options: { rehypePlugins: [["rehype-slug", {}]] } });

export default withMDX(nextConfig);
