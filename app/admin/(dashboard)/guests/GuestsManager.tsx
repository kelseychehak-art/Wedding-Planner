"use client";

import { useMemo, useState } from "react";
import styles from "./guests.module.css";

export type Guest = {
  id: string;
  party_id: string;
  first_name: string;
  is_child: boolean;
  rsvp_status: string;
  meal_choice: string | null;
  dietary_restrictions: string | null;
  allergies: string | null;
  accessibility_needs: string | null;
};

export type Travel = {
  id: string;
  party_id: string;
  arrival_date: string | null;
  departure_date: string | null;
  flight_info: string | null;
  room_assignment: string | null;
  needs_shuttle: boolean;
} | null;

export type Party = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  mailing_address: string | null;
  side: string | null;
  notes: string | null;
  guests: Guest[];
  travel: Travel;
};

const RSVP_STATUSES = ["Invited", "Confirmed", "Declined", "Pending"];
const SIDES = ["Kelsey", "Andrew", "Shared"];

type GuestDraft = {
  id?: string;
  first_name: string;
  is_child: boolean;
  rsvp_status: string;
  meal_choice: string;
  dietary_restrictions: string;
  allergies: string;
  accessibility_needs: string;
};

type PartyDraft = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  mailing_address: string;
  side: string;
  notes: string;
  guests: GuestDraft[];
  arrival_date: string;
  departure_date: string;
  flight_info: string;
  room_assignment: string;
  needs_shuttle: boolean;
  removedGuestIds: string[];
};

function partyToDraft(p: Party): PartyDraft {
  return {
    id: p.id,
    name: p.name,
    email: p.email ?? "",
    phone: p.phone ?? "",
    mailing_address: p.mailing_address ?? "",
    side: p.side ?? "",
    notes: p.notes ?? "",
    guests: p.guests.map((g) => ({
      id: g.id,
      first_name: g.first_name,
      is_child: g.is_child,
      rsvp_status: g.rsvp_status,
      meal_choice: g.meal_choice ?? "",
      dietary_restrictions: g.dietary_restrictions ?? "",
      allergies: g.allergies ?? "",
      accessibility_needs: g.accessibility_needs ?? "",
    })),
    arrival_date: p.travel?.arrival_date ?? "",
    departure_date: p.travel?.departure_date ?? "",
    flight_info: p.travel?.flight_info ?? "",
    room_assignment: p.travel?.room_assignment ?? "",
    needs_shuttle: p.travel?.needs_shuttle ?? false,
    removedGuestIds: [],
  };
}

function emptyPartyDraft(): PartyDraft {
  return {
    name: "",
    email: "",
    phone: "",
    mailing_address: "",
    side: "",
    notes: "",
    guests: [],
    arrival_date: "",
    departure_date: "",
    flight_info: "",
    room_assignment: "",
    needs_shuttle: false,
    removedGuestIds: [],
  };
}

function emptyGuestDraft(): GuestDraft {
  return {
    first_name: "",
    is_child: false,
    rsvp_status: "Invited",
    meal_choice: "",
    dietary_restrictions: "",
    allergies: "",
    accessibility_needs: "",
  };
}

const statusClass: Record<string, string> = {
  Confirmed: "statusConfirmed",
  Declined: "statusDeclined",
  Pending: "statusPending",
  Invited: "statusInvited",
};

export default function GuestsManager({ initialParties }: { initialParties: Party[] }) {
  const [parties, setParties] = useState(initialParties);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<PartyDraft>(emptyPartyDraft());
  const [saving, setSaving] = useState(false);

  const stats = useMemo(() => {
    const allGuests = parties.flatMap((p) => p.guests);
    const count = (s: string) => allGuests.filter((g) => g.rsvp_status === s).length;
    return {
      parties: parties.length,
      guests: allGuests.length,
      confirmed: count("Confirmed"),
      declined: count("Declined"),
      pending: count("Pending") + count("Invited"),
      withEmail: parties.filter((p) => p.email).length,
      shuttle: parties.filter((p) => p.travel?.needs_shuttle).length,
    };
  }, [parties]);

  function startAdd() {
    setDraft(emptyPartyDraft());
    setEditingId("new");
  }
  function startEdit(p: Party) {
    setDraft(partyToDraft(p));
    setEditingId(p.id);
  }
  function cancel() {
    setEditingId(null);
    setDraft(emptyPartyDraft());
  }

  async function saveDraft() {
    if (!draft.name.trim()) return;
    setSaving(true);
    try {
      // 1. Upsert the party
      const partyRes = await fetch("/api/admin/parties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: draft.id,
          name: draft.name,
          email: draft.email,
          phone: draft.phone,
          mailing_address: draft.mailing_address,
          side: draft.side,
          notes: draft.notes,
        }),
      });
      if (!partyRes.ok) return;
      const { party } = await partyRes.json();
      const partyId = party.id as string;

      // 2. Remove deleted guests
      for (const gid of draft.removedGuestIds) {
        await fetch(`/api/admin/guests/${gid}`, { method: "DELETE" });
      }

      // 3. Upsert guests
      const savedGuests: Guest[] = [];
      for (const g of draft.guests) {
        if (!g.first_name.trim()) continue;
        const gRes = await fetch("/api/admin/guests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...g, party_id: partyId }),
        });
        if (gRes.ok) {
          const { guest } = await gRes.json();
          savedGuests.push(guest);
        }
      }

      // 4. Upsert travel if any field set
      let travel: Travel = null;
      const hasTravel =
        draft.arrival_date ||
        draft.departure_date ||
        draft.flight_info ||
        draft.room_assignment ||
        draft.needs_shuttle;
      if (hasTravel) {
        const tRes = await fetch("/api/admin/travel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            party_id: partyId,
            arrival_date: draft.arrival_date,
            departure_date: draft.departure_date,
            flight_info: draft.flight_info,
            room_assignment: draft.room_assignment,
            needs_shuttle: draft.needs_shuttle,
          }),
        });
        if (tRes.ok) travel = (await tRes.json()).travel;
      }

      const updatedParty: Party = {
        id: partyId,
        name: party.name,
        email: party.email,
        phone: party.phone,
        mailing_address: party.mailing_address,
        side: party.side,
        notes: party.notes,
        guests: savedGuests,
        travel,
      };

      setParties((prev) => {
        const exists = prev.some((p) => p.id === partyId);
        return exists
          ? prev.map((p) => (p.id === partyId ? updatedParty : p))
          : [...prev, updatedParty];
      });
      cancel();
    } finally {
      setSaving(false);
    }
  }

  async function deleteParty(p: Party) {
    if (!confirm(`Delete ${p.name} and all their guests? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/parties/${p.id}`, { method: "DELETE" });
    if (res.ok) setParties((prev) => prev.filter((x) => x.id !== p.id));
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Guests</h1>
          <p className={styles.subheading}>Your guest list, RSVPs, and travel details.</p>
        </div>
        <button type="button" className="btn-primary" onClick={startAdd}>
          Add Party
        </button>
      </div>

      <div className={styles.stats}>
        <Stat label="Parties" value={stats.parties} />
        <Stat label="Guests" value={stats.guests} />
        <Stat label="Confirmed" value={stats.confirmed} tone="good" />
        <Stat label="Declined" value={stats.declined} tone="bad" />
        <Stat label="Awaiting reply" value={stats.pending} tone="warn" />
        <Stat label="Need shuttle" value={stats.shuttle} />
      </div>

      {editingId === "new" && (
        <div className={styles.editCard}>
          <PartyForm draft={draft} setDraft={setDraft} onSave={saveDraft} onCancel={cancel} saving={saving} />
        </div>
      )}

      {parties.length === 0 && editingId !== "new" ? (
        <p className={styles.empty}>No parties yet. Add your first one.</p>
      ) : (
        parties.map((p) =>
          editingId === p.id ? (
            <div className={styles.editCard} key={p.id}>
              <PartyForm draft={draft} setDraft={setDraft} onSave={saveDraft} onCancel={cancel} saving={saving} />
            </div>
          ) : (
            <div className={styles.partyCard} key={p.id}>
              <div className={styles.partyHead}>
                <div className={styles.partyIdentity}>
                  <span className={styles.partyName}>{p.name}</span>
                  {p.side && <span className={styles.sidePill}>{p.side}</span>}
                </div>
                <div className={styles.partyActions}>
                  <button type="button" onClick={() => startEdit(p)}>
                    Edit
                  </button>
                  <button type="button" className={styles.deleteBtn} onClick={() => deleteParty(p)}>
                    Delete
                  </button>
                </div>
              </div>
              {(p.email || p.phone) && (
                <div className={styles.contactLine}>
                  {p.email && <span>{p.email}</span>}
                  {p.phone && <span>{p.phone}</span>}
                </div>
              )}
              {p.guests.length === 0 ? (
                <p className={styles.noGuests}>No guests added yet.</p>
              ) : (
                <div className={styles.guestList}>
                  {p.guests.map((g) => (
                    <div className={styles.guestRow} key={g.id}>
                      <span className={styles.guestName}>
                        {g.first_name}
                        {g.is_child && <span className={styles.childTag}>child</span>}
                      </span>
                      <span
                        className={`${styles.status} ${styles[statusClass[g.rsvp_status] ?? "statusInvited"]}`}
                      >
                        {g.rsvp_status}
                      </span>
                      <div className={styles.guestDetails}>
                        {g.meal_choice && <span>Meal: {g.meal_choice}</span>}
                        {g.dietary_restrictions && <span>Dietary: {g.dietary_restrictions}</span>}
                        {g.allergies && <span>Allergies: {g.allergies}</span>}
                        {g.accessibility_needs && <span>Access: {g.accessibility_needs}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {p.travel && (p.travel.arrival_date || p.travel.room_assignment || p.travel.needs_shuttle) && (
                <div className={styles.travelLine}>
                  {p.travel.arrival_date && <span>Arrives {p.travel.arrival_date}</span>}
                  {p.travel.departure_date && <span>Departs {p.travel.departure_date}</span>}
                  {p.travel.room_assignment && <span>Room: {p.travel.room_assignment}</span>}
                  {p.travel.needs_shuttle && <span className={styles.shuttleTag}>Shuttle</span>}
                </div>
              )}
            </div>
          )
        )
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "good" | "bad" | "warn" }) {
  return (
    <div className={styles.statCard}>
      <span className={`${styles.statValue} ${tone ? styles[`stat_${tone}`] : ""}`}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

function PartyForm({
  draft,
  setDraft,
  onSave,
  onCancel,
  saving,
}: {
  draft: PartyDraft;
  setDraft: (d: PartyDraft) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  function set<K extends keyof PartyDraft>(key: K, value: PartyDraft[K]) {
    setDraft({ ...draft, [key]: value });
  }
  function setGuest(idx: number, patch: Partial<GuestDraft>) {
    setDraft({
      ...draft,
      guests: draft.guests.map((g, i) => (i === idx ? { ...g, ...patch } : g)),
    });
  }
  function addGuest() {
    setDraft({ ...draft, guests: [...draft.guests, emptyGuestDraft()] });
  }
  function removeGuest(idx: number) {
    const g = draft.guests[idx];
    setDraft({
      ...draft,
      guests: draft.guests.filter((_, i) => i !== idx),
      removedGuestIds: g.id ? [...draft.removedGuestIds, g.id] : draft.removedGuestIds,
    });
  }

  return (
    <div>
      <p className={styles.formSection}>Party</p>
      <div className={styles.fieldGrid}>
        <div className={`${styles.field} ${styles.fieldWide}`}>
          <label className={styles.label}>Party Name</label>
          <input
            className={styles.input}
            value={draft.name}
            placeholder="e.g. The Smith Family"
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Side</label>
          <select className={styles.input} value={draft.side} onChange={(e) => set("side", e.target.value)}>
            <option value="">—</option>
            {SIDES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input className={styles.input} value={draft.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Phone</label>
          <input className={styles.input} value={draft.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div className={`${styles.field} ${styles.fieldWide}`}>
          <label className={styles.label}>Mailing Address</label>
          <input
            className={styles.input}
            value={draft.mailing_address}
            onChange={(e) => set("mailing_address", e.target.value)}
          />
        </div>
        <div className={`${styles.field} ${styles.fieldWide}`}>
          <label className={styles.label}>Notes</label>
          <input className={styles.input} value={draft.notes} onChange={(e) => set("notes", e.target.value)} />
        </div>
      </div>

      <div className={styles.guestsFormHeader}>
        <p className={styles.formSection}>Guests</p>
        <button type="button" className="btn-outline" onClick={addGuest}>
          Add Guest
        </button>
      </div>
      {draft.guests.length === 0 && <p className={styles.noGuests}>No guests yet.</p>}
      {draft.guests.map((g, idx) => (
        <div className={styles.guestEditRow} key={g.id ?? `new-${idx}`}>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label className={styles.label}>First Name</label>
              <input
                className={styles.input}
                value={g.first_name}
                onChange={(e) => setGuest(idx, { first_name: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>RSVP</label>
              <select
                className={styles.input}
                value={g.rsvp_status}
                onChange={(e) => setGuest(idx, { rsvp_status: e.target.value })}
              >
                {RSVP_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Meal Choice</label>
              <input
                className={styles.input}
                value={g.meal_choice}
                onChange={(e) => setGuest(idx, { meal_choice: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Dietary Restrictions</label>
              <input
                className={styles.input}
                value={g.dietary_restrictions}
                onChange={(e) => setGuest(idx, { dietary_restrictions: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Allergies</label>
              <input
                className={styles.input}
                value={g.allergies}
                onChange={(e) => setGuest(idx, { allergies: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Accessibility Needs</label>
              <input
                className={styles.input}
                value={g.accessibility_needs}
                onChange={(e) => setGuest(idx, { accessibility_needs: e.target.value })}
              />
            </div>
            <div className={styles.checkboxRow}>
              <input
                id={`child-${idx}`}
                type="checkbox"
                checked={g.is_child}
                onChange={(e) => setGuest(idx, { is_child: e.target.checked })}
              />
              <label htmlFor={`child-${idx}`}>Child</label>
            </div>
            <div className={styles.removeGuestWrap}>
              <button type="button" className={styles.removeGuest} onClick={() => removeGuest(idx)}>
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <p className={styles.formSection}>Travel</p>
      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          <label className={styles.label}>Arrival Date</label>
          <input
            className={styles.input}
            type="date"
            value={draft.arrival_date}
            onChange={(e) => set("arrival_date", e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Departure Date</label>
          <input
            className={styles.input}
            type="date"
            value={draft.departure_date}
            onChange={(e) => set("departure_date", e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Flight Info</label>
          <input
            className={styles.input}
            value={draft.flight_info}
            onChange={(e) => set("flight_info", e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Room Assignment</label>
          <input
            className={styles.input}
            value={draft.room_assignment}
            onChange={(e) => set("room_assignment", e.target.value)}
          />
        </div>
        <div className={styles.checkboxRow}>
          <input
            id="needs_shuttle"
            type="checkbox"
            checked={draft.needs_shuttle}
            onChange={(e) => set("needs_shuttle", e.target.checked)}
          />
          <label htmlFor="needs_shuttle">Needs shuttle</label>
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="button" className="btn-primary" onClick={onSave} disabled={saving || !draft.name.trim()}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" className={styles.linkBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
