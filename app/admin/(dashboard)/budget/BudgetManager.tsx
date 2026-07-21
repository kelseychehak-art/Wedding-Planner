"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./budget.module.css";

export type BudgetItem = {
  id: string;
  category: string;
  name: string;
  estimated_amount: number | null;
  amount_paid: number;
  due_date: string | null;
  status: string;
  notes: string | null;
};

const CATEGORIES = [
  "Venue",
  "Catering",
  "Photography & Video",
  "Flowers & Decor",
  "Music & Entertainment",
  "Attire & Beauty",
  "Travel & Transport",
  "Stationery",
  "Planner",
  "Rentals",
  "Activities",
  "Gifts & Favors",
  "Other",
];

const STATUSES = ["Planned", "Quoted", "Booked", "Partially Paid", "Paid"];

type Draft = {
  id?: string;
  category: string;
  name: string;
  estimated_amount: string;
  amount_paid: string;
  due_date: string;
  status: string;
  notes: string;
};

function emptyDraft(): Draft {
  return {
    category: "Venue",
    name: "",
    estimated_amount: "",
    amount_paid: "",
    due_date: "",
    status: "Planned",
    notes: "",
  };
}

function draftFromItem(item: BudgetItem): Draft {
  return {
    id: item.id,
    category: item.category,
    name: item.name,
    estimated_amount: item.estimated_amount == null ? "" : String(item.estimated_amount),
    amount_paid: item.amount_paid ? String(item.amount_paid) : "",
    due_date: item.due_date ?? "",
    status: item.status,
    notes: item.notes ?? "",
  };
}

export default function BudgetManager({
  initialTotal,
  initialCurrency,
  initialItems,
  initialTargets,
}: {
  initialTotal: number;
  initialCurrency: string;
  initialItems: BudgetItem[];
  initialTargets: Record<string, number>;
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [currency, setCurrency] = useState(initialCurrency);
  const [targets, setTargets] = useState<Record<string, number>>(initialTargets ?? {});
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [saving, setSaving] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [totalDraft, setTotalDraft] = useState(String(initialTotal));
  const [currencyDraft, setCurrencyDraft] = useState(initialCurrency);
  const [targetEditCat, setTargetEditCat] = useState<string | null>(null);
  const [targetDraft, setTargetDraft] = useState("");

  async function saveTarget(category: string) {
    const raw = targetDraft.trim();
    const amount = raw === "" ? null : Number(raw);
    const res = await fetch("/api/admin/budget/targets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, amount }),
    });
    if (res.ok) {
      setTargets((prev) => {
        const next = { ...prev };
        if (amount == null || Number.isNaN(amount)) delete next[category];
        else next[category] = amount;
        return next;
      });
    }
    setTargetEditCat(null);
    setTargetDraft("");
  }

  const money = useMemo(() => {
    return (n: number) => {
      try {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }).format(n);
      } catch {
        return `${currency} ${Math.round(n).toLocaleString()}`;
      }
    };
  }, [currency]);

  const allocated = items.reduce((sum, i) => sum + (i.estimated_amount ?? 0), 0);
  const paid = items.reduce((sum, i) => sum + (i.amount_paid ?? 0), 0);
  const remainingToPay = allocated - paid;
  const budgetRemaining = total - allocated;
  const overBudget = budgetRemaining < 0;

  const grouped = useMemo(() => {
    const map = new Map<string, BudgetItem[]>();
    for (const cat of CATEGORIES) {
      const list = items.filter((i) => i.category === cat);
      if (list.length) map.set(cat, list);
    }
    return map;
  }, [items]);

  const upcoming = useMemo(() => {
    return items
      .filter((i) => i.due_date && i.status !== "Paid")
      .map((i) => ({
        ...i,
        outstanding: (i.estimated_amount ?? 0) - (i.amount_paid ?? 0),
      }))
      .sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1))
      .slice(0, 6);
  }, [items]);

  function daysUntil(dateStr: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((new Date(dateStr + "T00:00:00").getTime() - today.getTime()) / 86400000);
  }

  function startAdd() {
    setDraft(emptyDraft());
    setEditingId("new");
  }

  function startEdit(item: BudgetItem) {
    setDraft(draftFromItem(item));
    setEditingId(item.id);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(emptyDraft());
  }

  async function saveDraft() {
    if (!draft.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/budget/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) return;
      const { item } = await res.json();
      setItems((prev) => {
        const exists = prev.some((i) => i.id === item.id);
        return exists ? prev.map((i) => (i.id === item.id ? item : i)) : [...prev, item];
      });
      cancelEdit();
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(item: BudgetItem) {
    if (!confirm(`Delete "${item.name}"?`)) return;
    const res = await fetch(`/api/admin/budget/items/${item.id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  async function saveBudget() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/budget/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total: totalDraft, currency: currencyDraft }),
      });
      if (!res.ok) return;
      setTotal(Number(totalDraft) || 0);
      setCurrency(currencyDraft);
      setEditingBudget(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Budget</h1>
          <p className={styles.subheading}>
            Only wedding-day and hosted spend counts here — guest lodging is treated
            separately.
          </p>
        </div>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Total Budget</span>
          {editingBudget ? (
            <div className={styles.budgetEdit}>
              <input
                className={styles.budgetInput}
                type="number"
                value={totalDraft}
                onChange={(e) => setTotalDraft(e.target.value)}
              />
              <input
                className={styles.currencyInput}
                value={currencyDraft}
                onChange={(e) => setCurrencyDraft(e.target.value.toUpperCase())}
                maxLength={3}
              />
              <button
                type="button"
                className="btn-primary"
                onClick={saveBudget}
                disabled={saving}
              >
                {saving ? "…" : "Save"}
              </button>
              <button type="button" className={styles.linkBtn} onClick={() => setEditingBudget(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <div className={styles.budgetValueRow}>
              <span className={styles.summaryValue}>{money(total)}</span>
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => {
                  setTotalDraft(String(total));
                  setCurrencyDraft(currency);
                  setEditingBudget(true);
                }}
              >
                Edit
              </button>
            </div>
          )}
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Allocated</span>
          <span className={styles.summaryValue}>{money(allocated)}</span>
          <span className={styles.summaryMeta}>across {items.length} items</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Paid so far</span>
          <span className={styles.summaryValue}>{money(paid)}</span>
          <span className={styles.summaryMeta}>{money(remainingToPay)} still to pay</span>
        </div>
        <div className={`${styles.summaryCard} ${overBudget ? styles.overCard : ""}`}>
          <span className={styles.summaryLabel}>
            {overBudget ? "Over Budget" : "Left in Budget"}
          </span>
          <span className={styles.summaryValue}>{money(Math.abs(budgetRemaining))}</span>
          <span className={styles.summaryMeta}>
            {overBudget ? "allocated exceeds budget" : "still unallocated"}
          </span>
        </div>
      </div>

      {upcoming.length > 0 && (
        <section className={styles.upcoming}>
          <p className={styles.upcomingTitle}>Upcoming Payments</p>
          <div className={styles.upcomingList}>
            {upcoming.map((i) => {
              const d = daysUntil(i.due_date!);
              const tone = d < 0 ? styles.dueOverdue : d <= 14 ? styles.dueSoon : "";
              return (
                <div className={styles.upcomingRow} key={i.id}>
                  <span className={styles.upcomingName}>{i.name}</span>
                  <span className={styles.upcomingCat}>{i.category}</span>
                  <span className={`${styles.upcomingWhen} ${tone}`}>
                    {d < 0 ? `${Math.abs(d)}d overdue` : d === 0 ? "Due today" : `Due in ${d}d`}
                  </span>
                  <span className={styles.upcomingAmount}>
                    {i.outstanding > 0 ? money(i.outstanding) : money(i.estimated_amount ?? 0)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className={styles.actions}>
        <button type="button" className="btn-primary" onClick={startAdd}>
          Add Item
        </button>
      </div>

      {editingId === "new" && (
        <div className={styles.editCard}>
          <DraftForm
            draft={draft}
            setDraft={setDraft}
            onSave={saveDraft}
            onCancel={cancelEdit}
            saving={saving}
          />
        </div>
      )}

      {items.length === 0 && editingId !== "new" ? (
        <p className={styles.empty}>No budget items yet. Add your first one.</p>
      ) : (
        Array.from(grouped.entries()).map(([category, list]) => {
          const catEstimated = list.reduce((s, i) => s + (i.estimated_amount ?? 0), 0);
          const target = targets[category];
          const hasTarget = typeof target === "number" && target > 0;
          const overTarget = hasTarget && catEstimated > target;
          const barPct = hasTarget ? Math.min(100, Math.round((catEstimated / target) * 100)) : 0;
          return (
            <section className={styles.categoryBlock} key={category}>
              <div className={styles.categoryHeader}>
                <span className={styles.categoryName}>{category}</span>
                <div className={styles.categoryRight}>
                  <span className={styles.categoryTotal}>{money(catEstimated)}</span>
                  {targetEditCat === category ? (
                    <span className={styles.targetEdit}>
                      <span className={styles.targetOf}>of</span>
                      <input
                        className={styles.targetInput}
                        type="number"
                        autoFocus
                        value={targetDraft}
                        placeholder="target"
                        onChange={(e) => setTargetDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveTarget(category);
                          if (e.key === "Escape") setTargetEditCat(null);
                        }}
                      />
                      <button type="button" className={styles.linkBtn} onClick={() => saveTarget(category)}>
                        Save
                      </button>
                    </span>
                  ) : hasTarget ? (
                    <button
                      type="button"
                      className={`${styles.targetChip} ${overTarget ? styles.targetOver : ""}`}
                      onClick={() => {
                        setTargetDraft(String(target));
                        setTargetEditCat(category);
                      }}
                    >
                      of {money(target)} target
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.linkBtn}
                      onClick={() => {
                        setTargetDraft("");
                        setTargetEditCat(category);
                      }}
                    >
                      + target
                    </button>
                  )}
                </div>
              </div>
              {hasTarget && (
                <div className={styles.targetTrack}>
                  <span
                    className={`${styles.targetFill} ${overTarget ? styles.targetFillOver : ""}`}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              )}
              {list.map((item) =>
                editingId === item.id ? (
                  <div className={styles.editCard} key={item.id}>
                    <DraftForm
                      draft={draft}
                      setDraft={setDraft}
                      onSave={saveDraft}
                      onCancel={cancelEdit}
                      saving={saving}
                    />
                  </div>
                ) : (
                  <div className={styles.itemRow} key={item.id}>
                    <div className={styles.itemMain}>
                      <span className={styles.itemName}>{item.name}</span>
                      <div className={styles.itemMeta}>
                        <span className={styles.statusPill}>{item.status}</span>
                        {item.due_date && <span>Due {item.due_date}</span>}
                        {item.notes && <span className={styles.itemNotes}>{item.notes}</span>}
                      </div>
                    </div>
                    <div className={styles.itemAmounts}>
                      <span className={styles.itemEstimated}>
                        {item.estimated_amount != null ? money(item.estimated_amount) : "—"}
                      </span>
                      {item.amount_paid > 0 && (
                        <span className={styles.itemPaid}>{money(item.amount_paid)} paid</span>
                      )}
                    </div>
                    <div className={styles.itemActions}>
                      <button type="button" onClick={() => startEdit(item)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => deleteItem(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
            </section>
          );
        })
      )}
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
    <div className={styles.draftGrid}>
      <div className={styles.field}>
        <label className={styles.label}>Category</label>
        <select
          className={styles.input}
          value={draft.category}
          onChange={(e) => set("category", e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className={`${styles.field} ${styles.fieldWide}`}>
        <label className={styles.label}>Name</label>
        <input
          className={styles.input}
          value={draft.name}
          placeholder="e.g. Villa buyout, Photographer deposit"
          onChange={(e) => set("name", e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Status</label>
        <select
          className={styles.input}
          value={draft.status}
          onChange={(e) => set("status", e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Estimated Amount</label>
        <input
          className={styles.input}
          type="number"
          value={draft.estimated_amount}
          onChange={(e) => set("estimated_amount", e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Amount Paid</label>
        <input
          className={styles.input}
          type="number"
          value={draft.amount_paid}
          onChange={(e) => set("amount_paid", e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Next Payment Due</label>
        <input
          className={styles.input}
          type="date"
          value={draft.due_date}
          onChange={(e) => set("due_date", e.target.value)}
        />
      </div>
      <div className={`${styles.field} ${styles.fieldWide}`}>
        <label className={styles.label}>Notes</label>
        <input
          className={styles.input}
          value={draft.notes}
          placeholder="Deposit terms, payment schedule, original currency…"
          onChange={(e) => set("notes", e.target.value)}
        />
      </div>
      <div className={styles.draftActions}>
        <button
          type="button"
          className="btn-primary"
          onClick={onSave}
          disabled={saving || !draft.name.trim()}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" className={styles.linkBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
