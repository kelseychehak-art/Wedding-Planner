import type { Metadata } from "next";
import MobileNav from "@/components/mobileproto/MobileNav";
import { siteContent } from "@/data/siteContent";
import styles from "./home-vintage.module.css";

/*
 * PROTOTYPE — "vintage romance" hero: a public-domain landscape painting fills
 * the hero, names + live countdown layered over it. Swap art with
 * ?art=cypress|pastoral|villa. Noindex, standalone.
 */

export const metadata: Metadata = {
  title: "Home (Vintage) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

const ART: Record<string, string> = {
  cypress: "/assets/art/cypress.jpg",
  pastoral: "/assets/art/pastoral.jpg",
  villa: "/assets/art/villa.jpg",
  vista: "/assets/art/vista.jpg",
};

const TARGET = new Date("2027-06-16T16:00:00+02:00").getTime();

export default async function HomeVintagePage({
  searchParams,
}: {
  searchParams: Promise<{ art?: string }>;
}) {
  const { couple } = siteContent;
  const { art } = await searchParams;
  const image = ART[art ?? "cypress"] ?? ART.cypress;

  // Static countdown for SSR (the ticking version is the Countdown component;
  // here we render a representative value so the prototype needs no client JS).
  const ms = Math.max(0, TARGET - Date.now());
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const units = [
    { n: d, label: "Days" },
    { n: h, label: "Hrs" },
    { n: m, label: "Min" },
    { n: 0, label: "Sec" },
  ];

  return (
    <div className={styles.frame}>
      <section className={styles.hero}>
        <div className={styles.art} style={{ backgroundImage: `url(${image})` }} aria-hidden="true" />
        <div className={styles.scrim} aria-hidden="true" />

        <div className={styles.content}>
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
            June 16 – 21, 2027 <span className={styles.dot}>·</span> Tuscany, Italy
          </p>
          <a href="/rsvp-vintage" className={styles.cta}>
            RSVP &amp; Details
          </a>

          <div className={styles.countdown}>
            <p className={styles.cdLabel}>The celebration begins in</p>
            <div className={styles.cdUnits}>
              {units.map((u, i) => (
                <div key={i} className={styles.cdUnit}>
                  <span className={styles.cdNum}>{String(u.n).padStart(2, "0")}</span>
                  <span className={styles.cdUnitLabel}>{u.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MobileNav active="home" variant="vintage" />
    </div>
  );
}
