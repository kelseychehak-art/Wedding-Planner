"use client";

import { useState } from "react";
import { useConfirm } from "@/components/admin/useConfirm";
import styles from "./decisions.module.css";

export type Decision = {
  id: string;
  title: string;
  decided_on: string | null;
  category: string;
  decision: string | null;
  rationale: string | null;
  notes: string | null;
};

const CATEGORIES = ["Venue", "Vendors", "Guests", "Budget", "Design", "Logistics", "General"];

type Draft = {
  id?: string;
  title: string;
  decided_on: string;
  category: string;
  decision: string;
  rationale: string;
  notes: string;
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function emptyDraft(): Draft {
  return { title: "", decided_on: todayStr(), category: "General", decision: "", rationale: "", notes: "" };
}

function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DecisionsManager({ initialItems }: { initialItems: Decision[] }) {
  const { confirm, dialog } = useConfirm();
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [saving, setSaving] = useState(false);

  function startAdd() {
    setDraft(emptyDraft());
    setEditingId("new");
  }
  function startEdit(d: Decision) {
    setDraft({
      id: d.id,
      title: d.title,
      decided_on: d.decided_on ?? todayStr(),
      category: d.category,
      decision: d.decision ?? "",
      rationale: d.rationale ?? "",
      notes: d.notes ?? "",
    });
    setEditingId(d.id);
  }
  function cancel() {
    setEditingId(null);
    setDraft(emptyDraft());
  }

  async function saveDraft() {
    if (!draft.title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) return;
      const { item } = await res.json();
      setItems((prev) => {
        const exists = prev.some((i) => i.id === item.id);
        return exists ? prev.map((i) => (i.id === item.id ? item : i)) : [item, ...prev];
      });
      cancel();
    } finally {
      setSaving(false);
    }
  }

  async function remove(d: Decision) {
    if (!(await confirm({ title: `Delete “${d.title}”?`, body: "This decision and its rationale will be removed." }))) return;
    const res = await fetch(`/api/admin/decisions/${d.id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== d.id));
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Decision Log</h1>
          <p className={styles.subheading}>What you decided, and why — so you don&rsquo;t relitigate it later.</p>
        </div>
        <button type="button" className="btn-primary" onClick={startAdd}>
          Log Decision
        </button>
      </div>

      {editingId === "new" && (
        <div className={styles.editCard}>
          <DraftForm draft={draft} setDraft={setDraft} onSave={saveDraft} onCancel={cancel} saving={saving} />
        </div>
      )}

      {items.length === 0 && editingId !== "new" ? (
        <p className={styles.empty}>No decisions logged yet.</p>
      ) : (
        <div className={styles.list}>
          {items.map((d) =>
            editingId === d.id ? (
              <div className={styles.editCard} key={d.id}>
                <DraftForm draft={draft} setDraft={setDraft} onSave={saveDraft} onCancel={cancel} saving={saving} />
              </div>
            ) : (
              <div className={styles.card} key={d.id}>
                <div className={styles.cardHead}>
                  <div className={styles.cardIdentity}>
                    <span className={styles.cardTitle}>{d.title}</span>
                    <span className={styles.categoryTag}>{d.category}</span>
                  </div>
                  <div className={styles.cardActions}>
                    {d.decided_on && <span className={styles.date}>{fmtDate(d.decided_on)}</span>}
                    <button type="button" onClick={() => startEdit(d)}>
                      Edit
                    </button>
                    <button type="button" className={styles.deleteBtn} onClick={() => remove(d)}>
                      Delete
                    </button>
                  </div>
                </div>
                {d.decision && (
                  <p className={styles.body}>
                    <strong>Decided:</strong> {d.decision}
                  </p>
                )}
                {d.rationale && (
                  <p className={styles.body}>
                    <strong>Why:</strong> {d.rationale}
                  </p>
                )}
                {d.notes && <p className={styles.notes}>{d.notes}</p>}
              </div>
            )
          )}
        </div>
      )}
      {dialog}
    </div>
  );
}

function DraftForm({
  draft,
  setDraft,
  onSave,
  onCancel,
  saving,
}: {
  draft: Draft;
  setDraft: (d: Draft) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft({ ...draft, [key]: value });
  }
  return (
    <div className={styles.fieldGrid}>
      <div className={`${styles.field} ${styles.fieldWide}`}>
        <label className={styles.label}>Decision</label>
        <input
          className={styles.input}
          value={draft.title}
          placeholder="e.g. Chose a September wedding date"
          onChange={(e) => set("title", e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Category</label>
        <select className={styles.input} value={draft.category} onChange={(e) => set("category", e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Decided On</label>
        <input
          className={styles.input}
          type="date"
          value={draft.decided_on}
          onChange={(e) => set("decided_on", e.target.value)}
        />
      </div>
      <div className={`${styles.field} ${styles.fieldWide}`}>
        <label className={styles.label}>What We Decided</label>
        <textarea
          className={styles.textarea}
          value={draft.decision}
          onChange={(e) => set("decision", e.target.value)}
        />
      </div>
      <div className={`${styles.field} ${styles.fieldWide}`}>
        <label className={styles.label}>Rationale</label>
        <textarea
          className={styles.textarea}
          value={draft.rationale}
          onChange={(e) => set("rationale", e.target.value)}
        />
      </div>
      <div className={`${styles.field} ${styles.fieldWide}`}>
        <label className={styles.label}>Notes</label>
        <input className={styles.input} value={draft.notes} onChange={(e) => set("notes", e.target.value)} />
      </div>
      <div className={styles.formActions}>
        <button type="button" className="btn-primary" onClick={onSave} disabled={saving || !draft.title.trim()}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" className={styles.linkBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
