import type { CSSProperties } from "react";

/**
 * Functional line glyphs (calendar, car, chevron, check…) — the small UI icons
 * that pair with the decorative `Illustration` set. Single-weight strokes in
 * `currentColor` so they inherit color from context. Decorative by default
 * (aria-hidden); pass `title` for a meaningful label.
 */

export type UiIconName =
  | "calendar"
  | "calendarCheck"
  | "car"
  | "train"
  | "bulb"
  | "shield"
  | "bed"
  | "clock"
  | "pin"
  | "chevron"
  | "check"
  | "bookmark"
  | "info"
  | "camera"
  | "passport"
  | "clipboard"
  | "sparkle";

const PATHS: Record<UiIconName, React.ReactNode> = {
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
    </>
  ),
  calendarCheck: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4M9 15l2 2 4-4" />
    </>
  ),
  car: (
    <>
      <path d="M5 16v2M19 16v2" />
      <path d="M3 16v-3l2-5a2 2 0 0 1 1.9-1.3h10.2A2 2 0 0 1 19 8l2 5v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
      <path d="M3 13h18" />
      <circle cx="7.5" cy="16" r="1.2" />
      <circle cx="16.5" cy="16" r="1.2" />
    </>
  ),
  train: (
    <>
      <rect x="6" y="4" width="12" height="13" rx="3" />
      <path d="M6 11h12M9 21l-2 2M15 21l2 2M8.5 17h7" />
      <circle cx="9" cy="14" r="0.6" />
      <circle cx="15" cy="14" r="0.6" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.2 1 2V16h6v-.5c0-.8.3-1.3 1-2A6 6 0 0 0 12 3Z" />
    </>
  ),
  shield: <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />,
  bed: (
    <>
      <path d="M3 8v10M3 18h18M21 18v-6a3 3 0 0 0-3-3H8v4M3 13h18" />
      <path d="M6.5 11.5A1.5 1.5 0 0 1 8 10h.5a1.5 1.5 0 0 1 0 3H6.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21c4.5-4.2 7-7.4 7-11a7 7 0 1 0-14 0c0 3.6 2.5 6.8 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  chevron: <path d="M9 6l6 6-6 6" />,
  check: <path d="M5 12l4 4 10-10" />,
  bookmark: <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.2" />
    </>
  ),
  passport: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M9.5 16h5" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="5" width="14" height="16" rx="2" />
      <path d="M9 5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M9 11h6M9 15h4" />
    </>
  ),
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />,
};

const VIEWBOX: Partial<Record<UiIconName, string>> = {};

type UiIconProps = {
  name: UiIconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  title?: string;
  style?: CSSProperties;
};

export default function UiIcon({
  name,
  size = 22,
  strokeWidth = 1.6,
  className,
  title,
  style,
}: UiIconProps) {
  return (
    <svg
      viewBox={VIEWBOX[name] ?? "0 0 24 24"}
      width={size}
      height={size}
      className={className}
      style={{ display: "block", flexShrink: 0, ...style }}
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
      {PATHS[name]}
    </svg>
  );
}
