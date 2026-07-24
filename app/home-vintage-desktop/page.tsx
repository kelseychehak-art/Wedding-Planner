import type { Metadata } from "next";
import Countdown from "@/components/mobileproto/Countdown";
import { siteContent } from "@/data/siteContent";
import styles from "./home-vintage-desktop.module.css";

/*
 * PROTOTYPE — Desktop view of the "vintage" direction. A public-domain
 * landscape painting fills the full viewport; a top nav bar replaces the
 * mobile bottom tabs; names + live countdown are layered over the art.
 * Swap art with ?art=vista|cypress|pastoral|villa. Noindex, standalone.
 */

export const metadata: Metadata = {
  title: "Home · Desktop (Vintage) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

const ART: Record<string, string> = {
  vista: "/assets/art/vista.jpg",
  cypress: "/assets/art/cypress.jpg",
  pastoral: "/assets/art/pastoral.jpg",
  villa: "/assets/art/villa.jpg",
};

const NAV = [
  { href: "/our-weekend-vintage", label: "Our Weekend" },
  { href: "/travel-vintage-desktop", label: "Travel" },
  { href: "/stay-vintage-desktop", label: "Stay" },
  { href: "/activities-vintage-desktop", label: "Activities" },
  { href: "/faq-vintage-desktop", label: "FAQ" },
];

export default async function HomeVintageDesktopPage({
  searchParams,
}: {
  searchParams: Promise<{ art?: string }>;
}) {
  const { couple, wedding } = siteContent;
  const { art } = await searchParams;
  const image = ART[art ?? "vista"] ?? ART.vista;

  return (
    <div className={styles.frame}>
      <div className={styles.art} style={{ backgroundImage: `url(${image})` }} aria-hidden="true" />
      <div className={styles.scrim} aria-hidden="true" />

      <header className={styles.topbar}>
        <span className={styles.brand}>K &amp; A</span>
        <nav className={styles.nav} aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={styles.navLink}>
              {n.label}
            </a>
          ))}
          <a href="/rsvp-vintage-desktop" className={styles.navRsvp}>
            RSVP
          </a>
        </nav>
      </header>

      <main className={styles.center}>
        <p className={styles.eyebrow}>Join us for a week in</p>
        <h1 className={styles.names}>
          <span className={styles.nameLine}>{couple.bride}</span>
          <span className={styles.amp}>&amp;</span>
          <span className={styles.nameLine}>{couple.groom}</span>
        </h1>
        <p className={styles.tagline}>
          are getting married under the <em>Tuscan sun</em>
        </p>
        <p className={styles.meta}>
          {wedding.dateLabel} <span className={styles.dot}>·</span> {wedding.locationLabel}
        </p>
        <a href="/rsvp-vintage-desktop" className={styles.cta}>
          RSVP &amp; Details
        </a>
      </main>

      <footer className={styles.countdownBar}>
        <Countdown />
      </footer>
    </div>
  );
}
