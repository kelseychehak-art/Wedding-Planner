"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./SiteHeader.module.css";
import MobileMenu from "./MobileMenu";
import Illustration from "./Illustration";
import { siteContent } from "@/data/siteContent";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className={styles.header}>
      <div className={`page-shell ${styles.inner}`}>
        <a href="/" className={styles.monogram}>
          <span>{siteContent.couple.monogram}</span>
          <Illustration name="oliveBranch" size={30} className={styles.monogramSprig} />
        </a>

        <div className={styles.navGroup}>
          <nav className={styles.nav} aria-label="Primary">
            {siteContent.navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <a href="/rsvp" className={`btn-primary ${styles.rsvp}`}>
            {isHome ? "RSVP / Login" : "RSVP"}
          </a>
        </div>

        <span className={styles.spacer} aria-hidden="true" />

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
