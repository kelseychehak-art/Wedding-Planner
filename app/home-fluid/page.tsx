import type { Metadata } from "next";
import MobileNav from "@/components/mobileproto/MobileNav";
import Countdown from "@/components/mobileproto/Countdown";
import { siteContent } from "@/data/siteContent";
import styles from "./home-fluid.module.css";

/*
 * PROTOTYPE — "fluid" hero (Squarespace Rey vibe): the image is PART of the
 * page, bleeding up from the bottom and feathering into the cream, with the
 * type layered on the ivory above. Swap the image with ?img=amalfi|lemons|facade.
 * Noindex, standalone.
 */

export const metadata: Metadata = {
  title: "Home (Fluid) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

const IMAGES: Record<string, string> = {
  amalfi: "/assets/fluid/amalfi.jpg",
  lemons: "/assets/fluid/lemons.jpg",
  facade: "/assets/fluid/facade.jpg",
  federico: "/assets/fluid/federico.jpg",
  amy: "/assets/fluid/amy.jpg",
};

const SECTIONS = [
  { href: "/our-weekend-vintage", label: "Our Weekend", note: "Every event, welcome to farewell" },
  { href: "/travel-vintage", label: "Travel", note: "Flights & getting there" },
  { href: "/stay-vintage", label: "Where You'll Stay", note: "The villa & rooms" },
  { href: "/activities-vintage", label: "Activities", note: "Optional experiences" },
  { href: "/faq-vintage", label: "FAQ", note: "Answers to everything" },
];

export default async function HomeFluidPage({
  searchParams,
}: {
  searchParams: Promise<{ img?: string }>;
}) {
  const { couple } = siteContent;
  const { img } = await searchParams;
  const image = IMAGES[img ?? "federico"] ?? IMAGES.federico;

  return (
    <div className={styles.frame}>
      <section className={styles.hero}>
        <div className={styles.content}>
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
            June 16 – 21, 2027 <span className={styles.dot}>·</span> Tuscany, Italy
          </p>
        </div>

        <div className={styles.fluidImg} style={{ backgroundImage: `url(${image})` }} aria-hidden="true" />
        <div className={styles.heroCountdown}>
          <Countdown tone="onImage" />
        </div>
      </section>

      {/* ---- Everything that used to sit at the bottom now scrolls below the hero ---- */}
      <div className={styles.scroll}>
        <section className={styles.intro}>
          <p className={styles.introLabel}>With love</p>
          <h2 className={styles.introHead}>
            One <span className={styles.introHi}>unforgettable</span> week
          </h2>
          <p className={styles.introBody}>
            We&rsquo;re gathering everyone in Tuscany for five days of celebrating. Consider this
            your home base for all the details.
          </p>
        </section>

        <nav className={styles.explore} aria-label="Site sections">
          <p className={styles.exploreLabel}>Explore</p>
          <ul className={styles.links}>
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <a href={s.href} className={styles.link}>
                  <span>
                    <span className={styles.linkLabel}>{s.label}</span>
                    <span className={styles.linkNote}>{s.note}</span>
                  </span>
                  <span className={styles.linkArrow} aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={styles.after}>
        <p className={styles.sign}>Ci vediamo in Toscana</p>
        <p className={styles.signSub}>See you in Tuscany</p>
      </div>

      <MobileNav active="home" variant="vintage" />
    </div>
  );
}
