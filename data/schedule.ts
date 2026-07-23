// Weekend schedule content — Mon–Sat, June 16–21 2027 (docs/pages/our-weekend.md).
// Venue + exact timings still officially TBD; treat times as planned.
// `icon` is a semantic key mapped to an Illustration name in ScheduleCard /
// the Our Weekend timeline. Photos are [SWAP] placeholders.

export type ScheduleIcon =
  | "dinner"
  | "wine"
  | "cooking"
  | "pool"
  | "town"
  | "party";

export type ScheduleEvent = {
  time: string; // start, e.g. "6:00 PM"
  endTime?: string; // e.g. "9:00 PM"
  title: string;
  description: string;
  location: string;
  icon: ScheduleIcon;
  photo?: string; // [SWAP] interim countryside photo
};

export type ScheduleDay = {
  key: string;
  label: string; // short tab label, e.g. "MON"
  dayName: string; // full heading, e.g. "Monday"
  date: string; // e.g. "Jun 16"
  events: ScheduleEvent[];
};

// The week at a glance — one headline event per day.
export const schedule: ScheduleDay[] = [
  {
    key: "mon",
    label: "MON",
    dayName: "Monday",
    date: "Jun 16",
    events: [
      {
        time: "6:00 PM",
        endTime: "9:00 PM",
        title: "Welcome Dinner",
        description:
          "Kick off the week with a relaxed welcome dinner at the villa — good food, great company, and the first of many toasts.",
        location: "Villa Courtyard",
        icon: "dinner",
        photo: "/assets/photos/villa-lawn.jpg",
      },
    ],
  },
  {
    key: "tue",
    label: "TUE",
    dayName: "Tuesday",
    date: "Jun 17",
    events: [
      {
        time: "4:00 PM",
        endTime: "6:30 PM",
        title: "Wine Tasting",
        description:
          "Spend an afternoon at a local vineyard tasting the best of Tuscany, with long views out over the vines.",
        location: "Local Vineyard",
        icon: "wine",
        photo: "/assets/photos/olive-hills.jpg",
      },
    ],
  },
  {
    key: "wed",
    label: "WED",
    dayName: "Wednesday",
    date: "Jun 18",
    // The wedding day — ceremony, reception & dinner, then the after party.
    // Times, venues and details are placeholders (officially TBD).
    events: [
      {
        time: "4:00 PM",
        endTime: "4:45 PM",
        title: "The Ceremony",
        description:
          "The moment we've been waiting for — we say “I do” in the garden, surrounded by everyone we love.",
        location: "Villa Garden",
        icon: "party",
        photo: "/assets/photos/cypress-drive.jpg",
      },
      {
        time: "5:30 PM",
        endTime: "9:00 PM",
        title: "Reception & Dinner",
        description:
          "Cocktails, a long Tuscan dinner under the open sky, heartfelt toasts, and the first dances of the night.",
        location: "Villa Terrace",
        icon: "dinner",
        photo: "/assets/photos/villa-lawn.jpg",
      },
      {
        time: "9:00 PM",
        endTime: "1:00 AM",
        title: "After Party",
        description:
          "Keep the celebration going late — music, dancing, and a nightcap to remember under the stars.",
        location: "The Cellar",
        icon: "wine",
        photo: "/assets/photos/olive-hills.jpg",
      },
    ],
  },
  {
    key: "thu",
    label: "THU",
    dayName: "Thursday",
    date: "Jun 19",
    events: [
      {
        time: "12:00 PM",
        endTime: "4:00 PM",
        title: "Pool Day & Lunch",
        description:
          "Relax, swim, and soak up the sun. Lunch served poolside — no agenda, just downtime.",
        location: "Villa Pool",
        icon: "pool",
        photo: "/assets/photos/villa-lawn.jpg",
      },
    ],
  },
  {
    key: "fri",
    label: "FRI",
    dayName: "Friday",
    date: "Jun 20",
    events: [
      {
        time: "3:00 PM",
        endTime: "8:00 PM",
        title: "Town Excursion",
        description:
          "Explore a charming hill town with shopping, aperitivo, and dinner in the piazza.",
        location: "Nearby Hill Town",
        icon: "town",
        photo: "/assets/photos/olive-hills.jpg",
      },
    ],
  },
  {
    key: "sat",
    label: "SAT",
    dayName: "Saturday",
    date: "Jun 21",
    events: [
      {
        time: "7:00 PM",
        endTime: "11:00 PM",
        title: "Farewell Party",
        description:
          "Our last night together! Dinner, dancing, and memories to last a lifetime.",
        location: "Under the Stars",
        icon: "party",
        photo: "/assets/photos/cypress-drive.jpg",
      },
    ],
  },
];

export const DEFAULT_SCHEDULE_DAY = "mon";

/** Formats "6:00 PM" + "9:00 PM" → "6:00 – 9:00 PM" (collapses a shared meridiem). */
export function formatTimeRange(time: string, endTime?: string): string {
  if (!endTime) return time;
  const m = time.match(/\s?(AM|PM)$/i);
  const endM = endTime.match(/\s?(AM|PM)$/i);
  if (m && endM && m[1].toUpperCase() === endM[1].toUpperCase()) {
    return `${time.replace(/\s?(AM|PM)$/i, "")} – ${endTime}`;
  }
  return `${time} – ${endTime}`;
}
