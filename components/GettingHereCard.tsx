import Image from "next/image";
import styles from "./GettingHereCard.module.css";

export default function GettingHereCard() {
  return (
    <div className={styles.card}>
      <div className={styles.text}>
        <p className={styles.eyebrow}>Getting Here</p>
        <h3 className={styles.heading}>Planning the Trip</h3>
        <p className={styles.body}>
          Flights, transportation, and travel tips to make your journey to Italy
          feel seamless.
        </p>
        <a href="/travel" className={styles.link}>
          View Travel Guide <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
      <div className={styles.photo}>
        <Image
          src="/assets/photos/cypress-drive.jpg"
          alt="A cypress-lined gravel drive winding through the Tuscan countryside"
          fill
          sizes="(max-width: 767px) 100vw, 340px"
          className={styles.photoImg}
        />
      </div>
    </div>
  );
}
