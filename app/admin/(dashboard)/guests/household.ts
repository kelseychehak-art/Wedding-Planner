import type { Guest, Party } from "./GuestsManager";

/*
 * Household grouping + name derivation (docs/decisions.md D13).
 *
 * Names are DERIVED from the guests, not typed, so they stay correct as people
 * are added or renamed. Each party may override either name; the override wins
 * and is what invitation stationery should use.
 */

export type HouseholdType = "couple" | "family" | "single" | "single_plus_guest" | "group";

export const HOUSEHOLD_TYPES: { key: HouseholdType; label: string; hint: string }[] = [
  { key: "couple", label: "Couple", hint: "Two adults, one invitation" },
  { key: "family", label: "Family", hint: "Adults plus children at home" },
  { key: "single", label: "Single", hint: "One guest, no plus-one" },
  { key: "single_plus_guest", label: "Single + guest", hint: "One guest with a plus-one" },
  { key: "group", label: "Group", hint: "Housemates or a party that shares an invitation" },
];

export const HOUSEHOLD_LABEL: Record<string, string> = Object.fromEntries(
  HOUSEHOLD_TYPES.map((t) => [t.key, t.label])
);

function adults(p: Party) {
  return p.guests.filter((g) => !g.is_child);
}

/** Surname to address the household by: explicit, else the first adult's. */
export function householdSurname(p: Party): string {
  if (p.household_surname?.trim()) return p.household_surname.trim();
  const named = adults(p).find((g) => g.last_name?.trim());
  return named?.last_name?.trim() ?? "";
}

function joinNames(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} & ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
}

/**
 * The everyday name shown in the admin — first names, or "The X Family".
 * Falls back to the legacy free-text `name` when there are no guests yet.
 */
export function displayName(p: Party): string {
  if (p.display_name_override?.trim()) return p.display_name_override.trim();

  const surname = householdSurname(p);
  const adultNames = adults(p)
    .filter((g) => !g.is_plus_one)
    .map((g) => g.first_name?.trim())
    .filter(Boolean) as string[];

  if (p.guests.length === 0) return p.name;

  switch (p.household_type as HouseholdType) {
    case "family":
      return surname ? `The ${surname} Family` : joinNames(adultNames) || p.name;
    case "single_plus_guest": {
      const base = adultNames[0] ?? p.name;
      const plusOne = p.guests.find((g) => g.is_plus_one);
      const plusName = plusOne?.first_name?.trim();
      return plusName ? `${base} & ${plusName}` : `${base} & guest`;
    }
    case "single":
      return adultNames[0] ?? p.name;
    case "group":
      return surname ? `The ${surname} party` : joinNames(adultNames) || p.name;
    case "couple":
    default:
      return joinNames(adultNames) || p.name;
  }
}

/**
 * The envelope name. Deliberately plainer than full honorifics — we don't
 * store titles, so this composes full names rather than guessing "Mr. & Mrs.".
 */
export function formalName(p: Party): string {
  if (p.formal_name_override?.trim()) return p.formal_name_override.trim();

  const surname = householdSurname(p);
  const full = adults(p)
    .filter((g) => !g.is_plus_one)
    .map((g) => [g.first_name?.trim(), g.last_name?.trim()].filter(Boolean).join(" "))
    .filter(Boolean);

  if (p.household_type === "family" && surname) return `The ${surname} Family`;
  if (full.length === 0) return displayName(p);

  const base = joinNames(full);
  if (p.household_type === "single_plus_guest") {
    const plusOne = p.guests.find((g) => g.is_plus_one);
    const plusFull = [plusOne?.first_name?.trim(), plusOne?.last_name?.trim()]
      .filter(Boolean)
      .join(" ");
    return plusFull ? `${base} & ${plusFull}` : `${base} and Guest`;
  }
  return base;
}

/** One invitation per household — the count that drives the stationery order. */
export function invitationCount(parties: Party[]): number {
  return parties.filter((p) => p.guests.length > 0).length;
}

/*
 * Etiquette nudges, per the conventions the established tools follow:
 *  - an adult child still listed at home usually gets their own invitation
 *  - an unnamed plus-one needs a name before stationery goes out
 * These are surfaced as gentle suggestions, never enforced.
 */
export type HouseholdNudge = { partyId: string; message: string };

export function householdNudges(p: Party): HouseholdNudge[] {
  const out: HouseholdNudge[] = [];

  if (p.household_type === "family") {
    const grownChildren = p.guests.filter((g) => g.is_child === false && g.is_plus_one === false);
    if (grownChildren.length > 2) {
      out.push({
        partyId: p.id,
        message: `${grownChildren.length} adults share this invitation — adult children living at home usually get their own.`,
      });
    }
  }

  const unnamedPlusOne = p.guests.find((g) => g.is_plus_one && !g.first_name?.trim());
  if (unnamedPlusOne) {
    out.push({ partyId: p.id, message: "Plus-one still needs a name before invitations go out." });
  }

  /* An allowance is a seat that's counted but not yet attached to a person —
     fine for now, but it needs a name before stationery. */
  const pending = Math.max(
    0,
    (p.plus_one_allowance ?? 0) - p.guests.filter((g) => g.is_plus_one).length
  );
  if (pending > 0) {
    out.push({
      partyId: p.id,
      message: `${pending} plus-${pending === 1 ? "one" : "ones"} counted but not named yet.`,
    });
  }

  /* Head count, not row count — a single + guest with one named guest and a
     granted seat is correctly filled, and shouldn't be flagged. */
  const headCount = p.guests.length + pending;
  if (p.household_type !== "single" && headCount === 1) {
    out.push({
      partyId: p.id,
      message: `Only one guest, but grouped as "${HOUSEHOLD_LABEL[p.household_type] ?? p.household_type}".`,
    });
  }

  return out;
}
