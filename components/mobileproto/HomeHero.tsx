import { siteContent } from "@/data/siteContent";
import ShowcaseBottomNav from "./ShowcaseBottomNav";
import ShowcaseMenu from "./ShowcaseMenu";
import styles from "./Showcase.module.css";

/*
 * Homepage — locked one-screen hero (100vh, no scroll). The new brand direction:
 * warm oak-valley painting at a 52% veil, heart-swans, Playfair names with a
 * large italic ampersand, Gwendolyn "under the Tuscan sun", the date, and RSVP.
 * Desktop shows the top nav; mobile gets the ☰ menu + sticky bottom bar.
 * Reuses the hero styles from Showcase.module.css.
 */

const NAV = [
  { label: "Our Weekend", href: "/our-weekend" },
  { label: "Travel", href: "/travel" },
  { label: "Stay", href: "/stay" },
  { label: "Activities", href: "/activities" },
  { label: "FAQ", href: "/faq" },
];

export default function HomeHero() {
  const { couple, wedding } = siteContent;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroArt} aria-hidden="true" />
        <div className={styles.heroVeil} aria-hidden="true" />
        <div className={styles.heroTestVeil} aria-hidden="true" />

        <header className={styles.topbar}>
          <span className={styles.brand}>K &amp; A</span>
          <nav className={styles.nav} aria-label="Primary">
            {NAV.map((n) => (
              <a key={n.label} href={n.href} className={styles.navLink}>
                {n.label}
              </a>
            ))}
            <a href="/rsvp" className={styles.navRsvp}>
              RSVP
            </a>
          </nav>
        </header>
        <ShowcaseMenu />

        <div className={styles.heroInner}>
          <div className={styles.heroSwan} aria-hidden="true" />
          <p className={styles.eyebrow}>
            {wedding.eyebrow} {wedding.destination}
          </p>
          <h1 className={styles.names}>
            {couple.bride} <span className={styles.amp}>&amp;</span> {couple.groom}
          </h1>
          <p className={styles.leadin}>are getting married</p>
          <p className={styles.script}>under the Umbrian sun</p>
          <p className={styles.meta}>
            {wedding.dateLabel} <span className={styles.dot}>·</span> {wedding.locationLabel}
          </p>
          <a href="/rsvp" className={styles.cta}>
            RSVP
          </a>
        </div>
      </section>

      <ShowcaseBottomNav active="home" />
    </div>
  );
}
