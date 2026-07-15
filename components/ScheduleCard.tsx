"use client";

import { useState } from "react";
import styles from "./ScheduleCard.module.css";

const DATES = [
  { label: "WED 10", key: "wed" },
  { label: "THU 11", key: "thu" },
  { label: "FRI 12", key: "fri" },
  { label: "SAT 13", key: "sat" },
  { label: "SUN 14", key: "sun" },
  { label: "MON 15", key: "mon" },
];

const ROWS = [
  {
    time: "4:00 PM",
    title: "Ceremony",
    location: "Villa TBD",
    icon: "/assets/illustrations/church.svg",
  },
  {
    time: "5:00 PM",
    title: "Aperitivo",
    location: "On the Lawn",
    icon: "/assets/illustrations/cocktail.svg",
  },
  {
    time: "7:00 PM",
    title: "Dinner & Dancing",
    location: "Under the Stars",
    icon: "/assets/illustrations/music.svg",
  },
];

export default function ScheduleCard() {
  const [activeDate, setActiveDate] = useState("sat");

  return (
    <div className={styles.card}>
      <h3 className={styles.heading}>Weekend Schedule</h3>

      <div className={styles.dateTabs}>
        {DATES.map((date) => (
          <button
            key={date.key}
            type="button"
            className={`${styles.dateTab} ${
              date.key === activeDate ? styles.dateTabActive : ""
            }`}
            onClick={() => setActiveDate(date.key)}
          >
            {date.label}
          </button>
        ))}
      </div>

      <div className={styles.rows}>
        {ROWS.map((row) => (
          <div className={styles.row} key={row.title}>
            <span className={styles.rowTime}>{row.time}</span>
            <span className={styles.rowBody}>
              <span className={styles.rowTitle}>{row.title}</span>
              <span className={styles.rowLocation}>{row.location}</span>
            </span>
            <img src={row.icon} alt="" className={styles.rowIcon} />
          </div>
        ))}
      </div>

      <a href="#our-weekend" className={`btn-outline ${styles.button}`}>
        View Full Schedule
      </a>
    </div>
  );
}
