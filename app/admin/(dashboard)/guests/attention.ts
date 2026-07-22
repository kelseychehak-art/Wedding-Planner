import type { Guest, Party } from "./GuestsManager";

/*
 * Needs-attention rules for the Guest List, computed from real data only
 * (RSVP status, contact info, travel record, meal choices). Pure functions
 * so the Dashboard can reuse them later.
 */

export type AttentionItem = {
  key: string;
  label: string;
  tone: "warn" | "bad";
};

export const AWAITING_STATUSES = ["Invited", "Pending"];

export function isAwaiting(g: Guest) {
  return AWAITING_STATUSES.includes(g.rsvp_status);
}

export function isAttending(g: Guest) {
  return g.rsvp_status === "Confirmed";
}

export function partyHasTravel(p: Party) {
  return Boolean(
    p.travel && (p.travel.arrival_date || p.travel.departure_date || p.travel.flight_info)
  );
}

export function partyAttention(p: Party): AttentionItem[] {
  const items: AttentionItem[] = [];

  const awaiting = p.guests.filter(isAwaiting).length;
  if (awaiting > 0) {
    items.push({
      key: "awaiting",
      label: `${awaiting} guest${awaiting === 1 ? "" : "s"} awaiting RSVP`,
      tone: "warn",
    });
  }

  // Only flag missing contact once a party has real guests entered — otherwise
  // every early-setup party shell (no guests yet) lights up red.
  if (p.guests.length > 0 && !p.email && !p.phone) {
    items.push({ key: "contact", label: "Contact info missing", tone: "warn" });
  }

  const attending = p.guests.filter(isAttending);
  if (attending.length > 0 && !partyHasTravel(p)) {
    items.push({ key: "travel", label: "Travel info missing", tone: "warn" });
  }

  /*
   * No meal-choice flag. meal_choice is free text with no menu behind it —
   * there is no caterer and no venue contract yet — and the RSVP form has
   * never collected it. Flagging it marked every accepting guest as needing
   * attention for something nobody could act on, which buried the warnings
   * that were real. Bring this back when there is a menu to choose from.
   */

  const unnamed = p.guests.filter((g) => !g.first_name.trim()).length;
  if (unnamed > 0) {
    items.push({ key: "name", label: "Guest name missing", tone: "bad" });
  }

  return items;
}

/* Guest-level attention (Individual view). */
export function guestAttention(g: Guest, party: Party): AttentionItem[] {
  const items: AttentionItem[] = [];
  if (isAwaiting(g)) {
    items.push({ key: "awaiting", label: "Awaiting RSVP", tone: "warn" });
  }
  /* See partyAttention: no menu exists yet, so this is not actionable. */
  if (isAttending(g) && !partyHasTravel(party)) {
    items.push({ key: "travel", label: "Travel info missing", tone: "warn" });
  }
  return items;
}
