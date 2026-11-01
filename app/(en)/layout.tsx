import { alternatesFor, OG_LOCALES } from "@/lib/i18n-paths";
import { locale } from "@/lib/locale";
import type { Metadata, Viewport } from "next";
import { Albert_Sans, Newsreader } from "next/font/google";
import { JsonLd } from "@/components/editorial/JsonLd";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { site } from "@/config/site";
import "../globals.css";

// Latin only: every Nordic character the site uses (å, æ, ø, ä, ö, á) is in it.
const albert = Albert_Sans({ subsets: ["latin"], variable: "--font-albert", display: "swap" });
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
  // Not preloaded: it would compete with the opening photograph. Text paints at once in a size-matched fallback.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  alternates: alternatesFor("/"),
  openGraph: { siteName: site.name, locale: OG_LOCALES[locale], type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#f3efe6" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={locale} className={`${albert.variable} ${newsreader.variable}`}>
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            name: site.name,
            slogan: site.promise,
            description: site.description,
            url: site.url,
            email: site.contact.email,
            address: { "@type": "PostalAddress", ...site.address.postal },
            areaServed: ["Norway", "Sweden", "Denmark", "Finland"],
          }}
        />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
