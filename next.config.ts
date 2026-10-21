import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    // Stop at 2560: full-bleed photos on very large screens don't need a 3840px file.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2560],
    // 65 by default (see lib/image-loader.ts); 55 for full-bleed photos under a gradient.
    qualities: [55, 65],
  },
};

// Plugins are named as strings so Turbopack can load them.
const withMDX = createMDX({ options: { rehypePlugins: [["rehype-slug", {}]] } });

export default withMDX(nextConfig);
