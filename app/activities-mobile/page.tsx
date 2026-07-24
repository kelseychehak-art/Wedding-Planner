import type { Metadata } from "next";
import DolcePage, { dolce as d } from "@/components/mobileproto/DolcePage";
import { schedule, formatTimeRange, type ScheduleIcon } from "@/data/schedule";

/*
 * MOBILE-NATIVE PROTOTYPE — Activities, "Dolce" art direction.
 * Planned activities pulled from the schedule (stays in sync), shown as photo
 * cards using Kelsey's Unsplash set, plus a "Things to Do on your own" list.
 * Noindex, standalone route.
 */

export const metadata: Metadata = {
  title: "Activities (Dolce) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

// Kelsey's cropped Unsplash photos, mapped by the event's semantic icon.
const ACTIVITY_PHOTO: Partial<Record<ScheduleIcon, string>> = {
  dinner: "/assets/activities/italian-table.jpg",
  wine: "/assets/activities/wine-tasting.jpg",
  cooking: "/assets/activities/pizza-making.jpg",
  pool: "/assets/activities/pool-day.jpg",
  party: "/assets/activities/after-party.jpg",
};
// Per-title overrides where the icon isn't specific enough.
const TITLE_PHOTO: Record<string, string> = {
  "Farewell Party": "/assets/activities/aperitivo.jpg",
};

// RSVP expectation per day (mirrors the desktop Activities badges).
const BADGE: Record<string, { label: string; cls: string }> = {
  mon: { label: "Requires RSVP", cls: d.badgeTerra },
  tue: { label: "Requires RSVP", cls: d.badgeTerra },
  wed: { label: "Requires RSVP", cls: d.badgeTerra },
  thu: { label: "No RSVP Needed", cls: d.badgeOlive },
  fri: { label: "Optional", cls: d.badgeOlive },
  sat: { label: "No RSVP Needed", cls: d.badgeOlive },
};

const THINGS = [
  { name: "Explore Local Towns", desc: "Montepulciano, Montalcino, and Pienza are all close by." },
  { name: "Hike & Nature Walks", desc: "Scenic trails and long countryside views everywhere you look." },
  { name: "Wellness & Relaxation", desc: "Book a spa treatment or claim a quiet chair by the pool." },
  { name: "Golf", desc: "Beautiful courses a short drive from the villa." },
  { name: "Art & Culture", desc: "Museums, galleries, and historic sites to wander." },
  { name: "Shop & Sip", desc: "Boutiques, local markets, and wine bars for a slow afternoon." },
];

export default function ActivitiesMobilePage() {
  const events = schedule.flatMap((day) =>
    day.events.map((ev) => ({ ...ev, dayKey: day.key, dayName: day.dayName, date: day.date }))
  );

  return (
    <DolcePage
      eyebrow="The week"
      title="Activities"
      subtitle="Everything we've planned — come to it all, or pick your moments."
      active=""
    >
      <section className={d.section}>
        <p className={d.sectionLabel}>Planned together</p>
        <h2 className={d.sectionTitle}>On the schedule</h2>

        {events.map((ev, i) => {
          const photo = TITLE_PHOTO[ev.title] ?? ACTIVITY_PHOTO[ev.icon] ?? ev.photo;
          const badge = BADGE[ev.dayKey];
          return (
            <article key={i} className={d.imgCard}>
              {photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" className={d.imgCardPhoto} />
              )}
              <div className={d.imgCardBody}>
                {badge && <span className={`${d.badge} ${badge.cls}`}>{badge.label}</span>}
                <div className={d.imgCardTop}>
                  <h3 className={d.imgCardTitle}>{ev.title}</h3>
                  <span className={d.imgCardMeta}>
                    {ev.dayName} · {formatTimeRange(ev.time, ev.endTime)}
                  </span>
                </div>
                <p className={d.imgCardText}>{ev.description}</p>
              </div>
            </article>
          );
        })}
      </section>

      <section className={d.section}>
        <p className={d.sectionLabel}>On your own</p>
        <h2 className={d.sectionTitle}>Things to do</h2>
        {THINGS.map((t) => (
          <div key={t.name} className={d.row}>
            <span className={d.rowText}>
              <strong>{t.name}</strong>
              <br />
              <span className={d.rowNote}>{t.desc}</span>
            </span>
          </div>
        ))}
      </section>

      <p className={d.sign}>Non vediamo l&rsquo;ora</p>
      <p className={d.signSub}>We can&rsquo;t wait</p>
    </DolcePage>
  );
}
