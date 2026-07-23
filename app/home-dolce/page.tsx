import type { Metadata } from "next";
import MobileNav from "@/components/mobileproto/MobileNav";
import { siteContent } from "@/data/siteContent";
import { schedule } from "@/data/schedule";
import styles from "./home-dolce.module.css";

/*
 * MOBILE-NATIVE PROTOTYPE — Homepage, "Dolce" art direction.
 * The merge Kelsey asked for: the editorial elegance of the cream/script
 * prototype (Allura signature script, warm cream, Cormorant serif, airy
 * whitespace, small-caps labels) + the joy of "Riviera" brought in as tasteful
 * accents (full-colour photography, a sun-faded summer palette — sea, coral,
 * lemon, olive — as colour accents, not loud blocks). Keeps the mobile IA.
 * Noindex, standalone route.
 */

export const metadata: Metadata = {
  title: "Home (Dolce) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  { href: "/our-weekend-mobile", num: "01", label: "Our Weekend", note: "Every event, welcome to farewell" },
  { href: "/travel", num: "02", label: "Travel", note: "Flights & getting there" },
  { href: "/stay", num: "03", label: "Where You'll Stay", note: "The villa & rooms" },
  { href: "/activities", num: "04", label: "Activities", note: "Optional experiences" },
  { href: "/faq", num: "05", label: "FAQ", note: "Answers to everything" },
];

// Ticker = the real week, pulled from the schedule so it stays in sync.
const TICKER = schedule.map((d) => d.events[0].title);

export default function HomeDolcePage() {
  const { couple, wedding } = siteContent;

  return (
    <div className={styles.frame}>
      <main className={styles.main}>
        {/* ---- Hero ---- */}
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Join us for a week in</p>

          <h1 className={styles.names}>
            <span className={styles.nameLine}>{couple.bride}</span>
            <span className={styles.amp}>&amp;</span>
            <span className={styles.nameLine}>{couple.groom}</span>
          </h1>

          <p className={styles.tagline}>
            are getting married in the <em>Tuscan sun</em>
          </p>

          <div className={styles.photoWrap}>
            <span className={styles.sun} aria-hidden="true" />
            <figure className={styles.photo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/hero/valdorcia.jpg" alt="Sunlit hills and cypress trees in Tuscany" className={styles.photoImg} />
            </figure>
          </div>

          <p className={styles.meta}>
            <span>{wedding.dateLabel}</span>
            <span className={styles.dot} aria-hidden="true">·</span>
            <span>{wedding.locationLabel}</span>
          </p>

          <a href="/rsvp" className={styles.cta}>
            RSVP &amp; Details
          </a>
        </section>
      </main>

      {/* ---- Understated ticker ---- */}
      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerTrack}>
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span className={styles.tickerItem} key={i}>
              {t}
              <span className={styles.tickerStar}>❋</span>
            </span>
          ))}
        </div>
      </div>

      <div className={styles.main}>
        {/* ---- Intro band ---- */}
        <section className={styles.intro}>
          <p className={styles.introLabel}>Benvenuti</p>
          <h2 className={styles.introHead}>
            One golden week <span className={styles.introHi}>in Italy</span>
          </h2>
          <p className={styles.introBody}>
            Sun-warmed hills, long lunches, and the two of us saying <em>I do</em>. Here&rsquo;s
            everything you&rsquo;ll need to come celebrate with us.
          </p>
        </section>

        {/* ---- Section launcher ---- */}
        <nav className={styles.explore} aria-label="Site sections">
          <p className={styles.exploreLabel}>Explore</p>
          <ul className={styles.links}>
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <a href={s.href} className={styles.link}>
                  <span className={styles.linkNum}>{s.num}</span>
                  <span className={styles.linkText}>
                    <span className={styles.linkLabel}>{s.label}</span>
                    <span className={styles.linkNote}>{s.note}</span>
                  </span>
                  <span className={styles.linkArrow} aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className={styles.sign}>Ci vediamo in Toscana</p>
        <p className={styles.signSub}>See you in Tuscany</p>
      </div>

      <MobileNav active="home" />
    </div>
  );
}
