import type { Metadata } from "next";
import candidates from "./candidates.json";
import styles from "./art-picker.module.css";

/*
 * PROTOTYPE — browse public-domain art from The Met's Open Access API
 * (metmuseum.github.io). Everything here is isPublicDomain: true, released CC0
 * — free to use in any medium, no permission or fee. Images are hot-linked from
 * the Met for browsing only; once Kelsey picks, we download the full-resolution
 * originals and optimise them into /public/assets/art/. Noindex.
 */

export const metadata: Metadata = {
  title: "Art Picker · The Met Open Access · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

type Art = {
  id: number;
  cat: string;
  title: string;
  artist: string;
  date: string;
  img: string;
  small: string;
  url: string;
};

const NOTES: Record<string, string> = {
  "Italian landscapes": "Hero + tab headers — the Claude Lorrain look.",
  "Gardens & terraces": "Softer headers for Stay and Activities.",
  "Citrus & fruit": "Lemons — straight out of your Amalfi palette.",
  "Still life with porcelain": "Painted blue-and-white bowls with lemons — the Willem Kalf look, not photos of pots.",
  Florals: "Romantic accents, section breaks, the RSVP page.",
  "Botanical studies": "Delicate line-y studies — good as small spot art.",
  "Pattern & ornament": "Not photographs at all — repeatable texture, dividers, backgrounds.",
};

export default function ArtPickerPage() {
  const art = candidates as Art[];
  const cats = [...new Set(art.map((a) => a.cat))];

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>The Met · Open Access</p>
        <h1 className={styles.title}>Pick our art</h1>
        <p className={styles.sub}>
          {art.length}{" "}public-domain works, all CC0 — free to use in any medium, no permission
          or fee. Tell me the ID numbers you like and I&rsquo;ll wire them in.
        </p>
        <nav className={styles.jump}>
          {cats.map((c) => (
            <a key={c} href={`#${slug(c)}`} className={styles.jumpLink}>
              {c}
            </a>
          ))}
        </nav>
      </header>

      {cats.map((c) => {
        const items = art.filter((a) => a.cat === c);
        return (
          <section key={c} id={slug(c)} className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>{c}</h2>
              <span className={styles.count}>{items.length} works</span>
              {NOTES[c] && <p className={styles.note}>{NOTES[c]}</p>}
            </div>

            <div className={styles.grid}>
              {items.map((a) => (
                <figure key={a.id} className={styles.card}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.small || a.img} alt={a.title} className={styles.img} loading="lazy" />
                  <figcaption className={styles.cap}>
                    <span className={styles.id}>#{a.id}</span>
                    <span className={styles.name}>{a.title}</span>
                    <span className={styles.meta}>
                      {a.artist}
                      {a.date ? ` · ${a.date}` : ""}
                    </span>
                    <a href={a.url} target="_blank" rel="noreferrer" className={styles.link}>
                      View at the Met →
                    </a>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z]+/g, "-");
}
