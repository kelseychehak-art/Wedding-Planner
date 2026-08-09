import { Playfair_Display, Great_Vibes, Cormorant_Garamond, Instrument_Sans } from "next/font/google";
import DarkHome from "@/components/mobileproto/DarkHome";

/*
 * PREVIEW ONLY — /dark-preview. First pass at the moody espresso direction
 * (wine/olive/mauve, swan crest, lace, drapery) so we can judge it in context.
 * NOINDEX. Real site untouched.
 */
export const metadata = {
  title: "Dark preview (private)",
  robots: { index: false, follow: false },
};

const playfair = Playfair_Display({ weight: ["500", "600"], subsets: ["latin"], variable: "--font-heading" });
const cormorant = Cormorant_Garamond({ weight: ["500", "600"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-serif" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-script" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans" });

const VARS = [playfair, cormorant, greatVibes, instrument].map((f) => f.variable).join(" ");

export default function DarkPreviewPage() {
  return (
    <div
      className={VARS}
      style={{ ["--font-names" as string]: "var(--font-script)", ["--font-body" as string]: "var(--font-serif)" }}
    >
      <DarkHome />
    </div>
  );
}
