"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import MetricStrip, { type Metric } from "@/components/admin/MetricStrip";
import Pagination from "@/components/admin/Pagination";
import {
  IconCalendar,
  IconBasket,
  IconSearch,
  IconPlus,
} from "@/components/admin/icons";
import { useConfirm } from "@/components/admin/useConfirm";
import styles from "./activities.module.css";

/*
 * Admin Activities — docs/admin/activities.md, adapted to this repo's stack.
 * Category and location are plain text for now: the Itinerary spec (which
 * owns wedding_events / event_locations) isn't built yet.
 */

export type Activity = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  location_name: string | null;
  starts_at: string | null;
  ends_at: string | null;
  capacity: number | null;
  cost_per_adult: number | null;
  cost_per_child: number | null;
  status: string;
  age_rule_type: string;
  minimum_age: number | null;
  adult_accompaniment_required: boolean;
  transportation_required: boolean;
};

const CATEGORIES = [
  "Food & Drink",
  "Experience",
  "Adventure",
  "Relaxation",
  "Scenic",
  "Wellness",
  "Other",
];

function fmtDate(iso: string | null, tz: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: tz,
  });
}

function fmtTimeRange(start: string | null, end: string | null, tz: string): string {
  if (!start) return "—";
  const t = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: tz,
    });
  return end ? `${t(start)} – ${t(end)}` : t(start);
}

/* Per-person costs are held in euros (the wedding is in Italy). */
const eur = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

function money(n: number | null): string | null {
  if (n == null) return null;
  return eur.format(n);
}

function ageLabel(a: Activity): string {
  if (a.age_rule_type === "adults_only") return "18+ only";
  if (a.age_rule_type === "minimum_age" && a.minimum_age) return `${a.minimum_age}+`;
  return "All ages";
}

export default function ActivitiesManager({
  initialActivities,
  timezone,
}: {
  initialActivities: Activity[];
  timezone: string;
}) {
  const { confirm, dialog } = useConfirm();
  const router = useRouter();
  const [activities, setActivities] = useState(initialActivities);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editing, setEditing] = useState<Activity | "new" | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const metrics: Metric[] = useMemo(() => {
    const published = activities.filter((a) => a.status === "published").length;
    const priced = activities.filter((a) => a.cost_per_adult != null).length;

    return [
      {
        key: "total",
        icon: <IconCalendar size={22} />,
        value: String(activities.length),
        label: "Total Activities",
        sub: `${published} published`,
      },
      {
        key: "priced",
        icon: <IconBasket size={22} />,
        value: String(priced),
        label: "With a Cost",
        sub: "Have a per-person price",
        tone: "info",
      },
    ];
  }, [activities]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activities.filter((a) => {
      if (statusFilter && a.status !== statusFilter) return false;
      if (categoryFilter && a.category !== categoryFilter) return false;
      if (q && !a.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [activities, search, statusFilter, categoryFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const clampedPage = Math.min(page, pageCount);
  const visible = filtered.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);

  async function remove(a: Activity) {
    if (!(await confirm({ title: `Delete “${a.title}”?`, body: "This removes the activity for good." }))) return;
    const res = await fetch(`/api/admin/activities?id=${a.id}`, { method: "DELETE" });
    if (res.ok) {
      setActivities((prev) => prev.filter((x) => x.id !== a.id));
      router.refresh();
    }
  }

  return (
    <div>
      <PageHeader
        title="Activities"
        subtitle="Manage optional experiences, pricing, and logistics."
        action={
          <button type="button" className="btn-primary" onClick={() => setEditing("new")}>
            <IconPlus size={15} className={styles.btnIcon} />
            Add Activity
          </button>
        }
      />

      <MetricStrip metrics={metrics} />

      <div className={styles.toolbar}>
        <span className={styles.searchWrap}>
          <IconSearch size={15} className={styles.searchIcon} />
          <input
            className={styles.search}
            type="search"
            placeholder="Search activities…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </span>
        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          className={styles.select}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Types</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {editing && (
        <ActivityForm
          activity={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}

      {activities.length === 0 ? (
        <p className={styles.empty}>
          No activities yet. Add the wine tasting, cooking class, or pool day — each one becomes
          a card guests can see, with its per-person cost.
        </p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Category</th>
                <th>Cost / person</th>
                <th>Age Rules</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visible.map((a) => {
                const adult = money(a.cost_per_adult);
                const child = money(a.cost_per_child);
                return (
                  <tr key={a.id}>
                    <td>
                      <div className={styles.title}>{a.title}</div>
                      {a.description && <div className={styles.sub}>{a.description}</div>}
                    </td>
                    <td>{fmtDate(a.starts_at, timezone)}</td>
                    <td>{fmtTimeRange(a.starts_at, a.ends_at, timezone)}</td>
                    <td>{a.location_name ?? "—"}</td>
                    <td>{a.category ?? "—"}</td>
                    <td>
                      {adult ? (
                        <>
                          {adult}
                          {child && <span className={styles.sub}> · {child} child</span>}
                        </>
                      ) : (
                        "Free"
                      )}
                    </td>
                    <td>{ageLabel(a)}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          a.status === "published" ? styles.statusPublished : styles.statusDraft
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <button type="button" onClick={() => setEditing(a)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => remove(a)}
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
        </div>
      )}

      <Pagination
        total={filtered.length}
        page={clampedPage}
        pageSize={pageSize}
        onPage={setPage}
        onPageSize={setPageSize}
        noun="activities"
      />

      {dialog}
    </div>
  );
}

/* ---------- Form ---------- */

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function ActivityForm({
  activity,
  onCancel,
  onSaved,
}: {
  activity: Activity | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    id: activity?.id ?? "",
    title: activity?.title ?? "",
    description: activity?.description ?? "",
    category: activity?.category ?? "Experience",
    location_name: activity?.location_name ?? "",
    starts_at: toLocalInput(activity?.starts_at ?? null),
    ends_at: toLocalInput(activity?.ends_at ?? null),
    cost_per_adult: activity?.cost_per_adult != null ? String(activity.cost_per_adult) : "",
    cost_per_child: activity?.cost_per_child != null ? String(activity.cost_per_child) : "",
    status: activity?.status ?? "draft",
    age_rule_type: activity?.age_rule_type ?? "all_ages",
    minimum_age: activity?.minimum_age != null ? String(activity.minimum_age) : "",
    transportation_required: activity?.transportation_required ?? false,
  });
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : "",
          ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : "",
        }),
      });
      if (res.ok) onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>{activity ? "Edit activity" : "Add activity"}</h2>
      <div className={styles.formGrid}>
        <Field label="Title" wide>
          <input
            className={styles.input}
            value={form.title}
            placeholder="Wine Tasting at Villa di Terra"
            onChange={(e) => set("title", e.target.value)}
          />
        </Field>
        <Field label="Description" wide>
          <input
            className={styles.input}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>
        <Field label="Category">
          <select
            className={styles.input}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Location">
          <input
            className={styles.input}
            value={form.location_name}
            onChange={(e) => set("location_name", e.target.value)}
          />
        </Field>
        <Field label="Starts">
          <input
            className={styles.input}
            type="datetime-local"
            value={form.starts_at}
            onChange={(e) => set("starts_at", e.target.value)}
          />
        </Field>
        <Field label="Ends">
          <input
            className={styles.input}
            type="datetime-local"
            value={form.ends_at}
            onChange={(e) => set("ends_at", e.target.value)}
          />
        </Field>
        <Field label="Cost per adult (€)">
          <input
            className={styles.input}
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            value={form.cost_per_adult}
            onChange={(e) => set("cost_per_adult", e.target.value)}
          />
        </Field>
        <Field label="Cost per child (€)">
          <input
            className={styles.input}
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            value={form.cost_per_child}
            onChange={(e) => set("cost_per_child", e.target.value)}
          />
        </Field>
        <Field label="Status">
          <select
            className={styles.input}
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </Field>
        <Field label="Age rule">
          <select
            className={styles.input}
            value={form.age_rule_type}
            onChange={(e) => set("age_rule_type", e.target.value)}
          >
            <option value="all_ages">All ages</option>
            <option value="minimum_age">Minimum age</option>
            <option value="adults_only">Adults only</option>
          </select>
        </Field>
        {form.age_rule_type === "minimum_age" && (
          <Field label="Minimum age">
            <input
              className={styles.input}
              type="number"
              min="0"
              value={form.minimum_age}
              onChange={(e) => set("minimum_age", e.target.value)}
            />
          </Field>
        )}
      </div>

      <label className={styles.toggle}>
        <input
          type="checkbox"
          checked={form.transportation_required}
          onChange={(e) => set("transportation_required", e.target.checked)}
        />
        Transportation required
      </label>

      <div className={styles.formActions}>
        <button
          type="button"
          className="btn-primary"
          onClick={save}
          disabled={saving || !form.title.trim()}
        >
          {saving ? "Saving…" : "Save activity"}
        </button>
        <button type="button" className={styles.linkBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`${styles.field} ${wide ? styles.fieldWide : ""}`}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
    </label>
  );
}
