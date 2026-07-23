import type { Metadata } from "next";
import styles from "./script-compare.module.css";

/*
 * Name-script comparison — "Kelsey and Andrew" in each accentuated wedding
 * script so Kelsey can pick the closest to the scrapbook template. Noindex.
 */

export const metadata: Metadata = {
  title: "Script comparison · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

const OPTIONS: { key: string; label: string; var: string; note: string }[] = [
  { key: "windsong", label: "WindSong", var: "--font-windsong", note: "Whimsical, looping, lots of flourish." },
  { key: "luxurious", label: "Luxurious Script", var: "--font-luxurious", note: "Fine, high-contrast, dramatic capitals." },
  { key: "pinyon", label: "Pinyon Script", var: "--font-pinyon", note: "Formal calligraphy, ornate flourishes." },
  { key: "greatvibes", label: "Great Vibes", var: "--font-greatvibes", note: "Bold, dramatic capitals, high contrast." },
];

export default function ScriptComparePage() {
  return (
    <div className={styles.page}>
      <p className={styles.intro}>
        Same words, four scripts. Tell me the one closest to your template &mdash; or the number.
      </p>

      {OPTIONS.map((o, i) => (
        <section key={o.key} className={styles.row}>
          <div className={styles.meta}>
            <span className={styles.num}>{i + 1}</span>
            <span className={styles.name}>{o.label}</span>
            <span className={styles.note}>{o.note}</span>
          </div>
          <p className={styles.sample} style={{ fontFamily: `var(${o.var})` }}>
            Kelsey <span className={styles.and}>and</span> Andrew
          </p>
          <p className={styles.sub} style={{ fontFamily: `var(${o.var})` }}>
            are getting married!
          </p>
        </section>
      ))}
    </div>
  );
}
