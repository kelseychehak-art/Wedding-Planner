"use client";

import styles from "./MobileNav.module.css";

/*
 * MOBILE-NATIVE PROTOTYPE — shared sticky bottom navigation.
 * Thumb-reachable persistent nav (the way a real mobile page/app works),
 * instead of a hamburger buried at the top of an endless scroll.
 */

type Key = "home" | "weekend" | "travel" | "stay" | "rsvp";

const ITEMS: { key: Key; label: string; href: string; icon: React.ReactNode }[] = [
  {
    key: "home",
    label: "Home",
    href: "/home-mobile",
    icon: <path d="M4 11.5 12 5l8 6.5M6 10v9h12v-9" />,
  },
  {
    key: "weekend",
    label: "Weekend",
    href: "/our-weekend-mobile",
    icon: (
      <>
        <rect x="4" y="6" width="16" height="14" rx="2" />
        <path d="M4 10h16M8 4v3M16 4v3" />
      </>
    ),
  },
  {
    key: "travel",
    label: "Travel",
    href: "/travel",
    icon: <path d="M20 5 4 11l6 2.5L13 20l7-15Z" />,
  },
  {
    key: "stay",
    label: "Stay",
    href: "/stay",
    icon: <path d="M3 18v-6a2 2 0 0 1 2-2h9a3 3 0 0 1 3 3v5M3 14h18M21 18v-4" />,
  },
  {
    key: "rsvp",
    label: "RSVP",
    href: "/rsvp",
    icon: <path d="M12 20s-7-4.4-7-9.3A3.7 3.7 0 0 1 12 8a3.7 3.7 0 0 1 7 2.7C19 15.6 12 20 12 20Z" />,
  },
];

export default function MobileNav({ active }: { active: Key }) {
  return (
    <nav className={styles.nav} aria-label="Primary">
      {ITEMS.map((item) => (
        <a
          key={item.key}
          href={item.href}
          aria-current={item.key === active ? "page" : undefined}
          className={`${styles.item} ${item.key === active ? styles.itemActive : ""}`}
        >
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {item.icon}
          </svg>
          <span className={styles.label}>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
