import type { Metadata } from "next";
import Illustration from "@/components/Illustration";
import ScallopFrame from "@/components/ScallopFrame";
import { siteContent } from "@/data/siteContent";
import styles from "./home-preview.module.css";

/*
 * PROTOTYPE — homepage in the direction of Kelsey's mockup #2 (2026-07-22):
 * left sidebar + seal, an invitation-style centre with Playfair display names
 * and script accents, a wavy-edged photo panel, and scalloped colour cards.
 * Noindex, standalone route (/home-preview) — the live site is untouched.
 * Illustrations are our own SVGs, so they approximate the mockup's engravings
 * rather than matching them pixel for pixel.
 */

export const metadata: Metadata = {
  title: "Home (Preview) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

/* Small line icons for the sidebar nav. */
const ICONS: Record<string, React.ReactNode> = {
  Home: (
    <path d="M4 11.5 12 5l8 6.5M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
  ),
  "Our Weekend": (
    <>
      <rect x="4" y="6" width="16" height="14" rx="2" />
      <path d="M4 10h16M8 4v3M16 4v3" strokeLinecap="round" />
    </>
  ),
  Travel: (
    <>
      <path d="M12 21c4-3.6 6.5-6.6 6.5-10a6.5 6.5 0 1 0-13 0c0 3.4 2.5 6.4 6.5 10Z" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2.4" />
    </>
  ),
  Stay: (
    <>
      <path d="M3 18v-6a2 2 0 0 1 2-2h9a3 3 0 0 1 3 3v5M3 14h18M21 18v-4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  Activities: (
    <>
      <path d="M8 4h8l-1 6a3 3 0 0 1-6 0L8 4ZM12 13v5M9 21h6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  FAQ: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4 2c0 1.6-2 1.9-2 3.2M12 17.5h.01" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

function Seal() {
  return (
    <span className={styles.seal} aria-hidden="true">
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <path id="sealTop" d="M25 60a35 35 0 0 1 70 0" fill="none" />
        <path id="sealBot" d="M25 60a35 35 0 0 0 70 0" fill="none" />
        <text className={styles.sealText}>
          <textPath href="#sealTop" startOffset="50%" textAnchor="middle">ITALY</textPath>
        </text>
        <text className={styles.sealText}>
          <textPath href="#sealBot" startOffset="50%" textAnchor="middle">LA DOLCE VITA</textPath>
        </text>
      </svg>
      <span className={styles.sealArt}>
        <Illustration name="oliveBranch" tone="olive" size={34} />
      </span>
    </span>
  );
}

export default function HomePreviewPage() {
  const { couple, wedding } = siteContent;
  const nav = [{ label: "Home", href: "/" }, ...siteContent.navigation];

  return (
    <div className={styles.shell}>
      {/* ---------- Sidebar ---------- */}
      <aside className={styles.sidebar}>
        <Seal />

        <nav className={styles.nav}>
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${item.label === "Home" ? styles.navActive : ""}`}
            >
              <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                {ICONS[item.label] ?? ICONS.Home}
              </svg>
              {item.label}
            </a>
          ))}
        </nav>

        <span className={styles.navDivider} aria-hidden="true">
          <Illustration name="oliveBranch" tone="olive" size={20} />
          <Illustration name="heart" tone="terracotta" size={12} />
          <Illustration name="oliveBranch" tone="olive" size={20} />
        </span>

        <a href="/rsvp" className={styles.rsvpBtn}>
          RSVP / Login
        </a>
      </aside>

      {/* ---------- Main ---------- */}
      <main className={styles.main}>
        <section className={styles.invite}>
          <span className={styles.villa} aria-hidden="true">
            <Illustration name="villa" tone="olive" size={130} />
          </span>

          <p className={styles.pre}>Together with their families</p>

          <h1 className={styles.names}>
            <span className={styles.name}>{couple.bride}</span>
            <span className={styles.amp}>and</span>
            <span className={styles.name}>{couple.groom}</span>
          </h1>

          <p className={styles.inviteLine}>invite you to celebrate their wedding</p>

          {/* Wavy tricolour line — the "brand element" from the board. */}
          <span className={styles.wave} aria-hidden="true">
            <svg viewBox="0 0 260 22" preserveAspectRatio="none" fill="none">
              <path d="M2 6 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0"
                stroke="var(--rust)" strokeWidth="2" strokeLinecap="round" />
              <path d="M2 11 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0"
                stroke="var(--sage)" strokeWidth="2" strokeLinecap="round" />
              <path d="M2 16 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0"
                stroke="var(--sky-deep)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>

          <p className={styles.date}>{wedding.dateLabel}</p>
          <p className={styles.loc}>{wedding.locationLabel}</p>
          <p className={styles.dolce}>la dolce vita</p>

          {/* Blue scalloped welcome note */}
          <div className={styles.ciao}>
            <ScallopFrame color="var(--color-sky-blue-deep)" target={30} inset={7} />
            <p className={styles.ciaoTitle}>Ciao!</p>
            <p className={styles.ciaoBody}>
              We can&rsquo;t wait to celebrate with you in Italy. Explore the weekend details, travel
              info, and everything you need to plan an unforgettable trip.
            </p>
            <a href="/our-weekend" className={styles.ciaoLink}>
              More about our weekend <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* Three quick entries */}
          <div className={styles.tiles}>
            <a href="/travel" className={styles.tile}>
              <span className={`${styles.tileIcon} ${styles.tileBlue}`}>
                <Illustration name="airplane" tone="olive" size={20} />
              </span>
              <span>
                <span className={styles.tileLabel}>Travel Tips</span>
                <span className={styles.tileBody}>Helpful info for getting to Tuscany</span>
              </span>
            </a>
            <a href="/activities" className={styles.tile}>
              <span className={`${styles.tileIcon} ${styles.tileOlive}`}>
                <Illustration name="wineGlass" tone="olive" size={20} />
              </span>
              <span>
                <span className={styles.tileLabel}>Local Favorites</span>
                <span className={styles.tileBody}>Our favorite places to eat, sip &amp; explore</span>
              </span>
            </a>
            <a href="/our-weekend" className={styles.tile}>
              <span className={`${styles.tileIcon} ${styles.tileRose}`}>
                <Illustration name="lemon" tone="olive" size={20} />
              </span>
              <span>
                <span className={styles.tileLabel}>Weekend Schedule</span>
                <span className={styles.tileBody}>Every event, from welcome to farewell</span>
              </span>
            </a>
          </div>
        </section>

        {/* ---------- Photo panel ---------- */}
        <aside className={styles.photoPanel}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/hero/split-nick-george.jpg"
            alt="A stone villa among cypresses and olive groves in Tuscany"
            className={styles.photo}
          />
          <span className={styles.scallopEdge} aria-hidden="true" />

          {/* Clean round postmark, not the engraved stamp. */}
          <span className={styles.stamp} aria-hidden="true">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.4"
                strokeDasharray="1 4.4" strokeLinecap="round" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1" />
              <path id="stampTop" d="M20 50a30 30 0 0 1 60 0" fill="none" />
              <path id="stampBot" d="M20 50a30 30 0 0 0 60 0" fill="none" />
              <text className={styles.stampText}>
                <textPath href="#stampTop" startOffset="50%" textAnchor="middle">TUSCANY</textPath>
              </text>
              <text className={styles.stampText}>
                <textPath href="#stampBot" startOffset="50%" textAnchor="middle">ITALIA</textPath>
              </text>
              <path d="M50 44c-3-4-9-1-9 3 0 3 5 6 9 9 4-3 9-6 9-9 0-4-6-7-9-3Z"
                fill="currentColor" />
            </svg>
          </span>

          <div className={styles.highlights}>
            <ScallopFrame color="var(--color-citrus-gold)" target={26} inset={6} />
            <span className={styles.highlightsHead}>
              <Illustration name="cypress" tone="gold" size={18} /> Weekend Highlights
            </span>
            <p className={styles.highlightsBody}>
              Explore the key events, experiences, and moments we can&rsquo;t wait to share with you.
            </p>
            <a href="/activities" className={styles.highlightsLink} aria-hidden="true">
              →
            </a>
          </div>
        </aside>
      </main>
    </div>
  );
}
