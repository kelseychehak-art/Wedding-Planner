"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./guests.module.css";
import PageHeader from "@/components/admin/PageHeader";
import MetricStrip, { type Metric } from "@/components/admin/MetricStrip";
import {
  IconUsers,
  IconLeaf,
  IconHeart,
  IconClock,
  IconBasket,
  IconPlane,
  IconAlert,
  IconCheckCircle,
  IconSearch,
  IconMail,
  IconPhone,
  IconDots,
  IconPlus,
  IconChevronLeft,
  IconChevronRight,
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

type ViewMode = "party" | "individual";
type TabKey =
  | "all"
  | "attention"
  | "awaiting"
  | "travel-missing"
  | "attending"
  | "declined";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All Guests" },
  { key: "attention", label: "Needs Attention" },
  { key: "awaiting", label: "Awaiting RSVP" },
  { key: "travel-missing", label: "Travel Missing" },
  { key: "attending", label: "Attending" },
  { key: "declined", label: "Declined" },
];

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
    case "attending":
      return isAttending(g);
    case "declined":
      return g.rsvp_status === "Declined";
  }
}

export default function GuestsManager({
  initialParties,
  initialView = "party",
  initialTab = "all",
}: {
  initialParties: Party[];
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [menuId, setMenuId] = useState<string | null>(null);

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
      value: "—",
      label: "Activities Booked",
      sub: "Not tracked yet",
      disabled: true,
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

  const filteredParties = useMemo(
    () => parties.filter((p) => partyMatchesFilters(p) && partyMatchesTab(p, tab)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parties, tab, search, rsvpFilter, travelFilter, sideFilter]
  );

  const guestRows = useMemo(() => {
    const rows: { guest: Guest; party: Party }[] = [];
    for (const p of parties) {
      if (!partyMatchesFilters(p)) continue;
      for (const g of p.guests) {
        if (guestMatchesTab(g, p, tab)) rows.push({ guest: g, party: p });
      }
    }
    return rows;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parties, tab, search, rsvpFilter, travelFilter, sideFilter]);

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
          savedGuests.push(guest);
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
    setMenuId(null);
    if (!confirm(`Delete ${p.name} and all their guests? This can't be undone.`))
      return;
    const res = await fetch(`/api/admin/parties/${p.id}`, { method: "DELETE" });
    if (res.ok) setParties((prev) => prev.filter((x) => x.id !== p.id));
  }

  function metricSelect(key: string) {
    if (key === "activities") return;
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

      <MetricStrip
        metrics={metricCards}
        activeKey={tab}
        onSelect={metricSelect}
      />

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <IconSearch size={14} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search guests or parties…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <FilterSelect
          label="RSVP"
          value={rsvpFilter}
          options={["All", "Attending", "Awaiting", "Declined"]}
          onChange={(v) => {
            setRsvpFilter(v);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Travel"
          value={travelFilter}
          options={["All", "Submitted", "Missing"]}
          onChange={(v) => {
            setTravelFilter(v);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Side"
          value={sideFilter}
          options={["All", "Kelsey", "Andrew", "Shared"]}
          onChange={(v) => {
            setSideFilter(v);
            setPage(1);
          }}
        />
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
            className={
              view === "individual" ? styles.viewBtnActive : styles.viewBtn
            }
            onClick={() => changeView("individual")}
          >
            Individual View
          </button>
        </div>
      </div>

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
              changeTab("all");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : view === "party" ? (
        <PartyTable
          parties={pageParties}
          menuId={menuId}
          setMenuId={setMenuId}
          onEdit={startEdit}
          onDelete={deleteParty}
        />
      ) : (
        <IndividualTable
          rows={pageGuests}
          menuId={menuId}
          setMenuId={setMenuId}
          onEdit={startEdit}
          onDelete={deleteParty}
        />
      )}

      {totalRows > 0 && (
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            {startIdx + 1}–{Math.min(startIdx + pageSize, totalRows)} of{" "}
            {totalRows} {view === "party" ? "parties" : "guests"}
          </span>
          <div className={styles.pageSizeWrap}>
            <span>Rows per page:</span>
            <select
              className={styles.pageSizeSelect}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.pageButtons}>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={clampedPage <= 1}
              onClick={() => setPage(clampedPage - 1)}
              aria-label="Previous page"
            >
              <IconChevronLeft size={14} />
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                className={n === clampedPage ? styles.pageBtnActive : styles.pageBtn}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              className={styles.pageBtn}
              disabled={clampedPage >= pageCount}
              onClick={() => setPage(clampedPage + 1)}
              aria-label="Next page"
            >
              <IconChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Toolbar filter select ---- */

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className={styles.filterSelect}>
      <span className={styles.filterLabel}>{label}:</span>
      <select
        className={styles.filterControl}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
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
        <IconAlert size={13} /> {items.length}{" "}
        {items.length === 1 ? "issue" : "issues"}
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
  const room = party.travel?.room_assignment;
  if (!room) return <span className={styles.dim}>—</span>;
  return <span className={styles.lodgingCell}>{room}</span>;
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
  menuId,
  setMenuId,
  onEdit,
  onDelete,
}: {
  parties: Party[];
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
            <th>Child</th>
            <th>RSVP</th>
            <th title="Per-event RSVP is not tracked yet">Weekend Events</th>
            <th title="Activity sign-ups are not tracked yet">Activities</th>
            <th>Travel</th>
            <th>Lodging</th>
            <th>Contact</th>
            <th>Needs Attention</th>
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
              <tr key={p.id}>
                <td className={styles.tdGuest}>
                  <span className={styles.partyName}>{p.name}</span>
                  <span className={styles.partyMeta}>
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
                          {g.is_child ? "Child" : "Adult"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  {children > 0 ? (
                    <span>
                      {children} {children === 1 ? "child" : "children"}
                    </span>
                  ) : (
                    <span className={styles.dim}>—</span>
                  )}
                </td>
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
                <td className={styles.placeholderCell}>—</td>
                <td className={styles.placeholderCell}>—</td>
                <td>
                  <TravelCell party={p} />
                </td>
                <td>
                  <LodgingCell party={p} />
                </td>
                <td>
                  <ContactCell party={p} />
                </td>
                <td>
                  <AttentionCell items={partyAttention(p)} />
                </td>
                <td className={styles.tdActions}>
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
  menuId,
  setMenuId,
  onEdit,
  onDelete,
}: {
  rows: { guest: Guest; party: Party }[];
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
            <th>Party</th>
            <th>RSVP</th>
            <th title="Per-event RSVP is not tracked yet">Weekend Events</th>
            <th title="Activity sign-ups are not tracked yet">Activities</th>
            <th>Travel</th>
            <th>Lodging</th>
            <th>Dietary / Notes</th>
            <th>Needs Attention</th>
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
              <tr key={g.id}>
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
                <td>
                  <span className={styles.memberName}>{p.name}</span>
                  <span className={styles.partyMeta}>
                    {p.guests.length}{" "}
                    {p.guests.length === 1 ? "guest" : "guests"}
                  </span>
                </td>
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
                <td className={styles.placeholderCell}>—</td>
                <td className={styles.placeholderCell}>—</td>
                <td>
                  <TravelCell party={p} />
                </td>
                <td>
                  <LodgingCell party={p} />
                </td>
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
                <td>
                  <AttentionCell items={guestAttention(g, p)} />
                </td>
                <td className={styles.tdActions}>
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
