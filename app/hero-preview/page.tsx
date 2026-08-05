import { Great_Vibes, Pinyon_Script } from "next/font/google";
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

const SCRIPT_OPTIONS = [
  { key: "franchesca", label: "≈ Franchesca", sub: "Great Vibes", value: "var(--font-great-vibes)" },
  { key: "charlune", label: "≈ La Charlune", sub: "Pinyon Script", value: "var(--font-pinyon)" },
  { key: "cherolina", label: "Cherolina", sub: "current", value: "var(--font-names)" },
];

export default function HeroPreviewPage() {
  return (
    <div className={`${greatVibes.variable} ${pinyon.variable}`}>
      <ScriptSwitcher options={SCRIPT_OPTIONS}>
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
