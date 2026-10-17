import type { Metadata, Viewport } from "next";
import { Albert_Sans, DM_Mono, Newsreader } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { site } from "@/config/site";
import "./globals.css";

const albert = Albert_Sans({ subsets: ["latin", "latin-ext"], variable: "--font-albert", display: "swap" });
const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});
const dmMono = DM_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--font-dm-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, locale: site.locale, type: "website" },
};

export const viewport: Viewport = { themeColor: "#f3efe6" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${albert.variable} ${newsreader.variable} ${dmMono.variable}`}>
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
