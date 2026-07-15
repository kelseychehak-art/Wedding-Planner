import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="top" className="page-shell">
      <div className={styles.hero}>
        <Image
          src="/assets/hero/villa-hero.jpg"
          alt="Golden-hour view of an Italian stone villa surrounded by cypress trees and gardens"
          fill
          priority
          sizes="(max-width: 899px) 100vw, 1380px"
          className={styles.image}
        />
        <div className={styles.overlay} />

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
          <p className={styles.eyebrow}>Join us for a week in</p>
          <h1>
            <span className={styles.italy}>Italy</span>
            <span className={styles.coupleTitle}>
              Kelsey &amp; Andrew&rsquo;s
              <br />
              Wedding Week
            </span>
          </h1>
          <p className={styles.dateLocation}>
            May 2027 &middot; Dates TBD
            <br />
            Venue TBD, Italy
          </p>
          <a href="#our-weekend" className={`btn-primary ${styles.cta}`}>
            View Our Weekend
          </a>
        </div>
      </div>
    </section>
  );
}
