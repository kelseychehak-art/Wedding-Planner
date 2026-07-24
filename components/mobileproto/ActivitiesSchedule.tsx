"use client";

import { useState } from "react";
import { dolce as d } from "@/components/mobileproto/DolcePage";
import EventDrawer from "@/components/mobileproto/EventDrawer";
import {
  schedule,
  formatTimeRange,
  type ScheduleEvent,
  type ScheduleIcon,
} from "@/data/schedule";

/*
 * Activities "On the schedule" grid — the planned experiences (which are the
 * schedule events). Each tile is clickable and opens the shared EventDrawer with
 * the fuller detail plus, for anything that needs a headcount, a "Count me in"
 * CTA that routes to the RSVP page (per-activity sign-up itself is deferred to
 * the future guest system).
 */

const ACTIVITY_PHOTO: Partial<Record<ScheduleIcon, string>> = {
  dinner: "/assets/activities/italian-table.jpg",
  wine: "/assets/activities/wine-tasting.jpg",
  cooking: "/assets/activities/pizza-making.jpg",
  pool: "/assets/activities/pool-day.jpg",
  party: "/assets/activities/after-party.jpg",
};
const TITLE_PHOTO: Record<string, string> = {
  "Farewell Party": "/assets/activities/aperitivo.jpg",
};
const BADGE: Record<string, { label: string; cls: string }> = {
  mon: { label: "Requires RSVP", cls: d.badgeTerra },
  tue: { label: "Requires RSVP", cls: d.badgeTerra },
  wed: { label: "Requires RSVP", cls: d.badgeTerra },
  thu: { label: "No RSVP Needed", cls: d.badgeOlive },
  fri: { label: "Optional", cls: d.badgeOlive },
  sat: { label: "No RSVP Needed", cls: d.badgeOlive },
};

type ActivityEvent = ScheduleEvent & { dayKey: string; dayName: string };

export default function ActivitiesSchedule() {
  const [selected, setSelected] = useState<ActivityEvent | null>(null);

  const events: ActivityEvent[] = schedule.flatMap((day) =>
    day.events.map((ev) => ({ ...ev, dayKey: day.key, dayName: day.dayName })),
  );

  const needsRsvp = (dayKey: string) => BADGE[dayKey]?.label !== "No RSVP Needed";

  return (
    <section className={d.section}>
      <p className={d.sectionLabel}>Planned together</p>
      <h2 className={d.sectionTitle}>On the schedule</h2>
      <div className={d.cardGrid}>
        {events.map((ev, i) => {
          const photo = TITLE_PHOTO[ev.title] ?? ACTIVITY_PHOTO[ev.icon] ?? ev.photo;
          const badge = BADGE[ev.dayKey];
          return (
            <article
              key={i}
              className={d.cCard}
              role="button"
              tabIndex={0}
              aria-label={`${ev.title} — view details`}
              onClick={() => setSelected(ev)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(ev);
                }
              }}
            >
              {photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" className={d.cCardPhoto} />
              )}
              <div className={d.cCardBody}>
                {badge && <span className={`${d.badge} ${badge.cls}`}>{badge.label}</span>}
                <h3 className={d.cCardTitle}>{ev.title}</h3>
                <span className={d.cCardMeta}>
                  {ev.dayName} · {formatTimeRange(ev.time, ev.endTime)}
                </span>
                <p className={d.cCardText}>{ev.description}</p>
                <span className={d.detailsHint} aria-hidden="true">
                  View details →
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <EventDrawer
        event={selected}
        dayName={selected?.dayName}
        ctaHref={selected && needsRsvp(selected.dayKey) ? "/rsvp" : undefined}
        ctaLabel={selected && needsRsvp(selected.dayKey) ? "Count me in — RSVP" : undefined}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
