import type { Metadata } from "next";
import { Cormorant_Garamond, Fraunces, Instrument_Sans, Pinyon_Script } from "next/font/google";
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
      className={`${cormorant.variable} ${fraunces.variable} ${instrumentSans.variable} ${pinyonScript.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
