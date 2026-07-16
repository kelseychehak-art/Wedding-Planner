"use client";

import { useState } from "react";
import styles from "./SiteHeader.module.css";
import MobileMenu from "./MobileMenu";
import { siteContent } from "@/data/siteContent";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`page-shell ${styles.inner}`}>
        <a href="/" className={styles.monogram}>
          {siteContent.couple.monogram}
        </a>

        <nav className={styles.nav} aria-label="Primary">
          {siteContent.navigation.map((item) => (
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
