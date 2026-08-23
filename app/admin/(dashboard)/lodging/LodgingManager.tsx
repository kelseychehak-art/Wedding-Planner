"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import MetricStrip, { type Metric } from "@/components/admin/MetricStrip";
import {
  IconHome,
  IconUsers,
  IconBuilding,
  IconWallet,
  IconCalendar,
  IconSearch,
  IconPlus,
} from "@/components/admin/icons";
import { useConfirm } from "@/components/admin/useConfirm";
import styles from "./lodging.module.css";

/*
 * Admin Lodging — property + room inventory, per-household room assignment, and
 * per-person accommodation pricing. Assignments are party-level (a party = one
 * household/invite group); two households can share one room (doubling up), so
 * a room simply gathers every assignment that points at it.
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
  nightly_rate: number | null;
  currency_code: string | null;
  inventory_status: string;
  notes?: string | null;
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

export type Person = { id: string; firstName: string; isChild: boolean; age: number | null };
export type Household = { id: string; name: string; people: Person[] };

export type ChildBracket = { label: string; maxAge: number | null; price: number | null };
export type Pricing = { adultPrice: number | null; brackets: ChildBracket[] };

type Tab = "assign" | "rooms" | "pricing" | "properties" | "requests";

const STATUS_LABEL: Record<string, string> = {
  assigned: "Assigned",
  pending: "Pending",
  needs_room: "Needs room",
  cancelled: "Cancelled",
};

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/* Per-person price: adults pay the flat rate; a child pays the first bracket
 * whose max age covers them (children older than every bracket fall back to the
 * adult rate). A child with no age yet is flagged so it can be filled in. */
function personPrice(p: Person, pricing: Pricing): { amount: number; needsAge: boolean } {
  const adult = pricing.adultPrice ?? 0;
  if (!p.isChild) return { amount: adult, needsAge: false };
  if (p.age == null) return { amount: 0, needsAge: true };
  const sorted = pricing.brackets
    .filter((b) => b.maxAge != null)
    .sort((a, b) => (a.maxAge as number) - (b.maxAge as number));
  for (const b of sorted) {
    if (p.age <= (b.maxAge as number)) return { amount: b.price ?? 0, needsAge: false };
  }
  return { amount: adult, needsAge: false };
}

function householdCost(h: Household, pricing: Pricing): number {
  return h.people.reduce((s, p) => s + personPrice(p, pricing).amount, 0);
}

function countAdultsChildren(h: Household): { adults: number; children: number } {
  let adults = 0;
  let children = 0;
  for (const p of h.people) p.isChild ? children++ : adults++;
  return { adults, children };
}

export default function LodgingManager({
  data,
  households,
  pricing,
}: {
  data: LodgingData;
  households: Household[];
  pricing: Pricing;
}) {
  const { confirm, dialog } = useConfirm();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("assign");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<"property" | "room" | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const { properties, rooms, assignments, requests } = data;

  // party_id -> its (single) assignment
  const assignmentByParty = useMemo(() => {
    const m = new Map<string, Assignment>();
    for (const a of assignments) if (a.party_id) m.set(a.party_id, a);
    return m;
  }, [assignments]);

  const householdById = useMemo(() => {
    const m = new Map<string, Household>();
    for (const h of households) m.set(h.id, h);
    return m;
  }, [households]);

  const defaultDates = useMemo(() => {
    const ci = properties.find((p) => p.default_check_in_date)?.default_check_in_date ?? "";
    const co = properties.find((p) => p.default_check_out_date)?.default_check_out_date ?? "";
    return { ci, co };
  }, [properties]);

  const grandTotal = useMemo(
    () => households.reduce((s, h) => s + householdCost(h, pricing), 0),
    [households, pricing]
  );
  const childrenMissingAge = useMemo(
    () =>
      households.reduce(
        (s, h) => s + h.people.filter((p) => p.isChild && p.age == null).length,
        0
      ),
    [households]
  );

  const metrics: Metric[] = useMemo(() => {
    const assignedRooms = new Set(assignments.filter((a) => a.room_id).map((a) => a.room_id)).size;
    const assignedHouseholds = assignments.filter((a) => a.room_id).length;
    const guestsStaying = assignments
      .filter((a) => a.room_id)
      .reduce((s, a) => {
        const h = a.party_id ? householdById.get(a.party_id) : undefined;
        return s + (h ? h.people.length : a.party_guest_count || 0);
      }, 0);

    return [
      {
        key: "rooms",
        icon: <IconBuilding size={22} />,
        value: `${assignedRooms}`,
        label: "Rooms Filled",
        sub: `of ${rooms.length}`,
        tone: "info",
      },
      {
        key: "households",
        icon: <IconHome size={22} />,
        value: String(assignedHouseholds),
        label: "Households Placed",
        sub: `${households.length} total`,
      },
      {
        key: "guests",
        icon: <IconUsers size={22} />,
        value: String(guestsStaying),
        label: "Guests Staying",
      },
      {
        key: "total",
        icon: <IconWallet size={22} />,
        value: usd.format(grandTotal),
        label: "Accommodation Total",
        sub: childrenMissingAge > 0 ? `${childrenMissingAge} child age(s) missing` : "All priced",
        tone: childrenMissingAge > 0 ? "warn" : "good",
      },
      {
        key: "checkin",
        icon: <IconCalendar size={22} />,
        value: defaultDates.ci ? fmtDate(defaultDates.ci) : "—",
        label: "Check-in",
      },
      {
        key: "checkout",
        icon: <IconCalendar size={22} />,
        value: defaultDates.co ? fmtDate(defaultDates.co) : "—",
        label: "Check-out",
      },
    ];
  }, [assignments, rooms, households, householdById, grandTotal, childrenMissingAge, defaultDates]);

  async function removeRecord(kind: string, id: string, label: string) {
    if (!(await confirm({ title: `Delete ${label}?` }))) return;
    const res = await fetch(`/api/admin/lodging?kind=${kind}&id=${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  async function assignRoom(household: Household, roomId: string) {
    setBusy(household.id);
    const existing = assignmentByParty.get(household.id);
    try {
      const res = await fetch("/api/admin/lodging", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "assignment",
          id: existing?.id ?? "",
          party_id: household.id,
          room_id: roomId,
          check_in_date: existing?.check_in_date ?? (roomId ? defaultDates.ci : ""),
          check_out_date: existing?.check_out_date ?? (roomId ? defaultDates.co : ""),
          status: roomId ? "assigned" : "needs_room",
        }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(null);
    }
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "assign", label: "Assign Rooms", count: households.length },
    { key: "rooms", label: "Rooms", count: rooms.length },
    { key: "pricing", label: "Pricing" },
    { key: "properties", label: "Properties", count: properties.length },
    { key: "requests", label: "Requests", count: requests.length },
  ];

  return (
    <div>
      <PageHeader
        title="Lodging"
        subtitle="Assign each household to a room, and price the stay per person."
        action={
          <div className={styles.headerActions}>
            <button
              type="button"
              className="btn-outline"
              onClick={() => setEditing("room")}
              disabled={properties.length === 0}
              title={properties.length === 0 ? "Add a property first" : undefined}
            >
              Add Room
            </button>
            <button type="button" className="btn-primary" onClick={() => setEditing("property")}>
              <IconPlus size={15} className={styles.btnIcon} />
              Add Property
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
      {editing === "room" && (
        <RoomForm
          properties={properties}
          onClose={() => setEditing(null)}
          onSaved={() => router.refresh()}
        />
      )}

      {/* ---- Assign rooms (household-centric) ---- */}
      {tab === "assign" && (
        <>
          <div className={styles.toolbar}>
            <span className={styles.searchWrap}>
              <IconSearch size={15} className={styles.searchIcon} />
              <input
                className={styles.search}
                type="search"
                placeholder="Search household…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </span>
          </div>

          {households.length === 0 ? (
            <Empty text="No households yet. Add them in the Guest List, then assign rooms here." />
          ) : rooms.length === 0 ? (
            <Empty text="No rooms yet. Add a property and its rooms first, then assign households here." />
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Household</th>
                    <th>People</th>
                    <th>Room</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {households
                    .filter((h) =>
                      search.trim()
                        ? h.name.toLowerCase().includes(search.trim().toLowerCase())
                        : true
                    )
                    .map((h) => {
                      const a = assignmentByParty.get(h.id);
                      const { adults, children } = countAdultsChildren(h);
                      return (
                        <tr key={h.id}>
                          <td>
                            <div className={styles.strong}>{h.name}</div>
                          </td>
                          <td>
                            {adults} adult{adults === 1 ? "" : "s"}
                            {children > 0 && (
                              <span className={styles.sub}>
                                {" "}
                                · {children} child{children === 1 ? "" : "ren"}
                              </span>
                            )}
                          </td>
                          <td>
                            <select
                              className={styles.select}
                              value={a?.room_id ?? ""}
                              disabled={busy === h.id}
                              onChange={(e) => assignRoom(h, e.target.value)}
                            >
                              <option value="">— Unassigned —</option>
                              {rooms.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.room_name} (sleeps {r.total_capacity})
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>{usd.format(householdCost(h, pricing))}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ---- Rooms roster ---- */}
      {tab === "rooms" &&
        (rooms.length === 0 ? (
          <Empty
            text={
              properties.length === 0
                ? "No rooms yet. Add a property first, then add its rooms or suites here."
                : "No rooms yet. Use “Add Room” to enter each room or suite from the venue."
            }
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Room / Suite</th>
                  <th>Type</th>
                  <th>Who&rsquo;s assigned</th>
                  <th>Occupancy</th>
                  <th>Cost</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => {
                  const roomAssignments = assignments.filter((a) => a.room_id === r.id);
                  const occupants = roomAssignments
                    .map((a) => (a.party_id ? householdById.get(a.party_id) : undefined))
                    .filter(Boolean) as Household[];
                  const people = occupants.reduce((s, h) => s + h.people.length, 0);
                  const cost = occupants.reduce((s, h) => s + householdCost(h, pricing), 0);
                  const over = people > r.total_capacity;
                  return (
                    <tr key={r.id}>
                      <td>
                        <div className={styles.strong}>{r.room_name}</div>
                        {r.notes && <div className={styles.sub}>{r.notes}</div>}
                      </td>
                      <td>{r.room_type ?? "—"}</td>
                      <td>
                        {occupants.length === 0 ? (
                          <span className={styles.sub}>Empty</span>
                        ) : (
                          occupants.map((h) => <div key={h.id}>{h.name}</div>)
                        )}
                      </td>
                      <td>
                        <span className={over ? styles.over : undefined}>
                          {people} / {r.total_capacity}
                        </span>
                      </td>
                      <td>{occupants.length ? usd.format(cost) : "—"}</td>
                      <td>
                        <button
                          type="button"
                          className={styles.deleteLink}
                          onClick={() => removeRecord("room", r.id, `“${r.room_name}”`)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className={styles.strong}>
                    Accommodation total
                  </td>
                  <td className={styles.strong}>{usd.format(grandTotal)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        ))}

      {/* ---- Pricing ---- */}
      {tab === "pricing" && (
        <PricingPanel
          pricing={pricing}
          households={households}
          onSaved={() => router.refresh()}
        />
      )}

      {/* ---- Properties ---- */}
      {tab === "properties" &&
        (properties.length === 0 ? (
          <Empty text="No properties yet. Add the borgo or hotel your block is held at." />
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
      {dialog}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className={styles.empty}>{text}</p>;
}

/* ---------- Pricing panel ---------- */

function PricingPanel({
  pricing,
  households,
  onSaved,
}: {
  pricing: Pricing;
  households: Household[];
  onSaved: () => void;
}) {
  const [adult, setAdult] = useState(pricing.adultPrice != null ? String(pricing.adultPrice) : "");
  const [brackets, setBrackets] = useState<ChildBracket[]>(
    pricing.brackets.length
      ? pricing.brackets
      : [{ label: "Under 2", maxAge: 1, price: null }]
  );
  const [savingRates, setSavingRates] = useState(false);
  const [savedTick, setSavedTick] = useState(false);

  const children = useMemo(
    () =>
      households
        .flatMap((h) => h.people.map((p) => ({ ...p, household: h.name })))
        .filter((p) => p.isChild),
    [households]
  );

  function setBracket(i: number, patch: Partial<ChildBracket>) {
    setBrackets((prev) => prev.map((b, j) => (j === i ? { ...b, ...patch } : b)));
  }

  async function saveRates() {
    setSavingRates(true);
    setSavedTick(false);
    try {
      const res = await fetch("/api/admin/lodging/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adultPrice: adult === "" ? null : Number(adult),
          brackets: brackets
            .filter((b) => b.label.trim() || b.maxAge != null || b.price != null)
            .map((b) => ({ label: b.label, max_age: b.maxAge, price: b.price })),
        }),
      });
      if (res.ok) {
        setSavedTick(true);
        onSaved();
      }
    } finally {
      setSavingRates(false);
    }
  }

  async function saveAge(personId: string, ageStr: string) {
    await fetch("/api/admin/guests/age", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: personId, age: ageStr }),
    });
    onSaved();
  }

  return (
    <div className={styles.pricingWrap}>
      <section className={styles.pricingCard}>
        <h3 className={styles.pricingTitle}>Rates</h3>
        <p className={styles.pricingHelp}>
          Everyone is charged the adult price unless they&rsquo;re marked as a child with an age
          that falls in a bracket below. All amounts in US dollars.
        </p>
        <label className={styles.field} style={{ maxWidth: 220 }}>
          <span className={styles.fieldLabel}>Adult (per person)</span>
          <input
            className={styles.input}
            type="number"
            min="0"
            step="1"
            value={adult}
            onChange={(e) => setAdult(e.target.value)}
          />
        </label>

        <p className={styles.pricingSub}>Child brackets</p>
        <div className={styles.bracketRows}>
          {brackets.map((b, i) => (
            <div className={styles.bracketRow} key={i}>
              <input
                className={styles.input}
                placeholder="Label (e.g. Under 2)"
                value={b.label}
                onChange={(e) => setBracket(i, { label: e.target.value })}
              />
              <input
                className={styles.input}
                type="number"
                min="0"
                placeholder="Up to age"
                value={b.maxAge ?? ""}
                onChange={(e) =>
                  setBracket(i, { maxAge: e.target.value === "" ? null : Number(e.target.value) })
                }
              />
              <input
                className={styles.input}
                type="number"
                min="0"
                placeholder="Price $"
                value={b.price ?? ""}
                onChange={(e) =>
                  setBracket(i, { price: e.target.value === "" ? null : Number(e.target.value) })
                }
              />
              <button
                type="button"
                className={styles.deleteLink}
                onClick={() => setBrackets((prev) => prev.filter((_, j) => j !== i))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className={styles.linkBtn}
          onClick={() =>
            setBrackets((prev) => [...prev, { label: "", maxAge: null, price: null }])
          }
        >
          + Add bracket
        </button>

        <div className={styles.formActions}>
          <button type="button" className="btn-primary" onClick={saveRates} disabled={savingRates}>
            {savingRates ? "Saving…" : "Save rates"}
          </button>
          {savedTick && <span className={styles.savedNote}>Saved ✓</span>}
        </div>
      </section>

      <section className={styles.pricingCard}>
        <h3 className={styles.pricingTitle}>Children&rsquo;s ages</h3>
        {children.length === 0 ? (
          <p className={styles.pricingHelp}>
            No children yet. Mark a guest as a child in the Guest List and they&rsquo;ll appear here
            to price by age.
          </p>
        ) : (
          <>
            <p className={styles.pricingHelp}>
              Enter each child&rsquo;s age so they&rsquo;re priced by the right bracket.
            </p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Child</th>
                  <th>Household</th>
                  <th>Age</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {children.map((c) => {
                  const pr = personPrice(c, {
                    adultPrice: adult === "" ? null : Number(adult),
                    brackets,
                  });
                  return (
                    <tr key={c.id}>
                      <td className={styles.strong}>{c.firstName}</td>
                      <td>{c.household}</td>
                      <td>
                        <input
                          className={styles.input}
                          style={{ maxWidth: 90 }}
                          type="number"
                          min="0"
                          defaultValue={c.age ?? ""}
                          onBlur={(e) => saveAge(c.id, e.target.value)}
                        />
                      </td>
                      <td>{pr.needsAge ? <span className={styles.over}>age needed</span> : usd.format(pr.amount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </section>
    </div>
  );
}

/* ---------- Forms ---------- */

function PropertyForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: "",
    property_type: "Borgo",
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
            placeholder="SPAO Borgo San Pietro"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Type">
          <select
            className={styles.input}
            value={form.property_type}
            onChange={(e) => setForm({ ...form, property_type: e.target.value })}
          >
            <option>Borgo</option>
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

/*
 * Rooms/suites for a property. The borgo's suites are sized by bedroom count,
 * so room_type doubles as the suite category; the datalist offers those without
 * locking you out of a custom name.
 */
const ROOM_TYPES = ["1-bedroom", "2-bedroom", "3-bedroom", "Studio", "Suite"];

function RoomForm({
  properties,
  onClose,
  onSaved,
}: {
  properties: Property[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    property_id: properties[0]?.id ?? "",
    room_name: "",
    room_type: "",
    bed_configuration: "",
    adult_capacity: "2",
    child_capacity: "0",
    total_capacity: "",
    nightly_rate: "",
    accessible: false,
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    if (!form.property_id || !form.room_name.trim()) return;
    setSaving(true);
    try {
      const total =
        form.total_capacity ||
        String((Number(form.adult_capacity) || 0) + (Number(form.child_capacity) || 0));
      const res = await fetch("/api/admin/lodging", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "room", ...form, total_capacity: total }),
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
      <h2 className={styles.formTitle}>Add room</h2>
      <div className={styles.formGrid}>
        <Field label="Property">
          <select
            className={styles.input}
            value={form.property_id}
            onChange={(e) => set("property_id", e.target.value)}
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Room / suite name">
          <input
            className={styles.input}
            value={form.room_name}
            placeholder="Il Frantoio"
            onChange={(e) => set("room_name", e.target.value)}
          />
        </Field>
        <Field label="Type">
          <input
            className={styles.input}
            list="room-types"
            value={form.room_type}
            placeholder="2-bedroom"
            onChange={(e) => set("room_type", e.target.value)}
          />
          <datalist id="room-types">
            {ROOM_TYPES.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </Field>
        <Field label="Beds">
          <input
            className={styles.input}
            value={form.bed_configuration}
            placeholder="1 bedroom, 1 bath"
            onChange={(e) => set("bed_configuration", e.target.value)}
          />
        </Field>
        <Field label="Adults">
          <input
            className={styles.input}
            type="number"
            min="0"
            value={form.adult_capacity}
            onChange={(e) => set("adult_capacity", e.target.value)}
          />
        </Field>
        <Field label="Children">
          <input
            className={styles.input}
            type="number"
            min="0"
            value={form.child_capacity}
            onChange={(e) => set("child_capacity", e.target.value)}
          />
        </Field>
        <Field label="Sleeps (total)">
          <input
            className={styles.input}
            type="number"
            min="0"
            placeholder="auto"
            value={form.total_capacity}
            onChange={(e) => set("total_capacity", e.target.value)}
          />
        </Field>
        <Field label="Nightly rate ($)">
          <input
            className={styles.input}
            type="number"
            min="0"
            step="0.01"
            value={form.nightly_rate}
            onChange={(e) => set("nightly_rate", e.target.value)}
          />
        </Field>
        <Field label="Notes" wide>
          <input
            className={styles.input}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </Field>
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0 12px" }}>
        <input
          type="checkbox"
          checked={form.accessible}
          onChange={(e) => set("accessible", e.target.checked)}
        />
        Accessible room
      </label>
      <div className={styles.formActions}>
        <button
          type="button"
          className="btn-primary"
          onClick={save}
          disabled={saving || !form.property_id || !form.room_name.trim()}
        >
          {saving ? "Saving…" : "Save room"}
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
