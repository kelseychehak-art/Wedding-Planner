import Image from "next/image";
import styles from "./Hero.module.css";
import { siteContent } from "@/data/siteContent";
import Illustration from "./Illustration";
import PostageStamp from "./PostageStamp";

/**
 * Full-bleed editorial "invitation cover" — docs/homepage-spec.md.
 * A full-cover landscape + cream veil, a centered title stack, a tilted villa
 * stamp upper-right, and a handwritten line near the bottom fade.
 * [SWAP] final image = images/tuscan-homepage-landscape.jpg; illustrations pending.
 */

export default function Hero() {
  const { wedding, couple } = siteContent;

  return (
    <section id="top" className={styles.hero}>
      <Image
        src="/assets/hero/villa-estate.jpg"
        alt="The Tuscan countryside — cypress trees, olive groves, and a villa on the hillside"
        fill
        priority
        sizes="100vw"
        className={styles.bg}
      />
      <div className={styles.veil} />

      <span className={styles.stamp} aria-hidden="true">
        <PostageStamp variant="villa" rotate={6} />
      </span>

      <div className={styles.content}>
        <p className={styles.eyebrow}>{wedding.eyebrow}</p>
        <Illustration name="lemonBranch" className={styles.sprig} />
        <h1 className={styles.country}>{wedding.destination}</h1>

        <div className={styles.divider} aria-hidden="true">
          <span className={styles.rule} />
          <Illustration name="heart" tone="gold" size={20} />
          <span className={styles.rule} />
        </div>

        <p className={styles.couple}>{couple.displayName}&rsquo;s</p>
        <p className={styles.event}>{wedding.eventName}</p>

        <p className={styles.meta}>
          {wedding.dateLabel}
          <br />
          {wedding.locationLabel}
        </p>

        <a href="/rsvp" className={`btn-primary ${styles.cta}`}>
          RSVP / Login to Get Started
        </a>
      </div>

      <div className={styles.handwritten} aria-hidden="true">
        <span className={styles.handwrittenText}>
          We can&rsquo;t wait to celebrate with you
        </span>
        <Illustration name="heart" tone="terracotta" size={18} />
      </div>
    </section>
  );
}
