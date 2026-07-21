"use client";

import styles from "./MetricStrip.module.css";

/*
 * Shared summary-metric strip: a connected row of metric cards, each with a
 * thin-line icon, large serif value, uppercase label, and a small sub-line.
 * `tone` colors the value/icon; `onSelect` makes a card clickable (used to
 * apply filters); `active` marks the currently applied metric filter.
 */

export type MetricTone = "default" | "good" | "warn" | "bad" | "info";

export type Metric = {
  key: string;
  icon: React.ReactNode;
  value: string;
  label: string;
  sub?: string;
  tone?: MetricTone;
  disabled?: boolean;
};

const toneClass: Record<MetricTone, string> = {
  default: "",
  good: styles.toneGood,
  warn: styles.toneWarn,
  bad: styles.toneBad,
  info: styles.toneInfo,
};

export default function MetricStrip({
  metrics,
  activeKey,
  onSelect,
}: {
  metrics: Metric[];
  activeKey?: string | null;
  onSelect?: (key: string) => void;
}) {
  return (
    <div className={styles.strip} role={onSelect ? "toolbar" : undefined}>
      {metrics.map((m) => {
        const tone = toneClass[m.tone ?? "default"];
        const inner = (
          <>
            <span className={`${styles.icon} ${tone}`}>{m.icon}</span>
            <span className={styles.body}>
              <span className={`${styles.value} ${tone}`}>{m.value}</span>
              <span className={styles.label}>{m.label}</span>
              {m.sub ? <span className={styles.sub}>{m.sub}</span> : null}
            </span>
          </>
        );

        if (onSelect && !m.disabled) {
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => onSelect(m.key)}
              className={`${styles.card} ${styles.cardClickable} ${
                activeKey === m.key ? styles.cardActive : ""
              }`}
            >
              {inner}
            </button>
          );
        }

        return (
          <div
            key={m.key}
            className={`${styles.card} ${m.disabled ? styles.cardDisabled : ""}`}
          >
            {inner}
          </div>
        );
      })}
    </div>
  );
}
