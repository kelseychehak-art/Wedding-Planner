"use client";

import { useState } from "react";
import { IconGrip, IconChevronUp, IconChevronDown } from "@/components/admin/icons";
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
  plus_one_allowance: number;
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
    plus_one_allowance: 0,
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
  error,
}: {
  draft: PartyDraft;
  setDraft: (d: PartyDraft) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  /** Set when the last save failed; shown beside the button. */
  error?: string | null;
}) {
  /* Native HTML5 drag for the mouse; the arrow buttons cover keyboard and
     touch, which drag-and-drop alone would shut out. */
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  /* The household name is derived, so any one of these is enough to identify
     the party. Requiring the legacy field silently disabled Save. */
  const hasName =
    Boolean(draft.name.trim()) ||
    Boolean(draft.display_name_override.trim()) ||
    Boolean(draft.household_surname.trim()) ||
    draft.guests.some((g) => g.first_name.trim());

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

  /* Order is saved as each guest's array index on save (sort_order). */
  function moveGuest(from: number, to: number) {
    if (to < 0 || to >= draft.guests.length || from === to) return;
    const next = [...draft.guests];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setDraft({ ...draft, guests: next });
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
          <label className={styles.label}>Plus-ones allowed</label>
          <input
            className={styles.input}
            type="number"
            min={0}
            max={10}
            value={draft.plus_one_allowance}
            onChange={(e) =>
              set("plus_one_allowance", Math.max(0, Number(e.target.value) || 0))
            }
          />
          <span className={styles.fieldHint}>
            Counted in the totals straight away. Add the guest below once you know the name — the
            total won&rsquo;t change.
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
      {draft.guests.length > 1 && (
        <p className={styles.reorderHint}>
          Drag a guest by the handle to reorder, or use the arrows. This is the order they appear
          everywhere — the guest list, exports and stationery.
        </p>
      )}
      {draft.guests.map((g, idx) => (
        <div
          className={`${styles.guestEditRow} ${dragOver === idx ? styles.guestEditRowOver : ""} ${
            dragging === idx ? styles.guestEditRowDragging : ""
          }`}
          key={g.id ?? `new-${idx}`}
          onDragOver={(e) => {
            if (dragging === null) return;
            e.preventDefault();
            setDragOver(idx);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragging !== null) moveGuest(dragging, idx);
            setDragging(null);
            setDragOver(null);
          }}
        >
          {draft.guests.length > 1 && (
            <div className={styles.reorderBar}>
              <span
                className={styles.dragHandle}
                draggable
                onDragStart={() => setDragging(idx)}
                onDragEnd={() => {
                  setDragging(null);
                  setDragOver(null);
                }}
                aria-hidden="true"
              >
                <IconGrip size={15} />
              </span>
              <span className={styles.reorderPosition}>
                {idx + 1} of {draft.guests.length}
              </span>
              <button
                type="button"
                className={styles.reorderBtn}
                onClick={() => moveGuest(idx, idx - 1)}
                disabled={idx === 0}
                aria-label={`Move ${g.first_name || "guest"} up`}
              >
                <IconChevronUp size={14} />
              </button>
              <button
                type="button"
                className={styles.reorderBtn}
                onClick={() => moveGuest(idx, idx + 1)}
                disabled={idx === draft.guests.length - 1}
                aria-label={`Move ${g.first_name || "guest"} down`}
              >
                <IconChevronDown size={14} />
              </button>
            </div>
          )}
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
        <button type="button" className="btn-primary" onClick={onSave} disabled={saving || !hasName}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" className={styles.linkBtn} onClick={onCancel}>
          Cancel
        </button>
        {/* Say why the button is dead, rather than leaving it mysteriously
            greyed out — the household name can come from any of three places. */}
        {!hasName && (
          <span className={styles.formHint}>
            Add a display name, a legacy party name, or at least one guest.
          </span>
        )}
        {error && (
          <span className={styles.formError} role="alert">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
