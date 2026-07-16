import type { ReactNode } from "react";
import styles from "./PageHero.module.css";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  illustration?: string;
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
          <img src={illustration} alt="" className={styles.illustration} />
        )}
      </div>
    </section>
  );
}
