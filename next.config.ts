import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  async headers() {
    // Photo files never change under the same name (scripts/build-photos.ts), so browsers and the CDN can keep them.
    return [{ source: "/photos/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }];
  },
};

// Plugins are named as strings so Turbopack can load them.
const withMDX = createMDX({ options: { rehypePlugins: [["rehype-slug", {}]] } });

export default withMDX(nextConfig);
