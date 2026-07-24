import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Playfair_Display,
  EB_Garamond,
  DM_Serif_Display,
  Tangerine,
  Ephesis,
  Italianno,
  Pinyon_Script,
} from "next/font/google";
import styles from "./tagline-compare.module.css";

/*
 * PROTOTYPE — pick a tagline font. Candidates for "are getting married under
 * the Tuscan sun": more flowing than the current plain italic, but not full
 * script. Shown on cream and over a painting, with the Cherolina names above
 * for context. Noindex.
 */

export const metadata: Metadata = {
  title: "Tagline Font Compare · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

const cormorant = Cormorant_Garamond({ subsets: ["latin"], style: ["italic"], weight: ["500"] });
const playfair = Playfair_Display({ subsets: ["latin"], style: ["italic"], weight: ["500"] });
const ebgaramond = EB_Garamond({ subsets: ["latin"], style: ["italic"], weight: ["500"] });
const dmserif = DM_Serif_Display({ subsets: ["latin"], style: ["italic"], weight: ["400"] });
const tangerine = Tangerine({ subsets: ["latin"], weight: ["400", "700"] });
const ephesis = Ephesis({ subsets: ["latin"], weight: ["400"] });
const italianno = Italianno({ subsets: ["latin"], weight: ["400"] });
const pinyon = Pinyon_Script({ subsets: ["latin"], weight: ["400"] });

const OPTIONS: { n: number; name: string; note: string; cls: string; big?: boolean }[] = [
  { n: 0, name: "Cormorant Italic", note: "current — plain italic", cls: cormorant.className },
  { n: 1, name: "Playfair Display Italic", note: "editorial, gentle swashes", cls: playfair.className },
  { n: 2, name: "EB Garamond Italic", note: "classic book italic", cls: ebgaramond.className },
  { n: 3, name: "DM Serif Display Italic", note: "dramatic, high-contrast", cls: dmserif.className },
  { n: 4, name: "Ephesis", note: "flowing calligraphic — semi-script", cls: ephesis.className, big: true },
  { n: 5, name: "Tangerine", note: "elegant semi-script", cls: tangerine.className, big: true },
  { n: 6, name: "Italianno", note: "very flowing (leans script)", cls: italianno.className, big: true },
  { n: 7, name: "Pinyon Script", note: "full script — the 'too much' end", cls: pinyon.className, big: true },
];

function Line({ cls }: { cls: string }) {
  return (
    <p className={cls}>
      are getting married under the <em className={styles.em}>Tuscan sun</em>
    </p>
  );
}

export default function TaglineComparePage() {
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>Tagline font</p>
        <h1 className={styles.h1}>More flow, not full script</h1>
        <p className={styles.sub}>
          Names stay Cherolina. The line below is what we&rsquo;re choosing a font for.
        </p>
      </header>

      {OPTIONS.map((o) => (
        <section key={o.n} className={styles.row}>
          <div className={styles.meta}>
            <span className={styles.num}>{o.n}</span>
            <span className={styles.name}>{o.name}</span>
            <span className={styles.noteText}>{o.note}</span>
          </div>

          {/* In context: Cherolina names + this candidate tagline */}
          <div className={styles.context}>
            <p className={styles.names}>
              <span>Kelsey</span>
              <span className={styles.amp}>&amp;</span>
              <span>Andrew</span>
            </p>
            <div className={`${styles.taglineBox} ${o.big ? styles.taglineBig : ""}`}>
              <Line cls={o.cls} />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
