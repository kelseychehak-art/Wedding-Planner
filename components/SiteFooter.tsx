import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`page-shell ${styles.inner}`}>
        <p className={styles.line}>We can&rsquo;t wait to celebrate with you!</p>
        <p className={styles.names}>Kelsey &amp; Andrew</p>
      </div>
    </footer>
  );
}
