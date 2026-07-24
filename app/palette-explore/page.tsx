import type { Metadata } from "next";
import type { CSSProperties } from "react";
import styles from "./palette-explore.module.css";

/*
 * Palette exploration — swatch board + an applied mini-hero for each candidate
 * palette, so Kelsey can pick THE color system before it's wired as tokens.
 * Noindex, throwaway compare route.
 */

export const metadata: Metadata = {
  title: "Palette explore · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

type Swatch = { name: string; hex: string; on?: string };
type Palette = {
  name: string;
  note: string;
  paper: string;
  ink: string;
  muted: string;
  warm: string; // primary warm accent (headline word, button)
  cool: string; // cool accent (eyebrow)
  swatches: Swatch[];
};

// Same Dolce Vita accents, three base creams — pick the base that makes the
// colors pop without going stark white.
const DV_SWATCHES = (cream: string): Swatch[] => [
  { name: "Cream", hex: cream, on: "#2f2a24" },
  { name: "Ink", hex: "#2f2a24", on: cream },
  { name: "Cornflower", hex: "#6f9fce", on: "#fff" },
  { name: "Terracotta", hex: "#d96b3f", on: "#fff" },
  { name: "Golden", hex: "#e8b23e", on: "#2f2a24" },
  { name: "Herb green", hex: "#6e8b3d", on: "#fff" },
  { name: "Coral", hex: "#e79072", on: "#2f2a24" },
  { name: "Blush", hex: "#edc9bd", on: "#2f2a24" },
  { name: "Tomato", hex: "#c0492f", on: "#fff" },
];

const PALETTES: Palette[] = [
  {
    name: "Warm cream (now)",
    note: "#f7efdf — the current base",
    paper: "#f7efdf",
    ink: "#2f2a24",
    muted: "#8a8175",
    warm: "#d96b3f",
    cool: "#6f9fce",
    swatches: DV_SWATCHES("#f7efdf"),
  },
  {
    name: "Lighter ivory",
    note: "#faf6ec — a shade lighter",
    paper: "#faf6ec",
    ink: "#2f2a24",
    muted: "#8a8175",
    warm: "#d96b3f",
    cool: "#6f9fce",
    swatches: DV_SWATCHES("#faf6ec"),
  },
  {
    name: "Lightest ivory",
    note: "#fcf9f2 — soft off-white, not stark",
    paper: "#fcf9f2",
    ink: "#2f2a24",
    muted: "#8a8175",
    warm: "#d96b3f",
    cool: "#6f9fce",
    swatches: DV_SWATCHES("#fcf9f2"),
  },
];

export default function PaletteExplorePage() {
  return (
    <div className={styles.page}>
      <p className={styles.intro}>
        Three candidate palettes. Each shows its swatches (with hex) and a little sample of the hero
        applied. Tell me which one &mdash; or mix (&ldquo;Dolce Vita but the muted blue&rdquo;) &mdash; and
        I&rsquo;ll wire it as tokens across every tab.
      </p>

      <div className={styles.grid}>
        {PALETTES.map((p) => {
          const cardVars = {
            "--paper": p.paper,
            "--ink": p.ink,
            "--muted": p.muted,
            "--warm": p.warm,
            "--cool": p.cool,
          } as CSSProperties;
          return (
            <section key={p.name} className={styles.card} style={cardVars}>
              <div className={styles.head}>
                <p className={styles.name}>{p.name}</p>
                <p className={styles.note}>{p.note}</p>
              </div>

              <div className={styles.swatches}>
                {p.swatches.map((s) => (
                  <div key={s.name} className={styles.sw} style={{ background: s.hex, color: s.on ?? "#2f2a24" }}>
                    <span className={styles.swName}>{s.name}</span>
                    <span className={styles.swHex}>{s.hex}</span>
                  </div>
                ))}
              </div>

              <div className={styles.sample}>
                <p className={styles.eyebrow}>With love</p>
                <p className={styles.headline}>
                  One <span className={styles.hi}>unforgettable</span> week
                </p>
                <p className={styles.body}>Five days of celebrating in Tuscany.</p>
                <span className={styles.pill}>RSVP &amp; Details</span>
                <div className={styles.dots}>
                  {p.swatches.slice(2).map((s) => (
                    <span key={s.name} className={styles.dot} style={{ background: s.hex }} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
