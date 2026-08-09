import { siteContent } from "@/data/siteContent";
import styles from "./DarkHome.module.css";

/*
 * PREVIEW ONLY (noindex /dark-preview) — first pass at the moody "Italian villa
 * at night" direction: espresso ground, ivory type, wine/olive/mauve accents,
 * the swan crest, a lace divider, a draped feature header, over a moody
 * painting. Self-contained; the real site is untouched.
 */
const HERO_ART = "/assets/art/ai-swan-lake.jpg";
const SWAN = "/assets/art/swan-crest.png";

const NAV = [
  { href: "#", label: "Our Weekend" },
  { href: "#", label: "Travel" },
  { href: "#", label: "Stay" },
  { href: "#", label: "Activities" },
  { href: "#", label: "FAQ" },
];

const SECTIONS = [
  { label: "Our Weekend", note: "Every event, welcome to farewell" },
  { label: "Travel", note: "Flights & getting there" },
  { label: "Where You'll Stay", note: "The villa & your room" },
  { label: "Activities", note: "Optional experiences" },
  { label: "FAQ", note: "Answers to everything" },
];

/* delicate scalloped "lace" rule */
function Lace() {
  return (
    <div className={styles.lace} aria-hidden="true">
      <svg width="240" height="16" viewBox="0 0 240 16" fill="none">
        <path
          d="M2 12 Q 12 2 22 12 T 42 12 T 62 12 T 82 12 T 102 12 T 122 12 T 142 12 T 162 12 T 182 12 T 202 12 T 222 12 T 238 12"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
        <circle cx="120" cy="12" r="2.2" fill="currentColor" />
      </svg>
    </div>
  );
}

export default function DarkHome() {
  const { couple, wedding } = siteContent;

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <span className={styles.brand}>K &amp; A</span>
        <nav className={styles.nav} aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} className={styles.navLink}>
              {n.label}
            </a>
          ))}
          <a href="#" className={styles.navRsvp}>
            RSVP
          </a>
        </nav>
      </header>

      <section className={styles.hero}>
        <div
          className={styles.heroArt}
          style={{ backgroundImage: `url(${HERO_ART})` }}
          aria-hidden="true"
        />
        <div className={styles.heroInner}>
          <img className={styles.swan} src={SWAN} alt="" aria-hidden="true" />
          <p className={styles.eyebrow}>Join us for a week in Italy</p>
          <h1 className={styles.names}>
            {couple.bride} <span className={styles.amp}>&amp;</span> {couple.groom}
          </h1>
          <p className={styles.leadin}>are getting married</p>
          <p className={styles.script}>under the Tuscan sun</p>
          <p className={styles.meta}>
            {wedding.dateLabel} <span className={styles.dot}>·</span> {wedding.locationLabel}
          </p>
          <a href="#" className={styles.cta}>
            RSVP
          </a>
        </div>
      </section>

      <Lace />

      <section className={styles.intro}>
        <p className={styles.kicker}>With love</p>
        <h2 className={styles.introHead}>One unforgettable week</h2>
        <p className={styles.introBody}>
          We&rsquo;re gathering everyone in Tuscany for a week of long dinners, golden afternoons,
          and the two of us saying <em>I do</em>. Consider this your home base for every detail.
        </p>
      </section>

      <section className={styles.explore}>
        <p className={styles.kicker}>Explore</p>
        <ul className={styles.cards}>
          {SECTIONS.map((s) => (
            <li key={s.label} className={styles.card}>
              <span className={styles.cardTitle}>{s.label}</span>
              <span className={styles.cardNote}>{s.note}</span>
              <span className={styles.cardArrow} aria-hidden="true">→</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className={styles.footer}>
        <img className={styles.swanSm} src={SWAN} alt="" aria-hidden="true" />
        <p className={styles.sign}>Ci vediamo in Toscana</p>
        <p className={styles.signSub}>See you in Tuscany</p>
      </footer>
    </div>
  );
}
