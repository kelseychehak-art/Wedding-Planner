import styles from "./PageHeader.module.css";
import { OliveSprig } from "./icons";

/*
 * Shared admin page header: serif display title in forest green, muted
 * subtitle, decorative olive sprig, and a right-aligned action slot.
 * Matches the approved admin mockups' header treatment.
 */
export default function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className={styles.header}>
      <div className={styles.titleBlock}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{title}</h1>
          <OliveSprig size={46} className={styles.sprig} />
        </div>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </header>
  );
}
