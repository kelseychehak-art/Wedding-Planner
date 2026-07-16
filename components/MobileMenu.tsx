"use client";

import styles from "./MobileMenu.module.css";
import { siteContent } from "@/data/siteContent";

export default function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.topRow}>
        <span className={styles.monogram}>{siteContent.couple.monogram}</span>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close menu"
        >
          &times;
        </button>
      </div>
      <ul className={styles.nav}>
        {siteContent.navigation.map((item) => (
          <li key={item.href}>
            <a href={item.href} className={styles.navLink} onClick={onClose}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <a href="/rsvp" className={`btn-primary ${styles.rsvp}`} onClick={onClose}>
        RSVP
      </a>
    </div>
  );
}
