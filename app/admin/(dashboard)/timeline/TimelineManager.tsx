"use client";

import { useState } from "react";
import styles from "./timeline.module.css";

export type Milestone = {
  id: string;
  title: string;
  due_date: string | null;
  category: string;
  is_done: boolean;
  notes: string | null;
};

const CATEGORIES = [
  "Venue",
  "Vendors",
  "Guests",
  "Attire",
  "Travel",
  "Legal/Paperwork",
  "Budget",
  "Décor",
  "General",
];

type Draft = {
  id?: string;
  title: string;
  due_date: string;
  category: string;
  notes: string;
};

function emptyDraft(): Draft {
  return { title: "", due_date: "", category: "General", notes: "" };
}

function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TimelineManager({ initialItems }: { initialItems: Milestone[] }) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [saving, setSaving] = useState(false);
  const [showDone, setShowDone] = useState(false);

  const visible = items.filter((i) => showDone || !i.is_done);
  const upcoming = visible.filter((i) => !i.is_done);
  const done = items.filter((i) => i.is_done);

  function startAdd() {
    setDraft(emptyDraft());
    setEditingId("new");
  }
  function startEdit(m: Milestone) {
    setDraft({
      id: m.id,
      title: m.title,
      due_date: m.due_date ?? "",
      category: m.category,
      notes: m.notes ?? "",
    });
    setEditingId(m.id);
  }
  function cancel() {
    setEditingId(null);
    setDraft(emptyDraft());
  }

  async function persist(payload: Record<string, unknown>) {
    const res = await fetch("/api/admin/milestones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return (await res.json()).item as Milestone;
  }

  async function saveDraft() {
    if (!draft.title.trim()) return;
    setSaving(true);
    try {
      const existing = items.find((i) => i.id === draft.id);
      const saved = await persist({ ...draft, is_done: existing?.is_done ?? false });
      if (!saved) return;
      setItems((prev) => {
        const exists = prev.some((i) => i.id === saved.id);
        return exists ? prev.map((i) => (i.id === saved.id ? saved : i)) : [...prev, saved];
      });
      cancel();
    } finally {
      setSaving(false);
    }
  }

  async function toggleDone(m: Milestone) {
    const saved = await persist({
      id: m.id,
      title: m.title,
      due_date: m.due_date ?? "",
      category: m.category,
      notes: m.notes ?? "",
      is_done: !m.is_done,
    });
    if (saved) setItems((prev) => prev.map((i) => (i.id === saved.id ? saved : i)));
  }

  async function remove(m: Milestone) {
    if (!confirm(`Delete "${m.title}"?`)) return;
    const res = await fetch(`/api/admin/milestones/${m.id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== m.id));
  }

  function overdue(m: Milestone) {
    if (!m.due_date || m.is_done) return false;
    return new Date(m.due_date + "T00:00:00") < new Date(new Date().toDateString());
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Timeline</h1>
          <p className={styles.subheading}>Milestones and deadlines for the planning process.</p>
        </div>
        <button type="button" className="btn-primary" onClick={startAdd}>
          Add Milestone
        </button>
      </div>

      <label className={styles.showDone}>
        <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} />
        Show completed ({done.length})
      </label>

      {editingId === "new" && (
        <div className={styles.editCard}>
          <DraftForm draft={draft} setDraft={setDraft} onSave={saveDraft} onCancel={cancel} saving={saving} />
        </div>
      )}

      {upcoming.length === 0 && editingId !== "new" && (
        <p className={styles.empty}>No upcoming milestones. Add one to start your timeline.</p>
      )}

      <div className={styles.list}>
        {visible.map((m) =>
          editingId === m.id ? (
            <div className={styles.editCard} key={m.id}>
              <DraftForm draft={draft} setDraft={setDraft} onSave={saveDraft} onCancel={cancel} saving={saving} />
            </div>
          ) : (
            <div className={`${styles.row} ${m.is_done ? styles.rowDone : ""}`} key={m.id}>
              <button
                type="button"
                className={`${styles.check} ${m.is_done ? styles.checkOn : ""}`}
                onClick={() => toggleDone(m)}
                aria-label={m.is_done ? "Mark not done" : "Mark done"}
              >
                {m.is_done ? "✓" : ""}
              </button>
              <div className={styles.rowMain}>
                <span className={styles.rowTitle}>{m.title}</span>
                <div className={styles.rowMeta}>
                  <span className={styles.categoryTag}>{m.category}</span>
                  {m.due_date && (
                    <span className={overdue(m) ? styles.overdue : ""}>
                      {overdue(m) ? "Overdue · " : ""}
                      {fmtDate(m.due_date)}
                    </span>
                  )}
                  {m.notes && <span className={styles.rowNotes}>{m.notes}</span>}
                </div>
              </div>
              <div className={styles.rowActions}>
                <button type="button" onClick={() => startEdit(m)}>
                  Edit
                </button>
                <button type="button" className={styles.deleteBtn} onClick={() => remove(m)}>
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>
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
        <label className={styles.label}>Milestone</label>
        <input
          className={styles.input}
          value={draft.title}
          placeholder="e.g. Book photographer, Send invitations"
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
        <label className={styles.label}>Due Date</label>
        <input
          className={styles.input}
          type="date"
          value={draft.due_date}
          onChange={(e) => set("due_date", e.target.value)}
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
