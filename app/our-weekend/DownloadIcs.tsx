"use client";

import { schedule } from "@/data/schedule";

/** Parses "6:00 PM" → { h: 18, min: 0 } (floating local time). */
function parseTime(t: string): { h: number; min: number } {
  const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return { h: 0, min: 0 };
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ap = m[3].toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return { h, min };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** ICS text escaping for SUMMARY/LOCATION/DESCRIPTION values. */
const esc = (s: string) =>
  s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");

function buildIcs(): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kelsey & Andrew//Wedding Week//EN",
    "CALSCALE:GREGORIAN",
  ];
  // Days run Mon–Sat, June 16–21 2027 (matches the schedule order).
  schedule.forEach((day, i) => {
    const ymd = `202706${pad(16 + i)}`;
    day.events.forEach((ev, j) => {
      const s = parseTime(ev.time);
      const e = ev.endTime ? parseTime(ev.endTime) : { h: s.h + 2, min: s.min };
      const dtStart = `${ymd}T${pad(s.h)}${pad(s.min)}00`;
      const dtEnd = `${ymd}T${pad(e.h)}${pad(e.min)}00`;
      lines.push(
        "BEGIN:VEVENT",
        `UID:kaw-${day.key}-${j}@chehakshultswedding.com`,
        `DTSTAMP:${dtStart}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${esc(ev.title)}`,
        `LOCATION:${esc(ev.location)}`,
        `DESCRIPTION:${esc(ev.description)}`,
        "END:VEVENT",
      );
    });
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export default function DownloadIcs({ className }: { className?: string }) {
  const onClick = () => {
    const blob = new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kelsey-andrew-wedding-week.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <button type="button" onClick={onClick} className={className}>
      Download ICS
    </button>
  );
}
