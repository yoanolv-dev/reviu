import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE } from "@/lib/brand";
import {
  BRAND_DESCRIPTION,
  graph,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

// Polices auto-hébergées par next/font (aucune requête externe). display:swap
// évite le texte invisible au chargement. Space Grotesk est chargée en variable
// (un seul fichier couvre tous les poids) plutôt qu'en 4 instances fixes, et le
// mono, peu utilisé, n'est pas préchargé pour alléger le chemin critique.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "reviu — Plus d'avis Google, sans effort",
    template: "%s",
  },
  description: BRAND_DESCRIPTION,
  applicationName: SITE.name,
  authors: [{ name: "reviu" }],
  creator: "reviu",
  publisher: "reviu",
  category: "business",
  keywords: [
    "avis Google",
    "plus d'avis Google",
    "présentoir avis Google",
    "plaque NFC avis Google",
    "QR code avis Google",
    "collecter des avis clients",
    "e-réputation commerce local",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "fr_FR",
    url: SITE_URL,
    title: "reviu — Plus d'avis Google, sans effort",
    description: BRAND_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "reviu — Présentoirs NFC et QR codes pour plus d'avis Google",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "reviu — Plus d'avis Google, sans effort",
    description: BRAND_DESCRIPTION,
    images: [`${SITE_URL}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* Graphe de marque (Organization + WebSite), lu par Google et les
            moteurs génératifs pour identifier l'entité « reviu » de façon
            cohérente sur tout le site. */}
        <JsonLd schema={graph(organizationSchema(), websiteSchema())} />
        {children}
      </body>
    </html>
  );
}
