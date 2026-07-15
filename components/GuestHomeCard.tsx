import styles from "./GuestHomeCard.module.css";

const TASKS = [
  {
    title: "RSVP",
    description: "Please reply by April 1",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 6h16v13H4z" strokeLinejoin="round" />
        <path d="m4 6 8 7 8-7" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Submit Travel Info",
    description: "Let us know your flight details",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 15 20 5c1-.6 2 .3 1.5 1.4L14 21c-.5 1-1.8.9-2.1-.2L10 14l-6.6-2.9c-1.1-.4-1.1-1.7.1-2.1Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Choose Activities",
    description: "Pick what you're excited for",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5 10.5 15 16 9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Review Itinerary",
    description: "See the full week at a glance",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="4" width="16" height="16" rx="1" />
        <path d="M4 9h16" />
        <path d="M8 3v3M16 3v3" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function GuestHomeCard({ guestName }: { guestName: string }) {
  return (
    <div className={styles.card}>
      <p className={styles.label}>Guest Home (My Trip)</p>
      <h3 className={styles.greeting}>Ciao, {guestName}!</h3>
      <p className={styles.subLabel}>Here&rsquo;s what&rsquo;s next</p>

      <div className={styles.taskList}>
        {TASKS.map((task) => (
          <a href="#" className={styles.task} key={task.title}>
            <span className={styles.taskIcon}>{task.icon}</span>
            <span className={styles.taskBody}>
              <span className={styles.taskTitle}>{task.title}</span>
              <span className={styles.taskDescription}>{task.description}</span>
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={styles.taskArrow}
              aria-hidden="true"
            >
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
