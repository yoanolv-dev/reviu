import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

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
  title: "reviu — Plus d'avis Google, sans effort",
  description:
    "Présentoirs NFC et QR codes dynamiques pour collecter un maximum d'avis Google. Vos clients laissent un avis en un geste, vous pilotez tout à distance.",
  metadataBase: new URL("https://reviu.fr"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
