import styles from "./SiteFooter.module.css";
import Illustration from "./Illustration";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`page-shell ${styles.inner}`}>
        <Illustration name="oliveBranch" tone="cream" size={54} className={styles.flourish} />
        <p className={styles.line}>We can&rsquo;t wait to celebrate with you!</p>
        <p className={styles.names}>Kelsey &amp; Andrew</p>
      </div>
    </footer>
  );
}
