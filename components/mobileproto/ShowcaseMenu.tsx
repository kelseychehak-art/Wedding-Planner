"use client";

import { useState } from "react";
import styles from "./ShowcaseMenu.module.css";

/*
 * Mobile menu (☰) — reachable on phones where the desktop top nav is hidden.
 * A corner button opens a full-screen menu listing every page (incl. Activities
 * & FAQ, which the 5-slot bottom bar omits). Visible only ≤680px.
 */
const LINKS = [
  { label: "Home", href: "/" },
  { label: "Our Weekend", href: "/our-weekend" },
  { label: "Travel", href: "/travel" },
  { label: "Stay", href: "/stay" },
  { label: "Activities", href: "/activities" },
  { label: "FAQ", href: "/faq" },
  { label: "RSVP", href: "/rsvp" },
];

export default function ShowcaseMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            className={styles.close}
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            &times;
          </button>
          <nav className={styles.list}>
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className={styles.link} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
