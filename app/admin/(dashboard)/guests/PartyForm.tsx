"use client";

import styles from "./guests.module.css";

/*
 * Party add/edit form — extracted from the original GuestsManager unchanged
 * in behavior (controlled draft, repeatable guest rows, travel section).
 */

export type GuestDraft = {
  id?: string;
  first_name: string;
  last_name: string;
  is_child: boolean;
  is_plus_one: boolean;
  rsvp_status: string;
  meal_choice: string;
  dietary_restrictions: string;
  allergies: string;
  accessibility_needs: string;
};

export type PartyDraft = {
  id?: string;
  name: string;
  household_type: string;
  household_surname: string;
  display_name_override: string;
  formal_name_override: string;
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

export const HOUSEHOLD_TYPE_OPTIONS = [
  { key: "couple", label: "Couple", hint: "Two adults, one invitation" },
  { key: "family", label: "Family", hint: "Adults plus children at home" },
  { key: "single", label: "Single", hint: "One guest, no plus-one" },
  { key: "single_plus_guest", label: "Single + guest", hint: "One guest with a plus-one" },
  { key: "group", label: "Group", hint: "Housemates sharing an invitation" },
];

export const RSVP_STATUSES = ["Invited", "Confirmed", "Declined", "Pending"];
export const SIDES = ["Kelsey", "Andrew", "Shared"];

export function emptyGuestDraft(): GuestDraft {
  return {
    first_name: "",
    last_name: "",
    is_child: false,
    is_plus_one: false,
    rsvp_status: "Invited",
    meal_choice: "",
    dietary_restrictions: "",
    allergies: "",
    accessibility_needs: "",
  };
}

export function emptyPartyDraft(): PartyDraft {
  return {
    name: "",
    household_type: "couple",
    household_surname: "",
    display_name_override: "",
    formal_name_override: "",
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

export default function PartyForm({
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
      <p className={styles.formSection}>Household</p>
      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          <label className={styles.label}>Household Type</label>
          <select
            className={styles.input}
            value={draft.household_type}
            onChange={(e) => set("household_type", e.target.value)}
          >
            {HOUSEHOLD_TYPE_OPTIONS.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
          <span className={styles.fieldHint}>
            {HOUSEHOLD_TYPE_OPTIONS.find((t) => t.key === draft.household_type)?.hint}
          </span>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Household Surname</label>
          <input
            className={styles.input}
            value={draft.household_surname}
            placeholder="Ferguson"
            onChange={(e) => set("household_surname", e.target.value)}
          />
          <span className={styles.fieldHint}>Used for &ldquo;The Ferguson Family&rdquo;.</span>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Display Name (optional)</label>
          <input
            className={styles.input}
            value={draft.display_name_override}
            placeholder="auto from guests"
            onChange={(e) => set("display_name_override", e.target.value)}
          />
          <span className={styles.fieldHint}>Overrides the derived name.</span>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Formal Name (optional)</label>
          <input
            className={styles.input}
            value={draft.formal_name_override}
            placeholder="for envelopes"
            onChange={(e) => set("formal_name_override", e.target.value)}
          />
          <span className={styles.fieldHint}>Used on invitations.</span>
        </div>
        <div className={`${styles.field} ${styles.fieldWide}`}>
          <label className={styles.label}>Legacy Party Name</label>
          <input
            className={styles.input}
            value={draft.name}
            placeholder="e.g. The Smith Family"
            onChange={(e) => set("name", e.target.value)}
          />
          <span className={styles.fieldHint}>
            Kept as a fallback for parties with no guests entered yet.
          </span>
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
              <label className={styles.label}>Last Name</label>
              <input
                className={styles.input}
                value={g.last_name}
                onChange={(e) => setGuest(idx, { last_name: e.target.value })}
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
              <input
                id={`plusone-${idx}`}
                type="checkbox"
                checked={g.is_plus_one}
                onChange={(e) => setGuest(idx, { is_plus_one: e.target.checked })}
              />
              <label htmlFor={`plusone-${idx}`}>Plus-one</label>
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
