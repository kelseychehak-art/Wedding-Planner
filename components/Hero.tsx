import Image from "next/image";
import styles from "./Hero.module.css";
import { siteContent } from "@/data/siteContent";
import Illustration from "./Illustration";
import PostageStamp from "./PostageStamp";

export default function Hero() {
  const { wedding, couple } = siteContent;

  return (
    <section id="top" className="page-shell">
      <div className={styles.hero}>
        <Image
          src="/assets/hero/villa-estate.jpg"
          alt="A Tuscan villa estate framed by cypress trees and olive groves, with hills beyond"
          fill
          priority
          sizes="(max-width: 899px) 100vw, 1440px"
          className={styles.image}
        />
        <div className={styles.overlay} />

        {/* Decorative brand illustrations */}
        <Illustration
          name="lemonBranch"
          className={`${styles.decoration} ${styles.lemon}`}
        />
        <span className={`${styles.decoration} ${styles.stamp}`} aria-hidden="true">
          <PostageStamp variant="villa" rotate={5} size={92} />
        </span>

        <div className={styles.content}>
          <p className={styles.eyebrow}>{wedding.eyebrow}</p>
          <h1 className={styles.title}>
            <span className={styles.destination}>{wedding.destination}</span>
            <span className={styles.coupleTitle}>
              {couple.displayName}&rsquo;s
              <br />
              {wedding.eventName}
            </span>
          </h1>
          <p className={styles.dateLocation}>
            {wedding.dateLabel}
            <br />
            {wedding.locationLabel}
          </p>
          <a href="/our-weekend" className={`btn-primary ${styles.cta}`}>
            View Our Weekend
          </a>
        </div>
      </div>
    </section>
  );
}
