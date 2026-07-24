import type { Metadata } from "next";
import DolcePage, { dolce as d } from "@/components/mobileproto/DolcePage";
import styles from "./faq-mobile.module.css";

/*
 * MOBILE-NATIVE PROTOTYPE — FAQ, "Dolce" art direction.
 * Native <details> accordions (no JS), grouped by topic. Noindex.
 */

export const metadata: Metadata = {
  title: "FAQ (Dolce) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

const GROUPS: { title: string; qa: { q: string; a: string }[] }[] = [
  {
    title: "The Basics",
    qa: [
      { q: "What are the dates?", a: "June 16–21, 2027 — a full week of celebrations in the Tuscan countryside." },
      { q: "Where is the wedding?", a: "Tuscany, Italy. The exact venue is being finalized — we'll share it here as soon as it's set." },
      { q: "What will the weather be like?", a: "Warm, sunny June days (high 70s–80s°F) and cooler evenings. Pack a layer for after dark." },
      { q: "Is there a website or app?", a: "This site is home base — travel, schedule, where you'll stay, and RSVP all live right here." },
    ],
  },
  {
    title: "Travel",
    qa: [
      { q: "Which airport should I fly into?", a: "Florence (FLR) is closest and easiest. Pisa (PSA) and Rome (ROM) also work well." },
      { q: "Do you recommend renting a car?", a: "Yes — it's the most flexible way to get around the countryside and nearby towns." },
      { q: "Will transportation be provided?", a: "We'll arrange group transport for the main events. Details closer to the week." },
      { q: "How do I get to the villa from the airport?", a: "Private transfer, rental car, or train plus a short taxi. See the Travel tab for options." },
    ],
  },
  {
    title: "Where You'll Stay",
    qa: [
      { q: "Where will we be staying?", a: "Most guests stay right at the villa, which we have exclusively for the week. See the Stay tab." },
      { q: "How do I find out my room?", a: "Room assignments are coordinated with us — we'll let you know yours ahead of time." },
      { q: "What amenities are there?", a: "A pool, gardens, terraces, and lots of gathering spaces to relax between events." },
      { q: "Can I arrive early or stay later?", a: "Absolutely — just let us know your plans so we can help." },
    ],
  },
  {
    title: "Activities & Attire",
    qa: [
      { q: "What activities are planned?", a: "A welcome dinner, wine tasting, pool day, the ceremony, and a farewell party. See Activities." },
      { q: "Do I have to attend everything?", a: "Not at all — come to what you like. A few events ask for an RSVP so we can plan." },
      { q: "What should I wear?", a: "Relaxed elegance. We'll share specific dress notes for each event closer to the time." },
      { q: "Any tips on footwear?", a: "Flats or block heels — much of the week is on grass and stone." },
    ],
  },
  {
    title: "Food & Gifts",
    qa: [
      { q: "Will meals be provided?", a: "Most group events include food and drink. We'll flag any meals that are on your own." },
      { q: "Can you accommodate dietary needs?", a: "Yes — note them on your RSVP and we'll take care of it." },
      { q: "Are you registering for gifts?", a: "Your presence is the gift. If you'd like to give something, we'll share details later." },
      { q: "I have another question — who do I ask?", a: "Email us at chehakshultswedding@gmail.com — we're always happy to help." },
    ],
  },
];

export default function FaqMobilePage() {
  return (
    <DolcePage
      eyebrow="Good to know"
      title="FAQ"
      subtitle="Answers to the questions we hear most."
      active=""
    >
      {GROUPS.map((g) => (
        <section key={g.title} className={styles.group}>
          <h2 className={styles.groupTitle}>{g.title}</h2>
          {g.qa.map((item) => (
            <details key={item.q} className={styles.item}>
              <summary className={styles.q}>
                {item.q}
                <span className={styles.sign} aria-hidden="true">
                  +
                </span>
              </summary>
              <p className={styles.a}>{item.a}</p>
            </details>
          ))}
        </section>
      ))}

      <p className={d.sign} style={{ marginTop: 34 }}>
        A presto
      </p>
      <p className={d.signSub}>See you soon</p>
    </DolcePage>
  );
}
