import { siteContent } from "@/data/siteContent";
import styles from "./Showcase.module.css";

/*
 * PREVIEW ONLY (noindex /showcase) — the new brand direction, all together:
 * airy ivory base, warm sunlit painting, wine/olive/mauve/espresso accents,
 * real swan + lace motifs. The hero is a LOCKED one-screen cover (matches the
 * real homepage); everything below is the content-page treatment library so
 * Kelsey can see the whole system at once. Script font / painting / swan are
 * live-switchable via ShowcaseControls (--sc-* vars).
 */

const NAV = ["Our Weekend", "Travel", "Stay", "Activities", "FAQ"];

const SECTIONS = [
  { label: "Our Weekend", note: "Every event, welcome to farewell" },
  { label: "Travel", note: "Flights & getting there" },
  { label: "Where You'll Stay", note: "The villa & your room" },
  { label: "Activities", note: "Optional experiences" },
  { label: "FAQ", note: "Answers to everything" },
];

export default function Showcase() {
  const { couple, wedding } = siteContent;

  return (
    <div className={styles.page}>
      {/* ============ LOCKED ONE-SCREEN HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroArt} aria-hidden="true" />
        <div className={styles.heroVeil} aria-hidden="true" />
        <div className={styles.heroTestVeil} aria-hidden="true" />

        <header className={styles.topbar}>
          <span className={styles.brand}>K &amp; A</span>
          <nav className={styles.nav} aria-label="Primary">
            {NAV.map((n) => (
              <a key={n} href="#" className={styles.navLink}>
                {n}
              </a>
            ))}
            <a href="#" className={styles.navRsvp}>
              RSVP
            </a>
          </nav>
        </header>

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
          <a href="#" className={styles.cta}>
            RSVP
          </a>
        </div>

        <span className={styles.scrollHint} aria-hidden="true">
          the rest of the system ↓
        </span>
      </section>

      {/* ============ CONTENT-PAGE TREATMENT LIBRARY (scrolls) ============ */}

      {/* Intro with real lace ribbon divider */}
      <section className={styles.intro}>
        <LaceRibbon />
        <p className={styles.kicker}>With love</p>
        <h2 className={styles.introHead}>One unforgettable week</h2>
        <p className={styles.introBody}>
          We&rsquo;re gathering everyone in Tuscany for a week of long dinners, golden afternoons,
          and the two of us saying <em>I do</em>. Consider this your home base for every detail.
        </p>
        <LaceRibbon />
      </section>

      {/* Doily-framed "Details" panel — lace reads on the tinted panel */}
      <section className={styles.detailsWrap}>
        <div className={styles.detailsPanel}>
          <div className={styles.doily} aria-hidden="true" />
          <div className={styles.detailsInner}>
            <p className={styles.kickerLight}>Kindly respond</p>
            <p className={styles.detailsScript}>We can&rsquo;t wait</p>
            <p className={styles.detailsBody}>
              Let us know if you&rsquo;ll be joining us in Tuscany.
            </p>
            <a href="#" className={styles.ctaLight}>
              RSVP
            </a>
          </div>
        </div>
      </section>

      {/* Explore cards with lace-strip top edge */}
      <section className={styles.explore}>
        <p className={styles.kicker}>Explore</p>
        <ul className={styles.cards}>
          {SECTIONS.map((s) => (
            <li key={s.label} className={styles.card}>
              <span className={styles.cardLace} aria-hidden="true" />
              <span className={styles.cardTitle}>{s.label}</span>
              <span className={styles.cardNote}>{s.note}</span>
              <span className={styles.cardArrow} aria-hidden="true">
                →
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Palette in use */}
      <section className={styles.sampler}>
        <p className={styles.kicker}>The palette, in use</p>
        <div className={styles.samplerRow}>
          <a href="#" className={styles.btnPrimary}>
            Wine — primary
          </a>
          <a href="#" className={styles.btnOutline}>
            Olive — secondary
          </a>
          <span className={styles.tag}>Mauve accent</span>
        </div>
        <div className={styles.dots}>
          <span className={styles.chip} style={{ background: "#6E2438" }}>
            Wine
          </span>
          <span className={styles.chip} style={{ background: "#575C36" }}>
            Olive
          </span>
          <span className={styles.chip} style={{ background: "#BE8E90", color: "#3B2A1E" }}>
            Mauve
          </span>
          <span className={styles.chip} style={{ background: "#3B2A1E" }}>
            Espresso
          </span>
          <span
            className={styles.chip}
            style={{ background: "#F5EFE3", color: "#3B2A1E", border: "1px solid #d8ccb8" }}
          >
            Ivory
          </span>
        </div>
      </section>

      {/* Footer with the heart-swans + script sign-off */}
      <footer className={styles.footer}>
        <div className={styles.footerSwan} aria-hidden="true" />
        <p className={styles.sign}>Ci vediamo in Toscana</p>
        <p className={styles.signSub}>See you in Tuscany</p>
      </footer>
    </div>
  );
}

/* A real-lace ribbon: white lace strip on a soft olive band so it reads on ivory. */
function LaceRibbon() {
  return <div className={styles.laceRibbon} aria-hidden="true" />;
}
