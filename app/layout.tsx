import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: '#1C2B4A',
};

export const metadata: Metadata = {
  title: {
    default: "Cap Aventure — Location de Vans & Camping-cars Premium",
    template: "%s | Cap Aventure",
  },
  description:
    "Louez votre van aménagé, camping-car profilé ou fourgon pour explorer la France et l'Europe. Flotte premium, assurance incluse, réservation en ligne rapide.",
  keywords: [
    "location van aménagé",
    "location camping-car",
    "fourgon aménagé",
    "roadtrip France",
    "Cap Aventure",
    "Bordeaux",
  ],
  authors: [{ name: "Cap Aventure" }],
  openGraph: {
    title: "Cap Aventure — Location de Vans & Camping-cars Premium",
    description:
      "Explorez la liberté sur les routes à bord de notre flotte de vans et camping-cars premium. Assurance tous risques incluse.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${plusJakartaSans.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-brand-beige text-brand-text">
        {children}
      </body>
    </html>
  );
}
