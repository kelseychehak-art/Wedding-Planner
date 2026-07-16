"use client";

import { useState } from "react";
import styles from "./SiteHeader.module.css";
import MobileMenu from "./MobileMenu";

const NAV_ITEMS = [
  { label: "Our Weekend", href: "/our-weekend" },
  { label: "Travel", href: "/travel" },
  { label: "Stay", href: "/stay" },
  { label: "Things to Do", href: "/things-to-do" },
  { label: "FAQ", href: "/faq" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`page-shell ${styles.inner}`}>
        <a href="/" className={styles.monogram}>
          K &amp; A
        </a>

        <nav className={styles.nav} aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </a>
          ))}
        </nav>

        <a href="/rsvp" className={`btn-primary ${styles.rsvp}`}>
          RSVP
        </a>

        <button
          type="button"
          className={styles.menuButton}
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
    </header>
  );
}
