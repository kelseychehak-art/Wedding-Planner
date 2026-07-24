import MobileNav from "@/components/mobileproto/MobileNav";
import styles from "./DolcePage.module.css";

/*
 * MOBILE-NATIVE PROTOTYPE — shared "Dolce" content-page shell.
 * Every inner tab (Travel, Stay, Activities, FAQ, RSVP) renders inside this so
 * the frame, warm palette, Cherolina title, and sticky bottom nav stay perfectly
 * consistent. Pages pass their content as children and reuse the exported
 * `dolce` class library for cards/sections/rows.
 */

export type DolceNavKey = "home" | "weekend" | "travel" | "stay" | "rsvp" | "";

export const dolce = styles; // shared class library for pages

export default function DolcePage({
  eyebrow,
  title,
  subtitle,
  active = "",
  backHref = "/home-dolce",
  titleTone,
  art,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  active?: DolceNavKey;
  backHref?: string;
  titleTone?: "sea" | "coral";
  /** Path to a painting for the "vintage" treatment. When set, the header
   *  becomes a painterly band that feathers into the cream page and the
   *  accent palette shifts to the restrained terracotta/olive set. */
  art?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.frame} ${art ? styles.vintage : ""}`}>
      {art ? (
        <header
          className={styles.artHead}
          style={{ backgroundImage: `url(${art})` }}
        >
          <a href={backHref} className={styles.back} aria-label="Back to home">
            ←
          </a>
          <div className={styles.headText}>
            {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.sub}>{subtitle}</p>}
          </div>
        </header>
      ) : (
        <header className={styles.head}>
          <a href={backHref} className={styles.back} aria-label="Back to home">
            ←
          </a>
          <div className={styles.headText}>
            {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
            <h1
              className={`${styles.title} ${titleTone === "coral" ? styles.titleCoral : titleTone === "sea" ? styles.titleSea : ""}`}
            >
              {title}
            </h1>
            {subtitle && <p className={styles.sub}>{subtitle}</p>}
          </div>
        </header>
      )}

      <main className={styles.main}>{children}</main>

      <MobileNav active={active} variant={art ? "vintage" : "cream"} />
    </div>
  );
}
