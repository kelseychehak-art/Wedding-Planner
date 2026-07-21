"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import MetricStrip, { type Metric } from "@/components/admin/MetricStrip";
import {
  IconHome,
  IconUsers,
  IconBuilding,
  IconAlert,
  IconCalendar,
  IconSearch,
} from "@/components/admin/icons";
import styles from "./lodging.module.css";

/*
 * Admin Lodging — docs/admin/lodging.md, adapted to this repo's stack.
 * Assignments are party-level (that's how guests are invited here); the
 * spec's per-guest link table exists in the schema for when guests are named.
 */

export type Property = {
  id: string;
  name: string;
  property_type: string | null;
  city: string | null;
  region: string | null;
  default_check_in_date: string | null;
  default_check_out_date: string | null;
  total_rooms_held: number | null;
  status: string;
  guest_description: string | null;
  room_count: number;
  capacity: number;
};

export type Room = {
  id: string;
  property_id: string;
  property_name: string;
  room_name: string;
  room_type: string | null;
  bed_configuration: string | null;
  adult_capacity: number;
  child_capacity: number;
  total_capacity: number;
  accessible: boolean;
  crib_available: boolean;
  inventory_status: string;
};

export type Assignment = {
  id: string;
  room_id: string | null;
  party_id: string | null;
  party_name: string | null;
  property_name: string | null;
  room_name: string | null;
  room_type: string | null;
  total_capacity: number | null;
  check_in_date: string | null;
  check_out_date: string | null;
  status: string;
  guest_notes: string | null;
  party_guest_count: number;
};

export type LodgingRequest = {
  id: string;
  party_name: string | null;
  request_type: string;
  requested_room_type: string | null;
  crib_required: boolean;
  high_chair_required: boolean;
  accessibility_required: boolean;
  notes: string | null;
  status: string;
};

export type LodgingData = {
  properties: Property[];
  rooms: Room[];
  assignments: Assignment[];
  requests: LodgingRequest[];
};

export type PartyOption = { id: string; name: string; guestCount: number };

type Tab = "properties" | "assignments" | "requests" | "summary";

const STATUS_LABEL: Record<string, string> = {
  assigned: "Assigned",
  pending: "Pending",
  needs_room: "Needs room",
  cancelled: "Cancelled",
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function LodgingManager({
  data,
  parties,
}: {
  data: LodgingData;
  parties: PartyOption[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("assignments");
  const [search, setSearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editing, setEditing] = useState<"property" | "assignment" | null>(null);

  const { properties, rooms, assignments, requests } = data;

  const metrics: Metric[] = useMemo(() => {
    const totalRooms = rooms.length;
    const assignedRooms = new Set(
      assignments.filter((a) => a.room_id).map((a) => a.room_id)
    ).size;
    const guestsStaying = assignments
      .filter((a) => a.status === "assigned")
      .reduce((s, a) => s + (a.party_guest_count || 0), 0);
    const checkIn = properties.find((p) => p.default_check_in_date)?.default_check_in_date ?? null;
    const checkOut =
      properties.find((p) => p.default_check_out_date)?.default_check_out_date ?? null;

    return [
      {
        key: "properties",
        icon: <IconHome size={22} />,
        value: String(properties.length),
        label: "Properties",
      },
      {
        key: "guests",
        icon: <IconUsers size={22} />,
        value: String(guestsStaying),
        label: "Guests Staying",
        sub: assignments.length ? `${assignments.length} assignments` : "None yet",
      },
      {
        key: "rooms",
        icon: <IconBuilding size={22} />,
        value: String(assignedRooms),
        label: "Rooms Assigned",
        sub: `of ${totalRooms} available`,
        tone: "info",
      },
      {
        key: "requests",
        icon: <IconAlert size={22} />,
        value: String(requests.filter((r) => r.status === "open").length),
        label: "Room Requests",
        sub: "Need review",
        tone: requests.some((r) => r.status === "open") ? "warn" : "default",
      },
      {
        key: "checkin",
        icon: <IconCalendar size={22} />,
        value: checkIn ? fmtDate(checkIn) : "—",
        label: "Check-in",
      },
      {
        key: "checkout",
        icon: <IconCalendar size={22} />,
        value: checkOut ? fmtDate(checkOut) : "—",
        label: "Check-out",
      },
    ];
  }, [properties, rooms, assignments, requests]);

  const filteredAssignments = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assignments.filter((a) => {
      if (propertyFilter && a.property_name !== propertyFilter) return false;
      if (statusFilter && a.status !== statusFilter) return false;
      if (q && !(a.party_name ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [assignments, search, propertyFilter, statusFilter]);

  async function removeRecord(kind: string, id: string, label: string) {
    if (!confirm(`Delete ${label}?`)) return;
    const res = await fetch(`/api/admin/lodging?kind=${kind}&id=${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "properties", label: "Properties", count: properties.length },
    { key: "assignments", label: "Room Assignments", count: assignments.length },
    { key: "requests", label: "Room Requests", count: requests.length },
    { key: "summary", label: "Lodging Summary" },
  ];

  return (
    <div>
      <PageHeader
        title="Lodging"
        subtitle="Manage properties, room assignments, and guest lodging details."
        action={
          <div className={styles.headerActions}>
            <button
              type="button"
              className="btn-outline"
              onClick={() => setEditing("assignment")}
              disabled={rooms.length === 0}
              title={rooms.length === 0 ? "Add a property and rooms first" : undefined}
            >
              Assign Room
            </button>
            <button type="button" className="btn-primary" onClick={() => setEditing("property")}>
              + Add Property
            </button>
          </div>
        }
      />

      <MetricStrip metrics={metrics} />

      <div className={styles.tabs}>
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`${styles.tab} ${tab === t.key ? styles.tabActive : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            {t.count !== undefined && <span className={styles.tabCount}>{t.count}</span>}
          </button>
        ))}
      </div>

      {editing === "property" && (
        <PropertyForm onClose={() => setEditing(null)} onSaved={() => router.refresh()} />
      )}
      {editing === "assignment" && (
        <AssignmentForm
          rooms={rooms}
          parties={parties}
          onClose={() => setEditing(null)}
          onSaved={() => router.refresh()}
        />
      )}

      {/* ---- Properties ---- */}
      {tab === "properties" &&
        (properties.length === 0 ? (
          <Empty text="No properties yet. Add the villa or hotel your block is held at." />
        ) : (
          <div className={styles.propertyGrid}>
            {properties.map((p) => (
              <div className={styles.propertyCard} key={p.id}>
                <div className={styles.propertyHead}>
                  <h3 className={styles.propertyName}>{p.name}</h3>
                  <span className={styles.pill}>{p.property_type ?? "Property"}</span>
                </div>
                {(p.city || p.region) && (
                  <p className={styles.propertyMeta}>
                    {[p.city, p.region].filter(Boolean).join(", ")}
                  </p>
                )}
                <dl className={styles.propertyStats}>
                  <div>
                    <dt>Rooms</dt>
                    <dd>{p.room_count}</dd>
                  </div>
                  <div>
                    <dt>Sleeps</dt>
                    <dd>{p.capacity}</dd>
                  </div>
                  <div>
                    <dt>Check-in</dt>
                    <dd>{fmtDate(p.default_check_in_date)}</dd>
                  </div>
                  <div>
                    <dt>Check-out</dt>
                    <dd>{fmtDate(p.default_check_out_date)}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  className={styles.deleteLink}
                  onClick={() => removeRecord("property", p.id, p.name)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ))}

      {/* ---- Room assignments ---- */}
      {tab === "assignments" && (
        <>
          <div className={styles.toolbar}>
            <span className={styles.searchWrap}>
              <IconSearch size={15} className={styles.searchIcon} />
              <input
                className={styles.search}
                type="search"
                placeholder="Search guest or party…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </span>
            <select
              className={styles.select}
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
            >
              <option value="">All Properties</option>
              {properties.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              className={styles.select}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {assignments.length === 0 ? (
            <Empty text="No room assignments yet. Add a property with rooms, then assign parties to them." />
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Guest / Party</th>
                    <th>Property</th>
                    <th>Room</th>
                    <th>Room Type</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Occupancy</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <div className={styles.strong}>
                          {a.party_name ?? "Unassigned"}
                          {a.party_guest_count > 0 && ` (${a.party_guest_count})`}
                        </div>
                      </td>
                      <td>{a.property_name ?? "TBD"}</td>
                      <td>{a.room_name ?? "—"}</td>
                      <td>{a.room_type ?? "—"}</td>
                      <td>{fmtDate(a.check_in_date)}</td>
                      <td>{fmtDate(a.check_out_date)}</td>
                      <td>
                        {a.party_guest_count > 0
                          ? `${a.party_guest_count} ${a.party_guest_count === 1 ? "guest" : "guests"}`
                          : "—"}
                        {a.total_capacity != null && (
                          <div className={styles.sub}>sleeps {a.total_capacity}</div>
                        )}
                      </td>
                      <td>
                        <span
                          className={`${styles.status} ${
                            a.status === "assigned"
                              ? styles.statusAssigned
                              : a.status === "pending"
                                ? styles.statusPending
                                : styles.statusNeeds
                          }`}
                        >
                          {STATUS_LABEL[a.status] ?? a.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.deleteLink}
                          onClick={() =>
                            removeRecord("assignment", a.id, `the ${a.party_name} assignment`)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ---- Requests ---- */}
      {tab === "requests" &&
        (requests.length === 0 ? (
          <Empty text="No room requests. These arrive once guests can submit lodging preferences — the guest-facing form isn't built yet." />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Party</th>
                  <th>Request</th>
                  <th>Room Type</th>
                  <th>Needs</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td className={styles.strong}>{r.party_name ?? "—"}</td>
                    <td>{r.request_type}</td>
                    <td>{r.requested_room_type ?? "—"}</td>
                    <td>
                      {[
                        r.crib_required && "Crib",
                        r.high_chair_required && "High chair",
                        r.accessibility_required && "Accessible",
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </td>
                    <td>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {/* ---- Summary ---- */}
      {tab === "summary" && (
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Room inventory</p>
            {properties.length === 0 ? (
              <p className={styles.summaryEmpty}>No properties yet.</p>
            ) : (
              <ul className={styles.summaryList}>
                {properties.map((p) => (
                  <li key={p.id}>
                    <span>{p.name}</span>
                    <strong>
                      {p.room_count} {p.room_count === 1 ? "room" : "rooms"} · sleeps {p.capacity}
                    </strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Assignment status</p>
            <ul className={styles.summaryList}>
              {Object.entries(STATUS_LABEL).map(([k, v]) => (
                <li key={k}>
                  <span>{v}</span>
                  <strong>{assignments.filter((a) => a.status === k).length}</strong>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Unassigned parties</p>
            <p className={styles.summaryEmpty}>
              {(() => {
                const assigned = new Set(assignments.map((a) => a.party_id));
                const n = parties.filter((p) => !assigned.has(p.id)).length;
                return `${n} ${n === 1 ? "party has" : "parties have"} no room yet.`;
              })()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className={styles.empty}>{text}</p>;
}

/* ---------- Forms ---------- */

function PropertyForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: "",
    property_type: "Villa",
    city: "",
    region: "",
    default_check_in_date: "",
    default_check_out_date: "",
    total_rooms_held: "",
    guest_description: "",
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/lodging", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "property", ...form }),
      });
      if (res.ok) {
        onClose();
        onSaved();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>Add property</h2>
      <div className={styles.formGrid}>
        <Field label="Name">
          <input
            className={styles.input}
            value={form.name}
            placeholder="Villa di Torre"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Type">
          <select
            className={styles.input}
            value={form.property_type}
            onChange={(e) => setForm({ ...form, property_type: e.target.value })}
          >
            <option>Villa</option>
            <option>Hotel</option>
            <option>Agriturismo</option>
            <option>B&amp;B</option>
            <option>Other</option>
          </select>
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
        <Field label="Check-in">
          <input
            className={styles.input}
            type="date"
            value={form.default_check_in_date}
            onChange={(e) => setForm({ ...form, default_check_in_date: e.target.value })}
          />
        </Field>
        <Field label="Check-out">
          <input
            className={styles.input}
            type="date"
            value={form.default_check_out_date}
            onChange={(e) => setForm({ ...form, default_check_out_date: e.target.value })}
          />
        </Field>
        <Field label="Rooms held">
          <input
            className={styles.input}
            type="number"
            value={form.total_rooms_held}
            onChange={(e) => setForm({ ...form, total_rooms_held: e.target.value })}
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
          {saving ? "Saving…" : "Save property"}
        </button>
        <button type="button" className={styles.linkBtn} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function AssignmentForm({
  rooms,
  parties,
  onClose,
  onSaved,
}: {
  rooms: Room[];
  parties: PartyOption[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    party_id: "",
    room_id: "",
    check_in_date: "",
    check_out_date: "",
    status: "assigned",
    guest_notes: "",
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!form.party_id) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/lodging", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "assignment", ...form }),
      });
      if (res.ok) {
        onClose();
        onSaved();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>Assign a room</h2>
      <div className={styles.formGrid}>
        <Field label="Party">
          <select
            className={styles.input}
            value={form.party_id}
            onChange={(e) => setForm({ ...form, party_id: e.target.value })}
          >
            <option value="">Choose a party…</option>
            {parties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Room">
          <select
            className={styles.input}
            value={form.room_id}
            onChange={(e) => setForm({ ...form, room_id: e.target.value })}
          >
            <option value="">Unassigned (needs room)</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.property_name} — {r.room_name} (sleeps {r.total_capacity})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select
            className={styles.input}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {Object.entries(STATUS_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Check-in">
          <input
            className={styles.input}
            type="date"
            value={form.check_in_date}
            onChange={(e) => setForm({ ...form, check_in_date: e.target.value })}
          />
        </Field>
        <Field label="Check-out">
          <input
            className={styles.input}
            type="date"
            value={form.check_out_date}
            onChange={(e) => setForm({ ...form, check_out_date: e.target.value })}
          />
        </Field>
        <Field label="Notes" wide>
          <input
            className={styles.input}
            value={form.guest_notes}
            onChange={(e) => setForm({ ...form, guest_notes: e.target.value })}
          />
        </Field>
      </div>
      <div className={styles.formActions}>
        <button
          type="button"
          className="btn-primary"
          onClick={save}
          disabled={saving || !form.party_id}
        >
          {saving ? "Saving…" : "Save assignment"}
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
