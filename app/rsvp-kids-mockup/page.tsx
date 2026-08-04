import type { Metadata } from "next";
import styles from "./rsvp-kids-mockup.module.css";

/*
 * MOCKUP ONLY — NOT WIRED TO SUPABASE/RSVP. Visual concept for the per-person
 * RSVP with children handling: each invited person confirmed individually, and
 * children get a kids-menu vs regular-menu choice + dietary field. Static
 * (toggles shown pre-selected to illustrate states). Dolce style. Noindex.
 */

export const metadata: Metadata = {
  title: "RSVP Kids Mockup · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

function Seg({ options, active }: { options: string[]; active: string }) {
  return (
    <span className={styles.seg}>
      {options.map((o) => (
        <span key={o} className={`${styles.segItem} ${o === active ? styles.segOn : ""}`}>
          {o}
        </span>
      ))}
    </span>
  );
}

export default function RsvpKidsMockupPage() {
  return (
    <div className={styles.frame}>
      <div className={styles.wrap}>
        <p className={styles.mockNote}>Mockup — static concept, not wired to the real RSVP</p>

        <p className={styles.eyebrow}>RSVP</p>
        <h1 className={styles.title}>Who&rsquo;s joining?</h1>
        <p className={styles.intro}>
          We found your invitation, <strong>The Rivera Family</strong>. Please confirm each guest
          below.
        </p>

        <div className={styles.card}>
          {/* ---- Adult ---- */}
          <div className={styles.member}>
            <div className={styles.memberTop}>
              <span className={styles.name}>Ana Rivera</span>
              <Seg options={["Coming", "Can’t"]} active="Coming" />
            </div>
          </div>

          {/* ---- Adult ---- */}
          <div className={styles.member}>
            <div className={styles.memberTop}>
              <span className={styles.name}>Marco Rivera</span>
              <Seg options={["Coming", "Can’t"]} active="Coming" />
            </div>
          </div>

          {/* ---- Child, kids menu ---- */}
          <div className={`${styles.member} ${styles.memberChild}`}>
            <div className={styles.memberTop}>
              <span className={styles.name}>
                Sofia Rivera <span className={styles.childTag}>Child · 7</span>
              </span>
              <Seg options={["Coming", "Can’t"]} active="Coming" />
            </div>
            <div className={styles.kidExtras}>
              <div className={styles.kidField}>
                <span className={styles.kidLabel}>Meal</span>
                <Seg options={["Kids menu", "Regular"]} active="Kids menu" />
              </div>
              <div className={styles.kidField}>
                <span className={styles.kidLabel}>Dietary / allergies</span>
                <span className={styles.input}>No nuts</span>
              </div>
              <label className={styles.check}>
                <span className={`${styles.box} ${styles.boxOn}`}>✓</span>
                Highchair needed
              </label>
            </div>
          </div>

          {/* ---- Child, regular menu ---- */}
          <div className={`${styles.member} ${styles.memberChild}`}>
            <div className={styles.memberTop}>
              <span className={styles.name}>
                Leo Rivera <span className={styles.childTag}>Child · 12</span>
              </span>
              <Seg options={["Coming", "Can’t"]} active="Coming" />
            </div>
            <div className={styles.kidExtras}>
              <div className={styles.kidField}>
                <span className={styles.kidLabel}>Meal</span>
                <Seg options={["Kids menu", "Regular"]} active="Regular" />
              </div>
              <div className={styles.kidField}>
                <span className={styles.kidLabel}>Dietary / allergies</span>
                <span className={`${styles.input} ${styles.inputEmpty}`}>None</span>
              </div>
            </div>
          </div>
        </div>

        <button type="button" className={styles.submit}>Send RSVP</button>

        <p className={styles.foot}>
          Menus are being finalized with our venue — we&rsquo;ll follow up to confirm the specific
          dishes closer to the week.
        </p>
      </div>
    </div>
  );
}
