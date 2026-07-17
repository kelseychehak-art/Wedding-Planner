import ScallopFrame from "./ScallopFrame";
import Illustration from "./Illustration";
import { siteContent } from "@/data/siteContent";
import styles from "./RsvpTeaserCard.module.css";

export default function RsvpTeaserCard() {
  return (
    <div className={styles.card}>
      <ScallopFrame color="var(--color-sky-blue)" />
      <div className={styles.inner}>
        <div className={styles.headingRow}>
          <h3 className={styles.heading}>Kindly Respond</h3>
          <Illustration name="heart" tone="terracotta" size={16} />
        </div>
        <p className={styles.deadline}>{siteContent.wedding.rsvpDeadlineLabel}</p>
        <p className={styles.body}>
          We can&rsquo;t wait to celebrate with you in Italy.
        </p>
        <a href="/rsvp" className={`btn-blue ${styles.button}`}>
          RSVP
        </a>
      </div>
    </div>
  );
}
