import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import MobileNav from "@/components/mobileproto/MobileNav";
import { siteContent } from "@/data/siteContent";
import styles from "./home-cinema.module.css";

/*
 * MOBILE-NATIVE PROTOTYPE — Homepage, "Cinema" art direction.
 * A blend of three directions Kelsey was torn between: La Dolce Vita
 * (grayscale film, single pop of Campari red, grain), Amalfi Poster (bold
 * condensed marquee type + a scrolling cinema ticker), and the interactive
 * idea (concept hook: the week as "A Wedding in Six Acts"). Keeps the mobile
 * IA — compact hero → section launcher → sticky bottom nav. Noindex.
 */

const marquee = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-marquee" });

export const metadata: Metadata = {
  title: "Home (Cinema) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  { href: "/our-weekend-mobile", num: "I", label: "Our Weekend", note: "The week in six acts" },
  { href: "/travel", num: "II", label: "Travel", note: "Flights & getting there" },
  { href: "/stay", num: "III", label: "Where You'll Stay", note: "The villa & rooms" },
  { href: "/activities", num: "IV", label: "Activities", note: "Optional experiences" },
  { href: "/faq", num: "V", label: "FAQ", note: "Answers to everything" },
];

const TICKER = ["June 16–21 2027", "Tuscany, Italy", "La Dolce Vita", "Kelsey & Andrew"];

export default function HomeCinemaPage() {
  const { couple, wedding } = siteContent;

  return (
    <div className={`${styles.frame} ${marquee.variable}`}>
      <div className={styles.grain} aria-hidden="true" />

      {/* ---- Full-bleed cinematic hero ---- */}
      <header className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/hero/valdorcia.jpg" alt="Rolling hills and cypress trees in Tuscany" className={styles.heroImg} />
        <div className={styles.heroShade} aria-hidden="true" />

        <div className={styles.heroInner}>
          <p className={styles.kicker}>Tuscany · Italy</p>
          <p className={styles.presents}>The families of Kelsey &amp; Andrew present</p>

          <h1 className={styles.title}>
            <span className={styles.titleLine}>{couple.bride}</span>
            <span className={styles.amp}>&amp;</span>
            <span className={styles.titleLine}>{couple.groom}</span>
          </h1>

          <p className={styles.tagline}>are getting married</p>

          <div className={styles.credits}>
            <span>{wedding.dateLabel}</span>
            <span className={styles.dot} aria-hidden="true">•</span>
            <span>{wedding.locationLabel}</span>
          </div>

          <a href="/rsvp" className={styles.cta}>
            RSVP
          </a>
        </div>
      </header>

      {/* ---- Marquee ticker ---- */}
      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerTrack}>
          {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span className={styles.tickerItem} key={i}>
              {t}
              <span className={styles.tickerStar}>★</span>
            </span>
          ))}
        </div>
      </div>

      <main className={styles.main}>
        {/* ---- Concept band ---- */}
        <section className={styles.actsIntro}>
          <p className={styles.actsLabel}>Feature Presentation</p>
          <p className={styles.actsHead}>A wedding in six acts</p>
          <p className={styles.actsBody}>
            One week on a Tuscan hillside — welcome to farewell. Here&rsquo;s everything you&rsquo;ll need
            to join us for it.
          </p>
        </section>

        {/* ---- Section launcher, styled as a film programme ---- */}
        <nav className={styles.programme} aria-label="Site sections">
          <p className={styles.programmeLabel}>The Programme</p>
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
      </main>

      <MobileNav active="home" />
    </div>
  );
}
