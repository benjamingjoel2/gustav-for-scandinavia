import { site } from "@/config/site";
import { legal } from "@/data/legal";

/** Gustav's legal pages: the shared text plus what this site actually stores. */
export const legalPages = legal({
  brand: site.name,
  email: site.contact.email,
  address: site.address.lines,
  storage: [{ name: "gustav-currency", type: "local storage", duration: "until you clear it", purpose: "remembers the currency you chose for showing prices" }],
  processors: [{ name: "Vercel", purpose: "hosts this website and processes the enquiry form" }],
});

export const getLegalPage = (slug: "privacy" | "terms" | "cookies") => legalPages.find((p) => p.slug === slug)!;
