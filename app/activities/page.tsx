import type { Metadata } from "next";
import ContentPageFrame from "@/components/ContentPageFrame";
import Illustration, { type IllustrationName } from "@/components/Illustration";
import UiIcon, { type UiIconName } from "@/components/UiIcon";
import { schedule, formatTimeRange } from "@/data/schedule";
import c from "@/components/gridCards.module.css";
import a from "./activities.module.css";

export const metadata: Metadata = {
  title: "Activities · Kelsey & Andrew's Wedding Week",
  description:
    "The planned activities and experiences for Kelsey & Andrew's wedding week in Tuscany, plus ideas for exploring on your own.",
};

// Badge per event (RSVP requirement) — keyed by schedule day.
const BADGES: Record<string, { label: string; tone: "terra" | "olive" }> = {
  mon: { label: "Requires RSVP", tone: "terra" },
  tue: { label: "Requires RSVP", tone: "terra" },
  wed: { label: "Requires RSVP", tone: "terra" },
  thu: { label: "No RSVP Needed", tone: "olive" },
  fri: { label: "Optional", tone: "olive" },
  sat: { label: "No RSVP Needed", tone: "olive" },
};

const LEGEND: { icon: UiIconName; title: string; body: string }[] = [
  { icon: "bookmark", title: "Requires RSVP", body: "Please sign up so we can plan accordingly." },
  { icon: "check", title: "You're Attending", body: "Thanks! We can't wait to see you there." },
  { icon: "calendar", title: "No RSVP Needed", body: "Just come ready for a great time!" },
  { icon: "sparkle", title: "Optional", body: "Join if you'd like — no pressure either way." },
];

const THINGS: { name: string; desc: string; icon: IllustrationName }[] = [
  { name: "Explore Local Towns", desc: "Visit nearby towns like Montepulciano, Montalcino, and Pienza.", icon: "arch" },
  { name: "Hike & Nature Walks", desc: "Scenic trails and breathtaking views are everywhere.", icon: "cypress" },
  { name: "Wellness & Relaxation", desc: "Book a spa treatment or enjoy quiet time by the pool.", icon: "lemonBranch" },
  { name: "Golf", desc: "Beautiful courses just a short drive from the villa.", icon: "compass" },
  { name: "Art & Culture", desc: "Museums, galleries, and historic sites to explore.", icon: "villa" },
  { name: "Shop & Sip", desc: "Boutiques, local markets, and wine bars for a slow afternoon.", icon: "wineGlass" },
];

export default function ActivitiesPage() {
  return (
    <ContentPageFrame
      title="Activities & Experiences"
      subtitle="Join us for a week filled with unforgettable moments."
      footerLine="We can't wait to share this week with you!"
    >
      {/* ---------- Planned activities ---------- */}
      <div className={c.sectionHead}>
        <UiIcon name="clipboard" size={24} />
        <h2 className={c.sectionTitle}>Planned Activities</h2>
      </div>
      <p className={c.sectionIntro}>
        These are the events we&rsquo;re planning for our week together. Sign up for the ones
        you&rsquo;d like to join!
      </p>

      <div className={a.grid}>
        {schedule.map((day) => {
          const ev = day.events[0];
          const badge = BADGES[day.key];
          return (
            <article key={day.key} className={a.card}>
              <div className={a.photoWrap}>
                {ev.photo && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={ev.photo} alt="" className={a.photo} loading="lazy" />
                )}
                <span
                  className={`${a.badge} ${badge.tone === "terra" ? a.badgeTerra : a.badgeOlive}`}
                >
                  {badge.label}
                </span>
              </div>
              <div className={a.body}>
                <p className={a.date}>
                  {day.dayName} · {day.date}
                </p>
                <h3 className={a.title}>{ev.title}</h3>
                <div className={a.meta}>
                  <span className={a.metaRow}>
                    <UiIcon name="pin" size={15} />
                    {ev.location}
                  </span>
                  <span className={a.metaRow}>
                    <UiIcon name="clock" size={15} />
                    {formatTimeRange(ev.time, ev.endTime)}
                  </span>
                </div>
                <p className={a.desc}>{ev.description}</p>
                <div className={a.control}>
                  <a href="/rsvp" className="btn-outline">
                    Sign Up
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* ---------- Legend ---------- */}
      <div className={c.blockGap}>
        <div className={a.legend}>
          {LEGEND.map((l) => (
            <div key={l.title} className={a.legendItem}>
              <UiIcon name={l.icon} size={20} className={a.legendIcon} />
              <span>
                <span className={a.legendTitle}>{l.title}</span>
                <br />
                <span className={a.legendBody}>{l.body}</span>
              </span>
            </div>
          ))}
        </div>
        <div className={a.legendCta}>
          <a href="/our-weekend" className="btn-outline">
            View Full Schedule →
          </a>
        </div>
      </div>

      {/* ---------- Things to do on your own ---------- */}
      <div className={c.blockGap}>
        <div className={c.sectionHead}>
          <Illustration name="bicycle" size={26} />
          <h2 className={c.sectionTitle}>Things to Do (On Your Own)</h2>
        </div>
        <p className={c.sectionIntro}>Some ideas for exploring the area in your free time.</p>

        <div className={a.mini}>
          {THINGS.map((t) => (
            <div key={t.name} className={a.miniCard}>
              <Illustration name={t.icon} size={38} className={a.miniIcon} />
              <span>
                <span className={a.miniName}>{t.name}</span>
                <span className={a.miniDesc}>{t.desc}</span>
              </span>
              <UiIcon name="chevron" size={16} className={a.miniChevron} />
            </div>
          ))}
        </div>
      </div>
    </ContentPageFrame>
  );
}
