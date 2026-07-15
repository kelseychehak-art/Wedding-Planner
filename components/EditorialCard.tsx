import type { ReactNode } from "react";
import styles from "./EditorialCard.module.css";

type EditorialCardProps = {
  eyebrow?: string;
  heading: string;
  headingVariant: "script" | "plain";
  body: string;
  cta: { label: string; href: string; style: "outline" | "link" };
  illustrations?: ReactNode;
  showHeart?: boolean;
};

export default function EditorialCard({
  eyebrow,
  heading,
  headingVariant,
  body,
  cta,
  illustrations,
  showHeart,
}: EditorialCardProps) {
  return (
    <div className={styles.card}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <div className={styles.headingRow}>
        {headingVariant === "script" ? (
          <h3 className={styles.scriptHeading}>{heading}</h3>
        ) : (
          <h3 className={styles.plainHeading}>{heading}</h3>
        )}
        {showHeart && (
          <img src="/assets/illustrations/heart.svg" alt="" className={styles.heart} />
        )}
      </div>
      <p className={styles.body}>{body}</p>
      <div className={styles.spacer} />
      <a
        href={cta.href}
        className={
          cta.style === "outline" ? `btn-outline ${styles.outlineCta}` : styles.linkCta
        }
      >
        {cta.label}
        {cta.style === "link" && <span aria-hidden="true">&rarr;</span>}
      </a>
      {illustrations}
    </div>
  );
}
