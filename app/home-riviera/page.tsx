import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import MobileNav from "@/components/mobileproto/MobileNav";
import { siteContent } from "@/data/siteContent";
import styles from "./home-riviera.module.css";

/*
 * MOBILE-NATIVE PROTOTYPE — Homepage, "Riviera" art direction.
 * The bright, VIBRANT-SUMMER read of Amalfi / La Dolce Vita: sunny cream,
 * azure sea-blue, lemon yellow, a coral pop, full-colour Tuscan photography,
 * warm playful display type. Keeps the mobile IA (hero → section launcher →
 * sticky bottom nav). Noindex, standalone route.
 */

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "900"],
  style: ["normal", "italic"],
  variable: "--font-riviera",
});

export const metadata: Metadata = {
  title: "Home (Riviera) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  { href: "/our-weekend-mobile", num: "01", label: "Our Weekend", note: "Every event, welcome to farewell", tone: "sea" },
  { href: "/travel", num: "02", label: "Travel", note: "Flights & getting there", tone: "coral" },
  { href: "/stay", num: "03", label: "Where You'll Stay", note: "The villa & rooms", tone: "lemon" },
  { href: "/activities", num: "04", label: "Activities", note: "Optional experiences", tone: "olive" },
  { href: "/faq", num: "05", label: "FAQ", note: "Answers to everything", tone: "sea" },
];

const TICKER = ["Sole", "Mare", "Amore", "June 2027", "Tuscany"];

export default function HomeRivieraPage() {
  const { couple, wedding } = siteContent;

  return (
    <div className={`${styles.frame} ${display.variable}`}>
      <main className={styles.main}>
        {/* ---- Hero ---- */}
        <section className={styles.hero}>
          <p className={styles.kicker}>Tuscany, Italy · June 2027</p>

          <div className={styles.photoWrap}>
            <span className={styles.sun} aria-hidden="true" />
            <span className={styles.dots} aria-hidden="true" />
            <figure className={styles.photo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/hero/valdorcia.jpg" alt="Sunlit hills and cypress trees in Tuscany" className={styles.photoImg} />
            </figure>
            <span className={styles.badge}>
              <span className={styles.badgeTop}>Save</span>
              <span className={styles.badgeBig}>the</span>
              <span className={styles.badgeTop}>Date</span>
            </span>
          </div>

          <h1 className={styles.title}>
            <span className={styles.titleName}>{couple.bride}</span>
            <span className={styles.amp}>&amp;</span>
            <span className={styles.titleName}>{couple.groom}</span>
          </h1>

          <p className={styles.tagline}>
            are getting married in the <em>Tuscan sun</em>
          </p>

          <div className={styles.meta}>
            <span className={styles.metaPill}>{wedding.dateLabel}</span>
          </div>

          <a href="/rsvp" className={styles.cta}>
            RSVP &amp; Details
          </a>
        </section>
      </main>

      {/* ---- Sunny ticker ---- */}
      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerTrack}>
          {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
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
                <a href={s.href} className={`${styles.link} ${styles[s.tone]}`}>
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
