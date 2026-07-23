import type { Metadata } from "next";
import {
  Allura,
  Caveat,
  Cormorant_Garamond,
  Fraunces,
  Great_Vibes,
  Instrument_Sans,
  Luxurious_Script,
  Parisienne,
  Pinyon_Script,
  Playfair_Display,
  Sacramento,
  Tangerine,
  WindSong,
} from "next/font/google";
import "../styles/tokens.css";
import "./globals.css";

// Type system — "Option A" (docs/decisions.md D10), all free Google Fonts.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const pinyonScript = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// High-contrast Didone for the display names (the KELSEY / ANDREW look).
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Casual handwriting for scrapbook-style annotations.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Thin signature script for the couple names (the scrapbook template look).
const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Elegant signature script — the scrapbook template's real hand.
const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Candidate accentuated scripts (for the name-script comparison).
const greatVibes = Great_Vibes({
  variable: "--font-greatvibes",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
const tangerine = Tangerine({
  variable: "--font-tangerine",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});
const parisienne = Parisienne({
  variable: "--font-parisienne",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
const windsong = WindSong({
  variable: "--font-windsong",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});
const luxurious = Luxurious_Script({
  variable: "--font-luxurious",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kelsey & Andrew's Wedding Week",
  description: "Join us for a week in Italy — Kelsey & Andrew's Wedding Week.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${fraunces.variable} ${instrumentSans.variable} ${pinyonScript.variable} ${playfair.variable} ${caveat.variable} ${sacramento.variable} ${allura.variable} ${greatVibes.variable} ${tangerine.variable} ${parisienne.variable} ${windsong.variable} ${luxurious.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
