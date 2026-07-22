"use client";

import { useEffect, useState } from "react";
import Money from "@/components/admin/Money";
import { IconX, IconPlus } from "@/components/admin/icons";
import { useBodyScrollLock } from "@/components/admin/useBodyScrollLock";
import { useConfirm } from "@/components/admin/useConfirm";
import type { BudgetItem, BudgetCategory, BudgetPayment, VendorOption } from "./BudgetManager";
import styles from "./budget.module.css";

/*
 * One budget line, plus the payments underneath it.
 *
 * The payment schedule is the point of this drawer. A wedding vendor is almost
 * never one payment — it's a deposit now, a balance later, sometimes a third in
 * between — and "how much have we actually handed over, and what's next" is the
 * question the Budget page exists to answer. Paid is the sum of these rows, so
 * it can never drift from them.
 */

type Draft = {
  id: string;
  name: string;
  category_id: string;
  vendor_id: string;
  estimated_amount: string;
  actual_amount: string;
  committed_amount: string;
  due_date: string;
  notes: string;
};

function draftFrom(item: BudgetItem | null): Draft {
  return {
    id: item?.id ?? "",
    name: item?.name ?? "",
    category_id: item?.category_id ?? "",
    vendor_id: item?.vendor_id ?? "",
    estimated_amount: item?.estimated_amount == null ? "" : String(item.estimated_amount),
    actual_amount: item?.actual_amount == null ? "" : String(item.actual_amount),
    committed_amount: item?.committed_amount == null ? "" : String(item.committed_amount),
    due_date: item?.due_date ?? "",
    notes: item?.notes ?? "",
  };
}

const emptyPayment = { id: "", label: "", amount: "", due_date: "", paid_on: "", method: "" };

export default function ItemDrawer({
  item,
  categories,
  vendors,
  payments,
  currency,
  eurUsdRate,
  onClose,
  onSaved,
  onRefresh,
}: {
  item: BudgetItem | null;
  categories: BudgetCategory[];
  vendors: VendorOption[];
  payments: BudgetPayment[];
  currency: string;
  eurUsdRate: number;
  onClose: () => void;
  onSaved: () => void;
  /* Payment edits stay in the drawer — you tick several in a row — so they
     refresh the page data without closing it. */
  onRefresh: () => void;
}) {
  const { confirm, dialog } = useConfirm();
  const [form, setForm] = useState<Draft>(() => draftFrom(item));
  const [pay, setPay] = useState({ ...emptyPayment });
  const [addingPayment, setAddingPayment] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useBodyScrollLock();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function post(entity: string, body: unknown) {
    const res = await fetch("/api/admin/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity, item: body }),
    });
    const json = (await res.json()) as { item?: Record<string, unknown>; error?: string };
    if (!res.ok) {
      setError(json.error || "Couldn't save that.");
      return null;
    }
    return json.item ?? null;
  }

  async function save() {
    if (!form.name.trim()) return;
    setSaving(true);
    setError("");
    try {
      if (await post("item", form)) onSaved();
    } finally {
      setSaving(false);
    }
  }

  async function addPayment() {
    if (!item) return;
    if (!Number(pay.amount)) return;
    if (await post("payment", { ...pay, item_id: item.id })) {
      setPay({ ...emptyPayment });
      setAddingPayment(false);
      onRefresh();
    }
  }

  async function togglePaid(p: BudgetPayment) {
    await post("payment", {
      id: p.id,
      paid_on: p.paid_on ? "" : new Date().toISOString().slice(0, 10),
    });
    onRefresh();
  }

  async function removePayment(p: BudgetPayment) {
    const ok = await confirm({
      title: `Delete this ${currency} ${Number(p.amount).toLocaleString()} payment?`,
      body: p.paid_on
        ? "It's marked paid, so the total paid on this line drops by that much."
        : "It's only scheduled, so nothing paid changes.",
    });
    if (!ok) return;
    const res = await fetch(`/api/admin/budget?entity=payment&id=${p.id}`, { method: "DELETE" });
    if (res.ok) onRefresh();
  }

  const scheduled = payments.reduce((s, p) => s + (p.paid_on ? 0 : Number(p.amount)), 0);
  const paid = payments.reduce((s, p) => s + (p.paid_on ? Number(p.amount) : 0), 0);
  const cost = Number(form.actual_amount || form.estimated_amount || 0);
  const unscheduled = cost - paid - scheduled;

  return (
    <>
      <div
        className={styles.scrim}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={styles.drawer} role="dialog" aria-modal="true" aria-labelledby="item-title">
        <header className={styles.drawerHead}>
          <h2 id="item-title" className={styles.drawerTitle}>
            {item ? item.name || "Budget line" : "Add expense"}
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <IconX size={16} />
          </button>
        </header>

        <div className={styles.drawerBody}>
          <section className={styles.section}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Item</span>
              <input
                className={styles.input}
                value={form.name}
                placeholder="Villa buyout, photographer, welcome dinner…"
                onChange={(e) => set("name", e.target.value)}
              />
            </label>

            <div className={styles.fieldRow}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Category</span>
                <select
                  className={styles.input}
                  value={form.category_id}
                  onChange={(e) => set("category_id", e.target.value)}
                >
                  <option value="">Uncategorised</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Vendor</span>
                <select
                  className={styles.input}
                  value={form.vendor_id}
                  onChange={(e) => set("vendor_id", e.target.value)}
                >
                  <option value="">None</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
                <span className={styles.hint}>
                  Links this spend to the vendor, so their page can show it.
                </span>
              </label>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Money</h3>
            <div className={styles.fieldRow}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Budgeted</span>
                <input
                  className={styles.input}
                  type="number"
                  value={form.estimated_amount}
                  onChange={(e) => set("estimated_amount", e.target.value)}
                />
                <span className={styles.hint}>What you planned to spend.</span>
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Actual</span>
                <input
                  className={styles.input}
                  type="number"
                  value={form.actual_amount}
                  onChange={(e) => set("actual_amount", e.target.value)}
                />
                <span className={styles.hint}>
                  The real price once quoted. Above budgeted marks the line over.
                </span>
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Committed</span>
                <input
                  className={styles.input}
                  type="number"
                  value={form.committed_amount}
                  onChange={(e) => set("committed_amount", e.target.value)}
                />
                <span className={styles.hint}>Promised, not yet invoiced.</span>
              </label>
            </div>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Final due date</span>
              <input
                className={styles.input}
                type="date"
                value={form.due_date}
                onChange={(e) => set("due_date", e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Notes</span>
              <input
                className={styles.input}
                value={form.notes}
                placeholder="Deposit terms, what's included, original currency…"
                onChange={(e) => set("notes", e.target.value)}
              />
            </label>
          </section>

          {/* ---- Payments ---- */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Payment schedule</h3>

            {!item ? (
              <p className={styles.hint}>
                Save the line first — then you can break it into a deposit and a balance.
              </p>
            ) : (
              <>
                {payments.length > 0 && (
                  <ul className={styles.payList}>
                    {payments.map((p) => (
                      <li key={p.id} className={styles.payRow}>
                        <label className={styles.payCheck}>
                          <input
                            type="checkbox"
                            checked={Boolean(p.paid_on)}
                            onChange={() => togglePaid(p)}
                            aria-label={p.paid_on ? "Mark unpaid" : "Mark paid"}
                          />
                        </label>
                        <span className={styles.payMain}>
                          <span className={p.paid_on ? styles.payLabelPaid : styles.payLabel}>
                            {p.label || (p.paid_on ? "Payment" : "Scheduled payment")}
                          </span>
                          <span className={styles.sub}>
                            {p.paid_on
                              ? `Paid ${p.paid_on}${p.method ? ` · ${p.method}` : ""}`
                              : p.due_date
                                ? `Due ${p.due_date}`
                                : "No date set"}
                          </span>
                        </span>
                        <Money
                          amount={p.amount}
                          currency={currency}
                          eurUsdRate={eurUsdRate}
                          size="sm"
                        />
                        <button
                          type="button"
                          className={styles.payDelete}
                          onClick={() => removePayment(p)}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <dl className={styles.paySummary}>
                  <div>
                    <dt>Paid</dt>
                    <dd>{money(paid, currency)}</dd>
                  </div>
                  <div>
                    <dt>Scheduled</dt>
                    <dd>{money(scheduled, currency)}</dd>
                  </div>
                  <div>
                    <dt>{unscheduled < 0 ? "Over the line total" : "Not yet scheduled"}</dt>
                    <dd className={unscheduled < 0 ? styles.overText : ""}>
                      {money(Math.abs(unscheduled), currency)}
                    </dd>
                  </div>
                </dl>

                {addingPayment ? (
                  <div className={styles.payForm}>
                    <div className={styles.fieldRow}>
                      <label className={styles.field}>
                        <span className={styles.fieldLabel}>What for</span>
                        <input
                          className={styles.input}
                          value={pay.label}
                          placeholder="Deposit"
                          onChange={(e) => setPay((p) => ({ ...p, label: e.target.value }))}
                        />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.fieldLabel}>Amount</span>
                        <input
                          className={styles.input}
                          type="number"
                          value={pay.amount}
                          onChange={(e) => setPay((p) => ({ ...p, amount: e.target.value }))}
                        />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.fieldLabel}>Due</span>
                        <input
                          className={styles.input}
                          type="date"
                          value={pay.due_date}
                          onChange={(e) => setPay((p) => ({ ...p, due_date: e.target.value }))}
                        />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.fieldLabel}>Already paid on</span>
                        <input
                          className={styles.input}
                          type="date"
                          value={pay.paid_on}
                          onChange={(e) => setPay((p) => ({ ...p, paid_on: e.target.value }))}
                        />
                        <span className={styles.hint}>Leave blank if it&rsquo;s still to come.</span>
                      </label>
                    </div>
                    <div className={styles.payFormActions}>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={addPayment}
                        disabled={!Number(pay.amount)}
                      >
                        Add payment
                      </button>
                      <button
                        type="button"
                        className={styles.linkBtn}
                        onClick={() => setAddingPayment(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => setAddingPayment(true)}
                  >
                    <IconPlus size={14} className={styles.btnIcon} />
                    Add payment
                  </button>
                )}
              </>
            )}
          </section>
        </div>

        <footer className={styles.drawerFoot}>
          {error && <span className={styles.error}>{error}</span>}
          <button
            type="button"
            className={styles.linkBtn}
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={save}
            disabled={saving || !form.name.trim()}
          >
            {saving ? "Saving…" : item ? "Save changes" : "Add expense"}
          </button>
        </footer>
      </div>
      {dialog}
    </>
  );
}

function money(n: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${currency} ${Math.round(n).toLocaleString()}`;
  }
}
