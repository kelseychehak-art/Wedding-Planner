import MobileNav from "@/components/mobileproto/MobileNav";
import Countdown from "@/components/mobileproto/Countdown";
import { siteContent } from "@/data/siteContent";
import styles from "./HeroPreviewMobile.module.css";

/*
 * PREVIEW ONLY (noindex /hero-preview) — mobile flipped hero: serif names +
 * script phrase. Copy of HomeMobile with only the hero-text block changed. The
 * script font comes from `--preview-script` (set by the switcher; falls back to
 * Cherolina).
 */
const HERO_IMAGE = "/assets/fluid/federico.jpg";

const SECTIONS = [
  { href: "/our-weekend", label: "Our Weekend", note: "Every event, welcome to farewell" },
  { href: "/travel", label: "Travel", note: "Flights & getting there" },
  { href: "/stay", label: "Where You'll Stay", note: "The villa & rooms" },
  { href: "/activities", label: "Activities", note: "Optional experiences" },
  { href: "/faq", label: "FAQ", note: "Answers to everything" },
];

export default function HeroPreviewMobile() {
  const { couple } = siteContent;

  return (
    <div className={styles.frame}>
      <section className={styles.hero}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>Join us for a week in Italy</p>
          <h1 className={styles.names}>
            {couple.bride} <span className={styles.amp}>&amp;</span> {couple.groom}
          </h1>
          <p className={styles.leadin}>are getting married</p>
          <p className={styles.scriptPhrase}>under the Tuscan sun</p>
          <p className={styles.meta}>
            June 16 – 21, 2027 <span className={styles.dot}>·</span> Tuscany, Italy
          </p>
        </div>

        <div className={styles.fluidImg} style={{ backgroundImage: `url(${HERO_IMAGE})` }} aria-hidden="true" />
        <div className={styles.heroCountdown}>
          <Countdown tone="onImage" />
        </div>
      </section>

      <nav className={styles.explore} aria-label="Site sections">
        <p className={styles.exploreLabel}>Explore</p>
        <ul className={styles.links}>
          {SECTIONS.map((s) => (
            <li key={s.href}>
              <a href={s.href} className={styles.link}>
                <span>
                  <span className={styles.linkLabel}>{s.label}</span>
                  <span className={styles.linkNote}>{s.note}</span>
                </span>
                <span className={styles.linkArrow} aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <MobileNav active="home" variant="vintage" />
    </div>
  );
}
