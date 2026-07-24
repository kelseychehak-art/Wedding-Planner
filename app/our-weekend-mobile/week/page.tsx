import type { Metadata } from "next";
import MobileNav from "@/components/mobileproto/MobileNav";
import { schedule, formatTimeRange } from "@/data/schedule";
import styles from "../our-weekend-mobile.module.css";

/*
 * MOBILE-NATIVE PROTOTYPE — Weekend Schedule, "full week at a glance".
 * The second view behind the Day / Week toggle: a vertical timeline of all six
 * days at once, so guests who want the whole picture get it on one page —
 * without crowding the focused day-by-day pager. Dolce art direction.
 * Noindex, standalone route.
 */

export const metadata: Metadata = {
  title: "Weekend · Full Week (Mobile) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

export default function WeekViewPage() {
  return (
    <div className={styles.frame}>
      {/* ---- Compact header ---- */}
      <header className={styles.head}>
        <a href="/our-weekend-mobile" className={styles.back} aria-label="Back to day view">
          ←
        </a>
        <div>
          <p className={styles.eyebrow}>At a glance</p>
          <h1 className={styles.title}>The Full Week</h1>
          <p className={styles.sub}>June 16 – 21, 2027 · Tuscany</p>
        </div>
      </header>

      {/* ---- Day / Week view toggle ---- */}
      <div className={styles.viewToggle} role="tablist" aria-label="Schedule view">
        <a href="/our-weekend-mobile" className={styles.viewSeg} role="tab" aria-selected="false">
          Day
        </a>
        <span className={`${styles.viewSeg} ${styles.viewSegActive}`} role="tab" aria-selected="true">
          Week
        </span>
      </div>

      {/* ---- Whole week, one timeline ---- */}
      <main className={styles.main}>
        <ol className={styles.timeline}>
          {schedule.map((d) => (
            <li key={d.key} className={styles.tlItem}>
              <div className={styles.tlDate}>
                <span className={styles.tlDay}>{d.label}</span>
                <span className={styles.tlNum}>{d.date.replace(/^\w+ /, "")}</span>
              </div>
              <div className={styles.tlDayEvents}>
                {d.events.map((ev, i) => (
                  <a key={i} href={`/our-weekend-mobile?day=${d.key}`} className={styles.tlCard}>
                    <span className={styles.tlText}>
                      <span className={styles.tlTitle}>{ev.title}</span>
                      <span className={styles.tlMeta}>
                        {formatTimeRange(ev.time, ev.endTime)} · {ev.location}
                      </span>
                    </span>
                    {ev.photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ev.photo} alt="" className={styles.tlThumb} />
                    )}
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ol>

        <p className={styles.note}>Tap any day to open it in detail.</p>
      </main>

      <MobileNav active="weekend" />
    </div>
  );
}
