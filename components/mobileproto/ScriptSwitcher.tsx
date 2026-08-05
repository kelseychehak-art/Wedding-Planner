"use client";

import { useState } from "react";
import styles from "./ScriptSwitcher.module.css";

/*
 * PREVIEW ONLY — floating control that swaps the hero's script font by setting
 * the `--preview-script` custom property on a wrapper. Each option maps to a
 * CSS var provided by the page (Google-font stand-ins for the paid fonts).
 */
type Option = { key: string; label: string; sub: string; value: string };

export default function ScriptSwitcher({
  options,
  children,
}: {
  options: Option[];
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(options[0]);

  return (
    <div style={{ ["--preview-script" as string]: active.value }}>
      <div className={styles.bar}>
        <span className={styles.title}>Script:</span>
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            className={`${styles.btn} ${o.key === active.key ? styles.active : ""}`}
            onClick={() => setActive(o)}
          >
            <span className={styles.btnLabel}>{o.label}</span>
            <span className={styles.btnSub}>{o.sub}</span>
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
