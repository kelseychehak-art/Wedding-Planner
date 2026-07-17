import styles from "./GuestHomeCard.module.css";

// Placeholder for the future personalized guest dashboard. For now it's a
// generic "start here" orientation panel with real links; once guest identity
// exists, the greeting + rows become personalized.

const TASKS = [
  {
    title: "RSVP",
    description: "Let us know you'll be there",
    href: "/rsvp",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 6h16v13H4z" strokeLinejoin="round" />
        <path d="m4 6 8 7 8-7" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Plan Your Travel",
    description: "Flights and getting here",
    href: "/travel",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 15 20 5c1-.6 2 .3 1.5 1.4L14 21c-.5 1-1.8.9-2.1-.2L10 14l-6.6-2.9c-1.1-.4-1.1-1.7.1-2.1Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Where You'll Stay",
    description: "Villa details and rooms",
    href: "/stay",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 11 12 4l8 7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 10v9h12v-9" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Read the FAQ",
    description: "Answers to common questions",
    href: "/faq",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.5v.4" strokeLinecap="round" />
        <path d="M12 17h.01" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function GuestHomeCard({ guestName }: { guestName?: string }) {
  return (
    <div className={styles.card}>
      <p className={styles.label}>Your Trip</p>
      <h3 className={styles.greeting}>Ciao{guestName ? `, ${guestName}` : ""}!</h3>
      <p className={styles.subLabel}>What to do next</p>

      <div className={styles.taskList}>
        {TASKS.map((task) => (
          <a href={task.href} className={styles.task} key={task.title}>
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
