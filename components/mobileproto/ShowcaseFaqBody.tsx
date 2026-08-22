import { GROUPS } from "./tabs";
import styles from "./ShowcaseFaqBody.module.css";

/*
 * PREVIEW ONLY — FAQ body re-skinned for the new direction: each group is an
 * ivory card floating on the painting, accordion items with a wine +/− toggle.
 * Reuses the real FAQ data (GROUPS from tabs.tsx). Live /faq is untouched.
 */
export default function ShowcaseFaqBody() {
  return (
    <>
      <div className={styles.grid}>
        {GROUPS.map((g) => (
          <section key={g.title} className={styles.group}>
            <h2 className={styles.groupTitle}>{g.title}</h2>
            {g.qa.map((item) => (
              <details key={item.q} className={styles.item}>
                <summary className={styles.q}>
                  <span>{item.q}</span>
                  <span className={styles.plus} aria-hidden="true" />
                </summary>
                <p className={styles.a}>{item.a}</p>
              </details>
            ))}
          </section>
        ))}
      </div>

      <p className={styles.sign}>A presto</p>
      <p className={styles.signSub}>See you soon</p>
    </>
  );
}
