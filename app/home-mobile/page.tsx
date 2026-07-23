import type { Metadata } from "next";
import ScallopFrame from "@/components/ScallopFrame";
import MobileNav from "@/components/mobileproto/MobileNav";
import { siteContent } from "@/data/siteContent";
import styles from "./home-mobile.module.css";

/*
 * MOBILE-NATIVE PROTOTYPE — Homepage.
 * The point: a phone homepage is a *launchpad*, not the whole site linearized.
 * Compact invitation hero (fits ~one screen) → a tappable section grid you
 * drill into → a persistent bottom nav. Progressive disclosure, short scroll.
 * Noindex, standalone route; keeps the home-preview-2 visual language.
 */

export const metadata: Metadata = {
  title: "Home (Mobile) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    href: "/our-weekend-mobile",
    label: "Our Weekend",
    note: "6 days, every event",
    icon: (
      <>
        <rect x="4" y="6" width="16" height="14" rx="2" />
        <path d="M4 10h16M8 4v3M16 4v3" />
      </>
    ),
  },
  {
    href: "/travel",
    label: "Travel",
    note: "Flights & getting there",
    icon: <path d="M20 5 4 11l6 2.5L13 20l7-15Z" />,
  },
  {
    href: "/stay",
    label: "Where You'll Stay",
    note: "The villa & rooms",
    icon: <path d="M3 18v-6a2 2 0 0 1 2-2h9a3 3 0 0 1 3 3v5M3 14h18M21 18v-4" />,
  },
  {
    href: "/activities",
    label: "Activities",
    note: "Optional experiences",
    icon: <path d="M8 4h8l-1 6a3 3 0 0 1-6 0L8 4ZM12 13v5M9 21h6" />,
  },
  {
    href: "/faq",
    label: "FAQ",
    note: "Answers to everything",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M9.5 9.5a2.5 2.5 0 0 1 4 2c0 1.6-2 1.9-2 3.2M12 17.4h.01" />
      </>
    ),
  },
];

export default function HomeMobilePage() {
  const { couple, wedding } = siteContent;

  return (
    <div className={styles.frame}>
      <main className={styles.main}>
        {/* ---- Compact invitation hero ---- */}
        <section className={styles.hero}>
          <figure className={styles.polaroid}>
            <span className={styles.tape} aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/hero/split-rafael-peier.jpg"
              alt="A Tuscan farmhouse above olive groves and vineyard rows"
              className={styles.polaroidImg}
            />
            <figcaption className={styles.polaroidCap}>our home for the week</figcaption>
          </figure>

          <p className={styles.pre}>Together with their families</p>
          <h1 className={styles.names}>
            {couple.bride} <span className={styles.amp}>&amp;</span> {couple.groom}
          </h1>
          <p className={styles.invite}>invite you to celebrate their wedding</p>
          <p className={styles.date}>{wedding.dateLabel}</p>
          <p className={styles.loc}>{wedding.locationLabel}</p>

          <a href="/rsvp" className={styles.cta}>
            RSVP &amp; Details
          </a>
        </section>

        {/* ---- Short welcome (progressive disclosure, one line) ---- */}
        <section className={styles.postcard}>
          <ScallopFrame color="var(--blue)" target={26} inset={6} />
          <p className={styles.dolce}>la dolce vita</p>
          <p className={styles.postcardBody}>
            Everything you need for the week is here — tap a section to dive in.
          </p>
        </section>

        {/* ---- Section launcher (the homepage IS a menu, not a document) ---- */}
        <nav className={styles.grid} aria-label="Explore">
          {SECTIONS.map((s) => (
            <a key={s.href} href={s.href} className={styles.card}>
              <svg
                className={styles.cardIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {s.icon}
              </svg>
              <span className={styles.cardLabel}>{s.label}</span>
              <span className={styles.cardNote}>{s.note}</span>
              <span className={styles.cardArrow} aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </nav>

        <p className={styles.footNote}>We can&rsquo;t wait to celebrate with you.</p>
      </main>

      <MobileNav active="home" />
    </div>
  );
}
