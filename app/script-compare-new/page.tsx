import type { Metadata } from "next";
import { siteContent } from "@/data/siteContent";
import s from "./script-compare-new.module.css";

/*
 * PROTOTYPE — compare Kelsey's newly-dropped free-ish scripts against Cherolina
 * (the $59 personal-use one we've been using). Each card shows the couple names
 * in that font + a license badge, so looks and legality sit side by side.
 * Fonts are local (gitignored) → localhost only. Noindex.
 */

export const metadata: Metadata = {
  title: "Script Compare (new) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

type Lic = "free" | "paid" | "no" | "unknown";
type Row = { name: string; cls: string; lic: Lic; note: string };

const REF: Row = {
  name: "Cherolina",
  cls: s.fCherolina,
  lic: "no",
  note: "What we've been using · $59, personal-use demo — the one to match or beat.",
};

// Confirmed-free first, then unverified, then the not-free ones last.
const ROWS: Row[] = [
  { name: "Royalty Free", cls: s.fRoyalty, lic: "free", note: "License file: “100% free for personal & commercial use.” — your closest match, as-is." },
  { name: "Royalty Free — faux-thinned", cls: s.fRoyaltyThin, lic: "free", note: "Same font, edges shaved with a cream stroke so it reads lighter. Works because names sit on solid cream." },
  { name: "Quetine", cls: s.fQuetine, lic: "free", note: "License file: “100% free for personal & commercial use.”" },
  { name: "Sientta", cls: s.fSientta, lic: "unknown", note: "No license file included — verify on the source page before using." },
  { name: "Anita Jane", cls: s.fAnita, lic: "unknown", note: "No license file included — verify before using." },
  { name: "Botterill Signature", cls: s.fBotterill, lic: "unknown", note: "No license file included — verify before using." },
  { name: "Michael (Mike Ferrari)", cls: s.fMichael, lic: "unknown", note: "No license file included — verify before using." },
  { name: "Clarissa", cls: s.fClarissa, lic: "unknown", note: "No license file included — verify before using." },
  { name: "Adelia", cls: s.fAdelia, lic: "unknown", note: "No license file included — verify before using." },
  { name: "Frutilla Script", cls: s.fFrutilla, lic: "paid", note: "Ian Mikraz freebie — free personal, commercial needs a paid extended license." },
  { name: "Andrea Bellarosa", cls: s.fAndrea, lic: "no", note: "License file: “PERSONAL USE. NO COMMERCIAL USE ALLOWED.”" },
];

const BADGE: Record<Lic, { cls: string; text: string }> = {
  free: { cls: s.free, text: "Free · personal + commercial ✓" },
  paid: { cls: s.paid, text: "Free personal · commercial = paid" },
  no: { cls: s.no, text: "Personal only · no commercial ✗" },
  unknown: { cls: s.unknown, text: "License unverified" },
};

function Card({ row, isRef }: { row: Row; isRef?: boolean }) {
  const b = BADGE[row.lic];
  const { couple } = siteContent;
  return (
    <section className={`${s.card} ${isRef ? s.cardRef : ""}`}>
      <div className={s.meta}>
        <span className={s.name}>{row.name}</span>
        <span className={`${s.badge} ${b.cls}`}>{b.text}</span>
        <span className={s.note}>{row.note}</span>
      </div>
      <p className={`${s.names} ${row.cls}`}>
        <span>{couple.bride}</span>
        <span className={s.amp}>&amp;</span>
        <span>{couple.groom}</span>
      </p>
      <p className={`${s.tag} ${row.cls}`}>the celebration begins in</p>
    </section>
  );
}

export default function ScriptCompareNewPage() {
  return (
    <div className={s.page}>
      <header className={s.head}>
        <p className={s.eyebrow}>Script comparison</p>
        <h1 className={s.h1}>Free scripts vs. Cherolina</h1>
        <p className={s.sub}>
          Your names in each of the newly-dropped scripts, with its license. The two green ones are
          the only ones confirmed free for a live site; “unverified” means no license came in the
          zip, so double-check the source before committing.
        </p>
      </header>

      <Card row={REF} isRef />
      {ROWS.map((r) => (
        <Card key={r.name} row={r} />
      ))}
    </div>
  );
}
