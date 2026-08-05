import Countdown from "@/components/mobileproto/Countdown";
import { siteContent } from "@/data/siteContent";
import styles from "./HeroPreviewDesktop.module.css";

/*
 * PREVIEW ONLY (noindex /hero-preview) — the "flipped" hero: names in an
 * elegant SERIF, and "under the Tuscan sun" carried by the SCRIPT. A copy of
 * HomeDesktop with only the hero-text block changed, so the live homepage is
 * untouched. The script font is `--preview-script` (Cherolina stand-in today);
 * swap that one line to Franchesca once the webfont is licensed.
 * The background image + framed treatment come from PreviewControls via
 * `--preview-bg` and the [data-framed] ancestor attribute.
 */
const NAV = [
  { href: "/our-weekend", label: "Our Weekend" },
  { href: "/travel", label: "Travel" },
  { href: "/stay", label: "Stay" },
  { href: "/activities", label: "Activities" },
  { href: "/faq", label: "FAQ" },
];

export default function HeroPreviewDesktop() {
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
            {couple.bride} <span className={styles.amp}>&amp;</span> {couple.groom}
          </h1>
          <p className={styles.leadin}>are getting married</p>
          <p className={styles.scriptPhrase}>under the Tuscan sun</p>
          <p className={styles.meta}>
            {wedding.dateLabel} <span className={styles.dot}>·</span> {wedding.locationLabel}
          </p>
        </div>
        <div className={styles.fluidImg} aria-hidden="true" />
        <div className={styles.heroCountdown}>
          <Countdown tone="onImage" />
        </div>
      </section>
    </div>
  );
}
