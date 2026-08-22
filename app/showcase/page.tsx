import {
  Playfair_Display,
  Cormorant_Garamond,
  Instrument_Sans,
  Italianno,
  Gwendolyn,
  Great_Vibes,
  Alex_Brush,
  Mrs_Saint_Delafield,
  WindSong,
  Mea_Culpa,
} from "next/font/google";
import ShowcaseControls from "@/components/mobileproto/ShowcaseControls";
import Showcase from "@/components/mobileproto/Showcase";

/*
 * PREVIEW ONLY — /showcase. The new brand direction, all together, with a live
 * control panel (script font × painting × swan). NOINDEX. Real site untouched.
 */
export const metadata = {
  title: "Showcase (private)",
  robots: { index: false, follow: false },
};

// System fonts
const playfair = Playfair_Display({ weight: ["500", "600"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-display" });
const cormorant = Cormorant_Garamond({
  weight: ["500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
});
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans" });

// The 7 candidate hero scripts (all free, web-licensed Google Fonts)
const ital = Italianno({ weight: "400", subsets: ["latin"], variable: "--f-ital" });
const gwen = Gwendolyn({ weight: ["400", "700"], subsets: ["latin"], variable: "--f-gwen" });
const great = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--f-great" });
const alex = Alex_Brush({ weight: "400", subsets: ["latin"], variable: "--f-alex" });
const mrs = Mrs_Saint_Delafield({ weight: "400", subsets: ["latin"], variable: "--f-mrs" });
const wind = WindSong({ weight: ["400", "500"], subsets: ["latin"], variable: "--f-wind" });
const mea = Mea_Culpa({ weight: "400", subsets: ["latin"], variable: "--f-mea" });

const VARS = [playfair, cormorant, instrument, ital, gwen, great, alex, mrs, wind, mea]
  .map((f) => f.variable)
  .join(" ");

export default function ShowcasePage() {
  return (
    <div className={VARS}>
      <ShowcaseControls>
        <Showcase />
      </ShowcaseControls>
    </div>
  );
}
