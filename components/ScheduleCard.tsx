"use client";

import { useState } from "react";
import styles from "./ScheduleCard.module.css";
import { schedule, SCHEDULE_ICON_SRC, DEFAULT_SCHEDULE_DAY } from "@/data/schedule";

export default function ScheduleCard({ showButton = true }: { showButton?: boolean }) {
  const [activeKey, setActiveKey] = useState(DEFAULT_SCHEDULE_DAY);
  const activeDay = schedule.find((d) => d.key === activeKey) ?? schedule[0];

  return (
    <div className={styles.card}>
      <h3 className={styles.heading}>Weekend Schedule</h3>

      <div className={styles.dateTabs} role="tablist" aria-label="Schedule day">
        {schedule.map((day) => (
          <button
            key={day.key}
            type="button"
            role="tab"
            aria-selected={day.key === activeKey}
            className={`${styles.dateTab} ${
              day.key === activeKey ? styles.dateTabActive : ""
            }`}
            onClick={() => setActiveKey(day.key)}
          >
            {day.label}
          </button>
        ))}
      </div>

      <div className={styles.rows}>
        {activeDay.events.length === 0 ? (
          <p className={styles.emptyDay}>
            Details for {activeDay.dayName} are coming soon.
          </p>
        ) : (
          activeDay.events.map((row) => (
            <div className={styles.row} key={row.title}>
              <span className={styles.rowTime}>{row.time}</span>
              <span className={styles.rowBody}>
                <span className={styles.rowTitle}>{row.title}</span>
                <span className={styles.rowLocation}>{row.location}</span>
              </span>
              <img src={SCHEDULE_ICON_SRC[row.icon]} alt="" className={styles.rowIcon} />
            </div>
          ))
        )}
      </div>

      {showButton && (
        <a href="/our-weekend" className={`btn-outline ${styles.button}`}>
          View Full Schedule
        </a>
      )}
    </div>
  );
}
