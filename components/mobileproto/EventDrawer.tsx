"use client";

import { useEffect } from "react";
import { formatTimeRange, type ScheduleEvent } from "@/data/schedule";
import styles from "./EventDrawer.module.css";

/*
 * Event detail drawer — opens when a schedule event is tapped. Bottom sheet on
 * a phone, right-side drawer on wider screens. Shows the fuller logistics
 * (dress code, what to bring, good-to-knows). Detail labels use the cornflower
 * informational accent; the title stays warm.
 */
export default function EventDrawer({
  event,
  dayName,
  onClose,
}: {
  event: ScheduleEvent | null;
  dayName?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!event) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // lock background scroll while open
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={`${event.title} details`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className={styles.handle} aria-hidden="true" />

        {event.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.photo} alt="" className={styles.photo} />
        )}

        <div className={styles.body}>
          {dayName && <p className={styles.kicker}>{dayName}</p>}
          <h2 className={styles.title}>{event.title}</h2>

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

          {event.dressCode && (
            <div className={styles.detail}>
              <p className={styles.detailLabel}>Dress code</p>
              <p className={styles.detailText}>{event.dressCode}</p>
            </div>
          )}

          {event.bring && event.bring.length > 0 && (
            <div className={styles.detail}>
              <p className={styles.detailLabel}>What to bring</p>
              <ul className={styles.bringList}>
                {event.bring.map((b, i) => (
                  <li key={i} className={styles.bringItem}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {event.note && (
            <div className={styles.detail}>
              <p className={styles.detailLabel}>Good to know</p>
              <p className={styles.detailText}>{event.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
