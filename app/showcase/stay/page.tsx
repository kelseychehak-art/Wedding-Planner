import { Playfair_Display, Cormorant_Garamond, Instrument_Sans, Gwendolyn } from "next/font/google";
import ShowcaseTab from "@/components/mobileproto/ShowcaseTab";
import { stayMeta, StayBody } from "@/components/mobileproto/tabs";

export const metadata = {
  title: "Stay preview (private)",
  robots: { index: false, follow: false },
};

const playfair = Playfair_Display({ weight: ["500", "600"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-display" });
const cormorant = Cormorant_Garamond({ weight: ["500", "600"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-serif" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans" });
const gwendolyn = Gwendolyn({ weight: "400", subsets: ["latin"], variable: "--font-script" });

const VARS = [playfair, cormorant, instrument, gwendolyn].map((f) => f.variable).join(" ");

export default function ShowcaseStayPage() {
  return (
    <div className={VARS}>
      <ShowcaseTab title={stayMeta.title} subtitle={stayMeta.subtitle} activeKey="stay">
        <StayBody />
      </ShowcaseTab>
    </div>
  );
}
