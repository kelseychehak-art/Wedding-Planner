import Image from "next/image";
import styles from "./Hero.module.css";
import { siteContent } from "@/data/siteContent";
import Art from "./Art";
import PostageStamp from "./PostageStamp";

/**
 * Split "invitation cover" hero — type on cream (left), photograph in its own
 * panel (right), per Kelsey's Jul 21 mockup. Replaces the full-bleed cover:
 * every candidate photo was mid-toned and busy exactly where the date sat, so
 * the type now lives on cream where nothing can fight it, and the photo gets
 * to be a photo.
 *
 * [SWAP] Change HERO_PHOTO to switch candidates. Files are pre-cropped to the
 * panel's ~0.88 aspect and retina-sized (1584x1800) in public/assets/hero/.
 */

const CANDIDATES = {
  "nick-george": {
    src: "/assets/hero/split-nick-george.jpg",
    alt: "A stone villa with green shutters among umbrella pines and cypresses, with a pool below",
  },
  "rafael-peier": {
    src: "/assets/hero/split-rafael-peier.jpg",
    alt: "A Tuscan farmhouse on a hillside above olive groves and vineyard rows",
  },
  alessandro: {
    src: "/assets/hero/split-alessandro.jpg",
    alt: "An open window looking onto a pool, a cypress tree, and sunflower fields",
  },
} as const;

const HERO_PHOTO: keyof typeof CANDIDATES = "rafael-peier";

export default function Hero() {
  const { wedding, couple } = siteContent;
  const photo = CANDIDATES[HERO_PHOTO];

  return (
    <section id="top" className={styles.hero}>
      {/* ---- Invitation panel ---- */}
      <div className={styles.invite}>
        <div className={styles.inviteInner}>
          <p className={styles.eyebrow}>{wedding.eyebrow}</p>
          <Art name="lemon-branch" className={styles.sprig} />
          <h1 className={styles.country}>{wedding.destination}</h1>

          <Art name="div-gold-heart" className={styles.divider} />

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

          {/* On cream now, not over the photo — it finally reads. */}
          <p className={styles.handwritten} aria-hidden="true">
            We can&rsquo;t wait to celebrate with you
          </p>
        </div>

        <span className={styles.stamp} aria-hidden="true">
          <PostageStamp rotate={-7} />
        </span>
      </div>

      {/* ---- Photo panel ---- */}
      <div className={styles.photoPanel}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority
          sizes="(max-width: 899px) 100vw, 58vw"
          className={styles.photo}
        />
        {/* Gold hairline tracing the panel's curve, as in the mockup. */}
        <span className={styles.photoEdge} aria-hidden="true" />
      </div>
    </section>
  );
}
