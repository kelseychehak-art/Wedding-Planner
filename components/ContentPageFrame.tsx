import type { ReactNode } from "react";
import Link from "next/link";
import SiteHeader from "./SiteHeader";
import Illustration, { type IllustrationName } from "./Illustration";
import PostageStamp from "./PostageStamp";
import { siteContent } from "@/data/siteContent";
import styles from "./ContentPageFrame.module.css";

/**
 * Shared inner-page frame — docs/content-page-frame.md.
 * Faded Tuscan landscape → rounded cream panel → centered decorative hero
 * (back-to-home, sprig, Fraunces-italic title + heart, gold divider, subtitle,
 * tilted villa stamp) → page body → inner closing footer band.
 * [SWAP] real hero photo + sliced illustration art are pending.
 */

type ContentPageFrameProps = {
  /** Big green Fraunces-italic hero title, e.g. "Weekend Schedule". */
  title: string;
  /** One-line muted subtitle under the gold divider. */
  subtitle: string;
  /** Centered sprig above the title. Defaults to the lemon branch. */
  heroIllustration?: IllustrationName;
  /** Closing line in the footer band (rendered uppercase). */
  footerLine?: string;
  /** Hero title color. Most pages are olive; RSVP/personalized pages use terracotta. */
  titleTone?: "olive" | "terracotta";
  children: ReactNode;
};

export default function ContentPageFrame({
  title,
  subtitle,
  heroIllustration = "lemonBranch",
  footerLine = "We can't wait to celebrate with you!",
  titleTone = "olive",
  children,
}: ContentPageFrameProps) {
  const { couple, wedding } = siteContent;

  return (
    <>
      <SiteHeader />
      <div className={styles.bg} aria-hidden="true" />

      <main className={styles.main}>
        <article className={styles.panel}>
            <Link href="/" className={styles.back}>
              <span aria-hidden="true">←</span> Back to Home
            </Link>

            <span className={styles.stamp} aria-hidden="true">
              <PostageStamp variant="villa" rotate={5} />
            </span>

            <header className={styles.hero}>
              <Illustration name={heroIllustration} className={styles.sprig} />
              <h1
                className={styles.title}
                data-tone={titleTone === "terracotta" ? "terracotta" : undefined}
              >
                <span>{title}</span>
                <Illustration
                  name="heart"
                  tone="terracotta"
                  size={22}
                  className={styles.titleHeart}
                />
              </h1>
              <div className={styles.divider} aria-hidden="true">
                <span className={styles.rule} />
                <Illustration name="heart" tone="gold" size={18} />
                <span className={styles.rule} />
              </div>
              <p className={styles.subtitle}>{subtitle}</p>
            </header>

            <div className={styles.body}>{children}</div>

            <footer className={styles.footerBand}>
              <div className={styles.footerArt} aria-hidden="true">
                <Illustration name="wineGlass" size={38} />
                <Illustration name="oliveBranch" size={66} />
              </div>
              <p className={styles.footerLine}>{footerLine}</p>
              <div className={styles.divider} aria-hidden="true">
                <span className={styles.rule} />
                <Illustration name="heart" tone="gold" size={15} />
                <span className={styles.rule} />
              </div>
              <p className={styles.footerNames}>
                {couple.bride} <span aria-hidden="true">♥</span> {couple.groom}
              </p>
              <p className={styles.footerMeta}>{wedding.dateLabel}</p>
              <p className={styles.footerMeta}>{wedding.locationLabel}</p>
            </footer>
        </article>
      </main>
    </>
  );
}
