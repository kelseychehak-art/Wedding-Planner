"use client";

import { useState } from "react";
import { dolce as d } from "@/components/mobileproto/DolcePage";
import EventDrawer from "@/components/mobileproto/EventDrawer";
import { schedule, formatTimeRange, type ScheduleEvent } from "@/data/schedule";

/*
 * Desktop presentation of the week — every day at once, events as chips in the
 * grid. Chips are clickable and open the shared EventDrawer with the fuller
 * detail (dress code, what to bring, good-to-knows). Client counterpart to the
 * static agenda; used on the desktop half of /our-weekend.
 */
export default function WeekendAgenda() {
  const [selected, setSelected] = useState<ScheduleEvent | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>("");

  function open(ev: ScheduleEvent, dayName: string) {
    setSelected(ev);
    setSelectedDay(dayName);
  }

  return (
    <>
      <section className={d.section}>
        <div className={d.agenda}>
          {schedule.map((day) => (
            <article key={day.key} className={d.agendaRow}>
              <div>
                <p className={d.agendaDate}>{day.date}</p>
                <h3 className={d.agendaName}>{day.dayName}</h3>
              </div>
              <div className={d.agendaEvents}>
                {day.events.map((ev, i) => (
                  <div
                    key={i}
                    className={d.evChip}
                    role="button"
                    tabIndex={0}
                    aria-label={`${ev.title} — view details`}
                    onClick={() => open(ev, day.dayName)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        open(ev, day.dayName);
                      }
                    }}
                  >
                    <span className={d.evTitle}>{ev.title}</span>
                    <span className={d.evMeta}>{formatTimeRange(ev.time, ev.endTime)}</span>
                    <span className={d.evLoc}>{ev.location}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className={d.lead} style={{ textAlign: "center", marginTop: 28 }}>
        Times are planned and may shift — check back closer to the week.
      </p>

      <p className={d.sign}>Sarà indimenticabile</p>
      <p className={d.signSub}>It&rsquo;ll be unforgettable</p>

      <EventDrawer event={selected} dayName={selectedDay} onClose={() => setSelected(null)} />
    </>
  );
}
