import type { Metadata } from "next";
import styles from "./font-compare-dolce.module.css";

/*
 * Side-by-side: the Dolce hero name-block ("Kelsey & Andrew" + Tuscan-sun
 * subline) rendered in every candidate script, so Kelsey can pick the name
 * font for the Dolce direction. Noindex. Local demo fonts (Cherolina, Aerotis)
 * render on localhost only; the Google fonts are free forever.
 */

export const metadata: Metadata = {
  title: "Font compare (Dolce) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

type Candidate = { label: string; family: string; note: string };

const CANDIDATES: Candidate[] = [
  { label: "Allura", family: "var(--font-allura), cursive", note: "current Dolce · free" },
  { label: "Cherolina", family: '"cherolinaCmp", cursive', note: "your pick · paid ($59 webfont)" },
  { label: "Aerotis", family: '"aerotisCmp", cursive', note: "your accent pick · paid (~$39)" },
  { label: "Great Vibes", family: "var(--font-greatvibes), cursive", note: "free" },
  { label: "Pinyon Script", family: "var(--font-pinyon), cursive", note: "free" },
  { label: "WindSong", family: "var(--font-windsong), cursive", note: "free" },
  { label: "Luxurious Script", family: "var(--font-luxurious), cursive", note: "free" },
];

export default function FontCompareDolcePage() {
  return (
    <div className={styles.page}>
      <p className={styles.intro}>
        The Dolce hero, one script each. Tell me the winner &mdash; I&rsquo;ll wire it across every tab.
        <br />
        <span className={styles.introDim}>(Cherolina &amp; Aerotis are demo fonts &mdash; they only show here on localhost.)</span>
      </p>

      <div className={styles.grid}>
        {CANDIDATES.map((c) => (
          <section key={c.label} className={styles.card}>
            <header className={styles.cardHead}>
              <span className={styles.cardName}>{c.label}</span>
              <span className={styles.cardNote}>{c.note}</span>
            </header>

            <div className={styles.hero}>
              <p className={styles.eyebrow}>Join us for a week in</p>
              <p className={styles.names} style={{ fontFamily: c.family }}>
                Kelsey <span className={styles.amp}>&amp;</span> Andrew
              </p>
              <p className={styles.sub} style={{ fontFamily: c.family }}>
                are getting married in the <span className={styles.sun}>Tuscan sun</span>
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
