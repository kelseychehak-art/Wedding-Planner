"use client";

import styles from "./MobileMenu.module.css";

const NAV_ITEMS = [
  { label: "Our Weekend", href: "/our-weekend" },
  { label: "Travel", href: "/travel" },
  { label: "Stay", href: "/stay" },
  { label: "Things to Do", href: "/things-to-do" },
  { label: "FAQ", href: "/faq" },
];

export default function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.topRow}>
        <span className={styles.monogram}>K &amp; A</span>
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
        {NAV_ITEMS.map((item) => (
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
