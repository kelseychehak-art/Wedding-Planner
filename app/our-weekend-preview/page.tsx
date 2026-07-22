import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Illustration, { type IllustrationName } from "@/components/Illustration";
import Art from "@/components/Art";
import DownloadIcs from "../our-weekend/DownloadIcs";
import { schedule, formatTimeRange, type ScheduleIcon } from "@/data/schedule";
import { siteContent } from "@/data/siteContent";
import styles from "./our-weekend-preview.module.css";

/*
 * PROTOTYPE — Our Weekend rebuilt in the admin idiom (2026-07-22).
 * Drops the faded-photo canvas and the floating cream panel; adopts admin's
 * card system (paper surface, soft border, subtle shadow), uppercase
 * micro-labels, and left-aligned structure. Decoration is pared back to a
 * single sprig in the hero. Not linked in nav — reachable at
 * /our-weekend-preview so it can be compared against the live page.
 */

export const metadata: Metadata = {
  title: "Our Weekend (Preview) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

const ICON_NAME: Record<ScheduleIcon, IllustrationName> = {
  dinner: "wineGlass",
  wine: "wineBottle",
  cooking: "espresso",
  pool: "lemon",
  town: "arch",
  party: "music",
};

function ClockIcon() {
  return (
    <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21c4.5-4.2 7-7.4 7-11a7 7 0 1 0-14 0c0 3.6 2.5 6.8 7 11Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function OurWeekendPreviewPage() {
  const { couple, wedding } = siteContent;

  return (
    <div className={styles.page}>
      <SiteHeader />

      <main className={styles.container}>
        <a href="/" className={styles.back}>
          <span aria-hidden="true">←</span> Back to Home
        </a>

        {/* ---------- Restrained hero ---------- */}
        <header className={styles.hero}>
          <p className={styles.eyebrow}>
            {wedding.dateLabel} · {wedding.locationLabel}
          </p>
          <Art name="lemon-branch" className={styles.sprig} />
          <h1 className={styles.title}>Weekend Schedule</h1>
          <p className={styles.subtitle}>
            A week of celebration, connection, and unforgettable moments in Italy.
          </p>
        </header>

        {/* ---------- Body ---------- */}
        <div className={styles.layout}>
          {/* Left column */}
          <aside className={styles.sidebar}>
            <section className={styles.card}>
              <p className={styles.microLabel}>At a Glance</p>
              <ul className={styles.glanceList}>
                {schedule.map((day) => {
                  const ev = day.events[0];
                  return (
                    <li key={day.key} className={styles.glanceRow}>
                      <span className={styles.glanceDay}>
                        {day.label} · {day.date}
                      </span>
                      <span className={styles.glanceEvent}>
                        {ev.title}
                        <span className={styles.glanceTime}> · {ev.time}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className={styles.card}>
              <p className={`${styles.microLabel} ${styles.microNote}`}>Note</p>
              <p className={styles.mutedBody}>
                Times and details are subject to change. Check back for updates as we get closer.
              </p>
            </section>

            <section className={styles.card}>
              <p className={styles.microLabel}>Download Itinerary</p>
              <p className={styles.mutedBody}>
                Add the week to your calendar so you never miss a moment.
              </p>
              <DownloadIcs className={`btn-outline ${styles.downloadBtn}`} />
            </section>
          </aside>

          {/* Right timeline */}
          <div className={styles.timeline}>
            {schedule.map((day) => {
              const ev = day.events[0];
              return (
                <article key={day.key} className={`${styles.card} ${styles.dayCard}`}>
                  <div className={styles.dayHeader}>
                    <span className={styles.dayIcon} aria-hidden="true">
                      <Illustration name={ICON_NAME[ev.icon]} size={20} />
                    </span>
                    <p className={styles.dayLabel}>
                      {day.dayName} · {day.date}
                    </p>
                  </div>

                  <div className={styles.dayInner}>
                    {ev.photo && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={ev.photo} alt="" className={styles.dayPhoto} loading="lazy" />
                    )}
                    <div className={styles.dayContent}>
                      <h3 className={styles.dayTitle}>{ev.title}</h3>
                      <p className={styles.dayDesc}>{ev.description}</p>
                      <div className={styles.dayMeta}>
                        <span className={styles.metaItem}>
                          <ClockIcon />
                          {formatTimeRange(ev.time, ev.endTime)}
                        </span>
                        <span className={styles.metaItem}>
                          <PinIcon />
                          {ev.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* ---------- Closing band: three plain cards ---------- */}
        <div className={styles.band}>
          <div className={styles.card}>
            <Illustration name="suitcase" size={30} tone="olive" />
            <p className={styles.bandLabel}>What to Wear</p>
            <p className={styles.mutedBody}>
              Elevated and comfortable, with the countryside in mind. A dress code per event comes
              with your invitation.
            </p>
          </div>
          <div className={styles.card}>
            <Illustration name="envelope" size={30} tone="olive" />
            <p className={styles.bandLabel}>Share Your Photos</p>
            <p className={styles.mutedBody}>
              Tag your snapshots so we can relive the week together:{" "}
              <span className={styles.hashtag}>#ChehakShultsWedding</span>
            </p>
          </div>
          <div className={styles.card}>
            <Illustration name="oliveBranch" size={34} tone="olive" />
            <p className={styles.bandLabel}>Questions?</p>
            <p className={styles.mutedBody}>
              We&rsquo;ve gathered answers to everything we&rsquo;re asked most.
            </p>
            <a href="/faq" className={`btn-outline ${styles.downloadBtn}`}>
              View FAQ
            </a>
          </div>
        </div>

        {/* ---------- Slim closing ---------- */}
        <footer className={styles.closing}>
          <Art name="div-gold-heart" className={styles.closingDivider} />
          <p className={styles.closingNames}>
            {couple.bride} <span aria-hidden="true">♥</span> {couple.groom}
          </p>
          <p className={styles.closingMeta}>
            {wedding.dateLabel} · {wedding.locationLabel}
          </p>
        </footer>
      </main>
    </div>
  );
}
