"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DetailDrawer from "./DetailDrawer";
import { displayName, HOUSEHOLD_LABEL, householdNudges } from "./household";
import styles from "./guests.module.css";
import PageHeader from "@/components/admin/PageHeader";
import MetricStrip, { type Metric } from "@/components/admin/MetricStrip";
import Pagination from "@/components/admin/Pagination";
import {
  Toolbar,
  ToolbarSearch,
  FilterSelect,
  SortBar,
  ColumnsButton,
  useColumnVisibility,
  type ColumnDef,
} from "@/components/admin/Toolbar";
import {
  IconUsers,
  IconLeaf,
  IconHeart,
  IconClock,
  IconBasket,
  IconPlane,
  IconAlert,
  IconCheckCircle,
  IconMail,
  IconPhone,
  IconDots,
  IconPlus,
} from "@/components/admin/icons";
import PartyForm, {
  type PartyDraft,
  emptyPartyDraft,
} from "./PartyForm";
import {
  partyAttention,
  guestAttention,
  partyHasTravel,
  isAwaiting,
  isAttending,
  type AttentionItem,
} from "./attention";

export type GuestActivity = {
  activity_id: string;
  title: string;
  category: string | null;
  starts_at: string | null;
  booking_status: string | null;
};

export type GuestEvent = {
  event_id: string;
  title: string;
  short_label: string | null;
  starts_at: string | null;
  invitation_status: string | null;
  rsvp_status: string | null;
};

export type Guest = {
  id: string;
  party_id: string;
  first_name: string;
  last_name: string | null;
  is_child: boolean;
  is_plus_one: boolean;
  plus_one_of: string | null;
  rsvp_status: string;
  meal_choice: string | null;
  dietary_restrictions: string | null;
  allergies: string | null;
  accessibility_needs: string | null;
  activities: GuestActivity[];
  events: GuestEvent[];
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

export type Lodging = {
  assignment_id: string;
  status: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  room_name: string | null;
  room_type: string | null;
  property_name: string | null;
};

/** An RSVP-enabled event; one column of the Weekend Events dot matrix. */
export type WeekendEvent = {
  id: string;
  title: string;
  short_label: string | null;
  starts_at: string | null;
  rsvp_enabled: boolean;
};

export type Party = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  mailing_address: string | null;
  side: string | null;
  notes: string | null;
  household_type: string;
  household_surname: string | null;
  display_name_override: string | null;
  formal_name_override: string | null;
  guests: Guest[];
  travel: Travel;
  lodging: Lodging[];
};

type ViewMode = "party" | "individual";
type TabKey =
  | "all"
  | "attention"
  | "awaiting"
  | "travel-missing"
  | "activities"
  | "attending"
  | "declined";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All Guests" },
  { key: "attention", label: "Needs Attention" },
  { key: "awaiting", label: "Awaiting RSVP" },
  { key: "travel-missing", label: "Travel Missing" },
  { key: "activities", label: "Activity Follow-up" },
  { key: "attending", label: "Attending" },
  { key: "declined", label: "Declined" },
];

/*
 * Party-view columns. Guest/Party and Actions are locked: a table with no
 * identifying column, or no way to act on a row, isn't usable.
 */
const PARTY_COLUMNS: ColumnDef[] = [
  { key: "guest", label: "Guest / Party", locked: true },
  { key: "child", label: "Child" },
  { key: "rsvp", label: "RSVP" },
  { key: "events", label: "Weekend Events" },
  { key: "activities", label: "Activities" },
  { key: "travel", label: "Travel" },
  { key: "lodging", label: "Lodging" },
  { key: "contact", label: "Contact" },
  { key: "attention", label: "Needs Attention" },
  { key: "actions", label: "Actions", locked: true },
];

const INDIVIDUAL_COLUMNS: ColumnDef[] = [
  { key: "guest", label: "Guest", locked: true },
  { key: "party", label: "Party" },
  { key: "rsvp", label: "RSVP" },
  { key: "events", label: "Weekend Events" },
  { key: "activities", label: "Activities" },
  { key: "travel", label: "Travel" },
  { key: "lodging", label: "Lodging" },
  { key: "dietary", label: "Dietary / Notes" },
  { key: "attention", label: "Needs Attention" },
  { key: "actions", label: "Actions", locked: true },
];

const OPT_RSVP = [
  { value: "All", label: "All" },
  { value: "Attending", label: "Attending" },
  { value: "Awaiting", label: "Awaiting" },
  { value: "Declined", label: "Declined" },
];
const OPT_TRAVEL = [
  { value: "All", label: "All" },
  { value: "Submitted", label: "Submitted" },
  { value: "Missing", label: "Missing" },
];
const OPT_ACTIVITIES = [
  { value: "All", label: "All" },
  { value: "Booked", label: "Booked something" },
  { value: "None", label: "Nothing booked" },
];
const OPT_LODGING = [
  { value: "All", label: "All" },
  { value: "Assigned", label: "Room assigned" },
  { value: "Unassigned", label: "No room yet" },
];
const OPT_SIDE = [
  { value: "All", label: "All" },
  { value: "Kelsey", label: "Kelsey" },
  { value: "Andrew", label: "Andrew" },
  { value: "Shared", label: "Shared" },
];

type SortKey = "name" | "name-desc" | "guests" | "rsvp" | "attention";

const SORT_OPTIONS = [
  { value: "name", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "guests", label: "Party size" },
  { value: "rsvp", label: "Awaiting RSVP first" },
  { value: "attention", label: "Most issues first" },
];

/** Attending, but hasn't signed up for anything yet. */
function needsActivityFollowUp(g: Guest) {
  return isAttending(g) && (g.activities?.length ?? 0) === 0;
}

const statusClass: Record<string, string> = {
  Confirmed: "statusConfirmed",
  Declined: "statusDeclined",
  Pending: "statusPending",
  Invited: "statusInvited",
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/* "2027-06-15" → "Jun 15" (string-parsed; avoids timezone drift). */
function formatDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}`;
}

function partyToDraft(p: Party): PartyDraft {
  return {
    id: p.id,
    name: p.name,
    household_type: p.household_type ?? "couple",
    household_surname: p.household_surname ?? "",
    display_name_override: p.display_name_override ?? "",
    formal_name_override: p.formal_name_override ?? "",
    email: p.email ?? "",
    phone: p.phone ?? "",
    mailing_address: p.mailing_address ?? "",
    side: p.side ?? "",
    notes: p.notes ?? "",
    guests: p.guests.map((g) => ({
      id: g.id,
      first_name: g.first_name,
      last_name: g.last_name ?? "",
      is_child: g.is_child,
      is_plus_one: g.is_plus_one ?? false,
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

function partyMatchesTab(p: Party, tab: TabKey): boolean {
  switch (tab) {
    case "all":
      return true;
    case "attention":
      return partyAttention(p).length > 0;
    case "awaiting":
      return p.guests.some(isAwaiting);
    case "travel-missing":
      return p.guests.some(isAttending) && !partyHasTravel(p);
    case "activities":
      return p.guests.some(needsActivityFollowUp);
    case "attending":
      return p.guests.some(isAttending);
    case "declined":
      return p.guests.some((g) => g.rsvp_status === "Declined");
  }
}

function guestMatchesTab(g: Guest, p: Party, tab: TabKey): boolean {
  switch (tab) {
    case "all":
      return true;
    case "attention":
      return guestAttention(g, p).length > 0;
    case "awaiting":
      return isAwaiting(g);
    case "travel-missing":
      return isAttending(g) && !partyHasTravel(p);
    case "activities":
      return needsActivityFollowUp(g);
    case "attending":
      return isAttending(g);
    case "declined":
      return g.rsvp_status === "Declined";
  }
}

export default function GuestsManager({
  initialParties,
  events,
  initialView = "party",
  initialTab = "all",
}: {
  initialParties: Party[];
  /* RSVP-enabled events; the columns of the Weekend Events dot matrix. */
  events: WeekendEvent[];
  initialView?: string;
  initialTab?: string;
}) {
  const router = useRouter();
  const [parties, setParties] = useState(initialParties);
  const [view, setView] = useState<ViewMode>(
    initialView === "individual" ? "individual" : "party"
  );
  const [tab, setTab] = useState<TabKey>(
    TABS.some((t) => t.key === initialTab) ? (initialTab as TabKey) : "all"
  );
  const [search, setSearch] = useState("");
  const [rsvpFilter, setRsvpFilter] = useState("All");
  const [travelFilter, setTravelFilter] = useState("All");
  const [sideFilter, setSideFilter] = useState("All");
  const [activityFilter, setActivityFilter] = useState("All");
  const [lodgingFilter, setLodgingFilter] = useState("All");
  const [sort, setSort] = useState<SortKey>("name");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ party: Party; guest: Guest | null } | null>(null);

  const columns = view === "party" ? PARTY_COLUMNS : INDIVIDUAL_COLUMNS;
  const cols = useColumnVisibility(
    view === "party" ? "admin.guests.columns.party" : "admin.guests.columns.individual",
    columns
  );

  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<PartyDraft>(emptyPartyDraft());
  const [saving, setSaving] = useState(false);
  const editRef = useRef<HTMLDivElement>(null);

  /* Close row menus on any outside click. */
  useEffect(() => {
    if (!menuId) return;
    const close = () => setMenuId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuId]);

  /* Keep view/tab shareable in the URL without triggering navigation. */
  function syncUrl(nextView: ViewMode, nextTab: TabKey) {
    const params = new URLSearchParams();
    if (nextView !== "party") params.set("view", nextView);
    if (nextTab !== "all") params.set("tab", nextTab);
    const qs = params.toString();
    router.replace(`/admin/guests${qs ? `?${qs}` : ""}`, { scroll: false });
  }
  function changeView(v: ViewMode) {
    setView(v);
    setPage(1);
    syncUrl(v, tab);
  }
  function changeTab(t: TabKey) {
    setTab(t);
    setPage(1);
    syncUrl(view, t);
  }

  /* ---- Metrics (from real data; activities has no backend yet) ---- */
  const metrics = useMemo(() => {
    const allGuests = parties.flatMap((p) => p.guests);
    const invited = allGuests.length;
    const attending = allGuests.filter(isAttending);
    const adults = attending.filter((g) => !g.is_child).length;
    const children = attending.filter((g) => g.is_child).length;
    const declined = allGuests.filter((g) => g.rsvp_status === "Declined").length;
    const awaiting = allGuests.filter(isAwaiting).length;
    const pct = (n: number) => (invited ? Math.round((n / invited) * 100) : 0);
    const attendingParties = parties.filter((p) => p.guests.some(isAttending));
    const travelSubmitted = attendingParties.filter(partyHasTravel).length;
    const travelNeeded = attendingParties.length - travelSubmitted;
    const attentionCount = parties.filter((p) => partyAttention(p).length > 0).length;

    /* Activity sign-ups: count guests who have booked at least one, and how
       many attending guests still have none — the mockup's "8 need to select". */
    const activityBooked = allGuests.filter((g) => (g.activities?.length ?? 0) > 0).length;
    const activityNeeded = attending.filter((g) => (g.activities?.length ?? 0) === 0).length;
    const anyActivities = allGuests.some((g) => (g.activities?.length ?? 0) > 0);

    return {
      invited,
      partyCount: parties.length,
      attending: attending.length,
      adults,
      children,
      declined,
      declinedPct: pct(declined),
      awaiting,
      awaitingPct: pct(awaiting),
      travelSubmitted,
      travelNeeded,
      attentionCount,
      activityBooked,
      activityNeeded,
      anyActivities,
    };
  }, [parties]);

  const metricCards: Metric[] = [
    {
      key: "all",
      icon: <IconUsers size={18} />,
      value: String(metrics.invited),
      label: "Invited",
      sub: `Across ${metrics.partyCount} ${metrics.partyCount === 1 ? "party" : "parties"}`,
    },
    {
      key: "attending",
      icon: <IconLeaf size={18} />,
      value: String(metrics.attending),
      label: "Attending",
      sub: `${metrics.adults} adults · ${metrics.children} children`,
      tone: "good",
    },
    {
      key: "declined",
      icon: <IconHeart size={18} />,
      value: String(metrics.declined),
      label: "Declined",
      sub: `${metrics.declinedPct}% of invited`,
      tone: "bad",
    },
    {
      key: "awaiting",
      icon: <IconClock size={18} />,
      value: String(metrics.awaiting),
      label: "Awaiting RSVP",
      sub: `${metrics.awaitingPct}% of invited`,
      tone: "warn",
    },
    {
      key: "activities",
      icon: <IconBasket size={18} />,
      value: String(metrics.activityBooked),
      label: "Activities Booked",
      sub: metrics.anyActivities
        ? `${metrics.activityNeeded} still to select`
        : "No sign-ups yet",
    },
    {
      key: "travel-missing",
      icon: <IconPlane size={18} />,
      value: String(metrics.travelSubmitted),
      label: "Travel Submitted",
      sub: `${metrics.travelNeeded} still needed`,
      tone: "info",
    },
    {
      key: "attention",
      icon: <IconAlert size={18} />,
      value: String(metrics.attentionCount),
      label: "Need Attention",
      sub: "Click to view",
      tone: metrics.attentionCount > 0 ? "bad" : "good",
    },
  ];

  /* ---- Filtering ---- */
  function partyMatchesFilters(p: Party): boolean {
    if (sideFilter !== "All" && p.side !== sideFilter) return false;
    if (rsvpFilter === "Attending" && !p.guests.some(isAttending)) return false;
    if (rsvpFilter === "Awaiting" && !p.guests.some(isAwaiting)) return false;
    if (
      rsvpFilter === "Declined" &&
      !p.guests.some((g) => g.rsvp_status === "Declined")
    )
      return false;
    if (travelFilter === "Submitted" && !partyHasTravel(p)) return false;
    if (travelFilter === "Missing" && partyHasTravel(p)) return false;

    const booked = p.guests.some((g) => (g.activities?.length ?? 0) > 0);
    if (activityFilter === "Booked" && !booked) return false;
    if (activityFilter === "None" && booked) return false;

    const hasRoom = (p.lodging?.length ?? 0) > 0 || Boolean(p.travel?.room_assignment);
    if (lodgingFilter === "Assigned" && !hasRoom) return false;
    if (lodgingFilter === "Unassigned" && hasRoom) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const haystack = [
        p.name,
        p.email ?? "",
        p.phone ?? "",
        ...p.guests.map((g) => g.first_name),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  }

  const filteredParties = useMemo(() => {
    const rows = parties.filter((p) => partyMatchesFilters(p) && partyMatchesTab(p, tab));
    const byName = (a: Party, c: Party) => displayName(a).localeCompare(displayName(c));
    switch (sort) {
      case "name-desc":
        return rows.sort((a, c) => byName(c, a));
      case "guests":
        return rows.sort((a, c) => c.guests.length - a.guests.length || byName(a, c));
      case "rsvp":
        return rows.sort(
          (a, c) =>
            c.guests.filter(isAwaiting).length - a.guests.filter(isAwaiting).length || byName(a, c)
        );
      case "attention":
        return rows.sort(
          (a, c) => partyAttention(c).length - partyAttention(a).length || byName(a, c)
        );
      default:
        return rows.sort(byName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parties, tab, search, rsvpFilter, travelFilter, sideFilter, activityFilter, lodgingFilter, sort]);

  const guestRows = useMemo(() => {
    const rows: { guest: Guest; party: Party }[] = [];
    for (const p of parties) {
      if (!partyMatchesFilters(p)) continue;
      for (const g of p.guests) {
        if (guestMatchesTab(g, p, tab)) rows.push({ guest: g, party: p });
      }
    }
    const byName = (a: { guest: Guest }, c: { guest: Guest }) =>
      (a.guest.first_name || "").localeCompare(c.guest.first_name || "");
    if (sort === "name-desc") return rows.sort((a, c) => byName(c, a));
    if (sort === "attention")
      return rows.sort(
        (a, c) =>
          guestAttention(c.guest, c.party).length - guestAttention(a.guest, a.party).length ||
          byName(a, c)
      );
    return rows.sort(byName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parties, tab, search, rsvpFilter, travelFilter, sideFilter, activityFilter, lodgingFilter, sort]);

  const tabCounts = useMemo(() => {
    const counts = {} as Record<TabKey, number>;
    for (const t of TABS) {
      counts[t.key] =
        view === "party"
          ? parties.filter((p) => partyMatchesTab(p, t.key)).length
          : parties.flatMap((p) =>
              p.guests.filter((g) => guestMatchesTab(g, p, t.key))
            ).length;
    }
    return counts;
  }, [parties, view]);

  /* ---- Pagination ---- */
  const totalRows = view === "party" ? filteredParties.length : guestRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const clampedPage = Math.min(page, pageCount);
  const startIdx = (clampedPage - 1) * pageSize;
  const pageParties = filteredParties.slice(startIdx, startIdx + pageSize);
  const pageGuests = guestRows.slice(startIdx, startIdx + pageSize);

  /* ---- Edit / save / delete (unchanged flow) ---- */
  function startAdd() {
    setDraft(emptyPartyDraft());
    setEditingId("new");
    requestAnimationFrame(() =>
      editRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  }
  function startEdit(p: Party) {
    setDraft(partyToDraft(p));
    setEditingId(p.id);
    setMenuId(null);
    requestAnimationFrame(() =>
      editRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  }
  function cancel() {
    setEditingId(null);
    setDraft(emptyPartyDraft());
  }

  async function saveDraft() {
    if (!draft.name.trim()) return;
    setSaving(true);
    try {
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

      for (const gid of draft.removedGuestIds) {
        await fetch(`/api/admin/guests/${gid}`, { method: "DELETE" });
      }

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
          /* The upsert returns the guest row alone; activities and events come
             from admin_list_guests, so preserve what we already had for them. */
          const prior = parties
            .flatMap((p) => p.guests)
            .find((x) => x.id === guest.id);
          savedGuests.push({
            ...guest,
            activities: prior?.activities ?? [],
            events: prior?.events ?? [],
          });
        }
      }

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
        household_type: party.household_type ?? "couple",
        household_surname: party.household_surname ?? null,
        display_name_override: party.display_name_override ?? null,
        formal_name_override: party.formal_name_override ?? null,
        guests: savedGuests,
        travel,
        /* Room assignments are managed under Lodging, not this form — keep
           whatever the list already had for this party. */
        lodging: parties.find((x) => x.id === partyId)?.lodging ?? [],
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
    setMenuId(null);
    if (!confirm(`Delete ${p.name} and all their guests? This can't be undone.`))
      return;
    const res = await fetch(`/api/admin/parties/${p.id}`, { method: "DELETE" });
    if (res.ok) setParties((prev) => prev.filter((x) => x.id !== p.id));
  }

  function metricSelect(key: string) {
    changeTab(key as TabKey);
  }

  /* ---- Render ---- */
  return (
    <div>
      <PageHeader
        title="Guest List"
        subtitle="Manage invitations, responses, activities, travel & lodging."
        action={
          <button type="button" className="btn-primary" onClick={startAdd}>
            <IconPlus size={15} className={styles.btnIcon} />
            Add Guest or Party
          </button>
        }
      />

      {/* "all" is the resting state, not a chosen filter — highlighting the
          Invited card on load reads as a filter nobody applied (and the tab
          row already says "All Guests"). */}
      <MetricStrip
        metrics={metricCards}
        activeKey={tab === "all" ? null : tab}
        onSelect={metricSelect}
      />

      <Toolbar
        right={
          <>
            <div className={styles.viewToggle}>
              <button
                type="button"
                className={view === "party" ? styles.viewBtnActive : styles.viewBtn}
                onClick={() => changeView("party")}
              >
                Party View
              </button>
              <button
                type="button"
                className={view === "individual" ? styles.viewBtnActive : styles.viewBtn}
                onClick={() => changeView("individual")}
              >
                Individual View
              </button>
            </div>
            <ColumnsButton
              columns={columns}
              hidden={cols.hidden}
              onToggle={cols.toggle}
              onReset={cols.reset}
            />
          </>
        }
      >
        <ToolbarSearch
          value={search}
          placeholder="Search guests or parties…"
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />
        <FilterSelect
          label="RSVP"
          value={rsvpFilter}
          options={OPT_RSVP}
          onChange={(v) => {
            setRsvpFilter(v);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Travel"
          value={travelFilter}
          options={OPT_TRAVEL}
          onChange={(v) => {
            setTravelFilter(v);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Activities"
          value={activityFilter}
          options={OPT_ACTIVITIES}
          onChange={(v) => {
            setActivityFilter(v);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Lodging"
          value={lodgingFilter}
          options={OPT_LODGING}
          onChange={(v) => {
            setLodgingFilter(v);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Side"
          value={sideFilter}
          options={OPT_SIDE}
          onChange={(v) => {
            setSideFilter(v);
            setPage(1);
          }}
        />
      </Toolbar>

      <SortBar value={sort} options={SORT_OPTIONS} onChange={(v) => setSort(v as SortKey)} />

      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={tab === t.key ? styles.tabActive : styles.tab}
            onClick={() => changeTab(t.key)}
          >
            {t.label}
            {t.key !== "all" && (
              <span className={styles.tabCount}>{tabCounts[t.key]}</span>
            )}
          </button>
        ))}
      </div>

      {editingId !== null && (
        <div className={styles.editCard} ref={editRef}>
          <PartyForm
            draft={draft}
            setDraft={setDraft}
            onSave={saveDraft}
            onCancel={cancel}
            saving={saving}
          />
        </div>
      )}

      {parties.length === 0 ? (
        <p className={styles.empty}>No parties yet. Add your first one.</p>
      ) : totalRows === 0 ? (
        <div className={styles.empty}>
          <p>No guests match these filters.</p>
          <button
            type="button"
            className={styles.linkBtn}
            onClick={() => {
              setSearch("");
              setRsvpFilter("All");
              setTravelFilter("All");
              setSideFilter("All");
              setActivityFilter("All");
              setLodgingFilter("All");
              changeTab("all");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : view === "party" ? (
        <PartyTable
          parties={pageParties}
          events={events}
          show={cols.isVisible}
          onOpen={(p) => setDetail({ party: p, guest: null })}
          menuId={menuId}
          setMenuId={setMenuId}
          onEdit={startEdit}
          onDelete={deleteParty}
        />
      ) : (
        <IndividualTable
          rows={pageGuests}
          events={events}
          show={cols.isVisible}
          onOpen={(g, p) => setDetail({ party: p, guest: g })}
          menuId={menuId}
          setMenuId={setMenuId}
          onEdit={startEdit}
          onDelete={deleteParty}
        />
      )}

      {detail && (
        <DetailDrawer
          party={detail.party}
          guest={detail.guest}
          onClose={() => setDetail(null)}
          onEdit={() => {
            const p = detail.party;
            setDetail(null);
            startEdit(p);
          }}
        />
      )}

      <Pagination
        total={totalRows}
        page={clampedPage}
        pageSize={pageSize}
        onPage={setPage}
        onPageSize={setPageSize}
        noun={view === "party" ? "parties" : "guests"}
      />
    </div>
  );
}

/* ---- Shared cell helpers ---- */

function AttentionCell({ items }: { items: AttentionItem[] }) {
  if (items.length === 0) {
    return (
      <span className={styles.allSet}>
        <IconCheckCircle size={14} /> All set!
      </span>
    );
  }
  return (
    <div className={styles.attentionCell}>
      <span className={styles.attentionHead}>
        <IconAlert size={13} />
        <span>{`${items.length} ${items.length === 1 ? "issue" : "issues"}`}</span>
      </span>
      <ul className={styles.attentionList}>
        {items.map((it) => (
          <li key={it.key}>{it.label}</li>
        ))}
      </ul>
    </div>
  );
}

function ContactCell({ party }: { party: Party }) {
  if (!party.email && !party.phone) return <span className={styles.dim}>—</span>;
  return (
    <div className={styles.contactCell}>
      {party.email && (
        <span>
          <IconMail size={12} className={styles.cellIcon} /> {party.email}
        </span>
      )}
      {party.phone && (
        <span>
          <IconPhone size={12} className={styles.cellIcon} /> {party.phone}
        </span>
      )}
    </div>
  );
}

function TravelCell({ party }: { party: Party }) {
  const t = party.travel;
  if (partyHasTravel(party) && t) {
    return (
      <div className={styles.travelCell}>
        {t.arrival_date && (
          <span className={styles.travelArriving}>
            <IconPlane size={12} className={styles.cellIcon} /> Arrives{" "}
            {formatDate(t.arrival_date)}
          </span>
        )}
        {t.departure_date && <span>Departs {formatDate(t.departure_date)}</span>}
        {t.flight_info && <span className={styles.dim}>{t.flight_info}</span>}
        {t.needs_shuttle && <span className={styles.shuttleTag}>Shuttle</span>}
      </div>
    );
  }
  if (party.guests.some(isAttending)) {
    return (
      <span className={styles.travelMissing}>
        <IconAlert size={13} /> Travel info missing
      </span>
    );
  }
  return <span className={styles.dim}>—</span>;
}

function LodgingCell({ party }: { party: Party }) {
  const assignment = party.lodging?.[0];

  if (assignment) {
    const room = [assignment.room_name, assignment.room_type].filter(Boolean).join(" · ");
    const stay = [assignment.check_in_date, assignment.check_out_date]
      .filter(Boolean)
      .map((d) => formatDate(d as string))
      .join(" – ");
    return (
      <div className={styles.lodgingCell}>
        {assignment.property_name && (
          <span className={styles.lodgingProperty}>{assignment.property_name}</span>
        )}
        {room && <span>{room}</span>}
        {stay && <span className={styles.dim}>{stay}</span>}
        {assignment.status && assignment.status !== "assigned" && (
          <span className={styles.lodgingStatus}>{assignment.status}</span>
        )}
      </div>
    );
  }

  /* Fall back to the free-text room on travel_info for parties assigned before
     the Lodging module existed. */
  const legacy = party.travel?.room_assignment;
  if (legacy) return <span className={styles.lodgingCell}>{legacy}</span>;
  return <span className={styles.dim}>—</span>;
}

/*
 * Weekend Events — one dot per RSVP-enabled event, per guest, aligned to the
 * party's member list so a row reads across. Green attending, terracotta
 * declined, amber awaiting, hollow for not invited to that event.
 */
const EVENT_RSVP_CLASS: Record<string, string> = {
  attending: "dotAttending",
  confirmed: "dotAttending",
  declined: "dotDeclined",
  awaiting: "dotAwaiting",
  invited: "dotAwaiting",
  pending: "dotAwaiting",
};

function eventShortLabel(e: WeekendEvent): string {
  if (e.short_label?.trim()) return e.short_label.trim();
  return e.title.split(/\s+/)[0];
}

function eventDayLabel(e: WeekendEvent): string {
  if (!e.starts_at) return "";
  const m = e.starts_at.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return "";
  const [, y, mo, d] = m.map(Number);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    new Date(Date.UTC(y, mo - 1, d)).getUTCDay()
  ];
}

function WeekendEventsCell({
  party,
  events,
}: {
  party: Party;
  events: WeekendEvent[];
}) {
  if (events.length === 0) {
    return (
      <span className={styles.dim} title="No RSVP-enabled events in the Itinerary yet">
        —
      </span>
    );
  }
  return (
    <div className={styles.eventMatrix}>
      {party.guests.map((g) => (
        <div className={styles.eventRow} key={g.id}>
          {events.map((e) => {
            const invite = g.events?.find((x) => x.event_id === e.id);
            const cls = invite
              ? styles[EVENT_RSVP_CLASS[(invite.rsvp_status ?? "").toLowerCase()] ?? "dotAwaiting"]
              : styles.dotNotInvited;
            const label = invite
              ? `${g.first_name || "Guest"} · ${e.title}: ${invite.rsvp_status ?? "awaiting"}`
              : `${g.first_name || "Guest"} · not invited to ${e.title}`;
            return (
              <span key={e.id} className={styles.eventDotCell} title={label}>
                <span className={`${styles.eventDot} ${cls}`} />
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* Single-guest variants for the Individual view. */
function GuestEventsCell({ guest, events }: { guest: Guest; events: WeekendEvent[] }) {
  if (events.length === 0) return <span className={styles.dim}>—</span>;
  return (
    <div className={styles.eventRow}>
      {events.map((e) => {
        const invite = guest.events?.find((x) => x.event_id === e.id);
        const cls = invite
          ? styles[EVENT_RSVP_CLASS[(invite.rsvp_status ?? "").toLowerCase()] ?? "dotAwaiting"]
          : styles.dotNotInvited;
        const label = invite
          ? `${e.title}: ${invite.rsvp_status ?? "awaiting"}`
          : `Not invited to ${e.title}`;
        return (
          <span key={e.id} className={styles.eventDotCell} title={label}>
            <span className={`${styles.eventDot} ${cls}`} />
          </span>
        );
      })}
    </div>
  );
}

function GuestActivitiesCell({ guest }: { guest: Guest }) {
  const list = guest.activities ?? [];
  if (list.length === 0) return <span className={styles.dim}>—</span>;
  return (
    <div className={styles.activitiesCell}>
      {list.map((a) => (
        <span key={a.activity_id}>{a.title}</span>
      ))}
    </div>
  );
}

/* Activities — party rollup plus each activity and how many of them booked it. */
function ActivitiesCell({ party }: { party: Party }) {
  const counts = new Map<string, number>();
  for (const g of party.guests) {
    for (const a of g.activities ?? []) {
      counts.set(a.title, (counts.get(a.title) ?? 0) + 1);
    }
  }
  if (counts.size === 0) return <span className={styles.dim}>—</span>;

  return (
    <div className={styles.activitiesCell}>
      <span className={styles.activitiesCount}>
        <IconLeaf size={12} className={styles.cellIcon} />
        {`${counts.size} ${counts.size === 1 ? "activity" : "activities"}`}
      </span>
      {[...counts.entries()].map(([title, n]) => (
        <span key={title} className={styles.dim}>
          {`${title} (${n})`}
        </span>
      ))}
    </div>
  );
}

function RowMenu({
  open,
  onToggle,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={styles.menuWrap}>
      <button
        type="button"
        className={styles.menuBtn}
        aria-label="Row actions"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <IconDots size={16} />
      </button>
      {open && (
        <div className={styles.menu}>
          <button type="button" onClick={onEdit}>
            Edit
          </button>
          <button type="button" className={styles.menuDelete} onClick={onDelete}>
            Delete party
          </button>
        </div>
      )}
    </div>
  );
}

/* ---- Party view table ---- */

function PartyTable({
  parties,
  events,
  show,
  onOpen,
  menuId,
  setMenuId,
  onEdit,
  onDelete,
}: {
  parties: Party[];
  events: WeekendEvent[];
  show: (key: string) => boolean;
  onOpen: (p: Party) => void;
  menuId: string | null;
  setMenuId: (id: string | null) => void;
  onEdit: (p: Party) => void;
  onDelete: (p: Party) => void;
}) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thGuest}>Guest / Party</th>
            {show("child") && <th>Child</th>}
            {show("rsvp") && <th>RSVP</th>}
            {show("events") && (
            <th>
              Weekend Events
              {events.length > 0 && (
                <span className={styles.eventHeadRow}>
                  {events.map((e) => (
                    <span key={e.id} className={styles.eventHead} title={e.title}>
                      <span>{eventShortLabel(e)}</span>
                      <span className={styles.eventHeadDay}>{eventDayLabel(e)}</span>
                    </span>
                  ))}
                </span>
              )}
            </th>
            )}
            {show("activities") && <th>Activities</th>}
            {show("travel") && <th>Travel</th>}
            {show("lodging") && <th>Lodging</th>}
            {show("contact") && <th>Contact</th>}
            {show("attention") && <th>Needs Attention</th>}
            <th className={styles.thActions}>
              <span className={styles.visuallyHidden}>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {parties.map((p) => {
            const children = p.guests.filter((g) => g.is_child).length;
            const attending = p.guests.filter(isAttending).length;
            const awaiting = p.guests.filter(isAwaiting).length;
            return (
              <tr
                key={p.id}
                className={styles.rowClickable}
                onClick={() => onOpen(p)}
              >
                <td className={styles.tdGuest}>
                  <span className={styles.partyName}>{displayName(p)}</span>
                  <span className={styles.partyMeta}>
                    <span className={styles.householdTag}>
                      {HOUSEHOLD_LABEL[p.household_type] ?? p.household_type}
                    </span>
                    {p.guests.length}{" "}
                    {p.guests.length === 1 ? "guest" : "guests"}
                    {p.side ? ` · ${p.side}` : ""}
                  </span>
                  <ul className={styles.memberList}>
                    {p.guests.map((g) => (
                      <li key={g.id} className={styles.memberLine}>
                        <span className={styles.memberName}>
                          {g.first_name || (
                            <em className={styles.dim}>(name not set)</em>
                          )}
                        </span>
                        <span className={styles.memberKind}>
                          {g.is_plus_one ? "Plus-one" : g.is_child ? "Child" : "Adult"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                {show("child") && (
                <td>
                  {children > 0 ? (
                    <span>
                      {children} {children === 1 ? "child" : "children"}
                    </span>
                  ) : (
                    <span className={styles.dim}>—</span>
                  )}
                </td>
                )}
                {show("rsvp") && (
                <td>
                  <div className={styles.rsvpRollup}>
                    {attending > 0 && (
                      <span className={styles.rsvpAttending}>
                        {attending} attending
                      </span>
                    )}
                    {awaiting > 0 && (
                      <span className={styles.rsvpAwaiting}>
                        {awaiting} awaiting
                      </span>
                    )}
                  </div>
                  <ul className={styles.statusList}>
                    {p.guests.map((g) => (
                      <li key={g.id} className={styles.memberLine}>
                        <span
                          className={`${styles.status} ${
                            styles[statusClass[g.rsvp_status] ?? "statusInvited"]
                          }`}
                        >
                          {g.rsvp_status === "Confirmed"
                            ? "Attending"
                            : g.rsvp_status === "Pending"
                              ? "Awaiting"
                              : g.rsvp_status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                )}
                {show("events") && (
                <td>
                  <WeekendEventsCell party={p} events={events} />
                </td>
                )}
                {show("activities") && (
                <td>
                  <ActivitiesCell party={p} />
                </td>
                )}
                {show("travel") && (
                <td>
                  <TravelCell party={p} />
                </td>
                )}
                {show("lodging") && (
                <td>
                  <LodgingCell party={p} />
                </td>
                )}
                {show("contact") && (
                <td>
                  <ContactCell party={p} />
                </td>
                )}
                {show("attention") && (
                <td>
                  {p.guests.length === 0 ? (
                    <span className={styles.dim}>No guests yet</span>
                  ) : (
                    <AttentionCell
                      items={[
                        ...partyAttention(p),
                        ...householdNudges(p).map((n, i) => ({
                          key: `household-${i}`,
                          tone: "warn" as const,
                          label: n.message,
                        })),
                      ]}
                    />
                  )}
                </td>
                )}
                <td className={styles.tdActions} onClick={(e) => e.stopPropagation()}>
                  <RowMenu
                    open={menuId === p.id}
                    onToggle={() => setMenuId(menuId === p.id ? null : p.id)}
                    onEdit={() => onEdit(p)}
                    onDelete={() => onDelete(p)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---- Individual view table ---- */

function IndividualTable({
  rows,
  events,
  show,
  onOpen,
  menuId,
  setMenuId,
  onEdit,
  onDelete,
}: {
  rows: { guest: Guest; party: Party }[];
  events: WeekendEvent[];
  show: (key: string) => boolean;
  onOpen: (g: Guest, p: Party) => void;
  menuId: string | null;
  setMenuId: (id: string | null) => void;
  onEdit: (p: Party) => void;
  onDelete: (p: Party) => void;
}) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thGuest}>Guest</th>
            {show("party") && <th>Party</th>}
            {show("rsvp") && <th>RSVP</th>}
            {show("events") && <th>Weekend Events</th>}
            {show("activities") && <th>Activities</th>}
            {show("travel") && <th>Travel</th>}
            {show("lodging") && <th>Lodging</th>}
            {show("dietary") && <th>Dietary / Notes</th>}
            {show("attention") && <th>Needs Attention</th>}
            <th className={styles.thActions}>
              <span className={styles.visuallyHidden}>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ guest: g, party: p }) => {
            const dietary = [
              g.meal_choice && `Meal: ${g.meal_choice}`,
              g.dietary_restrictions,
              g.allergies && `Allergy: ${g.allergies}`,
              g.accessibility_needs && `Access: ${g.accessibility_needs}`,
            ].filter(Boolean) as string[];
            const menuKey = `g-${g.id}`;
            return (
              <tr
                key={g.id}
                className={styles.rowClickable}
                onClick={() => onOpen(g, p)}
              >
                <td className={styles.tdGuest}>
                  <span className={styles.partyName}>
                    {g.first_name || (
                      <em className={styles.dim}>(name not set)</em>
                    )}
                  </span>
                  <span className={styles.partyMeta}>
                    {g.is_child ? "Child" : "Adult"}
                  </span>
                </td>
                {show("party") && (
                <td>
                  <span className={styles.memberName}>{displayName(p)}</span>
                  <span className={styles.partyMeta}>
                    {p.guests.length}{" "}
                    {p.guests.length === 1 ? "guest" : "guests"}
                  </span>
                </td>
                )}
                {show("rsvp") && (
                <td>
                  <span
                    className={`${styles.status} ${
                      styles[statusClass[g.rsvp_status] ?? "statusInvited"]
                    }`}
                  >
                    {g.rsvp_status === "Confirmed"
                      ? "Attending"
                      : g.rsvp_status === "Pending"
                        ? "Awaiting"
                        : g.rsvp_status}
                  </span>
                </td>
                )}
                {show("events") && (
                <td>
                  <GuestEventsCell guest={g} events={events} />
                </td>
                )}
                {show("activities") && (
                <td>
                  <GuestActivitiesCell guest={g} />
                </td>
                )}
                {show("travel") && (
                <td>
                  <TravelCell party={p} />
                </td>
                )}
                {show("lodging") && (
                <td>
                  <LodgingCell party={p} />
                </td>
                )}
                {show("dietary") && (
                <td>
                  {dietary.length > 0 ? (
                    <div className={styles.dietaryCell}>
                      {dietary.map((d, i) => (
                        <span key={i}>{d}</span>
                      ))}
                    </div>
                  ) : (
                    <span className={styles.dim}>—</span>
                  )}
                </td>
                )}
                {show("attention") && (
                <td>
                  <AttentionCell items={guestAttention(g, p)} />
                </td>
                )}
                <td className={styles.tdActions} onClick={(e) => e.stopPropagation()}>
                  <RowMenu
                    open={menuId === menuKey}
                    onToggle={() => setMenuId(menuId === menuKey ? null : menuKey)}
                    onEdit={() => onEdit(p)}
                    onDelete={() => onDelete(p)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
