import Image from "next/image";
import styles from "./Hero.module.css";
import { siteContent } from "@/data/siteContent";

export default function Hero() {
  const { wedding, couple } = siteContent;

  return (
    <section id="top" className="page-shell">
      <div className={styles.hero}>
        <Image
          src="/assets/hero/villa-hero.jpg"
          alt="Golden-hour view of the Italian countryside — cypress trees over rolling hills"
          fill
          priority
          sizes="(max-width: 899px) 100vw, 1440px"
          className={styles.image}
        />
        <div className={styles.overlay} />

        {/* Decorative only — replace with final illustrations when available */}
        <Image
          src="/assets/illustrations/lemon-branch.svg"
          alt=""
          width={210}
          height={150}
          className={`${styles.decoration} ${styles.lemon}`}
        />
        <Image
          src="/assets/illustrations/postage-stamp.svg"
          alt=""
          width={100}
          height={100}
          className={`${styles.decoration} ${styles.stamp}`}
        />

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
