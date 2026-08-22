import { schedule, formatTimeRange } from "@/data/schedule";
import ShowcaseBottomNav from "./ShowcaseBottomNav";
import ShowcaseMenu from "./ShowcaseMenu";
import s from "./ShowcaseTab.module.css";
import w from "./ShowcaseWeekend.module.css";

/*
 * PREVIEW ONLY (noindex /showcase/weekend) — the Weekend itinerary in the new
 * brand skin. Same day-by-day timeline structure as the live page, but ENRICHED:
 * each day now shows its one-line description + a small olive motif, and the
 * wedding day (Wed) is elevated into a highlighted "The Wedding Day" block.
 * Header band reuses the Travel preview's shell (ShowcaseTab.module.css).
 */

const NAV = [
  { key: "weekend", label: "Our Weekend", href: "/our-weekend" },
  { key: "travel", label: "Travel", href: "/travel" },
  { key: "stay", label: "Stay", href: "/stay" },
  { key: "activities", label: "Activities", href: "/activities" },
  { key: "faq", label: "FAQ", href: "/faq" },
];

export default function ShowcaseWeekend() {
  return (
    <div className={s.page}>
      {/* header band (same shell as Travel) */}
      <section className={s.band}>
        <div className={s.bandVeil} aria-hidden="true" />
        <header className={s.topbar}>
          <a href="/" className={s.brand} aria-label="Home">
            <span className={s.brandSwan} aria-hidden="true" />
            <span className={s.brandInitials}>K &amp; A</span>
          </a>
          <nav className={s.nav} aria-label="Primary">
            {NAV.map((n) => (
              <a
                key={n.key}
                href={n.href}
                className={`${s.navLink} ${n.key === "weekend" ? s.navActive : ""}`}
              >
                {n.label}
              </a>
            ))}
            <a href="/rsvp" className={s.navRsvp}>
              RSVP
            </a>
          </nav>
        </header>
        <ShowcaseMenu />
        <div className={s.bandText}>
          <h1 className={s.title}>Our Weekend</h1>
          <p className={s.sub}>Every event from welcome to farewell.</p>
        </div>
      </section>

      {/* timeline */}
      <div className={w.timeline}>
        {schedule.map((day) => {
          const isWedding = day.events.length > 1;
          return (
            <section
              key={day.key}
              className={`${w.day} ${isWedding ? w.dayWed : ""}`}
            >
              <div className={w.rail}>
                <p className={w.date}>{day.date.replace(" ", " ").toUpperCase()}</p>
                <h2 className={w.dayName}>{day.dayName}</h2>
                {isWedding && <span className={w.wedTag}>The Wedding Day</span>}
              </div>

              <div className={w.events}>
                {day.events.map((e) => (
                  <div key={e.title} className={w.event}>
                    <h3 className={w.evtTitle}>{e.title}</h3>
                    <p className={w.evtMeta}>
                      <span className={w.evtTime}>{formatTimeRange(e.time, e.endTime)}</span>
                      <span className={w.evtDot}>·</span>
                      <span className={w.evtLoc}>{e.location}</span>
                    </p>
                    <p className={w.evtDesc}>{e.description}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* footer */}
      <footer className={w.footer}>
        <p className={w.note}>Times are planned and may shift — check back closer to the week.</p>
        <p className={w.sign}>Sar&agrave; indimenticabile</p>
        <p className={w.signSub}>It&rsquo;ll be unforgettable</p>
      </footer>
      <ShowcaseBottomNav active="weekend" />
    </div>
  );
}
