"use client";

import { useEffect, useState } from "react";
import MobileNav from "@/components/mobileproto/MobileNav";
import { schedule, formatTimeRange } from "@/data/schedule";
import styles from "./our-weekend-mobile.module.css";

/*
 * MOBILE-NATIVE PROTOTYPE — Weekend Schedule.
 * The point: don't stack all 7 event cards into an endless scroll. A sticky
 * day-selector pages through the week one day at a time (calendar/app pattern),
 * so the guest scans days and drills into one — not an infinite document.
 * Noindex, standalone route.
 */

export default function OurWeekendMobilePage() {
  const [activeKey, setActiveKey] = useState(schedule[0].key);

  // Deep-link support: /our-weekend-mobile?day=fri opens Friday (used by the
  // week view). Read on the client so there's no SSR/Suspense friction.
  useEffect(() => {
    const day = new URLSearchParams(window.location.search).get("day");
    if (day && schedule.some((d) => d.key === day)) setActiveKey(day);
  }, []);

  const activeIndex = schedule.findIndex((d) => d.key === activeKey);
  const day = schedule[activeIndex];
  const event = day.events[0];

  function go(delta: number) {
    const next = Math.min(schedule.length - 1, Math.max(0, activeIndex + delta));
    setActiveKey(schedule[next].key);
  }

  return (
    <div className={styles.frame}>
      {/* ---- Compact header ---- */}
      <header className={styles.head}>
        <a href="/home-mobile" className={styles.back} aria-label="Back to home">
          ←
        </a>
        <div>
          <h1 className={styles.title}>Weekend Schedule</h1>
          <p className={styles.sub}>June 16 – 21, 2027 · Tuscany</p>
        </div>
      </header>

      {/* ---- Day / Week view toggle ---- */}
      <div className={styles.viewToggle} role="tablist" aria-label="Schedule view">
        <span className={`${styles.viewSeg} ${styles.viewSegActive}`} role="tab" aria-selected="true">
          Day
        </span>
        <a href="/our-weekend-mobile/week" className={styles.viewSeg} role="tab" aria-selected="false">
          Week
        </a>
      </div>

      {/* ---- Sticky day selector ---- */}
      <div className={styles.dayBar}>
        {schedule.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setActiveKey(d.key)}
            aria-pressed={d.key === activeKey}
            className={`${styles.dayPill} ${d.key === activeKey ? styles.dayPillActive : ""}`}
          >
            <span className={styles.dayLabel}>{d.label}</span>
            <span className={styles.dayDate}>{d.date.replace(/^\w+ /, "")}</span>
          </button>
        ))}
      </div>

      {/* ---- One day at a time ---- */}
      <main className={styles.main}>
        <p className={styles.dayHeading}>
          {day.dayName} · <span className={styles.dayHeadingDate}>{day.date}</span>
        </p>

        <article className={styles.card}>
          {event.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.photo} alt="" className={styles.cardPhoto} />
          )}
          <div className={styles.cardBody}>
            <h2 className={styles.eventTitle}>{event.title}</h2>
            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <svg viewBox="0 0 24 24" className={styles.metaIcon} fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {formatTimeRange(event.time, event.endTime)}
              </span>
              <span className={styles.metaItem}>
                <svg viewBox="0 0 24 24" className={styles.metaIcon} fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 21c4-3.6 6.5-6.6 6.5-10a6.5 6.5 0 1 0-13 0c0 3.4 2.5 6.4 6.5 10Z" strokeLinejoin="round" />
                  <circle cx="12" cy="11" r="2.2" />
                </svg>
                {event.location}
              </span>
            </div>
            <p className={styles.desc}>{event.description}</p>
          </div>
        </article>

        {/* ---- Pager ---- */}
        <div className={styles.pager}>
          <button
            type="button"
            className={styles.pagerBtn}
            onClick={() => go(-1)}
            disabled={activeIndex === 0}
          >
            ← {activeIndex > 0 ? schedule[activeIndex - 1].dayName : ""}
          </button>
          <button
            type="button"
            className={styles.pagerBtn}
            onClick={() => go(1)}
            disabled={activeIndex === schedule.length - 1}
          >
            {activeIndex < schedule.length - 1 ? schedule[activeIndex + 1].dayName : ""} →
          </button>
        </div>

        <p className={styles.note}>Times are planned and may shift — check back closer to the week.</p>
      </main>

      <MobileNav active="weekend" />
    </div>
  );
}
