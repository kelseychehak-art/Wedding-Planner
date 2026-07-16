import type { CSSProperties } from "react";

/**
 * Illustration library — one commissioned collection.
 *
 * Line language: confident single-weight linework in `currentColor` (olive-dark
 * by default), rounded joins, generous negative space, silhouette-first. Accent
 * fills are used sparingly and always inherit design tokens (never hardcoded).
 *
 * Every illustration is inline SVG so it inherits color from the design system
 * and works on light or dark backgrounds. Add new art to ART below; it will
 * automatically share the same language.
 */

export type IllustrationName =
  // Botanical
  | "lemonBranch"
  | "lemon"
  | "oliveBranch"
  | "cypress"
  // Architecture
  | "villa"
  | "arch"
  // Travel
  | "bicycle"
  | "suitcase"
  | "key"
  | "airplane"
  | "compass"
  // Food & Drink
  | "wineGlass"
  | "wineBottle"
  | "espresso"
  // Celebration / Wedding
  | "music"
  | "candles"
  | "heart"
  | "envelope";

export type IllustrationTone =
  | "olive"
  | "olive-light"
  | "terracotta"
  | "gold"
  | "sage"
  | "ink"
  | "cream";

const TONE_COLOR: Record<IllustrationTone, string> = {
  olive: "var(--color-olive-dark)",
  "olive-light": "var(--color-olive)",
  terracotta: "var(--color-terracotta)",
  gold: "var(--color-citrus-gold)",
  sage: "var(--color-sage)",
  ink: "var(--color-ink)",
  cream: "var(--color-paper)",
};

// Accent fill tokens (used sparingly)
const GOLD = "var(--color-citrus-gold)";
const SAGE = "var(--color-sage)";
const TERRA = "var(--color-terracotta)";

type Art = { viewBox: string; paths: React.ReactNode };

const ART: Record<IllustrationName, Art> = {
  // ---------------- Botanical ----------------
  lemonBranch: {
    viewBox: "0 0 128 96",
    paths: (
      <>
        <path d="M12 84 C 40 76 66 60 94 30" />
        {/* leaves */}
        <path d="M44 66 C 32 64 27 52 33 40 C 45 42 50 54 44 66 Z" fill={SAGE} fillOpacity="0.35" />
        <path d="M70 48 C 60 44 57 32 64 22 C 74 26 76 38 70 48 Z" fill={SAGE} fillOpacity="0.35" />
        <path d="M33 40 L 40 53" />
        <path d="M64 22 L 68 36" />
        {/* lemons */}
        <g transform="rotate(-24 96 34)">
          <ellipse cx="96" cy="34" rx="18" ry="12" fill={GOLD} fillOpacity="0.85" />
        </g>
        <g transform="rotate(-24 78 52)">
          <ellipse cx="78" cy="52" rx="15" ry="10" fill={GOLD} fillOpacity="0.85" />
        </g>
      </>
    ),
  },
  lemon: {
    viewBox: "0 0 100 100",
    paths: (
      <>
        <g transform="rotate(-24 50 54)">
          <ellipse cx="50" cy="54" rx="26" ry="18" fill={GOLD} fillOpacity="0.85" />
          <path d="M76 54 h6 M18 54 h6" />
        </g>
        <path d="M62 32 C 70 22 82 22 88 26 C 84 34 72 36 64 32 Z" fill={SAGE} fillOpacity="0.4" />
      </>
    ),
  },
  oliveBranch: {
    viewBox: "0 0 128 96",
    paths: (
      <>
        <path d="M14 80 C 42 72 68 56 96 28" />
        <path d="M40 66 C 31 65 27 56 31 48 C 40 49 44 58 40 66 Z" fill={SAGE} fillOpacity="0.4" />
        <path d="M58 54 C 49 53 45 44 49 36 C 58 37 62 46 58 54 Z" fill={SAGE} fillOpacity="0.4" />
        <path d="M78 40 C 69 39 65 30 69 22 C 78 23 82 32 78 40 Z" fill={SAGE} fillOpacity="0.4" />
        <circle cx="52" cy="64" r="5" fill="var(--color-olive)" />
        <circle cx="70" cy="50" r="5" fill="var(--color-olive)" />
        <circle cx="88" cy="34" r="5" fill="var(--color-olive)" />
      </>
    ),
  },
  cypress: {
    viewBox: "0 0 100 100",
    paths: (
      <>
        <path d="M50 8 C 41 24 37 44 41 64 C 43 78 47 88 50 88 C 53 88 57 78 59 64 C 63 44 59 24 50 8 Z" fill="var(--color-olive)" fillOpacity="0.12" />
        <path d="M50 20 L 50 84" strokeOpacity="0.5" />
        <path d="M50 88 L 50 96" />
      </>
    ),
  },

  // ---------------- Architecture ----------------
  villa: {
    viewBox: "0 0 120 100",
    paths: (
      <>
        {/* roof + body */}
        <path d="M16 50 L 50 28 L 84 50" />
        <path d="M24 50 L 24 86 L 76 86 L 76 50" />
        {/* tower */}
        <path d="M84 50 L 100 40 L 100 86 L 76 86" />
        <path d="M84 42 L 92 37 L 100 42" />
        {/* door + windows */}
        <path d="M44 86 L 44 68 Q44 64 50 64 Q56 64 56 68 L 56 86" />
        <rect x="30" y="58" width="9" height="9" rx="1" />
        <rect x="61" y="58" width="9" height="9" rx="1" />
        <rect x="85" y="54" width="8" height="9" rx="1" />
      </>
    ),
  },
  arch: {
    viewBox: "0 0 100 100",
    paths: (
      <>
        <path d="M24 88 L 24 44 Q24 20 50 20 Q76 20 76 44 L 76 88" />
        <path d="M34 88 L 34 46 Q34 30 50 30 Q66 30 66 46 L 66 88" />
        <path d="M16 88 L 84 88" />
      </>
    ),
  },

  // ---------------- Travel ----------------
  bicycle: {
    viewBox: "0 0 130 84",
    paths: (
      <>
        <circle cx="28" cy="56" r="18" />
        <circle cx="102" cy="56" r="18" />
        <circle cx="28" cy="56" r="2.5" fill="currentColor" stroke="none" />
        <circle cx="102" cy="56" r="2.5" fill="currentColor" stroke="none" />
        {/* frame */}
        <path d="M28 56 L 58 56 L 46 30 L 78 30 L 102 56 M58 56 L 78 30" />
        <circle cx="58" cy="56" r="3" fill="currentColor" stroke="none" />
        {/* seat + post */}
        <path d="M46 30 L 44 24 M38 24 L 50 24" />
        {/* handlebar */}
        <path d="M78 30 L 86 22 L 92 24" />
        {/* basket */}
        <path d="M84 24 L 98 24 L 95 38 L 87 38 Z" />
      </>
    ),
  },
  suitcase: {
    viewBox: "0 0 100 100",
    paths: (
      <>
        <path d="M24 36 L 76 36 Q80 36 80 40 L 80 80 Q80 84 76 84 L 24 84 Q20 84 20 80 L 20 40 Q20 36 24 36 Z" />
        <path d="M40 36 L 40 28 Q40 24 44 24 L 56 24 Q60 24 60 28 L 60 36" />
        <path d="M37 36 L 37 84 M63 36 L 63 84" />
        <path d="M20 58 L 80 58" strokeOpacity="0.5" />
      </>
    ),
  },
  key: {
    viewBox: "0 0 100 100",
    paths: (
      <>
        <circle cx="50" cy="26" r="15" />
        <circle cx="50" cy="26" r="6" />
        <path d="M50 41 L 50 84" />
        <path d="M50 74 L 60 74 M50 64 L 58 64" />
      </>
    ),
  },
  airplane: {
    viewBox: "0 0 100 100",
    paths: (
      <>
        <path d="M14 46 L 86 22 L 46 80 L 42 54 Z" />
        <path d="M42 54 L 86 22" strokeOpacity="0.6" />
      </>
    ),
  },
  compass: {
    viewBox: "0 0 100 100",
    paths: (
      <>
        <circle cx="50" cy="50" r="34" />
        <path d="M50 34 L 58 50 L 50 66 L 42 50 Z" fill={TERRA} fillOpacity="0.6" />
        <circle cx="50" cy="50" r="2.5" fill="currentColor" stroke="none" />
      </>
    ),
  },

  // ---------------- Food & Drink ----------------
  wineGlass: {
    viewBox: "0 0 100 100",
    paths: (
      <>
        <path d="M34 14 L 66 14 C 66 40 58 54 50 54 C 42 54 34 40 34 14 Z" />
        <path d="M37 22 C 40 34 45 44 50 44 C 55 44 60 34 63 22 Z" fill={TERRA} fillOpacity="0.5" stroke="none" />
        <path d="M50 54 L 50 82" />
        <path d="M38 84 L 62 84" />
      </>
    ),
  },
  wineBottle: {
    viewBox: "0 0 100 100",
    paths: (
      <>
        <path d="M42 12 L 58 12 L 58 30 C 58 34 64 38 64 48 L 64 82 Q64 88 58 88 L 42 88 Q36 88 36 82 L 36 48 C 36 38 42 34 42 30 Z" />
        <path d="M42 24 L 58 24" strokeOpacity="0.5" />
        <rect x="40" y="56" width="24" height="20" rx="1" fill={GOLD} fillOpacity="0.25" />
      </>
    ),
  },
  espresso: {
    viewBox: "0 0 100 100",
    paths: (
      <>
        <path d="M28 46 L 68 46 L 64 74 Q64 78 60 78 L 36 78 Q32 78 32 74 Z" />
        <path d="M68 52 Q82 52 82 62 Q82 72 68 70" />
        <path d="M22 84 L 74 84" />
        <path d="M42 34 Q46 28 42 20 M54 34 Q58 28 54 20" strokeOpacity="0.6" />
      </>
    ),
  },

  // ---------------- Celebration / Wedding ----------------
  music: {
    viewBox: "0 0 100 100",
    paths: (
      <>
        <ellipse cx="36" cy="72" rx="9" ry="7" fill="currentColor" stroke="none" transform="rotate(-18 36 72)" />
        <ellipse cx="74" cy="64" rx="9" ry="7" fill="currentColor" stroke="none" transform="rotate(-18 74 64)" />
        <path d="M44 70 L 44 30 L 82 22 L 82 62" />
        <path d="M44 40 L 82 32" />
      </>
    ),
  },
  candles: {
    viewBox: "0 0 100 100",
    paths: (
      <>
        <path d="M38 44 L 38 84 M62 44 L 62 84" />
        <path d="M30 84 L 70 84" />
        <path d="M38 44 C 33 38 38 30 38 30 C 38 30 43 38 38 44 Z" fill={GOLD} fillOpacity="0.6" />
        <path d="M62 44 C 57 38 62 30 62 30 C 62 30 67 38 62 44 Z" fill={GOLD} fillOpacity="0.6" />
      </>
    ),
  },
  heart: {
    viewBox: "0 0 100 100",
    paths: (
      <path d="M50 82 C 22 60 15 36 33 27 C 43 22 49 30 50 38 C 51 30 57 22 67 27 C 85 36 78 60 50 82 Z" />
    ),
  },
  envelope: {
    viewBox: "0 0 100 100",
    paths: (
      <>
        <rect x="18" y="28" width="64" height="46" rx="2" />
        <path d="M18 32 L 50 54 L 82 32" />
      </>
    ),
  },
};

type IllustrationProps = {
  name: IllustrationName;
  /** px size for standalone use. Omit to let a CSS class control width. */
  size?: number;
  tone?: IllustrationTone;
  className?: string;
  title?: string; // meaningful label; omit for decorative (aria-hidden)
  strokeWidth?: number;
};

export default function Illustration({
  name,
  size,
  tone = "olive",
  className,
  title,
  strokeWidth = 4,
}: IllustrationProps) {
  const art = ART[name];
  const style: CSSProperties = {
    display: "block",
    height: "auto",
    color: TONE_COLOR[tone],
    ...(size ? { width: size } : null),
  };

  return (
    <svg
      viewBox={art.viewBox}
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {art.paths}
    </svg>
  );
}
