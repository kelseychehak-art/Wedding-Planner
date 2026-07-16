"use client";

import { useState } from "react";
import styles from "./ScheduleCard.module.css";
import Illustration, { type IllustrationName } from "./Illustration";
import ScallopFrame from "./ScallopFrame";
import { schedule, DEFAULT_SCHEDULE_DAY, type ScheduleIcon } from "@/data/schedule";

const ICON_NAME: Record<ScheduleIcon, IllustrationName> = {
  villa: "villa",
  wine: "wineGlass",
  music: "music",
};

export default function ScheduleCard({ showButton = true }: { showButton?: boolean }) {
  const [activeKey, setActiveKey] = useState(DEFAULT_SCHEDULE_DAY);
  const activeDay = schedule.find((d) => d.key === activeKey) ?? schedule[0];

  return (
    <div className={styles.card}>
      <ScallopFrame color="var(--color-terracotta)" />
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
              <Illustration name={ICON_NAME[row.icon]} size={20} className={styles.rowIcon} />
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
