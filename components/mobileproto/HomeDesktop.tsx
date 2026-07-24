import Countdown from "@/components/mobileproto/Countdown";
import { siteContent } from "@/data/siteContent";
import styles from "./HomeDesktop.module.css";

/*
 * Desktop "fluid" homepage: a photograph bleeds up from the bottom and feathers
 * into the cream, type layered above, cream top nav. One locked screen (no
 * scroll). The wide counterpart to HomeMobile.
 */
const HERO_IMAGE = "/assets/fluid/federico.jpg";

const NAV = [
  { href: "/our-weekend", label: "Our Weekend" },
  { href: "/travel", label: "Travel" },
  { href: "/stay", label: "Stay" },
  { href: "/activities", label: "Activities" },
  { href: "/faq", label: "FAQ" },
];

export default function HomeDesktop() {
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
          <a href="/rsvp" className={styles.navRsvp}>
            RSVP
          </a>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Join us for a week in Italy</p>
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
        </div>
        <div className={styles.fluidImg} style={{ backgroundImage: `url(${HERO_IMAGE})` }} aria-hidden="true" />
        <div className={styles.heroCountdown}>
          <Countdown tone="onImage" />
        </div>
      </section>
    </div>
  );
}
