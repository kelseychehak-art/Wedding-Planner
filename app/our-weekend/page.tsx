import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import ScheduleCard from "@/components/ScheduleCard";
import PostageStamp from "@/components/PostageStamp";
import styles from "@/components/ContentPage.module.css";

export const metadata: Metadata = {
  title: "Our Weekend · Kelsey & Andrew's Wedding Week",
  description: "The plan for Kelsey & Andrew's wedding week in Italy — a few unhurried days of good food, great people, and celebration.",
};

export default function OurWeekendPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Our Weekend"
          title="A Week in Italy"
          intro="We're not doing a single day — we're doing a whole week. Good food, great people, and a place we love, with plenty of time to slow down and enjoy every bit of it together."
          illustration={<PostageStamp variant="cypress" size={128} rotate={-4} />}
        />

        <div className={`page-shell ${styles.page}`}>
          <section className={styles.section}>
            <p className={styles.sectionEyebrow}>The Idea</p>
            <h2 className={styles.sectionTitle}>How We&rsquo;re Celebrating</h2>
            <div className={styles.prose}>
              <p>
                Rather than a whirlwind day, we&rsquo;re gathering everyone we love in one
                beautiful spot for several days. Think long lunches, lazy afternoons by the
                pool, an aperitivo as the sun goes down, and one very special evening at the
                heart of it all.
              </p>
              <p>
                There&rsquo;s no bridal party and no fuss — just the people who matter most,
                together in Italy. The full day-by-day schedule below will fill in as we lock
                down our dates and venue.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.sectionEyebrow}>The Plan</p>
            <h2 className={styles.sectionTitle}>
              Weekend Schedule
              <span className={styles.tbd}>Dates TBD</span>
            </h2>
            <div className={styles.scheduleWrap}>
              <ScheduleCard showButton={false} />
            </div>
          </section>

          <div className={styles.ctaBand}>
            <span className={styles.ctaText}>Will you be joining us?</span>
            <a href="/rsvp" className="btn-primary">
              RSVP
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
