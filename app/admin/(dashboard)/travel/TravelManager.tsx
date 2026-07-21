"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import MetricStrip, { type Metric } from "@/components/admin/MetricStrip";
import Pagination from "@/components/admin/Pagination";
import {
  IconPlane,
  IconBasket,
  IconAlert,
  IconCalendar,
  IconCheckCircle,
  IconSearch,
  IconDots,
} from "@/components/admin/icons";
import styles from "./travel.module.css";

/*
 * Admin Travel — docs/admin/travel.md, adapted to this repo's stack.
 * Itineraries are party-level (matching how guests are invited here) and
 * carry arrival/departure segments plus transportation needs.
 */

export type Segment = {
  id?: string;
  direction: "arrival" | "departure";
  segment_type: string;
  segment_order: number;
  departure_location_code: string | null;
  departure_city: string | null;
  departure_at: string | null;
  arrival_location_code: string | null;
  arrival_city: string | null;
  arrival_at: string | null;
  carrier_name: string | null;
  service_number: string | null;
  confirmation_number: string | null;
  notes: string | null;
};

export type Itinerary = {
  id: string;
  party_id: string | null;
  party_name: string | null;
  party_side: string | null;
  submission_status: string;
  submitted_by_name: string | null;
  source: string;
  transportation_needed: string;
  transportation_type: string | null;
  transportation_guests: number | null;
  notes: string | null;
  admin_notes: string | null;
  submitted_at: string | null;
  party_guest_count: number;
  segments: Segment[];
};

export type PartyOption = {
  id: string;
  name: string;
  side: string | null;
  guestCount: number;
};

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  in_progress: "In Progress",
  missing: "Missing",
  admin_entered: "Admin Entered",
  needs_review: "Needs Review",
  not_required: "Not Required",
};

const STATUS_TONE: Record<string, string> = {
  submitted: "statusSubmitted",
  in_progress: "statusProgress",
  missing: "statusMissing",
  admin_entered: "statusAdmin",
  needs_review: "statusReview",
  not_required: "statusNone",
};

type ViewKey =
  | "all"
  | "submitted"
  | "missing"
  | "arriving"
  | "departing"
  | "transport";

function seg(it: Itinerary, direction: "arrival" | "departure"): Segment | undefined {
  return it.segments?.find((s) => s.direction === direction);
}

/** The datetime that matters for a segment: when they land, or when they leave. */
function segMoment(s: Segment | undefined): string | null {
  if (!s) return null;
  return s.direction === "arrival" ? s.arrival_at : s.departure_at;
}

/*
 * Flight times are shown in the WEDDING's timezone (Settings → Wedding Details),
 * not the admin's browser locale — an arrival time is only useful for planning
 * pickups if it reads in local-to-the-venue time.
 */
function fmtDate(iso: string | null, tz: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: tz,
  });
}

function fmtTime(iso: string | null, tz: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (d.getUTCHours() === 0 && d.getUTCMinutes() === 0) return "";
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
  });
}

function daysFromNow(iso: string | null): number | null {
  if (!iso) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(iso).getTime() - today.getTime()) / 86400000);
}

export default function TravelManager({
  initialItineraries,
  parties,
  travelDeadline,
  timezone,
}: {
  initialItineraries: Itinerary[];
  parties: PartyOption[];
  travelDeadline: string;
  timezone: string;
}) {
  const router = useRouter();
  const [itineraries, setItineraries] = useState(initialItineraries);
  const [view, setView] = useState<ViewKey>("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [transportFilter, setTransportFilter] = useState("");
  const [editing, setEditing] = useState<Itinerary | "new" | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const partiesWithout = useMemo(() => {
    const covered = new Set(itineraries.map((i) => i.party_id));
    return parties.filter((p) => !covered.has(p.id));
  }, [itineraries, parties]);

  const metrics: Metric[] = useMemo(() => {
    const invitedGuests = parties.reduce((s, p) => s + p.guestCount, 0);
    const submitted = itineraries.filter((i) => i.submission_status === "submitted").length;
    const missing = partiesWithout.length +
      itineraries.filter((i) => i.submission_status === "missing").length;

    const arrivals = itineraries
      .map((i) => segMoment(seg(i, "arrival")))
      .filter(Boolean) as string[];
    const departures = itineraries
      .map((i) => segMoment(seg(i, "departure")))
      .filter(Boolean) as string[];
    const transport = itineraries.filter((i) => i.transportation_needed === "yes").length;

    const range = (list: string[]) => {
      if (!list.length) return "None yet";
      const sorted = [...list].sort();
      return `${fmtDate(sorted[0], timezone)} – ${fmtDate(sorted[sorted.length - 1], timezone)}`;
    };

    return [
      {
        key: "invited",
        icon: <IconPlane size={22} />,
        value: String(invitedGuests || parties.length),
        label: invitedGuests ? "Invited" : "Parties",
        sub: `Across ${parties.length} parties`,
      },
      {
        key: "submitted",
        icon: <IconBasket size={22} />,
        value: String(submitted),
        label: "Submitted",
        sub: parties.length ? `${Math.round((submitted / parties.length) * 100)}% of parties` : "—",
        tone: "good",
      },
      {
        key: "missing",
        icon: <IconAlert size={22} />,
        value: String(missing),
        label: "Missing",
        sub: "Need travel info",
        tone: missing > 0 ? "bad" : "default",
      },
      {
        key: "arriving",
        icon: <IconCalendar size={22} />,
        value: String(arrivals.length),
        label: "Arriving",
        sub: range(arrivals),
        tone: "info",
      },
      {
        key: "departing",
        icon: <IconCalendar size={22} />,
        value: String(departures.length),
        label: "Departing",
        sub: range(departures),
        tone: "info",
      },
      {
        key: "transport",
        icon: <IconCheckCircle size={22} />,
        value: String(transport),
        label: "Need Transport",
        sub: "Airport pickup/drop-off",
      },
    ];
  }, [itineraries, parties, partiesWithout, timezone]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const weekAway = (iso: string | null) => {
      const d = daysFromNow(iso);
      return d !== null && d >= 0 && d <= 7;
    };

    return itineraries.filter((i) => {
      if (view === "submitted" && i.submission_status !== "submitted") return false;
      if (view === "missing" && i.submission_status !== "missing") return false;
      if (view === "arriving" && !weekAway(segMoment(seg(i, "arrival")))) return false;
      if (view === "departing" && !weekAway(segMoment(seg(i, "departure")))) return false;
      if (view === "transport" && i.transportation_needed !== "yes") return false;

      if (statusFilter && i.submission_status !== statusFilter) return false;
      if (transportFilter && i.transportation_needed !== transportFilter) return false;
      if (q && !(i.party_name ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [itineraries, view, search, statusFilter, transportFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const clampedPage = Math.min(page, pageCount);
  const visible = filtered.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);

  const views: { key: ViewKey; label: string; count: number }[] = [
    { key: "all", label: "All", count: itineraries.length },
    {
      key: "submitted",
      label: "Submitted",
      count: itineraries.filter((i) => i.submission_status === "submitted").length,
    },
    {
      key: "missing",
      label: "Missing",
      count: itineraries.filter((i) => i.submission_status === "missing").length,
    },
    {
      key: "arriving",
      label: "Arriving This Week",
      count: itineraries.filter((i) => {
        const d = daysFromNow(segMoment(seg(i, "arrival")));
        return d !== null && d >= 0 && d <= 7;
      }).length,
    },
    {
      key: "departing",
      label: "Departing This Week",
      count: itineraries.filter((i) => {
        const d = daysFromNow(segMoment(seg(i, "departure")));
        return d !== null && d >= 0 && d <= 7;
      }).length,
    },
    {
      key: "transport",
      label: "Need Transport",
      count: itineraries.filter((i) => i.transportation_needed === "yes").length,
    },
  ];

  async function remove(it: Itinerary) {
    if (!confirm(`Delete the travel record for ${it.party_name ?? "this party"}?`)) return;
    const res = await fetch(`/api/admin/travel/itineraries/${it.id}`, { method: "DELETE" });
    if (res.ok) {
      setItineraries((prev) => prev.filter((x) => x.id !== it.id));
      router.refresh();
    }
  }

  return (
    <div>
      <PageHeader
        title="Travel"
        subtitle="Manage guest travel details, arrivals, departures, and transportation needs."
        action={
          <button type="button" className="btn-primary" onClick={() => setEditing("new")}>
            + Add Travel Info
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
            placeholder="Search parties…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </span>
        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Submission: All</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          value={transportFilter}
          onChange={(e) => setTransportFilter(e.target.value)}
        >
          <option value="">Transport: All</option>
          <option value="yes">Needed</option>
          <option value="no">Not needed</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      <div className={styles.tabs}>
        {views.map((v) => (
          <button
            key={v.key}
            type="button"
            className={`${styles.tab} ${view === v.key ? styles.tabActive : ""}`}
            onClick={() => setView(v.key)}
          >
            {v.label} <span className={styles.tabCount}>{v.count}</span>
          </button>
        ))}
      </div>

      {editing && (
        <ItineraryForm
          itinerary={editing === "new" ? null : editing}
          parties={parties}
          onCancel={() => setEditing(null)}
          onSaved={(saved) => {
            setEditing(null);
            setItineraries((prev) => {
              const exists = prev.some((x) => x.id === saved.id);
              return exists ? prev.map((x) => (x.id === saved.id ? saved : x)) : [...prev, saved];
            });
            router.refresh();
          }}
        />
      )}

      {itineraries.length === 0 ? (
        <p className={styles.empty}>
          No travel records yet. Add one, or they&rsquo;ll appear here as guests submit their
          flights.
        </p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th rowSpan={2}>Guest / Party</th>
                <th rowSpan={2}>Submission Status</th>
                <th colSpan={3} className={styles.groupHead}>
                  Arrival
                </th>
                <th colSpan={3} className={styles.groupHead}>
                  Departure
                </th>
                <th rowSpan={2}>Transportation</th>
                <th rowSpan={2}>Notes</th>
                <th rowSpan={2} />
              </tr>
              <tr>
                <th>Date &amp; Time</th>
                <th>Airline &amp; Flight</th>
                <th>From</th>
                <th>Date &amp; Time</th>
                <th>Airline &amp; Flight</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((it) => {
                const a = seg(it, "arrival");
                const d = seg(it, "departure");
                return (
                  <tr key={it.id}>
                    <td>
                      <div className={styles.partyName}>{it.party_name ?? "Unassigned"}</div>
                      <div className={styles.partyMeta}>
                        {it.party_side ? `${it.party_side}'s side · ` : ""}
                        {it.party_guest_count} {it.party_guest_count === 1 ? "guest" : "guests"}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`${styles.status} ${styles[STATUS_TONE[it.submission_status] ?? "statusNone"]}`}
                      >
                        {STATUS_LABEL[it.submission_status] ?? it.submission_status}
                      </span>
                      {it.submitted_by_name && (
                        <div className={styles.partyMeta}>by {it.submitted_by_name}</div>
                      )}
                    </td>
                    <td>
                      <div>{fmtDate(segMoment(a), timezone)}</div>
                      <div className={styles.cellSub}>{fmtTime(segMoment(a), timezone)}</div>
                    </td>
                    <td>
                      {a?.carrier_name || a?.service_number
                        ? `${a?.carrier_name ?? ""} ${a?.service_number ?? ""}`.trim()
                        : "—"}
                    </td>
                    <td>
                      <div>{a?.departure_location_code ?? "—"}</div>
                      <div className={styles.cellSub}>{a?.departure_city ?? ""}</div>
                    </td>
                    <td>
                      <div>{fmtDate(segMoment(d), timezone)}</div>
                      <div className={styles.cellSub}>{fmtTime(segMoment(d), timezone)}</div>
                    </td>
                    <td>
                      {d?.carrier_name || d?.service_number
                        ? `${d?.carrier_name ?? ""} ${d?.service_number ?? ""}`.trim()
                        : "—"}
                    </td>
                    <td>
                      <div>{d?.arrival_location_code ?? "—"}</div>
                      <div className={styles.cellSub}>{d?.arrival_city ?? ""}</div>
                    </td>
                    <td>
                      <div
                        className={
                          it.transportation_needed === "yes"
                            ? styles.transportYes
                            : it.transportation_needed === "unknown"
                              ? styles.transportUnknown
                              : undefined
                        }
                      >
                        {it.transportation_needed === "yes"
                          ? "Yes"
                          : it.transportation_needed === "no"
                            ? "No"
                            : "Unknown"}
                      </div>
                      <div className={styles.cellSub}>{it.transportation_type ?? ""}</div>
                    </td>
                    <td className={styles.notesCell}>{it.notes ?? ""}</td>
                    <td>
                      <div className={styles.rowActions}>
                        <button type="button" onClick={() => setEditing(it)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => remove(it)}
                        >
                          <IconDots size={14} />
                          <span className={styles.srOnly}>Delete</span>
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
        noun="travel records"
      />

      <div className={styles.footCards}>
        <div className={styles.footCard}>
          <p className={styles.footTitle}>Travel Collection Window</p>
          <p className={styles.footBody}>
            {travelDeadline
              ? `Guests can submit or update travel information until ${new Date(
                  travelDeadline + "T00:00:00"
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}.`
              : "No travel deadline set yet — add one in Settings → Travel & Lodging."}
          </p>
        </div>
        <div className={styles.footCard}>
          <p className={styles.footTitle}>Travel Reminders</p>
          <p className={styles.footBody}>
            {`${partiesWithout.length} ${
              partiesWithout.length === 1 ? "party has" : "parties have"
            } no travel record yet.`}{" "}
            Reminder emails need a messaging provider, which isn&rsquo;t wired up.
          </p>
        </div>
        <div className={styles.footCard}>
          <p className={styles.footTitle}>Transportation Summary</p>
          <p className={styles.footBody}>
            {(() => {
              const n = itineraries.filter((i) => i.transportation_needed === "yes").length;
              return `${n} ${n === 1 ? "party needs" : "parties need"} airport transportation.`;
            })()}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Add / edit form ---------- */

type Draft = {
  id?: string;
  party_id: string;
  submission_status: string;
  submitted_by_name: string;
  transportation_needed: string;
  transportation_type: string;
  notes: string;
  arrival_at: string;
  arrival_carrier: string;
  arrival_flight: string;
  arrival_from_code: string;
  arrival_from_city: string;
  departure_at: string;
  departure_carrier: string;
  departure_flight: string;
  departure_to_code: string;
  departure_to_city: string;
};

/** `datetime-local` needs `YYYY-MM-DDTHH:mm`; the DB gives full ISO. */
function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function draftFrom(it: Itinerary | null): Draft {
  const a = it ? seg(it, "arrival") : undefined;
  const d = it ? seg(it, "departure") : undefined;
  return {
    id: it?.id,
    party_id: it?.party_id ?? "",
    submission_status: it?.submission_status ?? "admin_entered",
    submitted_by_name: it?.submitted_by_name ?? "",
    transportation_needed: it?.transportation_needed ?? "unknown",
    transportation_type: it?.transportation_type ?? "",
    notes: it?.notes ?? "",
    arrival_at: toLocalInput(a?.arrival_at),
    arrival_carrier: a?.carrier_name ?? "",
    arrival_flight: a?.service_number ?? "",
    arrival_from_code: a?.departure_location_code ?? "",
    arrival_from_city: a?.departure_city ?? "",
    departure_at: toLocalInput(d?.departure_at),
    departure_carrier: d?.carrier_name ?? "",
    departure_flight: d?.service_number ?? "",
    departure_to_code: d?.arrival_location_code ?? "",
    departure_to_city: d?.arrival_city ?? "",
  };
}

function ItineraryForm({
  itinerary,
  parties,
  onCancel,
  onSaved,
}: {
  itinerary: Itinerary | null;
  parties: PartyOption[];
  onCancel: () => void;
  onSaved: (it: Itinerary) => void;
}) {
  const [draft, setDraft] = useState<Draft>(draftFrom(itinerary));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    if (!draft.party_id) {
      setError("Choose which party this travel belongs to.");
      return;
    }
    setSaving(true);
    setError("");

    const segments: Record<string, unknown>[] = [];
    if (draft.arrival_at || draft.arrival_flight) {
      segments.push({
        direction: "arrival",
        segment_type: "flight",
        segment_order: 0,
        arrival_at: draft.arrival_at ? new Date(draft.arrival_at).toISOString() : null,
        carrier_name: draft.arrival_carrier,
        service_number: draft.arrival_flight,
        departure_location_code: draft.arrival_from_code,
        departure_city: draft.arrival_from_city,
      });
    }
    if (draft.departure_at || draft.departure_flight) {
      segments.push({
        direction: "departure",
        segment_type: "flight",
        segment_order: 0,
        departure_at: draft.departure_at ? new Date(draft.departure_at).toISOString() : null,
        carrier_name: draft.departure_carrier,
        service_number: draft.departure_flight,
        arrival_location_code: draft.departure_to_code,
        arrival_city: draft.departure_to_city,
      });
    }

    try {
      const res = await fetch("/api/admin/travel/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: draft.id,
          party_id: draft.party_id,
          submission_status: draft.submission_status,
          submitted_by_name: draft.submitted_by_name,
          source: "admin",
          transportation_needed: draft.transportation_needed,
          transportation_type: draft.transportation_type,
          notes: draft.notes,
          segments,
        }),
      });
      if (!res.ok) {
        setError("Couldn't save that. Try again.");
        return;
      }
      const { itinerary: savedRow } = await res.json();
      const party = parties.find((p) => p.id === draft.party_id);
      onSaved({
        ...(savedRow as Itinerary),
        party_name: party?.name ?? null,
        party_side: party?.side ?? null,
        party_guest_count: party?.guestCount ?? 0,
        segments: segments as unknown as Segment[],
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>
        {itinerary ? "Edit travel" : "Add travel info"}
      </h2>

      <div className={styles.formGrid}>
        <label className={styles.formField}>
          <span className={styles.formLabel}>Party</span>
          <select
            className={styles.input}
            value={draft.party_id}
            onChange={(e) => set("party_id", e.target.value)}
          >
            <option value="">Choose a party…</option>
            {parties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.formField}>
          <span className={styles.formLabel}>Submission status</span>
          <select
            className={styles.input}
            value={draft.submission_status}
            onChange={(e) => set("submission_status", e.target.value)}
          >
            {Object.entries(STATUS_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.formField}>
          <span className={styles.formLabel}>Submitted by</span>
          <input
            className={styles.input}
            value={draft.submitted_by_name}
            onChange={(e) => set("submitted_by_name", e.target.value)}
          />
        </label>
      </div>

      <h3 className={styles.formSection}>Arrival</h3>
      <div className={styles.formGrid}>
        <label className={styles.formField}>
          <span className={styles.formLabel}>Lands at</span>
          <input
            className={styles.input}
            type="datetime-local"
            value={draft.arrival_at}
            onChange={(e) => set("arrival_at", e.target.value)}
          />
        </label>
        <label className={styles.formField}>
          <span className={styles.formLabel}>Airline</span>
          <input
            className={styles.input}
            value={draft.arrival_carrier}
            onChange={(e) => set("arrival_carrier", e.target.value)}
          />
        </label>
        <label className={styles.formField}>
          <span className={styles.formLabel}>Flight no.</span>
          <input
            className={styles.input}
            value={draft.arrival_flight}
            onChange={(e) => set("arrival_flight", e.target.value)}
          />
        </label>
        <label className={styles.formField}>
          <span className={styles.formLabel}>From (code)</span>
          <input
            className={styles.input}
            placeholder="JFK"
            value={draft.arrival_from_code}
            onChange={(e) => set("arrival_from_code", e.target.value.toUpperCase())}
          />
        </label>
        <label className={styles.formField}>
          <span className={styles.formLabel}>From (city)</span>
          <input
            className={styles.input}
            value={draft.arrival_from_city}
            onChange={(e) => set("arrival_from_city", e.target.value)}
          />
        </label>
      </div>

      <h3 className={styles.formSection}>Departure</h3>
      <div className={styles.formGrid}>
        <label className={styles.formField}>
          <span className={styles.formLabel}>Departs at</span>
          <input
            className={styles.input}
            type="datetime-local"
            value={draft.departure_at}
            onChange={(e) => set("departure_at", e.target.value)}
          />
        </label>
        <label className={styles.formField}>
          <span className={styles.formLabel}>Airline</span>
          <input
            className={styles.input}
            value={draft.departure_carrier}
            onChange={(e) => set("departure_carrier", e.target.value)}
          />
        </label>
        <label className={styles.formField}>
          <span className={styles.formLabel}>Flight no.</span>
          <input
            className={styles.input}
            value={draft.departure_flight}
            onChange={(e) => set("departure_flight", e.target.value)}
          />
        </label>
        <label className={styles.formField}>
          <span className={styles.formLabel}>To (code)</span>
          <input
            className={styles.input}
            placeholder="FCO"
            value={draft.departure_to_code}
            onChange={(e) => set("departure_to_code", e.target.value.toUpperCase())}
          />
        </label>
        <label className={styles.formField}>
          <span className={styles.formLabel}>To (city)</span>
          <input
            className={styles.input}
            value={draft.departure_to_city}
            onChange={(e) => set("departure_to_city", e.target.value)}
          />
        </label>
      </div>

      <h3 className={styles.formSection}>Transportation &amp; notes</h3>
      <div className={styles.formGrid}>
        <label className={styles.formField}>
          <span className={styles.formLabel}>Transport needed</span>
          <select
            className={styles.input}
            value={draft.transportation_needed}
            onChange={(e) => set("transportation_needed", e.target.value)}
          >
            <option value="unknown">Unknown</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label className={styles.formField}>
          <span className={styles.formLabel}>Type</span>
          <input
            className={styles.input}
            placeholder="Villa transfer, airport pickup…"
            value={draft.transportation_type}
            onChange={(e) => set("transportation_type", e.target.value)}
          />
        </label>
        <label className={`${styles.formField} ${styles.formFieldWide}`}>
          <span className={styles.formLabel}>Notes</span>
          <input
            className={styles.input}
            value={draft.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </label>
      </div>

      {error && <p className={styles.formError}>{error}</p>}

      <div className={styles.formActions}>
        <button type="button" className="btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" className={styles.linkBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
