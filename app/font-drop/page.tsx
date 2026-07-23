import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import styles from "./font-drop.module.css";

/*
 * Renders every font dropped into public/fonts/candidates/ttf as "Kelsey and
 * Andrew" so Kelsey can pick her name script. Reads the folder at request time,
 * so it auto-updates as fonts are added/removed. Noindex. Licenses are checked
 * before any font ships to the live site (most of these are personal-use/demo).
 */

export const metadata: Metadata = {
  title: "Font drop · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function label(file: string) {
  return file
    .replace(/\.(ttf|otf)$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function FontDropPage() {
  const dir = path.join(process.cwd(), "public/fonts/candidates/ttf");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => /\.(ttf|otf)$/i.test(f)).sort();
  } catch {
    files = [];
  }

  const fontFace = files
    .map((f, i) => {
      const fmt = /\.otf$/i.test(f) ? "opentype" : "truetype";
      return `@font-face{font-family:'cand${i}';src:url('/fonts/candidates/ttf/${f}') format('${fmt}');font-display:swap;}`;
    })
    .join("");

  return (
    <div className={styles.page}>
      <style>{fontFace}</style>
      <p className={styles.intro}>
        {files.length} fonts from your drop. Tell me the names of your favourites &mdash; then I&rsquo;ll
        drop them into the real design.
      </p>

      {files.length === 0 && <p className={styles.intro}>No font files found in the folder yet.</p>}

      {files.map((f, i) => (
        <section key={f} className={styles.row}>
          <p className={styles.name}>{label(f)}</p>
          <p className={styles.sample} style={{ fontFamily: `'cand${i}', cursive` }}>
            Kelsey <span className={styles.and}>and</span> Andrew
          </p>
          <p className={styles.sub} style={{ fontFamily: `'cand${i}', cursive` }}>
            are getting married!
          </p>
        </section>
      ))}
    </div>
  );
}
