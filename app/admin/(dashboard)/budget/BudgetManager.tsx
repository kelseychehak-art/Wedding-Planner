"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import MetricStrip, { type Metric } from "@/components/admin/MetricStrip";
import Pagination from "@/components/admin/Pagination";
import Money from "@/components/admin/Money";
import { Toolbar, ToolbarSearch, FilterSelect } from "@/components/admin/Toolbar";
import { useConfirm } from "@/components/admin/useConfirm";
import {
  IconWallet,
  IconBasket,
  IconCheckCircle,
  IconClock,
  IconAlert,
  IconPlus,
  IconPencil,
} from "@/components/admin/icons";
import ItemDrawer from "./ItemDrawer";
import styles from "./budget.module.css";

/*
 * Admin Budget — docs/admin/budget.md, adapted to this repo.
 *
 * Four money columns, and they mean different things:
 *   Budgeted  — what you planned to spend
 *   Spent     — what it actually costs, once you know
 *   Committed — promised but not yet invoiced
 *   Paid      — the sum of real payments, never a number anyone typed
 *
 * `amount_paid` and `status` used to be stored columns you could edit into
 * disagreement with reality. Both are now derived in `admin_get_budget`, so
 * this component only ever displays them.
 */

export type BudgetCategory = {
  id: string;
  name: string;
  budgeted_amount: number | null;
  sort_order: number;
  item_count: number;
  planned: number;
  actual: number;
  paid: number;
};

export type BudgetItem = {
  id: string;
  name: string;
  category_id: string | null;
  category: string;
  estimated_amount: number | null;
  actual_amount: number | null;
  committed_amount: number | null;
  due_date: string | null;
  notes: string | null;
  vendor_id: string | null;
  vendor_name: string | null;
  amount_paid: number;
  scheduled_total: number;
  next_due: string | null;
  status: string;
  created_at: string;
};

export type BudgetPayment = {
  id: string;
  item_id: string;
  item_name: string;
  category: string;
  label: string | null;
  amount: number;
  due_date: string | null;
  paid_on: string | null;
  method: string | null;
  note: string | null;
};

export type VendorOption = { id: string; name: string; category: string };

type TabKey = "all" | "over" | "unpaid" | "payments";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All Items" },
  { key: "over", label: "Over Budget" },
  { key: "unpaid", label: "Unpaid" },
  { key: "payments", label: "Upcoming Payments" },
];

const STATUS_CLASS: Record<string, string> = {
  Paid: styles.pillPaid,
  Partial: styles.pillPartial,
  Committed: styles.pillCommitted,
  "Over Budget": styles.pillOver,
  Planned: styles.pillPlanned,
};

/** What a line actually costs: the real figure once known, else the estimate. */
export function itemCost(i: BudgetItem): number {
  return Number(i.actual_amount ?? i.estimated_amount ?? 0);
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return new Date(`${m[0]}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* Compared as calendar dates, not timestamps, so a due date can't shift a day
   depending on the reader's timezone. */
export function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(`${iso}T00:00:00`).getTime() - today.getTime()) / 86400000);
}

function dueLabel(iso: string | null): { text: string; tone: string } {
  if (!iso) return { text: "—", tone: "" };
  const d = daysUntil(iso);
  if (d < 0) return { text: `${Math.abs(d)} days overdue`, tone: styles.dueOverdue };
  if (d === 0) return { text: "Due today", tone: styles.dueOverdue };
  if (d <= 30) return { text: `In ${d} days`, tone: styles.dueSoon };
  return { text: `In ${d} days`, tone: "" };
}

export default function BudgetManager({
  initialTotal,
  initialCurrency,
  initialItems,
  initialCategories,
  initialPayments,
  vendors,
  eurUsdRate,
  initialTab,
  initialCategoryId,
}: {
  initialTotal: number;
  initialCurrency: string;
  initialItems: BudgetItem[];
  initialCategories: BudgetCategory[];
  initialPayments: BudgetPayment[];
  vendors: VendorOption[];
  eurUsdRate: number;
  initialTab?: string;
  initialCategoryId?: string;
}) {
  const router = useRouter();
  const { confirm, dialog } = useConfirm();

  /*
   * Read straight from props rather than copying into state. Paid and status
   * are computed in the database, so after any write the only trustworthy
   * version is the one the server just recalculated — `router.refresh()` brings
   * it back, and local state would sit in front of it showing stale figures.
   */
  const items = initialItems;
  const categories = initialCategories;
  const payments = initialPayments;
  const total = initialTotal;
  const currency = initialCurrency;

  const [tab, setTab] = useState<TabKey>(
    TABS.some((t) => t.key === initialTab) ? (initialTab as TabKey) : "all"
  );
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryId ?? "");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* Held as an id, not the row: ticking a payment refreshes the page data, and
     a captured row object would leave the open drawer showing the old figures. */
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [editingBudget, setEditingBudget] = useState(false);
  const [totalDraft, setTotalDraft] = useState(String(initialTotal));
  const [currencyDraft, setCurrencyDraft] = useState(initialCurrency);
  const [catEditId, setCatEditId] = useState<string | null>(null);
  const [catDraft, setCatDraft] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [saving, setSaving] = useState(false);

  const money = useMemo(
    () => (n: number) => {
      try {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }).format(n);
      } catch {
        return `${currency} ${Math.round(n).toLocaleString()}`;
      }
    },
    [currency]
  );

  const totals = useMemo(() => {
    const spent = items.reduce((s, i) => s + itemCost(i), 0);
    const committed = items.reduce((s, i) => s + Number(i.committed_amount ?? 0), 0);
    const paid = payments.reduce((s, p) => s + (p.paid_on ? Number(p.amount) : 0), 0);
    const overCategories = categories.filter(
      (c) => Number(c.budgeted_amount ?? 0) > 0 && c.actual > Number(c.budgeted_amount)
    );
    return { spent, committed, paid, remaining: total - spent, overCategories };
  }, [items, payments, categories, total]);

  const pct = (n: number) => (total > 0 ? `${((n / total) * 100).toFixed(1)}% of budget` : "—");

  const metrics: Metric[] = useMemo(
    () => [
      {
        key: "total",
        icon: <IconWallet size={22} />,
        value: money(total),
        label: "Total Budget",
        sub: `${items.length} line${items.length === 1 ? "" : "s"}`,
      },
      {
        key: "spent",
        icon: <IconBasket size={22} />,
        value: money(totals.spent),
        label: "Total Spent",
        sub: pct(totals.spent),
        tone: totals.spent > total && total > 0 ? "bad" : "default",
      },
      {
        key: "committed",
        icon: <IconClock size={22} />,
        value: money(totals.committed),
        label: "Committed",
        sub: pct(totals.committed),
        tone: "info",
      },
      {
        key: "paid",
        icon: <IconCheckCircle size={22} />,
        value: money(totals.paid),
        label: "Paid",
        sub: pct(totals.paid),
        tone: "good",
      },
      {
        key: "remaining",
        icon: <IconWallet size={22} />,
        value: money(Math.abs(totals.remaining)),
        label: totals.remaining < 0 ? "Over Budget" : "Remaining",
        sub: pct(Math.abs(totals.remaining)),
        tone: totals.remaining < 0 ? "bad" : "default",
      },
      {
        key: "over",
        icon: <IconAlert size={22} />,
        value: String(totals.overCategories.length),
        label: "Over Budget",
        sub: totals.overCategories.length ? "Review categories" : "All categories on track",
        tone: totals.overCategories.length ? "bad" : "good",
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [money, total, items.length, totals]
  );

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    const scope =
      tab === "over"
        ? items.filter((i) => i.status === "Over Budget")
        : tab === "unpaid"
          ? items.filter((i) => i.amount_paid < itemCost(i))
          : items;

    return scope.filter((i) => {
      if (categoryFilter && i.category_id !== categoryFilter) return false;
      if (statusFilter && i.status !== statusFilter) return false;
      if (q && !`${i.name} ${i.vendor_name ?? ""} ${i.category}`.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [items, tab, categoryFilter, statusFilter, search]);

  /* The Upcoming Payments tab shows the payment schedule itself, not items:
     what is owed, when, and what has already gone out. */
  const scheduleRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments
      .filter((p) => !p.paid_on)
      .filter((p) => !q || `${p.item_name} ${p.label ?? ""}`.toLowerCase().includes(q))
      .sort((a, b) => (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999"));
  }, [payments, search]);

  const rows: (BudgetItem | BudgetPayment)[] = tab === "payments" ? scheduleRows : filteredItems;
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const clampedPage = Math.min(page, pageCount);
  const visible = rows.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);

  function changeTab(next: TabKey) {
    setTab(next);
    setPage(1);
    router.replace(`/admin/budget${next === "all" ? "" : `?tab=${next}`}`, { scroll: false });
  }

  async function post(entity: string, item: unknown) {
    const res = await fetch("/api/admin/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity, item }),
    });
    return res.ok ? ((await res.json()).item as Record<string, unknown>) : null;
  }

  async function saveTotal() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/budget/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total: totalDraft, currency: currencyDraft }),
      });
      if (!res.ok) return;
      setEditingBudget(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function saveCategoryBudget(c: BudgetCategory) {
    await post("category", { id: c.id, budgeted_amount: catDraft.trim() });
    setCatEditId(null);
    setCatDraft("");
    router.refresh();
  }

  async function addCategory() {
    const name = newCatName.trim();
    if (!name) return;
    if (await post("category", { name })) {
      setNewCatName("");
      router.refresh();
    }
  }

  async function removeCategory(c: BudgetCategory) {
    const ok = await confirm({
      title: `Delete the “${c.name}” category?`,
      body:
        c.item_count > 0
          ? `Its ${c.item_count} line${c.item_count === 1 ? "" : "s"} stay, and become uncategorised — no spending is lost.`
          : "Nothing is filed under it.",
    });
    if (!ok) return;
    const res = await fetch(`/api/admin/budget?entity=category&id=${c.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  async function removeItem(i: BudgetItem) {
    const ok = await confirm({
      title: `Delete “${i.name}”?`,
      body:
        i.amount_paid > 0
          ? `The ${money(i.amount_paid)} already recorded as paid against it goes too.`
          : "Its scheduled payments go with it.",
    });
    if (!ok) return;
    const res = await fetch(`/api/admin/budget?entity=item&id=${i.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  async function markPaid(p: BudgetPayment) {
    await post("payment", { id: p.id, paid_on: new Date().toISOString().slice(0, 10) });
    router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="Budget"
        subtitle="Track your spending, manage payments, and stay on budget."
        action={
          <div className={styles.headerActions}>
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setTotalDraft(String(total));
                setCurrencyDraft(currency);
                setEditingBudget((v) => !v);
              }}
            >
              <IconPencil size={14} className={styles.btnIcon} />
              Total
            </button>
            <button type="button" className="btn-primary" onClick={() => setEditingId("new")}>
              <IconPlus size={15} className={styles.btnIcon} />
              Add Expense
            </button>
          </div>
        }
      />

      {editingBudget && (
        <div className={styles.totalEditor}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Total budget</span>
            <input
              className={styles.input}
              type="number"
              value={totalDraft}
              onChange={(e) => setTotalDraft(e.target.value)}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Currency</span>
            <input
              className={styles.input}
              value={currencyDraft}
              maxLength={3}
              onChange={(e) => setCurrencyDraft(e.target.value.toUpperCase())}
            />
          </label>
          <button type="button" className="btn-primary" onClick={saveTotal} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            className={styles.linkBtn}
            onClick={() => setEditingBudget(false)}
          >
            Cancel
          </button>
        </div>
      )}

      <MetricStrip metrics={metrics} />

      <div className={styles.layout}>
        {/* ---- Categories ---- */}
        <aside className={styles.catPanel}>
          <h2 className={styles.panelTitle}>Budget by Category</h2>
          <ul className={styles.catList}>
            {categories.map((c) => {
              const budgeted = Number(c.budgeted_amount ?? 0);
              const share = budgeted > 0 ? (c.actual / budgeted) * 100 : 0;
              const over = budgeted > 0 && c.actual > budgeted;
              const selected = categoryFilter === c.id;
              return (
                <li key={c.id}>
                  <div className={`${styles.catRow} ${selected ? styles.catRowActive : ""}`}>
                    <button
                      type="button"
                      className={styles.catMain}
                      onClick={() => {
                        setCategoryFilter(selected ? "" : c.id);
                        setPage(1);
                      }}
                      aria-pressed={selected}
                    >
                      <span className={styles.catName}>{c.name}</span>
                      <span className={styles.catFigures}>
                        {budgeted > 0 ? money(budgeted) : "No budget set"}
                        <span className={styles.catSpent}>{money(c.actual)} spent</span>
                      </span>
                    </button>
                    <span className={`${styles.catPct} ${over ? styles.catPctOver : ""}`}>
                      {budgeted > 0 ? `${share.toFixed(1)}%` : "—"}
                    </span>
                  </div>

                  {budgeted > 0 && (
                    <div className={styles.catTrack}>
                      <span
                        className={`${styles.catFill} ${over ? styles.catFillOver : ""}`}
                        style={{ width: `${Math.min(100, share)}%` }}
                      />
                    </div>
                  )}

                  {catEditId === c.id ? (
                    <div className={styles.catEdit}>
                      <input
                        className={styles.catInput}
                        type="number"
                        autoFocus
                        placeholder="Budget for this category"
                        value={catDraft}
                        onChange={(e) => setCatDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveCategoryBudget(c);
                          if (e.key === "Escape") setCatEditId(null);
                        }}
                      />
                      <button
                        type="button"
                        className={styles.linkBtn}
                        onClick={() => saveCategoryBudget(c)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className={styles.catActions}>
                      <button
                        type="button"
                        className={styles.linkBtn}
                        onClick={() => {
                          setCatDraft(c.budgeted_amount == null ? "" : String(c.budgeted_amount));
                          setCatEditId(c.id);
                        }}
                      >
                        {budgeted > 0 ? "Change budget" : "Set budget"}
                      </button>
                      <button
                        type="button"
                        className={styles.catDelete}
                        onClick={() => removeCategory(c)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className={styles.catAdd}>
            <input
              className={styles.catInput}
              value={newCatName}
              placeholder="New category"
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addCategory();
              }}
            />
            <button
              type="button"
              className={styles.linkBtn}
              onClick={addCategory}
              disabled={!newCatName.trim()}
            >
              Add
            </button>
          </div>
        </aside>

        {/* ---- Items / payments ---- */}
        <section className={styles.tablePanel}>
          <div className={styles.tabs} role="tablist" aria-label="Budget views">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                className={`${styles.tab} ${tab === t.key ? styles.tabActive : ""}`}
                onClick={() => changeTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Toolbar>
            <ToolbarSearch
              value={search}
              onChange={setSearch}
              placeholder={tab === "payments" ? "Search payments…" : "Search items…"}
            />
            {tab !== "payments" && (
              <>
                <FilterSelect
                  label="Category"
                  value={categoryFilter}
                  onChange={(v) => {
                    setCategoryFilter(v);
                    setPage(1);
                  }}
                  options={[
                    { value: "", label: "All" },
                    ...categories.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                />
                <FilterSelect
                  label="Status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { value: "", label: "All" },
                    { value: "Planned", label: "Planned" },
                    { value: "Committed", label: "Committed" },
                    { value: "Partial", label: "Partial" },
                    { value: "Paid", label: "Paid" },
                    { value: "Over Budget", label: "Over Budget" },
                  ]}
                />
              </>
            )}
          </Toolbar>

          {rows.length === 0 ? (
            <p className={styles.empty}>
              {tab === "payments"
                ? "Nothing scheduled. Open a line and add its deposit and balance — that's what fills this in."
                : items.length === 0
                  ? "No budget lines yet. Add the villa, the caterer, the photographer — then give each one a payment schedule so you can see what's due when."
                  : "Nothing matches these filters."}
            </p>
          ) : (
            <div className={styles.tableWrap}>
              {tab === "payments" ? (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Payment</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Due</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {(visible as BudgetPayment[]).map((p) => {
                      const due = dueLabel(p.due_date);
                      return (
                        <tr key={p.id}>
                          <td>
                            <div className={styles.itemName}>{p.item_name}</div>
                            {p.label && <div className={styles.sub}>{p.label}</div>}
                          </td>
                          <td>{p.category}</td>
                          <td>
                            <Money
                              amount={p.amount}
                              currency={currency}
                              eurUsdRate={eurUsdRate}
                              size="sm"
                            />
                          </td>
                          <td>
                            {fmtDate(p.due_date)}
                            <div className={`${styles.sub} ${due.tone}`}>{due.text}</div>
                          </td>
                          <td>
                            <div className={styles.rowActions}>
                              <button type="button" onClick={() => markPaid(p)}>
                                Mark paid
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Category</th>
                      <th>Budgeted</th>
                      <th>Spent</th>
                      <th>Committed</th>
                      <th>Paid</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {(visible as BudgetItem[]).map((i) => {
                      const due = dueLabel(i.due_date ?? i.next_due);
                      return (
                        <tr key={i.id}>
                          <td>
                            <button
                              type="button"
                              className={styles.itemLink}
                              onClick={() => setEditingId(i.id)}
                            >
                              {i.name}
                            </button>
                            {i.vendor_name && <div className={styles.sub}>{i.vendor_name}</div>}
                          </td>
                          <td>
                            <span className={styles.catTag}>{i.category}</span>
                          </td>
                          <td>
                            <Money
                              amount={i.estimated_amount}
                              currency={currency}
                              eurUsdRate={eurUsdRate}
                              size="sm"
                            />
                          </td>
                          <td className={i.status === "Over Budget" ? styles.overText : ""}>
                            <Money
                              amount={itemCost(i)}
                              currency={currency}
                              eurUsdRate={eurUsdRate}
                              size="sm"
                            />
                          </td>
                          <td>
                            {i.committed_amount ? (
                              <Money
                                amount={i.committed_amount}
                                currency={currency}
                                eurUsdRate={eurUsdRate}
                                size="sm"
                              />
                            ) : (
                              "—"
                            )}
                          </td>
                          <td>
                            {i.amount_paid ? (
                              <Money
                                amount={i.amount_paid}
                                currency={currency}
                                eurUsdRate={eurUsdRate}
                                size="sm"
                              />
                            ) : (
                              "—"
                            )}
                          </td>
                          <td>
                            {fmtDate(i.due_date ?? i.next_due)}
                            {due.text !== "—" && (
                              <div className={`${styles.sub} ${due.tone}`}>{due.text}</div>
                            )}
                          </td>
                          <td>
                            <span
                              className={`${styles.pill} ${STATUS_CLASS[i.status] ?? styles.pillPlanned}`}
                            >
                              {i.status}
                            </span>
                          </td>
                          <td>
                            <div className={styles.rowActions}>
                              <button type="button" onClick={() => setEditingId(i.id)}>
                                Edit
                              </button>
                              <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={() => removeItem(i)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {rows.length > 0 && (
            <Pagination
              total={rows.length}
              page={clampedPage}
              pageSize={pageSize}
              onPage={setPage}
              onPageSize={setPageSize}
              noun={tab === "payments" ? "payments" : "items"}
            />
          )}
        </section>
      </div>

      {editingId && (
        <ItemDrawer
          item={editingId === "new" ? null : (items.find((i) => i.id === editingId) ?? null)}
          categories={categories}
          vendors={vendors}
          payments={payments.filter((p) => p.item_id === editingId)}
          currency={currency}
          eurUsdRate={eurUsdRate}
          onClose={() => setEditingId(null)}
          onSaved={() => {
            setEditingId(null);
            router.refresh();
          }}
          onRefresh={() => router.refresh()}
        />
      )}

      {dialog}
    </div>
  );
}
