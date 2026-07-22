import type { Party, Guest } from "../guests/GuestsManager";
import { isAttending, isAwaiting, partyHasTravel } from "../guests/attention";
import { displayName } from "../guests/household";

/*
 * Who a message goes to, resolved live against the guest list.
 *
 * The unit of delivery is the HOUSEHOLD, not the guest: an email address and a
 * phone number live on `parties`, not on `guests` (see docs/admin/guest-list.md).
 * So a rule matches parties, and the guest count is "how many people that
 * reaches" — both numbers are shown, because "12 households · 31 guests" is the
 * honest description and "31 guests" on its own is not.
 *
 * Dynamic by design: nothing is snapshotted until a message is marked sent, so
 * a rule written in March still means the right people in May.
 */

export type RecipientBase = "all" | "attending" | "awaiting" | "declined";

export type RecipientRule = {
  base: RecipientBase;
  /** Bride's side / groom's side, matched against parties.side. */
  side?: string;
  /** Only households with at least one child guest. */
  hasChildren?: boolean;
  /** Only households with no travel record yet. */
  missingTravel?: boolean;
  /** Only households with someone booked on this activity. */
  activityId?: string;
  /** Only households with someone invited to this weekend event. */
  eventId?: string;
  /** Only households staying at this property. */
  lodgingProperty?: string;
  /** A hand-picked list, used by static groups. Ignored when empty. */
  partyIds?: string[];
};

export type Channel = "email" | "sms" | "both" | "announcement";

export const BASE_LABEL: Record<RecipientBase, string> = {
  all: "All invited households",
  attending: "Attending guests",
  awaiting: "Awaiting RSVP",
  declined: "Declined",
};

export const CHANNEL_LABEL: Record<Channel, string> = {
  email: "Email",
  sms: "SMS",
  both: "Email + SMS",
  announcement: "Announcement",
};

export function emptyRule(): RecipientRule {
  return { base: "all" };
}

/** Guests within a household that the base filter is actually about. */
function matchingGuests(p: Party, base: RecipientBase): Guest[] {
  if (base === "attending") return p.guests.filter(isAttending);
  if (base === "awaiting") return p.guests.filter(isAwaiting);
  if (base === "declined") return p.guests.filter((g) => g.rsvp_status === "Declined");
  return p.guests;
}

/*
 * An announcement goes on the website, so everyone can read it. Email needs an
 * address, SMS needs a number, and "both" needs at least one of the two —
 * a household with only a phone still gets the text.
 */
export function hasChannel(p: Party, channel: Channel): boolean {
  const email = Boolean(p.email?.trim());
  const phone = Boolean(p.phone?.trim());
  if (channel === "announcement") return true;
  if (channel === "email") return email;
  if (channel === "sms") return phone;
  return email || phone;
}

export type Resolved = {
  /** Households the rule selects, reachable or not. */
  matched: Party[];
  /** Of those, the ones that can actually be contacted on this channel. */
  reachable: Party[];
  /** Selected but missing an address/number — they will not be contacted. */
  unreachable: Party[];
  /** People inside the reachable households that the base filter is about. */
  guestCount: number;
  /** People who would have been reached if the missing contact details existed. */
  missedGuestCount: number;
};

export function resolveRecipients(
  parties: Party[],
  rule: RecipientRule,
  channel: Channel
): Resolved {
  const pick = new Set(rule.partyIds ?? []);

  const matched = parties.filter((p) => {
    if (pick.size > 0 && !pick.has(p.id)) return false;

    /* A household qualifies when someone in it matches the base filter. An
       empty household (a shell with no guests entered) only survives "all". */
    const people = matchingGuests(p, rule.base);
    if (rule.base !== "all" && people.length === 0) return false;

    if (rule.side && p.side !== rule.side) return false;
    if (rule.hasChildren && !p.guests.some((g) => g.is_child)) return false;
    if (rule.missingTravel && partyHasTravel(p)) return false;

    if (rule.activityId) {
      const booked = p.guests.some((g) =>
        g.activities.some((a) => a.activity_id === rule.activityId)
      );
      if (!booked) return false;
    }

    if (rule.eventId) {
      const invited = p.guests.some((g) => g.events.some((e) => e.event_id === rule.eventId));
      if (!invited) return false;
    }

    if (rule.lodgingProperty) {
      const staying = p.lodging.some((l) => l.property_name === rule.lodgingProperty);
      if (!staying) return false;
    }

    return true;
  });

  const reachable = matched.filter((p) => hasChannel(p, channel));
  const unreachable = matched.filter((p) => !hasChannel(p, channel));
  const count = (list: Party[]) =>
    list.reduce((sum, p) => sum + matchingGuests(p, rule.base).length, 0);

  return {
    matched,
    reachable,
    unreachable,
    guestCount: count(reachable),
    missedGuestCount: count(unreachable),
  };
}

/** "Attending guests · with children · Villa Rosa" — a rule read back in words. */
export function describeRule(rule: RecipientRule, lookups?: RuleLookups): string {
  const parts: string[] = [BASE_LABEL[rule.base]];
  if (rule.partyIds?.length) parts.push(`${rule.partyIds.length} chosen households`);
  if (rule.side) parts.push(`${rule.side}'s side`);
  if (rule.hasChildren) parts.push("with children");
  if (rule.missingTravel) parts.push("no travel yet");
  if (rule.activityId) parts.push(lookups?.activities.get(rule.activityId) ?? "one activity");
  if (rule.eventId) parts.push(lookups?.events.get(rule.eventId) ?? "one event");
  if (rule.lodgingProperty) parts.push(rule.lodgingProperty);
  return parts.join(" · ");
}

export type RuleLookups = {
  activities: Map<string, string>;
  events: Map<string, string>;
  properties: string[];
  sides: string[];
};

/*
 * Rule options come from the guest data itself rather than a second round of
 * queries — an activity nobody is booked on can't be a useful filter, so the
 * list is exactly the set that would return someone.
 */
export function ruleLookups(parties: Party[]): RuleLookups {
  const activities = new Map<string, string>();
  const events = new Map<string, string>();
  const properties = new Set<string>();
  const sides = new Set<string>();

  for (const p of parties) {
    if (p.side) sides.add(p.side);
    for (const l of p.lodging) if (l.property_name) properties.add(l.property_name);
    for (const g of p.guests) {
      for (const a of g.activities) activities.set(a.activity_id, a.title);
      for (const e of g.events) events.set(e.event_id, e.short_label || e.title);
    }
  }

  return {
    activities,
    events,
    properties: [...properties].sort(),
    sides: [...sides].sort(),
  };
}

/*
 * Merge tokens. Rendered for the preview only — there is no send path, so this
 * is what the message will look like, not something that has been delivered.
 * A household email is addressed to the household, so {{first_name}} falls back
 * to the party's display name when it covers more than one person.
 */
const SITE_URL = "https://chehakshultswedding.com";

export function renderTokens(text: string, party?: Party): string {
  const partyName = party ? displayName(party) : "the Smith family";
  const first =
    party && party.guests.length === 1 && party.guests[0].first_name
      ? party.guests[0].first_name
      : partyName;

  return text
    .replaceAll("{{first_name}}", first)
    .replaceAll("{{party_name}}", partyName)
    .replaceAll("{{site_url}}", SITE_URL)
    .replaceAll("{{rsvp_link}}", `${SITE_URL}/rsvp`);
}

export const MERGE_TOKENS = [
  { token: "{{first_name}}", note: "Guest's first name, or the household name" },
  { token: "{{party_name}}", note: "Household name, e.g. “The Shults Family”" },
  { token: "{{rsvp_link}}", note: "Link to the RSVP page" },
  { token: "{{site_url}}", note: "Wedding website home page" },
];
