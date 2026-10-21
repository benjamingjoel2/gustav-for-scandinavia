import type { Metadata, Viewport } from "next";
import { Albert_Sans, DM_Mono, Newsreader } from "next/font/google";
import { JsonLd } from "@/components/editorial/JsonLd";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { site } from "@/config/site";
import "./globals.css";

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
const dmMono = DM_Mono({ subsets: ["latin"], weight: "400", variable: "--font-dm-mono", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: { siteName: site.name, locale: site.locale, type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#f3efe6" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${albert.variable} ${newsreader.variable} ${dmMono.variable}`}>
      <head>
        {/* Photographs come from the Unsplash CDN: open the connection before the first image is requested. */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
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
