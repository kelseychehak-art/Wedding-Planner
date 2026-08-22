"use client";

import { useState } from "react";
import styles from "./ShowcaseControls.module.css";

/*
 * PREVIEW ONLY — live control panel for /showcase. Sets --sc-* custom
 * properties on a wrapper that the (server-rendered) Showcase reads:
 *   --sc-script  hero script + footer sign font
 *   --sc-hero    hero background image (url(...))
 *   --sc-swan    hero swan motif (url(...))
 * Font variables (--f-*) live on the page wrapper (next/font); we just
 * point --sc-script at one of them.
 */

type Opt = { id: string; label: string; value: string };

const SCRIPTS: Opt[] = [
  { id: "ital", label: "Italianno", value: "var(--f-ital)" },
  { id: "gwen", label: "Gwendolyn", value: "var(--f-gwen)" },
  { id: "great", label: "Great Vibes", value: "var(--f-great)" },
  { id: "alex", label: "Alex Brush", value: "var(--f-alex)" },
  { id: "mrs", label: "Mrs S. Delafield", value: "var(--f-mrs)" },
  { id: "wind", label: "WindSong", value: "var(--f-wind)" },
  { id: "mea", label: "Mea Culpa", value: "var(--f-mea)" },
];

const HEROES: Opt[] = [
  { id: "oak", label: "Oak valley", value: 'url("/assets/art/ai-oak-valley.jpg")' },
  { id: "oaksky", label: "Oak valley — sky", value: 'url("/assets/art/ai-oak-valley-sky.jpg")' },
  { id: "land1", label: "Landscape 1", value: 'url("/assets/art/landscape-1.jpg")' },
  { id: "land2", label: "Landscape 2", value: 'url("/assets/art/landscape-2.jpg")' },
  { id: "meadow", label: "Oak meadow", value: 'url("/assets/art/ai-oak-meadow.jpg")' },
  { id: "misty", label: "Misty valley", value: 'url("/assets/art/ai-misty-valley.jpg")' },
];

const SWANS: Opt[] = [
  { id: "together", label: "Heart pair", value: 'url("/assets/motifs/swans-together.png")' },
  { id: "pair", label: "Facing pair", value: 'url("/assets/motifs/swans-pair.png")' },
  { id: "solo", label: "Single", value: 'url("/assets/motifs/swan-solo-1.png")' },
];

function Row({
  label,
  opts,
  active,
  onPick,
}: {
  label: string;
  opts: Opt[];
  active: string;
  onPick: (id: string) => void;
}) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <div className={styles.pills}>
        {opts.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`${styles.pill} ${active === o.id ? styles.pillOn : ""}`}
            onClick={() => onPick(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ShowcaseControls({ children }: { children: React.ReactNode }) {
  const [script, setScript] = useState("gwen");
  const [hero, setHero] = useState("oaksky");
  const [swan, setSwan] = useState("together");
  const [open, setOpen] = useState(false);

  const val = (opts: Opt[], id: string) => opts.find((o) => o.id === id)!.value;

  const wrapStyle = {
    ["--sc-script" as string]: val(SCRIPTS, script),
    ["--sc-hero" as string]: val(HEROES, hero),
    ["--sc-swan" as string]: val(SWANS, swan),
  } as React.CSSProperties;

  return (
    <div style={wrapStyle}>
      <div className={`${styles.panel} ${open ? "" : styles.panelClosed}`}>
        <button type="button" className={styles.toggle} onClick={() => setOpen((o) => !o)}>
          <span className={styles.toggleDot} />
          {open ? "Hide controls" : "Show controls"}
        </button>
        {open && (
          <div className={styles.body}>
            <Row label="Script" opts={SCRIPTS} active={script} onPick={setScript} />
            <Row label="Painting" opts={HEROES} active={hero} onPick={setHero} />
            <Row label="Swans" opts={SWANS} active={swan} onPick={setSwan} />
            <p className={styles.hint}>
              Live preview — changes the hero script font, background painting, and swan motif.
            </p>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
