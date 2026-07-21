"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import MetricStrip, { type Metric } from "@/components/admin/MetricStrip";
import {
  IconCalendar,
  IconUsers,
  IconCheckCircle,
  IconClock,
  IconBuilding,
  IconAlert,
} from "@/components/admin/icons";
import styles from "./itinerary.module.css";

/*
 * Admin Itinerary — docs/admin/itinerary.md.
 * This is the weekend EVENT schedule (Welcome Dinner, Ceremony, Farewell), which
 * is distinct from /admin/timeline — that page tracks planning milestones.
 */

export type WeddingEvent = {
  id: string;
  title: string;
  short_label: string | null;
  description: string | null;
  guest_description: string | null;
  category: string | null;
  starts_at: string | null;
  ends_at: string | null;
  location_id: string | null;
  location_name: string | null;
  location_property: string | null;
  visibility: string;
  status: string;
  dress_code: string | null;
  what_to_bring: string | null;
  rsvp_enabled: boolean;
  attending_count: number;
  awaiting_count: number;
  declined_count: number;
  block_count: number;
};

export type EventLocation = {
  id: string;
  name: string;
  property_name: string | null;
  city: string | null;
  region: string | null;
};

export type EventTask = {
  id: string;
  title: string;
  is_done: boolean;
  due_date: string | null;
};

export type ItineraryData = {
  events: WeddingEvent[];
  locations: EventLocation[];
  tasks: EventTask[];
};

const CATEGORIES = [
  "Welcome Event",
  "Ceremony",
  "Reception",
  "Activity",
  "Relaxation",
  "Free Time",
  "Celebration",
  "Farewell",
];

const STATUSES = ["draft", "tentative", "scheduled", "confirmed", "cancelled", "completed"];

const STATUS_TONE: Record<string, string> = {
  scheduled: "dotScheduled",
  confirmed: "dotConfirmed",
  draft: "dotDraft",
  tentative: "dotTentative",
  cancelled: "dotCancelled",
  completed: "dotConfirmed",
};

type TabKey = "all" | "public" | "internal" | string;

function fmtDayLabel(iso: string | null, tz: string) {
  if (!iso) return { weekday: "—", date: "" };
  const d = new Date(iso);
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short", timeZone: tz }).toUpperCase(),
    date: d
      .toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: tz })
      .toUpperCase(),
  };
}

function fmtTimeRange(start: string | null, end: string | null, tz: string) {
  if (!start) return "—";
  const t = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: tz,
    });
  return end ? `${t(start)} – ${t(end)}` : t(start);
}

export default function ItineraryManager({
  data,
  timezone,
  invited,
}: {
  data: ItineraryData;
  timezone: string;
  invited: number;
}) {
  const router = useRouter();
  const { events, locations, tasks } = data;
  const [tab, setTab] = useState<TabKey>("all");
  const [editing, setEditing] = useState<WeddingEvent | "new" | null>(null);
  const [editingLocation, setEditingLocation] = useState(false);

  const metrics: Metric[] = useMemo(() => {
    const days = new Set(
      events.filter((e) => e.starts_at).map((e) => e.starts_at!.slice(0, 10))
    ).size;
    const attending = events.reduce((s, e) => s + Number(e.attending_count ?? 0), 0);
    const blocks = events.reduce((s, e) => s + Number(e.block_count ?? 0), 0);
    const openTasks = tasks.filter((t) => !t.is_done).length;

    return [
      {
        key: "events",
        icon: <IconCalendar size={22} />,
        value: String(events.length),
        label: "Events",
        sub: days ? `Across ${days} ${days === 1 ? "day" : "days"}` : "None scheduled",
      },
      {
        key: "invited",
        icon: <IconUsers size={22} />,
        value: String(invited),
        label: "Invited",
        sub: "Across all parties",
      },
      {
        key: "attending",
        icon: <IconCheckCircle size={22} />,
        value: String(attending),
        label: "Attending",
        sub: "Event responses",
        tone: "good",
      },
      {
        key: "blocks",
        icon: <IconClock size={22} />,
        value: String(blocks),
        label: "Time Blocks",
        sub: "Scheduled",
      },
      {
        key: "locations",
        icon: <IconBuilding size={22} />,
        value: String(locations.length),
        label: "Locations",
        sub: locations.length ? "Across Tuscany" : "None yet",
      },
      {
        key: "tasks",
        icon: <IconAlert size={22} />,
        value: String(openTasks),
        label: "To Do Items",
        sub: "Outstanding",
        tone: openTasks > 0 ? "warn" : "default",
      },
    ];
  }, [events, locations, tasks, invited]);

  const categoryTabs = useMemo(() => {
    const cats = Array.from(
      new Set(events.map((e) => e.category).filter(Boolean) as string[])
    );
    return [
      { key: "all", label: "All Events" },
      { key: "public", label: "Public Schedule" },
      { key: "internal", label: "Internal Timeline" },
      ...cats.map((c) => ({ key: c, label: c })),
    ];
  }, [events]);

  const filtered = useMemo(() => {
    if (tab === "all") return events;
    if (tab === "public") return events.filter((e) => e.visibility === "public");
    if (tab === "internal") return events.filter((e) => e.visibility !== "public");
    return events.filter((e) => e.category === tab);
  }, [events, tab]);

  async function remove(e: WeddingEvent) {
    if (!confirm(`Delete "${e.title}"?`)) return;
    const res = await fetch(`/api/admin/itinerary?id=${e.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="Itinerary"
        subtitle="Manage your weekend schedule, timeline, and event details."
        action={
          <div className={styles.headerActions}>
            <button
              type="button"
              className="btn-outline"
              onClick={() => setEditingLocation(true)}
            >
              Add Location
            </button>
            <button type="button" className="btn-primary" onClick={() => setEditing("new")}>
              + Add Event
            </button>
          </div>
        }
      />

      <MetricStrip metrics={metrics} />

      <div className={styles.tabs}>
        {categoryTabs.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`${styles.tab} ${tab === t.key ? styles.tabActive : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {editingLocation && (
        <LocationForm
          onClose={() => setEditingLocation(false)}
          onSaved={() => {
            setEditingLocation(false);
            router.refresh();
          }}
        />
      )}

      {editing && (
        <EventForm
          event={editing === "new" ? null : editing}
          locations={locations}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}

      {events.length === 0 ? (
        <p className={styles.empty}>
          No events yet. Add the Welcome Dinner, Ceremony, and Farewell Brunch — these become the
          weekend schedule guests see, and they unlock per-event RSVP tracking.
        </p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Event</th>
                <th>Time</th>
                <th>Location</th>
                <th>Attending</th>
                <th>Visibility</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => {
                const day = fmtDayLabel(e.starts_at, timezone);
                return (
                  <tr key={e.id}>
                    <td>
                      <div className={styles.dateBlock}>
                        <span className={styles.dateWeekday}>{day.weekday}</span>
                        <span className={styles.dateDay}>{day.date}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.eventTitle}>{e.title}</div>
                      {e.description && (
                        <div className={styles.eventDesc}>{e.description}</div>
                      )}
                      {e.category && <span className={styles.badge}>{e.category}</span>}
                    </td>
                    <td className={styles.nowrap}>
                      {fmtTimeRange(e.starts_at, e.ends_at, timezone)}
                    </td>
                    <td>
                      <div className={styles.locName}>{e.location_name ?? "—"}</div>
                      {e.location_property && (
                        <div className={styles.locSub}>{e.location_property}</div>
                      )}
                    </td>
                    <td>
                      {e.rsvp_enabled ? (
                        <>
                          <div className={styles.attending}>
                            {e.attending_count} <span className={styles.dim}>Attending</span>
                          </div>
                          {e.awaiting_count > 0 && (
                            <div className={styles.awaiting}>
                              {e.awaiting_count} <span className={styles.dim}>Awaiting</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className={styles.dim}>No RSVP</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={
                          e.visibility === "public" ? styles.visPublic : styles.visPrivate
                        }
                      >
                        {e.visibility === "public" ? "Public" : "Private"}
                      </span>
                      <div className={styles.locSub}>
                        {e.visibility === "public" ? "Visible to guests" : "Not visible"}
                      </div>
                    </td>
                    <td className={styles.nowrap}>
                      <span
                        className={`${styles.statusDot} ${styles[STATUS_TONE[e.status] ?? "dotDraft"]}`}
                      />
                      <span className={styles.statusLabel}>{e.status}</span>
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <button type="button" onClick={() => setEditing(e)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => remove(e)}
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

      <div className={styles.legendRow}>
        <ul className={styles.legend}>
          {STATUSES.filter((s) => s !== "completed").map((s) => (
            <li key={s}>
              <span className={`${styles.statusDot} ${styles[STATUS_TONE[s] ?? "dotDraft"]}`} />
              {s}
            </li>
          ))}
        </ul>
        <p className={styles.legendNote}>Times and details are subject to change.</p>
      </div>
    </div>
  );
}

/* ---------- Forms ---------- */

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function EventForm({
  event,
  locations,
  onCancel,
  onSaved,
}: {
  event: WeddingEvent | null;
  locations: EventLocation[];
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    id: event?.id ?? "",
    title: event?.title ?? "",
    description: event?.description ?? "",
    category: event?.category ?? "Activity",
    location_id: event?.location_id ?? "",
    starts_at: toLocalInput(event?.starts_at ?? null),
    ends_at: toLocalInput(event?.ends_at ?? null),
    visibility: event?.visibility ?? "public",
    status: event?.status ?? "draft",
    dress_code: event?.dress_code ?? "",
    what_to_bring: event?.what_to_bring ?? "",
    rsvp_enabled: event?.rsvp_enabled ?? true,
  });
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "event",
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
      <h2 className={styles.formTitle}>{event ? "Edit event" : "Add event"}</h2>
      <div className={styles.formGrid}>
        <Field label="Title" wide>
          <input
            className={styles.input}
            value={form.title}
            placeholder="Welcome Dinner"
            onChange={(e) => set("title", e.target.value)}
          />
        </Field>
        <Field label="Guest description" wide>
          <input
            className={styles.input}
            value={form.description}
            placeholder="Kick off the weekend with a relaxed welcome dinner."
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
          <select
            className={styles.input}
            value={form.location_id}
            onChange={(e) => set("location_id", e.target.value)}
          >
            <option value="">No location set</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
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
        <Field label="Visibility">
          <select
            className={styles.input}
            value={form.visibility}
            onChange={(e) => set("visibility", e.target.value)}
          >
            <option value="public">Public — visible to guests</option>
            <option value="private">Private — admin only</option>
            <option value="selected_guests">Selected guests</option>
          </select>
        </Field>
        <Field label="Status">
          <select
            className={styles.input}
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Dress code">
          <input
            className={styles.input}
            value={form.dress_code}
            onChange={(e) => set("dress_code", e.target.value)}
          />
        </Field>
        <Field label="What to bring">
          <input
            className={styles.input}
            value={form.what_to_bring}
            onChange={(e) => set("what_to_bring", e.target.value)}
          />
        </Field>
      </div>

      <label className={styles.toggle}>
        <input
          type="checkbox"
          checked={form.rsvp_enabled}
          onChange={(e) => set("rsvp_enabled", e.target.checked)}
        />
        Collect an RSVP for this event
      </label>

      <div className={styles.formActions}>
        <button
          type="button"
          className="btn-primary"
          onClick={save}
          disabled={saving || !form.title.trim()}
        >
          {saving ? "Saving…" : "Save event"}
        </button>
        <button type="button" className={styles.linkBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function LocationForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: "",
    property_name: "",
    city: "",
    region: "",
    guest_directions: "",
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "location", ...form }),
      });
      if (res.ok) onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>Add location</h2>
      <div className={styles.formGrid}>
        <Field label="Name">
          <input
            className={styles.input}
            value={form.name}
            placeholder="Villa Courtyard"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Property">
          <input
            className={styles.input}
            value={form.property_name}
            placeholder="Villa Rosa"
            onChange={(e) => setForm({ ...form, property_name: e.target.value })}
          />
        </Field>
        <Field label="City">
          <input
            className={styles.input}
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </Field>
        <Field label="Region">
          <input
            className={styles.input}
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
          />
        </Field>
        <Field label="Directions for guests" wide>
          <input
            className={styles.input}
            value={form.guest_directions}
            onChange={(e) => setForm({ ...form, guest_directions: e.target.value })}
          />
        </Field>
      </div>
      <div className={styles.formActions}>
        <button
          type="button"
          className="btn-primary"
          onClick={save}
          disabled={saving || !form.name.trim()}
        >
          {saving ? "Saving…" : "Save location"}
        </button>
        <button type="button" className={styles.linkBtn} onClick={onClose}>
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
