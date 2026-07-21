"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import MetricStrip, { type Metric } from "@/components/admin/MetricStrip";
import Pagination from "@/components/admin/Pagination";
import {
  IconCalendar,
  IconUsers,
  IconBasket,
  IconClock,
  IconAlert,
  IconSearch,
} from "@/components/admin/icons";
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
  status: string;
  age_rule_type: string;
  minimum_age: number | null;
  adult_accompaniment_required: boolean;
  transportation_required: boolean;
  booked_count: number;
  waitlist_count: number;
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

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
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

/*
 * The sign-up window from Settings, read as plain dates. Compared against
 * today's calendar date rather than a timestamp, so "closes Jul 15" means the
 * whole of the 15th — and no timezone can shift the boundary by a day.
 */
function describeSignupWindow(opens: string, closes: string) {
  const label = (iso: string) => {
    const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}` : iso;
  };
  if (!opens && !closes) {
    return { value: "Not set", sub: "Set it in Settings", tone: "default" as const };
  }

  const today = new Date().toISOString().slice(0, 10);
  const range = [opens && label(opens), closes && label(closes)].filter(Boolean).join(" – ");

  if (opens && today < opens) {
    return { value: "Opens soon", sub: range, tone: "info" as const };
  }
  if (closes && today > closes) {
    return { value: "Closed", sub: range, tone: "bad" as const };
  }
  return { value: "Open", sub: range, tone: "good" as const };
}

function ageLabel(a: Activity): string {
  if (a.age_rule_type === "adults_only") return "18+ only";
  if (a.age_rule_type === "minimum_age" && a.minimum_age) return `${a.minimum_age}+`;
  return "All ages";
}

export default function ActivitiesManager({
  initialActivities,
  timezone,
  signupOpens,
  signupCloses,
}: {
  initialActivities: Activity[];
  timezone: string;
  /* Set under Settings → Events & Activities. */
  signupOpens: string;
  signupCloses: string;
}) {
  const router = useRouter();
  const [activities, setActivities] = useState(initialActivities);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editing, setEditing] = useState<Activity | "new" | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const signupWindow = useMemo(
    () => describeSignupWindow(signupOpens, signupCloses),
    [signupOpens, signupCloses]
  );

  const metrics: Metric[] = useMemo(() => {
    const totalCapacity = activities.reduce((s, a) => s + (a.capacity ?? 0), 0);
    const signedUp = activities.reduce((s, a) => s + a.booked_count, 0);
    const waitlisted = activities.reduce((s, a) => s + a.waitlist_count, 0);
    const spacesLeft = Math.max(0, totalCapacity - signedUp);

    return [
      {
        key: "total",
        icon: <IconCalendar size={22} />,
        value: String(activities.length),
        label: "Total Activities",
        sub: `${activities.filter((a) => a.status === "published").length} published`,
      },
      {
        key: "signed",
        icon: <IconUsers size={22} />,
        value: String(signedUp),
        label: "Signed Up",
        sub: totalCapacity ? `${Math.round((signedUp / totalCapacity) * 100)}% of capacity` : "—",
        tone: "good",
      },
      {
        key: "spaces",
        icon: <IconBasket size={22} />,
        value: String(spacesLeft),
        label: "Spaces Left",
        sub: "Across all activities",
        tone: "info",
      },
      {
        key: "waitlist",
        icon: <IconAlert size={22} />,
        value: String(waitlisted),
        label: "Waitlisted",
        sub: "Across all activities",
        tone: waitlisted > 0 ? "warn" : "default",
      },
      {
        key: "window",
        icon: <IconClock size={22} />,
        value: signupWindow.value,
        label: "Sign-up Window",
        sub: signupWindow.sub,
        tone: signupWindow.tone,
      },
    ];
  }, [activities, signupWindow]);

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
    if (!confirm(`Delete "${a.title}"?`)) return;
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
        subtitle="Manage optional experiences, sign-ups, capacity, and logistics."
        action={
          <button type="button" className="btn-primary" onClick={() => setEditing("new")}>
            + Add Activity
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
          a card guests can sign up for once the guest-facing flow is built.
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
                <th>Capacity</th>
                <th>Signed Up</th>
                <th>Waitlist</th>
                <th>Age Rules</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visible.map((a) => {
                const pct = a.capacity ? Math.round((a.booked_count / a.capacity) * 100) : null;
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
                    <td>{a.capacity ?? "—"}</td>
                    <td>
                      {a.booked_count}
                      {pct !== null && <span className={styles.sub}> ({pct}%)</span>}
                    </td>
                    <td>{a.waitlist_count}</td>
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

      <p className={styles.footNote}>
        Sign-up counts come from real bookings. Guests can&rsquo;t book yet — the guest-facing
        activity sign-up flow is still to build, so these will read zero until then.
      </p>
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
    capacity: activity?.capacity != null ? String(activity.capacity) : "",
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
        <Field label="Capacity">
          <input
            className={styles.input}
            type="number"
            min="0"
            value={form.capacity}
            onChange={(e) => set("capacity", e.target.value)}
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
