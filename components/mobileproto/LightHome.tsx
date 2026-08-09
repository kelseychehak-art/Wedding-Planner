import { siteContent } from "@/data/siteContent";
import styles from "./LightHome.module.css";

/*
 * PREVIEW ONLY (noindex /light-preview) — the RIGHT read: airy ivory base,
 * warm sunlit painting, with the new palette (wine / olive / mauve / espresso)
 * as ACCENTS — not a dark page. Includes a small "palette in use" sampler.
 */
const HERO_ART = "/assets/art/ai-oak-valley.jpg";
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

export default function LightHome() {
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

      {/* palette-in-use sampler */}
      <section className={styles.sampler}>
        <p className={styles.kicker}>The palette, in use</p>
        <div className={styles.samplerRow}>
          <a href="#" className={styles.btnPrimary}>Wine — primary</a>
          <a href="#" className={styles.btnOutline}>Olive — secondary</a>
          <span className={styles.tag}>Mauve accent</span>
        </div>
        <div className={styles.dots}>
          <span className={styles.dotChip} style={{ background: "#6E2438" }}>Wine</span>
          <span className={styles.dotChip} style={{ background: "#575C36" }}>Olive</span>
          <span className={styles.dotChip} style={{ background: "#BE8E90", color: "#3B2A1E" }}>Mauve</span>
          <span className={styles.dotChip} style={{ background: "#3B2A1E" }}>Espresso</span>
          <span className={styles.dotChip} style={{ background: "#F5EFE3", color: "#3B2A1E", border: "1px solid #d8ccb8" }}>Ivory</span>
        </div>
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
