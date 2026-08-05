"use client";

import { useRef, useState } from "react";
import styles from "./ScriptSwitcher.module.css";

/*
 * PREVIEW ONLY — playground controls for /hero-preview.
 * Rows: Names / Script / Image / Layout, plus a "Place" row that lets you DRAG
 * the background image to position it (updates `--preview-pos`) and copy the
 * resulting `background-position` so it can be baked into the real page.
 */
type Opt = { key: string; label: string; sub?: string; value: string };

const NAMES: Opt[] = [
  { key: "playfair", label: "Playfair", sub: "Didone", value: "var(--font-playfair-p)" },
  { key: "cormorant", label: "Cormorant", sub: "garamond", value: "var(--font-cormorant-p)" },
  { key: "fraunces", label: "Fraunces", sub: "modern", value: "var(--font-fraunces-p)" },
];

const SCRIPTS: Opt[] = [
  { key: "franchesca", label: "≈ Franchesca", sub: "Great Vibes", value: "var(--font-great-vibes)" },
  { key: "charlune", label: "≈ La Charlune", sub: "Pinyon", value: "var(--font-pinyon)" },
  { key: "cherolina", label: "Cherolina", sub: "current", value: "var(--font-names)" },
];

const BACKGROUNDS: Opt[] = [
  { key: "photo", label: "Photo", sub: "current", value: "url(/assets/fluid/federico.jpg)" },
  { key: "oak-valley", label: "Oak valley", sub: "Canva", value: "url(/assets/art/ai-oak-valley.jpg)" },
  { key: "landscape-1", label: "Landscape 1", value: "url(/assets/art/landscape-1.jpg)" },
  { key: "landscape-2", label: "Landscape 2", value: "url(/assets/art/landscape-2.jpg)" },
  { key: "swan-1", label: "Swan 1", value: "url(/assets/art/swan-1.jpg)" },
  { key: "misty-valley", label: "Misty valley", value: "url(/assets/art/ai-misty-valley.jpg)" },
];

const FRAMES: Opt[] = [
  { key: "off", label: "Open", sub: "no frame", value: "false" },
  { key: "on", label: "Framed", sub: "espresso", value: "true" },
];

const clamp = (v: number) => Math.max(0, Math.min(100, v));

export default function ScriptSwitcher({ children }: { children: React.ReactNode }) {
  const [names, setNames] = useState(NAMES[0]);
  const [script, setScript] = useState(SCRIPTS[0]);
  const [bg, setBg] = useState(BACKGROUNDS[0]);
  const [frame, setFrame] = useState(FRAMES[0]);
  const [pos, setPos] = useState({ x: 50, y: 55 });
  const [placing, setPlacing] = useState(false);
  const [copied, setCopied] = useState(false);
  const posRef = useRef(pos);
  posRef.current = pos;

  // Drag anywhere on the image to pan it. Window-level listeners so the gesture
  // keeps tracking even if the pointer leaves the layer, and preventDefault so
  // the browser doesn't start a text selection instead.
  const onDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const start = { x: e.clientX, y: e.clientY, px: posRef.current.x, py: posRef.current.y };
    const s = 0.09;
    const move = (ev: PointerEvent) => {
      setPos({
        x: clamp(start.px - (ev.clientX - start.x) * s),
        y: clamp(start.py - (ev.clientY - start.y) * s),
      });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const posStr = `${Math.round(pos.x)}% ${Math.round(pos.y)}%`;
  const copy = () => {
    navigator.clipboard?.writeText(`${bg.key} → background-position: ${posStr}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const row = (title: string, opts: Opt[], active: Opt, set: (o: Opt) => void) => (
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
        ["--preview-names" as string]: names.value,
        ["--preview-script" as string]: script.value,
        ["--preview-bg" as string]: bg.value,
        ["--preview-pos" as string]: posStr,
      }}
    >
      <div
        onPointerDown={onDown}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 45,
          cursor: "grab",
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          pointerEvents: placing ? "auto" : "none",
        }}
      />

      <div className={styles.bar}>
        {row("Names", NAMES, names, setNames)}
        {row("Script", SCRIPTS, script, setScript)}
        {row("Image", BACKGROUNDS, bg, setBg)}
        {row("Layout", FRAMES, frame, setFrame)}
        <div className={styles.row}>
          <span className={styles.title}>Place</span>
          <button
            type="button"
            className={`${styles.btn} ${placing ? styles.active : ""}`}
            onClick={() => setPlacing((p) => !p)}
          >
            <span className={styles.btnLabel}>{placing ? "Drag the image…" : "Drag to place"}</span>
          </button>
          <span className={styles.readout}>{posStr}</span>
          <button type="button" className={styles.btn} onClick={copy}>
            <span className={styles.btnLabel}>{copied ? "Copied ✓" : "Copy"}</span>
          </button>
          <button type="button" className={styles.btn} onClick={() => setPos({ x: 50, y: 55 })}>
            <span className={styles.btnLabel}>Reset</span>
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
