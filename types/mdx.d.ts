declare module "*.mdx" {
  import type { ComponentType } from "react";
  export const meta: {
    title: string;
    description: string;
    date?: string;
    image?: string;
    readingMinutes?: number;
  };
  const MDXContent: ComponentType;
  export default MDXContent;
}
