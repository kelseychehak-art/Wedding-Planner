import styles from "./loading.module.css";

/*
 * Skeleton for every admin page in this group. They're async server components
 * running up to seven Supabase RPCs, so without this a navigation is a blank
 * pause with no indication anything is happening.
 *
 * The shape mirrors the shared page furniture — title, metric strip, toolbar,
 * table — so the layout doesn't jump when the real content arrives.
 */
export default function AdminLoading() {
  return (
    <div className={styles.wrap} aria-busy="true" aria-live="polite">
      <span className={styles.srOnly}>Loading…</span>

      <div className={styles.header}>
        <div>
          <div className={`${styles.bar} ${styles.title}`} />
          <div className={`${styles.bar} ${styles.subtitle}`} />
        </div>
        <div className={`${styles.bar} ${styles.button}`} />
      </div>

      <div className={styles.strip}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div className={styles.metric} key={i}>
            <div className={`${styles.bar} ${styles.metricValue}`} />
            <div className={`${styles.bar} ${styles.metricLabel}`} />
          </div>
        ))}
      </div>

      <div className={styles.toolbar}>
        <div className={`${styles.bar} ${styles.search}`} />
        <div className={`${styles.bar} ${styles.filter}`} />
        <div className={`${styles.bar} ${styles.filter}`} />
      </div>

      <div className={styles.table}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div className={styles.row} key={i}>
            <div className={`${styles.bar} ${styles.cellWide}`} />
            <div className={`${styles.bar} ${styles.cell}`} />
            <div className={`${styles.bar} ${styles.cell}`} />
            <div className={`${styles.bar} ${styles.cell}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
