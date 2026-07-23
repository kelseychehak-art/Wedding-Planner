import type { Metadata } from "next";
import { siteContent } from "@/data/siteContent";
import styles from "./home-preview-3.module.css";

/*
 * PROTOTYPE v3 — a faithful match of the "scrapbook" Etsy template Kelsey
 * chose: warm textured paper, monochrome charcoal type, a thin signature
 * script for the names, casual handwriting for annotations, small-caps
 * labels, and taped/polaroid scrapbook photos. No colour accents by design.
 * Noindex, standalone route; her structure (sidebar, real nav) is kept.
 */

export const metadata: Metadata = {
  title: "Home (Preview 3) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

const ICONS: Record<string, React.ReactNode> = {
  Home: <path d="M4 11.5 12 5l8 6.5M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />,
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
  Stay: <path d="M3 18v-6a2 2 0 0 1 2-2h9a3 3 0 0 1 3 3v5M3 14h18M21 18v-4" strokeLinecap="round" strokeLinejoin="round" />,
  Activities: <path d="M8 4h8l-1 6a3 3 0 0 1-6 0L8 4ZM12 13v5M9 21h6" strokeLinecap="round" strokeLinejoin="round" />,
  FAQ: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4 2c0 1.6-2 1.9-2 3.2M12 17.5h.01" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

export default function HomePreview3Page() {
  const { couple, wedding } = siteContent;
  const nav = [{ label: "Home", href: "/" }, ...siteContent.navigation];

  return (
    <div className={styles.shell}>
      <div className={styles.grain} aria-hidden="true" />

      {/* ---------- Sidebar (minimal, monochrome) ---------- */}
      <aside className={styles.sidebar}>
        <span className={styles.mark} aria-hidden="true">
          <span className={styles.markScript}>Kelsey &amp; Andrew</span>
          <span className={styles.markSub}>Tuscany &middot; 2027</span>
        </span>

        <nav className={styles.nav}>
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${item.label === "Home" ? styles.navActive : ""}`}
            >
              <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {ICONS[item.label] ?? ICONS.Home}
              </svg>
              {item.label}
            </a>
          ))}
        </nav>

        <a href="/rsvp" className={styles.rsvpBtn}>
          RSVP / Login
        </a>
      </aside>

      {/* ---------- Main ---------- */}
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
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
          </div>

          {/* Taped scrapbook photo cluster */}
          <div className={styles.photos}>
            <figure className={`${styles.snap} ${styles.snapBack}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/hero/giuseppe-mondi-fJWYwHWYQpY-unsplash.jpg" alt="Golden-hour light over the Tuscan hills" className={styles.snapImg} />
            </figure>
            <figure className={`${styles.snap} ${styles.snapFront}`}>
              <span className={styles.tape} aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/hero/couple-1.jpg" alt="Kelsey and Andrew in the mountains" className={styles.snapImg} />
              <figcaption className={styles.snapCap}>la dolce vita</figcaption>
            </figure>
          </div>
        </section>

        {/* ---------- Details band ---------- */}
        <section className={styles.detailsBand}>
          <div className={styles.bandHead}>
            <figure className={styles.bandPhoto}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/hero/villa-estate.jpg" alt="A Tuscan villa among cypresses" />
            </figure>
            <h2 className={styles.bandTitle}>
              A week in <span className={styles.bandTitleLine}>Tuscany</span>
            </h2>
          </div>
          <div className={styles.details}>
            <div className={styles.detail}>
              <p className={styles.detailLabel}>The Setting</p>
              <p className={styles.detailBody}>
                Six days in the Tuscan countryside — a private villa, long dinners, and the people we
                love most, all in one place.
              </p>
            </div>
            <div className={styles.detail}>
              <p className={styles.detailLabel}>The Week</p>
              <p className={styles.detailBody}>
                Welcome dinner, a wine tasting, a cooking class, pool days, and a farewell party.
                The full schedule lives on Our Weekend.
              </p>
            </div>
            <div className={styles.detail}>
              <p className={styles.detailLabel}>Kindly Respond</p>
              <p className={styles.detailBody}>
                Please let us know by April 1, 2027. Look up your invitation with your name and the
                email we sent it to.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
