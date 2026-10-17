import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
};

// Plugins are named as strings so Turbopack can load them.
const withMDX = createMDX({ options: { rehypePlugins: [["rehype-slug", {}]] } });

export default withMDX(nextConfig);
