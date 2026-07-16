import Illustration, { type IllustrationName } from "./Illustration";
import styles from "./PostageStamp.module.css";

/**
 * Postage stamp family — a recurring brand element. Every stamp shares an
 * identical perforated frame, border, and weight; only the center art changes,
 * so the whole collection reads as one set of vintage travel stamps.
 */

const STAMP_ART: Record<string, IllustrationName> = {
  villa: "villa",
  lemon: "lemon",
  cypress: "cypress",
  wine: "wineGlass",
  bicycle: "bicycle",
  olive: "oliveBranch",
  espresso: "espresso",
  music: "music",
  key: "key",
  compass: "compass",
};

export type StampVariant = keyof typeof STAMP_ART;

type PostageStampProps = {
  variant: StampVariant;
  /** px width for standalone use. Omit to let a CSS class control width. */
  size?: number;
  rotate?: number;
  className?: string;
  label?: string;
};

export default function PostageStamp({
  variant,
  size,
  rotate = 0,
  className,
  label,
}: PostageStampProps) {
  return (
    <span
      className={`${styles.stamp} ${className ?? ""}`}
      style={{
        width: size,
        aspectRatio: "100 / 118",
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
      role="presentation"
      aria-hidden="true"
    >
      <svg className={styles.frame} viewBox="0 0 100 118" preserveAspectRatio="none">
        {/* stamp paper */}
        <rect x="4" y="4" width="92" height="110" rx="3" fill="var(--color-paper)" />
        {/* perforated edge (round teeth) */}
        <rect
          x="4"
          y="4"
          width="92"
          height="110"
          rx="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="0.1 4.1"
          strokeLinecap="round"
        />
        {/* inner paper tint + keyline */}
        <rect x="11" y="11" width="78" height="96" rx="2" fill="var(--color-sand)" fillOpacity="0.5" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
      </svg>
      <span className={styles.art}>
        <Illustration name={STAMP_ART[variant]} strokeWidth={4} />
      </span>
      {label ? <span className={styles.label}>{label}</span> : null}
    </span>
  );
}
