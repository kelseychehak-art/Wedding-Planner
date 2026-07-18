import type { Metadata } from "next";
import ContentPageFrame from "@/components/ContentPageFrame";
import Illustration, { type IllustrationName } from "@/components/Illustration";
import DownloadIcs from "./DownloadIcs";
import { schedule, formatTimeRange, type ScheduleIcon } from "@/data/schedule";
import styles from "./our-weekend.module.css";

export const metadata: Metadata = {
  title: "Our Weekend · Kelsey & Andrew's Wedding Week",
  description:
    "The weekend schedule for Kelsey & Andrew's wedding week in Tuscany — a week of celebration, connection, and unforgettable moments.",
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

export default function OurWeekendPage() {
  return (
    <ContentPageFrame
      title="Weekend Schedule"
      subtitle="A week of celebration, connection, and unforgettable moments in Italy."
      footerLine="We can't wait to celebrate with you!"
    >
      <div className={styles.layout}>
        {/* ---------- Left sidebar ---------- */}
        <aside className={styles.sidebar}>
          <section className={styles.glance}>
            <h2 className={styles.glanceTitle}>At a Glance</h2>
            <ul className={styles.glanceList}>
              {schedule.map((day) => {
                const ev = day.events[0];
                return (
                  <li key={day.key} className={styles.glanceRow}>
                    <span className={styles.glanceDay}>
                      {day.label} · {day.date}
                    </span>
                    <span className={styles.glanceEvent}>
                      {ev.title} · {ev.time}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <div className={styles.note}>
            <p className={styles.noteLabel}>Note</p>
            <p className={styles.noteBody}>
              Times and details are subject to change. Check back for updates as we get
              closer!
            </p>
          </div>

          <section className={styles.download}>
            <p className={styles.downloadTitle}>Download Itinerary</p>
            <p className={styles.downloadBody}>
              Add the week to your calendar so you never miss a moment.
            </p>
            <DownloadIcs className={`btn-outline ${styles.downloadBtn}`} />
          </section>

          <div className={styles.sidebarArt} aria-hidden="true">
            <Illustration name="bicycle" size={72} />
            <Illustration name="lemonBranch" size={96} />
          </div>
        </aside>

        {/* ---------- Right timeline ---------- */}
        <div className={styles.timeline}>
          {schedule.map((day) => {
            const ev = day.events[0];
            return (
              <article key={day.key} className={styles.dayRow}>
                <div className={styles.dayIcon} aria-hidden="true">
                  <Illustration name={ICON_NAME[ev.icon]} size={30} />
                </div>

                <div className={styles.dayCard}>
                  <p className={styles.dayLabel}>
                    {day.dayName} · {day.date}
                  </p>
                  <div className={styles.dayInner}>
                    {ev.photo && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={ev.photo}
                        alt=""
                        className={styles.dayPhoto}
                        loading="lazy"
                      />
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
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ---------- Bottom mini-blocks band ---------- */}
      <div className={styles.band}>
        <div className={styles.bandItem}>
          <Illustration name="suitcase" size={34} tone="olive" />
          <p className={styles.bandLabel}>What to Wear</p>
          <p className={styles.bandBody}>
            Elevated and comfortable, with the countryside in mind. A dress code per event
            comes with your invitation.
          </p>
        </div>
        <div className={styles.bandItem}>
          <Illustration name="envelope" size={34} tone="olive" />
          <p className={styles.bandLabel}>Share Your Photos</p>
          <p className={styles.bandBody}>
            Tag your snapshots so we can relive the week together:
            <br />
            <span className={styles.hashtag}>#ChehakShultsWedding</span>
          </p>
        </div>
        <div className={styles.bandItem}>
          <Illustration name="oliveBranch" size={40} tone="olive" />
          <p className={styles.bandLabel}>Questions?</p>
          <p className={styles.bandBody}>
            We&rsquo;ve gathered answers to everything we&rsquo;re asked most.
          </p>
          <a href="/faq" className="btn-outline">
            View FAQ
          </a>
        </div>
      </div>
    </ContentPageFrame>
  );
}
