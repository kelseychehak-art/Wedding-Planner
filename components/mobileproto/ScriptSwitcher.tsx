"use client";

import { useState } from "react";
import styles from "./ScriptSwitcher.module.css";

/*
 * PREVIEW ONLY — playground controls for /hero-preview. Three rows:
 *  - Script: swaps the hero script font via `--preview-script`
 *  - Background: swaps the hero image via `--preview-bg`
 *  - Frame: toggles the espresso panel treatment via [data-framed]
 * All state is applied on a single wrapper so the (server) hero components
 * just read the CSS vars / attribute.
 */
type Opt = { key: string; label: string; sub?: string; value: string };

const SCRIPTS: Opt[] = [
  { key: "franchesca", label: "≈ Franchesca", sub: "Great Vibes", value: "var(--font-great-vibes)" },
  { key: "charlune", label: "≈ La Charlune", sub: "Pinyon", value: "var(--font-pinyon)" },
  { key: "cherolina", label: "Cherolina", sub: "current", value: "var(--font-names)" },
];

const BACKGROUNDS: Opt[] = [
  { key: "photo", label: "Photo", sub: "current", value: "url(/assets/fluid/federico.jpg)" },
  { key: "valley", label: "Tuscan valley", value: "url(/assets/art/ai-tuscan-valley.jpg)" },
  { key: "swan", label: "Swan lake", value: "url(/assets/art/ai-swan-lake.jpg)" },
  { key: "misty", label: "Misty valley", value: "url(/assets/art/ai-misty-valley.jpg)" },
];

const FRAMES: Opt[] = [
  { key: "off", label: "Open", sub: "no frame", value: "false" },
  { key: "on", label: "Framed", sub: "espresso", value: "true" },
];

export default function ScriptSwitcher({ children }: { children: React.ReactNode }) {
  const [script, setScript] = useState(SCRIPTS[0]);
  const [bg, setBg] = useState(BACKGROUNDS[0]);
  const [frame, setFrame] = useState(FRAMES[0]);

  const row = (
    title: string,
    opts: Opt[],
    active: Opt,
    set: (o: Opt) => void,
  ) => (
    <div className={styles.row}>
      <span className={styles.title}>{title}</span>
      {opts.map((o) => (
        <button
          key={o.key}
          type="button"
          className={`${styles.btn} ${o.key === active.key ? styles.active : ""}`}
          onClick={() => set(o)}
        >
          <span className={styles.btnLabel}>{o.label}</span>
          {o.sub ? <span className={styles.btnSub}>{o.sub}</span> : null}
        </button>
      ))}
    </div>
  );

  return (
    <div
      data-framed={frame.value}
      style={{
        ["--preview-script" as string]: script.value,
        ["--preview-bg" as string]: bg.value,
      }}
    >
      <div className={styles.bar}>
        {row("Script", SCRIPTS, script, setScript)}
        {row("Image", BACKGROUNDS, bg, setBg)}
        {row("Layout", FRAMES, frame, setFrame)}
      </div>
      {children}
    </div>
  );
}
