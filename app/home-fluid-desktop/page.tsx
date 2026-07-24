import type { Metadata } from "next";
import Countdown from "@/components/mobileproto/Countdown";
import { siteContent } from "@/data/siteContent";
import styles from "./home-fluid-desktop.module.css";

/*
 * PROTOTYPE — Desktop view of the "Fluid" homepage: a photograph bleeds up from
 * the bottom and feathers into the cream, type layered above. Swap the image
 * with ?img=federico|amy|amalfi|lemons|facade. Cream desktop content tabs. Noindex.
 */

export const metadata: Metadata = {
  title: "Home · Desktop (Fluid) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

const IMAGES: Record<string, string> = {
  amalfi: "/assets/fluid/amalfi.jpg",
  lemons: "/assets/fluid/lemons.jpg",
  facade: "/assets/fluid/facade.jpg",
  federico: "/assets/fluid/federico.jpg",
  amy: "/assets/fluid/amy.jpg",
};

const NAV = [
  { href: "/our-weekend-vintage-desktop", label: "Our Weekend" },
  { href: "/travel-vintage-desktop", label: "Travel" },
  { href: "/stay-vintage-desktop", label: "Stay" },
  { href: "/activities-vintage-desktop", label: "Activities" },
  { href: "/faq-vintage-desktop", label: "FAQ" },
];

export default async function HomeFluidDesktopPage({
  searchParams,
}: {
  searchParams: Promise<{ img?: string }>;
}) {
  const { couple, wedding } = siteContent;
  const { img } = await searchParams;
  const image = IMAGES[img ?? "federico"] ?? IMAGES.federico;

  return (
    <div className={styles.page}>
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

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Join us for a week in Italy</p>
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
        </div>
        <div className={styles.fluidImg} style={{ backgroundImage: `url(${image})` }} aria-hidden="true" />
        <div className={styles.heroCountdown}>
          <Countdown tone="onImage" />
        </div>
      </section>
    </div>
  );
}
