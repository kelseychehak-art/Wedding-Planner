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
  { key: "greatvibes", label: "Great Vibes", var: "--font-greatvibes", note: "Dramatic capitals, high contrast — the most 'accentuated'." },
  { key: "pinyon", label: "Pinyon Script", var: "--font-pinyon", note: "Formal calligraphy, ornate flourishes." },
  { key: "tangerine", label: "Tangerine", var: "--font-tangerine", note: "Elegant, flowing, lighter." },
  { key: "parisienne", label: "Parisienne", var: "--font-parisienne", note: "Casual-elegant signature." },
  { key: "allura", label: "Allura (current)", var: "--font-allura", note: "Restrained signature — what's on preview-3 now." },
];

export default function ScriptComparePage() {
  return (
    <div className={styles.page}>
      <p className={styles.intro}>
        Same words, five scripts. Tell me the one closest to your template &mdash; or the number.
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
