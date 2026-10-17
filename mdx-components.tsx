import Link from "next/link";
import type { MDXComponents } from "mdx/types";

/** Long-form typography for journal posts and editorial pages. */
const components: MDXComponents = {
  h2: (props) => <h2 className="headline mt-14 text-[clamp(1.6rem,1.2rem+1.4vw,2.3rem)]" {...props} />,
  h3: (props) => <h3 className="mt-10 font-sans text-xl font-normal" {...props} />,
  p: (props) => <p className="mt-5" {...props} />,
  ul: (props) => <ul className="mt-5 list-disc space-y-2 pl-5 marker:text-oak" {...props} />,
  ol: (props) => <ol className="mt-5 list-decimal space-y-2 pl-5 marker:text-oak" {...props} />,
  blockquote: (props) => <blockquote className="lede my-10 border-l border-oak pl-6 italic" {...props} />,
  hr: () => <hr className="my-12 border-ink/15" />,
  strong: (props) => <strong className="font-semibold" {...props} />,
  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? <Link href={href} className="link-dotted text-[1em]" {...props} /> : <a href={href} className="link-dotted text-[1em]" rel="noopener" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
