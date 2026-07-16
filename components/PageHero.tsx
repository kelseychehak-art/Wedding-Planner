import type { ReactNode } from "react";
import styles from "./PageHero.module.css";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  illustration?: ReactNode;
  children?: ReactNode;
};

export default function PageHero({
  eyebrow,
  title,
  intro,
  illustration,
  children,
}: PageHeroProps) {
  return (
    <section className={styles.hero}>
      <div className="page-shell">
        <div className={styles.inner}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.intro}>{intro}</p>
          {children}
        </div>
        {illustration && (
          <span className={styles.illustration} aria-hidden="true">
            {illustration}
          </span>
        )}
      </div>
    </section>
  );
}
