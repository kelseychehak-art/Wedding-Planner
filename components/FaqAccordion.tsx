"use client";

import { useState, type ReactNode } from "react";
import styles from "./FaqAccordion.module.css";

export type FaqItem = {
  question: string;
  answer: ReactNode;
};

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.list}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
          >
            <button
              type="button"
              className={styles.trigger}
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span className={styles.question}>{item.question}</span>
              <span className={styles.sign} aria-hidden="true">
                {isOpen ? "–" : "+"}
              </span>
            </button>
            {isOpen && <div className={styles.answer}>{item.answer}</div>}
          </div>
        );
      })}
    </div>
  );
}
