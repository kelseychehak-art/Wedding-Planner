import { Playfair_Display, Cormorant_Garamond, Instrument_Sans, Gwendolyn } from "next/font/google";
import ShowcaseTab from "@/components/mobileproto/ShowcaseTab";
import { travelMeta, TravelBody } from "@/components/mobileproto/tabs";

/*
 * PREVIEW ONLY — /showcase/travel. The real Travel body under the new brand
 * skin (palette + fonts + motifs + painting background). NOINDEX.
 */
export const metadata = {
  title: "Tab preview (private)",
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

export default function ShowcaseTravelPage() {
  return (
    <div className={VARS}>
      <ShowcaseTab title={travelMeta.title} subtitle={travelMeta.subtitle} activeKey="travel">
        <TravelBody rsvpHref="#" />
      </ShowcaseTab>
    </div>
  );
}
