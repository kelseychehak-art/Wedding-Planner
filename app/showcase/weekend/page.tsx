import { Playfair_Display, Cormorant_Garamond, Instrument_Sans, Gwendolyn } from "next/font/google";
import ShowcaseWeekend from "@/components/mobileproto/ShowcaseWeekend";

/*
 * PREVIEW ONLY — /showcase/weekend. The Weekend itinerary (enriched) in the new
 * brand skin, same timeline structure as the live page. NOINDEX.
 */
export const metadata = {
  title: "Weekend preview (private)",
  robots: { index: false, follow: false },
};

const playfair = Playfair_Display({ weight: ["500", "600"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-display" });
const cormorant = Cormorant_Garamond({
  weight: ["500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
});
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans" });
const gwendolyn = Gwendolyn({ weight: "400", subsets: ["latin"], variable: "--font-script" });

const VARS = [playfair, cormorant, instrument, gwendolyn].map((f) => f.variable).join(" ");

export default function ShowcaseWeekendPage() {
  return (
    <div className={VARS}>
      <ShowcaseWeekend />
    </div>
  );
}
