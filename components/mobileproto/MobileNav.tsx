"use client";

import styles from "./MobileNav.module.css";

/*
 * MOBILE-NATIVE PROTOTYPE — shared sticky bottom navigation.
 * Thumb-reachable persistent nav (the way a real mobile page/app works),
 * instead of a hamburger buried at the top of an endless scroll.
 */

type Key = "home" | "weekend" | "travel" | "stay" | "rsvp";
type Variant = "cream" | "vintage";

const ICONS: Record<Key, React.ReactNode> = {
  home: <path d="M4 11.5 12 5l8 6.5M6 10v9h12v-9" />,
  weekend: (
    <>
      <rect x="4" y="6" width="16" height="14" rx="2" />
      <path d="M4 10h16M8 4v3M16 4v3" />
    </>
  ),
  travel: <path d="M20 5 4 11l6 2.5L13 20l7-15Z" />,
  stay: <path d="M3 18v-6a2 2 0 0 1 2-2h9a3 3 0 0 1 3 3v5M3 14h18M21 18v-4" />,
  rsvp: <path d="M12 20s-7-4.4-7-9.3A3.7 3.7 0 0 1 12 8a3.7 3.7 0 0 1 7 2.7C19 15.6 12 20 12 20Z" />,
};

const LABELS: Record<Key, string> = {
  home: "Home",
  weekend: "Weekend",
  travel: "Travel",
  stay: "Stay",
  rsvp: "RSVP",
};

// Per-variant hrefs so each version's bottom nav stays within its own set.
const HREFS: Record<Variant, Record<Key, string>> = {
  cream: {
    home: "/home-dolce",
    weekend: "/our-weekend-mobile",
    travel: "/travel-mobile",
    stay: "/stay-mobile",
    rsvp: "/rsvp-mobile",
  },
  vintage: {
    home: "/",
    weekend: "/our-weekend",
    travel: "/travel",
    stay: "/stay",
    rsvp: "/rsvp",
  },
};

const ORDER: Key[] = ["home", "weekend", "travel", "stay", "rsvp"];

export default function MobileNav({
  active,
  variant = "cream",
}: {
  active: Key | "";
  variant?: Variant;
}) {
  const hrefs = HREFS[variant];
  return (
    <nav className={styles.nav} aria-label="Primary">
      {ORDER.map((key) => {
        const item = { key, label: LABELS[key], href: hrefs[key], icon: ICONS[key] };
        return (
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
        );
      })}
    </nav>
  );
}
