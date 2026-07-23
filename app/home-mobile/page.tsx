import type { Metadata } from "next";
import MobileNav from "@/components/mobileproto/MobileNav";
import { siteContent } from "@/data/siteContent";
import styles from "./home-mobile.module.css";

/*
 * MOBILE-NATIVE PROTOTYPE — Homepage, in the "scrapbook" style (home-preview-3).
 * Keeps the mobile IA (compact hero → tappable section launcher → sticky bottom
 * nav) but wears Kelsey's chosen look: warm paper, charcoal type, Allura
 * signature script, taped polaroids, small-caps labels — monochrome by design.
 * Noindex, standalone route.
 */

export const metadata: Metadata = {
  title: "Home (Mobile) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  { href: "/our-weekend-mobile", num: "01", label: "Our Weekend", note: "Every event, welcome to farewell" },
  { href: "/travel", num: "02", label: "Travel", note: "Flights & getting there" },
  { href: "/stay", num: "03", label: "Where You'll Stay", note: "The villa & rooms" },
  { href: "/activities", num: "04", label: "Activities", note: "Optional experiences" },
  { href: "/faq", num: "05", label: "FAQ", note: "Answers to everything" },
];

export default function HomeMobilePage() {
  const { couple, wedding } = siteContent;

  return (
    <div className={styles.frame}>
      <div className={styles.grain} aria-hidden="true" />

      <main className={styles.main}>
        {/* ---- Hero: taped photo cluster + signature-script invitation ---- */}
        <section className={styles.hero}>
          <div className={styles.photos}>
            <figure className={`${styles.snap} ${styles.snapBack}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/hero/split-nick-george.jpg" alt="A stone villa among cypresses" className={styles.snapImg} />
            </figure>
            <figure className={`${styles.snap} ${styles.snapFront}`}>
              <span className={styles.tape} aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/hero/split-rafael-peier.jpg" alt="A Tuscan farmhouse above olive groves" className={styles.snapImg} />
              <figcaption className={styles.snapCap}>la dolce vita</figcaption>
            </figure>
          </div>

          <p className={styles.pre}>Together with their families</p>
          <h1 className={styles.names}>
            {couple.bride} <span className={styles.and}>and</span> {couple.groom}
          </h1>
          <p className={styles.married}>are getting married!</p>

          <p className={styles.meta}>{wedding.dateLabel}</p>
          <p className={styles.meta}>{wedding.locationLabel}</p>

          <a href="/rsvp" className={styles.cta}>
            RSVP &amp; Details
          </a>
        </section>

        {/* ---- Section launcher (mobile-native: tap to drill in) ---- */}
        <section className={styles.explore}>
          <p className={styles.exploreLabel}>Find your way around</p>
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
        </section>

        <p className={styles.sign}>We can&rsquo;t wait to celebrate with you</p>
      </main>

      <MobileNav active="home" />
    </div>
  );
}
