import type { Metadata } from "next";
import { Albert_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const albert = Albert_Sans({ subsets: ["latin"], variable: "--font-albert", display: "swap" });

export const metadata: Metadata = { title: "Not found · Gustav", robots: { index: false } };

/** Shown for URLs that match no page in any language (each language's own 404 handles missing slugs). */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={albert.variable}>
      <body>
        <main id="main" className="flex min-h-svh flex-col justify-center bg-polar text-birch-50">
          <div className="gutter">
            <p className="eyebrow text-birch-50/80">404</p>
            <h1 className="headline mt-4 max-w-2xl">
              This page is in <em>polar night.</em>
            </h1>
            <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm">
              <Link href="/" lang="en" className="underline underline-offset-4">Back to home</Link>
              <Link href="/fr" lang="fr" className="underline underline-offset-4">Retour à l’accueil</Link>
              <Link href="/de" lang="de" className="underline underline-offset-4">Zur Startseite</Link>
              <Link href="/es" lang="es" className="underline underline-offset-4">Volver al inicio</Link>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
