import Art from "./Art";
import styles from "./PostageStamp.module.css";

/**
 * Postage stamp — a perforated stamp frame with a Tuscan villa engraving
 * inside, and the round "ITALY" postmark overlapping the corner (deck slide 1).
 */

type PostageStampProps = {
  /** px width for standalone use. Omit to let a CSS class control width. */
  size?: number;
  rotate?: number;
  className?: string;
};

export default function PostageStamp({ size, rotate = 0, className }: PostageStampProps) {
  return (
    <span
      className={`${styles.stamp} ${className ?? ""}`}
      style={{ width: size, transform: rotate ? `rotate(${rotate}deg)` : undefined }}
      role="presentation"
      aria-hidden="true"
    >
      <span className={styles.card}>
        <svg className={styles.frame} viewBox="0 0 100 118" preserveAspectRatio="none">
          <rect x="4" y="4" width="92" height="110" rx="3" fill="var(--color-paper)" />
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
          <rect
            x="10"
            y="10"
            width="80"
            height="98"
            rx="2"
            fill="var(--color-sand)"
            fillOpacity="0.35"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeOpacity="0.45"
          />
        </svg>
        <Art name="villa" className={styles.art} />
      </span>
      <Art name="italy-seal" className={styles.postmark} />
    </span>
  );
}
