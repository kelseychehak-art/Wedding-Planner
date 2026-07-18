"use client";

import { useState, type ReactNode } from "react";
import UiIcon, { type UiIconName } from "./UiIcon";
import Illustration, { type IllustrationName } from "./Illustration";
import styles from "./FaqGroups.module.css";

export type FaqGroup = {
  id: string;
  label: string;
  icon: { kind: "ui"; name: UiIconName } | { kind: "art"; name: IllustrationName };
  items: { q: string; a: ReactNode }[];
};

function GroupIcon({ icon, size = 20 }: { icon: FaqGroup["icon"]; size?: number }) {
  return icon.kind === "ui" ? (
    <UiIcon name={icon.name} size={size} />
  ) : (
    <Illustration name={icon.name} size={size} />
  );
}

export default function FaqGroups({ groups }: { groups: FaqGroup[] }) {
  // Single-open across all groups; key = `${groupId}:${index}`.
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className={styles.groups}>
      {groups.map((group) => (
        <section key={group.id} id={group.id} className={styles.group}>
          <header className={styles.groupHead}>
            <h2 className={styles.groupTitle}>{group.label}</h2>
            <span className={styles.groupIcon} aria-hidden="true">
              <GroupIcon icon={group.icon} size={22} />
            </span>
          </header>

          <div className={styles.rows}>
            {group.items.map((item, i) => {
              const key = `${group.id}:${i}`;
              const isOpen = open === key;
              return (
                <div key={key} className={styles.row}>
                  <button
                    type="button"
                    className={styles.question}
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : key)}
                  >
                    <span>{item.q}</span>
                    <UiIcon
                      name="chevron"
                      size={16}
                      className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                    />
                  </button>
                  {isOpen && <div className={styles.answer}>{item.a}</div>}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
