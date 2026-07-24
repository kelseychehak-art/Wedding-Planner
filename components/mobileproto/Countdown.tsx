"use client";

import { useEffect, useState } from "react";
import styles from "./Countdown.module.css";

/*
 * Live countdown to the wedding. Ticks every second on the client.
 * Target date is a placeholder (June 16, 2027) until the real date is set.
 */

const TARGET = new Date("2027-06-16T16:00:00+02:00").getTime();

function parts(ms: number) {
  const clamp = Math.max(0, ms);
  const d = Math.floor(clamp / 86_400_000);
  const h = Math.floor((clamp % 86_400_000) / 3_600_000);
  const m = Math.floor((clamp % 3_600_000) / 60_000);
  const s = Math.floor((clamp % 60_000) / 1000);
  return [
    { n: d, label: "Days" },
    { n: h, label: "Hrs" },
    { n: m, label: "Min" },
    { n: s, label: "Sec" },
  ];
}

export default function Countdown({
  label = "The celebration begins in",
  tone = "default",
}: {
  label?: string;
  /** "onImage" = ivory numerals + soft shadow, for laying over a photo. */
  tone?: "default" | "onImage";
}) {
  // Start null so server and first client render match (avoids hydration mismatch).
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = now === null ? null : TARGET - now;

  return (
    <div className={`${styles.wrap} ${tone === "onImage" ? styles.onImage : ""}`} aria-label={label}>
      <p className={styles.label}>{label}</p>
      <div className={styles.units}>
        {(remaining === null ? parts(0).map((u) => ({ ...u, n: null as number | null })) : parts(remaining)).map(
          (u, i) => (
            <div key={i} className={styles.unit}>
              <span className={styles.num}>
                {u.n === null ? "—" : String(u.n).padStart(2, "0")}
              </span>
              <span className={styles.unitLabel}>{u.label}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
