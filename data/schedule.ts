// Weekend schedule content. Mock/placeholder day + events until the venue and
// final itinerary are set. Icons map to SVGs in /public/assets/illustrations.

export type ScheduleIcon = "villa" | "wine" | "music";

export type ScheduleEvent = {
  time: string;
  title: string;
  location: string;
  icon: ScheduleIcon;
};

export type ScheduleDay = {
  key: string;
  label: string; // short tab label
  dayName: string; // full heading
  events: ScheduleEvent[];
};

export const SCHEDULE_ICON_SRC: Record<ScheduleIcon, string> = {
  villa: "/assets/illustrations/church.svg",
  wine: "/assets/illustrations/cocktail.svg",
  music: "/assets/illustrations/music.svg",
};

// The celebration spans several days; details fill in as we confirm the venue.
export const schedule: ScheduleDay[] = [
  { key: "wed", label: "WED", dayName: "Wednesday", events: [] },
  { key: "thu", label: "THU", dayName: "Thursday", events: [] },
  { key: "fri", label: "FRI", dayName: "Friday", events: [] },
  {
    key: "sat",
    label: "SAT",
    dayName: "Saturday",
    events: [
      { time: "4:00 PM", title: "Ceremony", location: "Villa TBD", icon: "villa" },
      { time: "5:00 PM", title: "Aperitivo", location: "On the Lawn", icon: "wine" },
      { time: "7:00 PM", title: "Dinner & Dancing", location: "Under the Stars", icon: "music" },
    ],
  },
  { key: "sun", label: "SUN", dayName: "Sunday", events: [] },
  { key: "mon", label: "MON", dayName: "Monday", events: [] },
];

export const DEFAULT_SCHEDULE_DAY = "sat";
