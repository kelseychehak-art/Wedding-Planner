import type { Metadata } from "next";
import Countdown from "@/components/mobileproto/Countdown";
import { siteContent } from "@/data/siteContent";
import styles from "./home-dolce-desktop.module.css";

/*
 * PROTOTYPE — Desktop view of the "Framed / scrapbook" homepage (cream,
 * editorial, a taped photo frame). Top nav bar; content tabs are the shared
 * cream desktop set. Noindex.
 */

export const metadata: Metadata = {
  title: "Home · Desktop (Framed) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/our-weekend-mobile", label: "Our Weekend" },
  { href: "/travel-desktop", label: "Travel" },
  { href: "/stay-desktop", label: "Stay" },
  { href: "/activities-desktop", label: "Activities" },
  { href: "/faq-desktop", label: "FAQ" },
];

const SECTIONS = [
  { href: "/our-weekend-mobile", label: "Our Weekend", note: "Every event, welcome to farewell" },
  { href: "/travel-desktop", label: "Travel", note: "Flights & getting there" },
  { href: "/stay-desktop", label: "Where You'll Stay", note: "The villa & rooms" },
  { href: "/activities-desktop", label: "Activities", note: "Optional experiences" },
  { href: "/faq-desktop", label: "FAQ", note: "Answers to everything" },
];

export default function HomeDolceDesktopPage() {
  const { couple, wedding } = siteContent;
  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <span className={styles.brand}>K &amp; A</span>
        <nav className={styles.nav} aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={styles.navLink}>
              {n.label}
            </a>
          ))}
          <a href="/rsvp-desktop" className={styles.navRsvp}>
            RSVP
          </a>
        </nav>
      </header>

      <main className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Join us for a week in</p>
          <h1 className={styles.names}>
            <span className={styles.nameLine}>{couple.bride}</span>
            <span className={styles.amp}>&amp;</span>
            <span className={styles.nameLine}>{couple.groom}</span>
          </h1>
          <p className={styles.tagline}>
            are getting married under the <em>Tuscan sun</em>
          </p>
          <p className={styles.meta}>
            {wedding.dateLabel} <span className={styles.dot}>·</span> {wedding.locationLabel}
          </p>
          <a href="/rsvp-desktop" className={styles.cta}>
            RSVP &amp; Details
          </a>
          <div className={styles.countdown}>
            <Countdown />
          </div>
        </div>

        <div className={styles.heroPhotoWrap}>
          <figure className={styles.photoFrame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/hero/valdorcia.jpg" alt="Sunlit hills and cypress trees in Tuscany" className={styles.photo} />
            <figcaption className={styles.caption}>Val d&rsquo;Orcia, Tuscany</figcaption>
          </figure>
        </div>
      </main>

      <section className={styles.explore}>
        <p className={styles.exploreLabel}>Explore</p>
        <div className={styles.exploreGrid}>
          {SECTIONS.map((s) => (
            <a key={s.href} href={s.href} className={styles.exploreCard}>
              <span className={styles.exploreCardLabel}>{s.label}</span>
              <span className={styles.exploreCardNote}>{s.note}</span>
              <span className={styles.exploreArrow} aria-hidden="true">→</span>
            </a>
          ))}
        </div>
        <p className={styles.sign}>Ci vediamo in Toscana</p>
        <p className={styles.signSub}>See you in Tuscany</p>
      </section>
    </div>
  );
}
