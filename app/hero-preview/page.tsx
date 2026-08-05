import {
  Great_Vibes,
  Pinyon_Script,
  Playfair_Display,
  Cormorant_Garamond,
  Fraunces,
} from "next/font/google";
import HeroPreviewMobile from "@/components/mobileproto/HeroPreviewMobile";
import HeroPreviewDesktop from "@/components/mobileproto/HeroPreviewDesktop";
import ScriptSwitcher from "@/components/mobileproto/ScriptSwitcher";
import rt from "@/components/mobileproto/ResponsiveTab.module.css";

/*
 * PREVIEW ONLY — /hero-preview. The "flipped" hero (serif names + script
 * phrase) so we can judge the fix in context before buying a font. NOINDEX.
 * Great Vibes ≈ Franchesca, Pinyon Script ≈ La Charlune (free Google stand-ins
 * for the paid fonts); Cherolina is the current site script for reference.
 */
export const metadata = {
  title: "Hero preview (private)",
  robots: { index: false, follow: false },
};

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-great-vibes" });
const pinyon = Pinyon_Script({ weight: "400", subsets: ["latin"], variable: "--font-pinyon" });
const playfair = Playfair_Display({ weight: ["500", "600"], subsets: ["latin"], variable: "--font-playfair-p" });
const cormorant = Cormorant_Garamond({ weight: ["500", "600"], subsets: ["latin"], variable: "--font-cormorant-p" });
const fraunces = Fraunces({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-fraunces-p" });

const FONT_VARS = [greatVibes, pinyon, playfair, cormorant, fraunces]
  .map((f) => f.variable)
  .join(" ");

export default function HeroPreviewPage() {
  return (
    <div className={FONT_VARS}>
      <ScriptSwitcher>
        <div className={rt.mobile}>
          <HeroPreviewMobile />
        </div>
        <div className={rt.desktop}>
          <HeroPreviewDesktop />
        </div>
      </ScriptSwitcher>
    </div>
  );
}
