"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import MetricStrip, { type Metric } from "@/components/admin/MetricStrip";
import Pagination from "@/components/admin/Pagination";
import Money from "@/components/admin/Money";
import { Toolbar, ToolbarSearch, FilterSelect } from "@/components/admin/Toolbar";
import { useConfirm } from "@/components/admin/useConfirm";
import {
  IconStore,
  IconMail,
  IconShield,
  IconHeart,
  IconWallet,
  IconPlus,
  IconPhone,
} from "@/components/admin/icons";
import styles from "./vendors.module.css";

/*
 * Admin Vendors — docs/admin/vendors.md, adapted to this repo.
 *
 * Proposals and contracts are fields on the vendor rather than tables of their
 * own: one vendor, one proposal, one contract, exactly as the mockup's single
 * Status column implies.
 *
 * Money is NOT stored here. `contracted_amount` and `paid_amount` are rolled up
 * from budget_items / budget_payments linked by vendor_id, so this page and the
 * Budget page can never quote different figures for the same vendor. Attach a
 * budget line to a vendor in the Budget drawer and it appears here.
 */

export type Vendor = {
  id: string;
  name: string;
  category: string;
  stage: string;
  location: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  estimated_cost: number | null;
  deposit_amount: number | null;
  currency: string | null;
  proposal_status: string;
  proposal_amount: number | null;
  proposal_received_on: string | null;
  contract_status: string;
  contract_sent_on: string | null;
  contract_signed_on: string | null;
  next_action: string | null;
  next_action_date: string | null;
  last_contact: string | null;
  decision: string | null;
  contracted_amount: number;
  paid_amount: number;
  budget_item_count: number;
  next_payment_due: string | null;
  next_task: string | null;
  next_task_due: string | null;
  open_tasks: number;
};

export type VendorTask = {
  id: string;
  vendor_id: string;
  vendor_name: string;
  title: string;
  due_date: string | null;
  done_on: string | null;
  notes: string | null;
};

type TabKey = "all" | "proposals" | "contracts" | "payments" | "tasks";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All Vendors" },
  { key: "proposals", label: "Proposals" },
  { key: "contracts", label: "Contracts" },
  { key: "payments", label: "Payments" },
  { key: "tasks", label: "Tasks" },
];

const STAGES = [
  "Researching",
  "Contacted",
  "Waiting",
  "In conversation",
  "Proposal received",
  "Top contender",
  "Booked",
  "Declined",
];

/*
 * One line that answers "where are we with them". Contract state outranks
 * proposal state, which outranks the research stage — the furthest-along fact
 * is the one worth surfacing.
 */
function statusOf(v: Vendor): { label: string; tone: string } {
  if (v.contract_status === "signed") return { label: "Contract signed", tone: styles.toneGood };
  if (v.contract_status === "sent") return { label: "Contract sent", tone: styles.toneInfo };
  if (v.contract_status === "drafted") return { label: "Contract drafted", tone: styles.toneInfo };
  if (v.proposal_status === "accepted") return { label: "Proposal accepted", tone: styles.toneGood };
  if (v.proposal_status === "under_review") return { label: "Proposal in review", tone: styles.toneWarn };
  if (v.proposal_status === "received") return { label: "Proposal received", tone: styles.toneWarn };
  if (v.proposal_status === "requested") return { label: "Proposal requested", tone: "" };
  if (v.proposal_status === "declined") return { label: "Proposal declined", tone: styles.toneBad };
  return { label: v.stage, tone: "" };
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

function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(`${iso}T00:00:00`).getTime() - today.getTime()) / 86400000);
}

export default function VendorsManager({
  vendors,
  tasks,
  eurUsdRate,
  initialTab,
  initialStage,
}: {
  vendors: Vendor[];
  tasks: VendorTask[];
  eurUsdRate: number;
  initialTab?: string;
  initialStage?: string;
}) {
  const router = useRouter();
  const { confirm, dialog } = useConfirm();

  const [tab, setTab] = useState<TabKey>(
    TABS.some((t) => t.key === initialTab) ? (initialTab as TabKey) : "all"
  );
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stageFilter, setStageFilter] = useState(initialStage ?? "");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [newTask, setNewTask] = useState({ vendor_id: "", title: "", due_date: "" });
  const [savingTask, setSavingTask] = useState(false);

  const categories = useMemo(
    () => [...new Set(vendors.map((v) => v.category).filter(Boolean))].sort(),
    [vendors]
  );

  const metrics: Metric[] = useMemo(() => {
    const proposals = vendors.filter((v) =>
      ["received", "under_review", "requested"].includes(v.proposal_status)
    );
    const contracts = vendors.filter((v) => v.contract_status === "signed");
    const booked = vendors.filter((v) => v.stage === "Booked");
    const due = vendors.filter(
      (v) => v.next_payment_due && daysUntil(v.next_payment_due) <= 30
    );

    return [
      {
        key: "vendors",
        icon: <IconStore size={22} />,
        value: String(vendors.length),
        label: "Vendors",
        sub: "In the pipeline",
      },
      {
        key: "proposals",
        icon: <IconMail size={22} />,
        value: String(proposals.length),
        label: "Proposals",
        sub: "Requested or in review",
        tone: proposals.length ? "warn" : "default",
      },
      {
        key: "contracts",
        icon: <IconShield size={22} />,
        value: String(contracts.length),
        label: "Contracts",
        sub: "Signed",
        tone: contracts.length ? "good" : "default",
      },
      {
        key: "booked",
        icon: <IconHeart size={22} />,
        value: String(booked.length),
        label: "Booked",
        sub: "Locked in",
        tone: "good",
      },
      {
        key: "due",
        icon: <IconWallet size={22} />,
        value: String(due.length),
        label: "Payments Due",
        sub: "Next 30 days",
        tone: due.length ? "warn" : "default",
      },
    ];
  }, [vendors]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const scope =
      tab === "proposals"
        ? vendors.filter((v) => v.proposal_status !== "none")
        : tab === "contracts"
          ? vendors.filter((v) => v.contract_status !== "none")
          : tab === "payments"
            ? vendors.filter((v) => v.budget_item_count > 0)
            : vendors;

    return scope.filter((v) => {
      if (categoryFilter && v.category !== categoryFilter) return false;
      if (stageFilter && v.stage !== stageFilter) return false;
      if (q && !`${v.name} ${v.category} ${v.contact_name ?? ""}`.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [vendors, tab, categoryFilter, stageFilter, search]);

  const openTasks = useMemo(
    () =>
      tasks
        .filter((t) => !t.done_on)
        .sort((a, b) => (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999")),
    [tasks]
  );
  const doneTasks = useMemo(() => tasks.filter((t) => t.done_on), [tasks]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const clampedPage = Math.min(page, pageCount);
  const visible = filtered.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);

  function changeTab(next: TabKey) {
    setTab(next);
    setPage(1);
    router.replace(`/admin/vendors${next === "all" ? "" : `?tab=${next}`}`, { scroll: false });
  }

  async function addTask() {
    if (!newTask.vendor_id || !newTask.title.trim()) return;
    setSavingTask(true);
    try {
      const res = await fetch("/api/admin/vendors/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        setNewTask({ vendor_id: "", title: "", due_date: "" });
        router.refresh();
      }
    } finally {
      setSavingTask(false);
    }
  }

  async function toggleTask(t: VendorTask) {
    await fetch("/api/admin/vendors/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: t.id,
        done_on: t.done_on ? "" : new Date().toISOString().slice(0, 10),
      }),
    });
    router.refresh();
  }

  async function removeTask(t: VendorTask) {
    if (!(await confirm({ title: `Delete “${t.title}”?`, body: `A follow-up for ${t.vendor_name}.` })))
      return;
    const res = await fetch(`/api/admin/vendors/tasks?id=${t.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="Vendors"
        subtitle="Research, proposals, contracts, payments, and what to chase next."
        action={
          <Link href="/admin/vendors/new" className="btn-primary">
            <IconPlus size={15} className={styles.btnIcon} />
            Add Vendor
          </Link>
        }
      />

      <MetricStrip metrics={metrics} />

      <div className={styles.tabs} role="tablist" aria-label="Vendor views">
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
            {t.key === "tasks" && openTasks.length > 0 && (
              <span className={styles.tabCount}>{openTasks.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "tasks" ? (
        <section>
          <div className={styles.taskAdd}>
            <select
              className={styles.input}
              value={newTask.vendor_id}
              onChange={(e) => setNewTask((t) => ({ ...t, vendor_id: e.target.value }))}
              aria-label="Vendor"
            >
              <option value="">Choose a vendor…</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
            <input
              className={styles.input}
              value={newTask.title}
              placeholder="Chase the quote, confirm headcount…"
              onChange={(e) => setNewTask((t) => ({ ...t, title: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTask();
              }}
            />
            <input
              className={styles.input}
              type="date"
              value={newTask.due_date}
              onChange={(e) => setNewTask((t) => ({ ...t, due_date: e.target.value }))}
              aria-label="Due date"
            />
            <button
              type="button"
              className="btn-primary"
              onClick={addTask}
              disabled={savingTask || !newTask.vendor_id || !newTask.title.trim()}
            >
              {savingTask ? "Adding…" : "Add task"}
            </button>
          </div>

          {tasks.length === 0 ? (
            <p className={styles.empty}>
              No follow-ups yet. Add the next thing each vendor is waiting on you for — that&rsquo;s
              what turns a list of names into a plan.
            </p>
          ) : (
            <ul className={styles.taskList}>
              {[...openTasks, ...doneTasks].map((t) => {
                const overdue = !t.done_on && t.due_date && daysUntil(t.due_date) < 0;
                return (
                  <li key={t.id} className={styles.taskRow}>
                    <input
                      type="checkbox"
                      checked={Boolean(t.done_on)}
                      onChange={() => toggleTask(t)}
                      aria-label={t.done_on ? "Mark as still to do" : "Mark done"}
                    />
                    <span className={styles.taskMain}>
                      <span className={t.done_on ? styles.taskTitleDone : styles.taskTitle}>
                        {t.title}
                      </span>
                      <span className={styles.sub}>
                        <Link href={`/admin/vendors/${t.vendor_id}`}>{t.vendor_name}</Link>
                        {t.due_date && !t.done_on && (
                          <span className={overdue ? styles.toneBad : ""}>
                            {" "}
                            · due {fmtDate(t.due_date)}
                            {overdue ? ` (${Math.abs(daysUntil(t.due_date))} days ago)` : ""}
                          </span>
                        )}
                        {t.done_on && <span> · done {fmtDate(t.done_on)}</span>}
                      </span>
                    </span>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => removeTask(t)}
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ) : (
        <>
          <Toolbar>
            <ToolbarSearch value={search} onChange={setSearch} placeholder="Search vendors…" />
            <FilterSelect
              label="Category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={[
                { value: "", label: "All" },
                ...categories.map((c) => ({ value: c, label: c })),
              ]}
            />
            <FilterSelect
              label="Stage"
              value={stageFilter}
              onChange={setStageFilter}
              options={[
                { value: "", label: "All" },
                ...STAGES.map((s) => ({ value: s, label: s })),
              ]}
            />
          </Toolbar>

          {filtered.length === 0 ? (
            <p className={styles.empty}>
              {vendors.length === 0
                ? "No vendors yet. Add the first one to start tracking research, proposals and payments."
                : "No vendors match these filters."}
            </p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>Category</th>
                    <th>Stage</th>
                    <th>Status</th>
                    <th>{tab === "payments" ? "Contracted" : "Est. Cost"}</th>
                    <th>Paid</th>
                    <th>Next follow-up</th>
                    <th>Contact</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {visible.map((v) => {
                    const status = statusOf(v);
                    const contracted = v.contracted_amount || v.estimated_cost || 0;
                    const share =
                      contracted > 0 ? Math.round((v.paid_amount / contracted) * 100) : 0;
                    const overdue =
                      v.next_task_due && daysUntil(v.next_task_due) < 0 ? styles.toneBad : "";
                    return (
                      <tr key={v.id}>
                        <td>
                          <Link href={`/admin/vendors/${v.id}`} className={styles.vendorName}>
                            {v.name}
                          </Link>
                          {v.location && <div className={styles.sub}>{v.location}</div>}
                        </td>
                        <td>{v.category}</td>
                        <td>
                          <span className={styles.stagePill}>{v.stage}</span>
                        </td>
                        <td className={status.tone}>{status.label}</td>
                        <td>
                          {contracted ? (
                            <Money
                              amount={contracted}
                              currency={v.currency ?? "EUR"}
                              eurUsdRate={eurUsdRate}
                              size="sm"
                            />
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>
                          {v.paid_amount ? (
                            <>
                              <Money
                                amount={v.paid_amount}
                                currency={v.currency ?? "EUR"}
                                eurUsdRate={eurUsdRate}
                                size="sm"
                              />
                              <div className={styles.sub}>{share}% of contracted</div>
                            </>
                          ) : (
                            <>
                              <span className={styles.sub}>No payments</span>
                              {v.next_payment_due && (
                                <div className={styles.sub}>
                                  Next due {fmtDate(v.next_payment_due)}
                                </div>
                              )}
                            </>
                          )}
                        </td>
                        <td>
                          {v.next_task ? (
                            <>
                              <div>{v.next_task}</div>
                              {v.next_task_due && (
                                <div className={`${styles.sub} ${overdue}`}>
                                  {fmtDate(v.next_task_due)}
                                </div>
                              )}
                            </>
                          ) : v.next_action ? (
                            <>
                              <div>{v.next_action}</div>
                              {v.next_action_date && (
                                <div className={styles.sub}>{fmtDate(v.next_action_date)}</div>
                              )}
                            </>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>
                          {v.contact_name && <div>{v.contact_name}</div>}
                          {v.contact_phone && (
                            <div className={styles.sub}>
                              <IconPhone size={11} /> {v.contact_phone}
                            </div>
                          )}
                          {v.contact_email && <div className={styles.sub}>{v.contact_email}</div>}
                          {!v.contact_name && !v.contact_phone && !v.contact_email && "—"}
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <Link href={`/admin/vendors/${v.id}`}>Open</Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {filtered.length > 0 && (
            <Pagination
              total={filtered.length}
              page={clampedPage}
              pageSize={pageSize}
              onPage={setPage}
              onPageSize={setPageSize}
              noun="vendors"
            />
          )}

          {tab === "payments" && (
            <p className={styles.footNote}>
              These figures come from the Budget: attach a budget line to a vendor and its
              payments appear here. Nothing about money is stored twice.
            </p>
          )}
        </>
      )}

      {dialog}
    </div>
  );
}
