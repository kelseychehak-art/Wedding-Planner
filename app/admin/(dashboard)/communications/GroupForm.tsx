"use client";

import { useEffect, useState } from "react";
import type { Party } from "../guests/GuestsManager";
import { IconX } from "@/components/admin/icons";
import { useBodyScrollLock } from "@/components/admin/useBodyScrollLock";
import type { RecipientGroup } from "./CommunicationsManager";
import RuleBuilder from "./RuleBuilder";
import { emptyRule, type RecipientRule, type RuleLookups } from "./recipients";
import styles from "./communications.module.css";

/*
 * A saved recipient rule. Always dynamic: it stores the rule, not the people,
 * so "families with children" still means the right families after the guest
 * list changes. A static snapshot would quietly go stale, which is exactly the
 * failure mode you don't want on the day you send the final details.
 */

export default function GroupForm({
  group,
  parties,
  lookups,
  onCancel,
  onSaved,
}: {
  group: RecipientGroup | null;
  parties: Party[];
  lookups: RuleLookups;
  onCancel: () => void;
  onSaved: (saved: RecipientGroup) => void;
}) {
  const [name, setName] = useState(group?.name ?? "");
  const [description, setDescription] = useState(group?.description ?? "");
  const [rule, setRule] = useState<RecipientRule>(group?.rule_definition ?? emptyRule());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useBodyScrollLock();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  async function save() {
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/communications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "group",
          item: {
            id: group?.id ?? "",
            name,
            description,
            group_type: "dynamic",
            rule_definition: rule,
          },
        }),
      });
      const body = (await res.json()) as { item?: RecipientGroup; error?: string };
      if (!res.ok || !body.item) {
        setError(body.error || "Couldn't save that group.");
        return;
      }
      onSaved(body.item);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className={styles.scrim} onClick={onCancel} aria-hidden="true" />
      <div className={styles.composer} role="dialog" aria-modal="true" aria-labelledby="group-title">
        <header className={styles.composerHead}>
          <h2 id="group-title" className={styles.composerTitle}>
            {group ? "Edit group" : "New recipient group"}
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onCancel}
            aria-label="Close"
          >
            <IconX size={16} />
          </button>
        </header>

        <div className={styles.composerBody}>
          <section className={styles.section}>
            <div className={styles.fieldRow}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Name</span>
                <input
                  className={styles.input}
                  value={name}
                  placeholder="Families with children"
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Description</span>
                <input
                  className={styles.input}
                  value={description}
                  placeholder="For anything about kids' meals or the crèche"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Rule</h3>
            <RuleBuilder rule={rule} onChange={setRule} parties={parties} lookups={lookups} />
          </section>
        </div>

        <footer className={styles.composerFoot}>
          {error && <span className={styles.error}>{error}</span>}
          <button type="button" className={styles.linkBtn} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={save}
            disabled={saving || !name.trim()}
          >
            {saving ? "Saving…" : "Save group"}
          </button>
        </footer>
      </div>
    </>
  );
}
