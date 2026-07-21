import Link from "next/link";
import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import styles from "./dashboard.module.css";
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
  IconPlus,
  IconChevronRight,
} from "@/components/admin/icons";

/* ---- Types (shape returned by admin_list_guests) ---- */
type Guest = {
  id: string;
  first_name: string;
  is_child: boolean;
  rsvp_status: string;
  meal_choice: string | null;
  created_at?: string | null;
};
type Travel = {
  arrival_date: string | null;
  departure_date: string | null;
  flight_info: string | null;
  room_assignment: string | null;
  needs_shuttle: boolean;
} | null;
type Party = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  side: string | null;
  guests: Guest[];
  travel: Travel;
  created_at?: string | null;
};

type BudgetItem = {
  name: string;
  estimated_amount: number | null;
  amount_paid: number;
  due_date: string | null;
  status: string;
};
type PipelineItem = {
  id: string;
  name: string;
  stage: string;
  next_action: string | null;
  next_action_date: string | null;
};

type ActivityRow = {
  id: string;
  title: string;
  status: string;
  capacity: number | null;
  booked_count: number;
  waitlist_count: number;
};

type ItineraryPayload = {
  events?: {
    id: string;
    title: string;
    starts_at: string | null;
    rsvp_enabled: boolean;
    attending_count: number;
    awaiting_count: number;
    declined_count: number;
  }[];
};

type LodgingSnapshot = {
  properties?: { id: string; name: string }[];
  rooms?: { id: string }[];
  assignments?: { room_id: string | null; status: string; party_guest_count: number }[];
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isAttending(g: Guest) {
  return g.rsvp_status === "Confirmed";
}
function isAwaiting(g: Guest) {
  return g.rsvp_status === "Invited" || g.rsvp_status === "Pending";
}
function partyHasTravel(p: Party) {
  return Boolean(
    p.travel && (p.travel.arrival_date || p.travel.departure_date || p.travel.flight_info)
  );
}

/* "2027-06-16" → {month:"Jun", day:16, weekday:"Wed"} (string-parsed, no TZ drift) */
function parseDate(iso: string) {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const [, y, mo, d] = m.map(Number);
  const weekday = WEEKDAYS[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()];
  return { month: MONTHS[mo - 1], day: d, weekday, key: iso.slice(0, 10) };
}

function relTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return "";
  return `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`;
}

async function getDashboard() {
  const token = await getAdminToken();
  if (!token) return null;

  const [
    { data: parties },
    { data: budget },
    { data: venues },
    { data: vendors },
    { data: activityRows },
    { data: lodging },
    { data: itinerary },
  ] =
    await Promise.all([
      supabase.rpc("admin_list_guests", { p_token: token }),
      supabase.rpc("admin_get_budget", { p_token: token }),
      supabase.rpc("admin_list_venues", { p_token: token }),
      supabase.rpc("admin_list_vendors", { p_token: token }),
      supabase.rpc("admin_list_activities", { p_token: token }),
      supabase.rpc("admin_get_lodging", { p_token: token }),
      supabase.rpc("admin_get_itinerary", { p_token: token }),
    ]);

  const partyList = (parties ?? []) as Party[];
  const allGuests = partyList.flatMap((p) => p.guests ?? []);

  // ---- Metrics (real, from guest data) ----
  const invited = allGuests.length;
  const attending = allGuests.filter(isAttending);
  const adults = attending.filter((g) => !g.is_child).length;
  const children = attending.filter((g) => g.is_child).length;
  const declined = allGuests.filter((g) => g.rsvp_status === "Declined").length;
  const awaiting = allGuests.filter(isAwaiting).length;
  const pct = (n: number) => (invited ? Math.round((n / invited) * 100) : 0);
  const attendingParties = partyList.filter((p) => p.guests.some(isAttending));
  const travelSubmitted = attendingParties.filter(partyHasTravel).length;
  const travelNeeded = attendingParties.length - travelSubmitted;

  // ---- Activities rollup (mockup §11E "Activity Booking Status") ----
  const activities = (activityRows ?? []) as ActivityRow[];
  const activityCapacity = activities.reduce((s, a) => s + (a.capacity ?? 0), 0);
  const activityBooked = activities.reduce((s, a) => s + Number(a.booked_count ?? 0), 0);
  const activityWaitlist = activities.reduce((s, a) => s + Number(a.waitlist_count ?? 0), 0);
  const activitySpaces = Math.max(0, activityCapacity - activityBooked);
  const activityPublished = activities.filter((a) => a.status === "published").length;
  const activityFillPct = activityCapacity
    ? Math.round((activityBooked / activityCapacity) * 100)
    : 0;

  // ---- Lodging rollup (mockup §11F "Lodging Snapshot") ----
  const lodgingData = (lodging ?? {}) as LodgingSnapshot;
  const lodgingProperties = lodgingData.properties ?? [];
  const lodgingRooms = lodgingData.rooms ?? [];
  const lodgingAssignments = lodgingData.assignments ?? [];
  const roomsHeld = lodgingRooms.length;
  const roomsReserved = new Set(
    lodgingAssignments.filter((a) => a.room_id).map((a) => a.room_id)
  ).size;
  const roomsAvailable = Math.max(0, roomsHeld - roomsReserved);
  const guestsLodging = lodgingAssignments
    .filter((a) => a.status === "assigned")
    .reduce((s, a) => s + Number(a.party_guest_count ?? 0), 0);
  const occupancyPct = roomsHeld ? Math.round((roomsReserved / roomsHeld) * 100) : 0;
  const lodgingPropertyLabel =
    lodgingProperties.length === 1
      ? lodgingProperties[0].name
      : `${lodgingProperties.length} properties`;

  // ---- RSVP progress by event (mockup §11A) ----
  const itineraryEvents = ((itinerary ?? {}) as ItineraryPayload).events ?? [];
  const eventProgress = itineraryEvents
    .filter((e) => e.rsvp_enabled)
    .map((e) => {
      const a = Number(e.attending_count ?? 0);
      const w = Number(e.awaiting_count ?? 0);
      const d = Number(e.declined_count ?? 0);
      const responded = a + d;
      const total = responded + w;
      return {
        id: e.id,
        title: e.title,
        when: e.starts_at ? relTime(e.starts_at) : "",
        attending: a,
        awaiting: w,
        declined: d,
        rate: total ? Math.round((responded / total) * 100) : 0,
      };
    })
    .slice(0, 8);

  // ---- Guest needs-attention rollups (real) ----
  const missingTravelGuests = attendingParties
    .filter((p) => !partyHasTravel(p))
    .reduce((s, p) => s + p.guests.length, 0);
  const missingContactGuests = partyList
    .filter((p) => p.guests.length > 0 && !p.email && !p.phone)
    .reduce((s, p) => s + p.guests.length, 0);
  const unnamedGuests = allGuests.filter((g) => !g.first_name.trim()).length;
  const missingMeal = attending.filter((g) => !g.meal_choice).length;

  const guestIssues = [
    {
      key: "travel",
      label: "Missing travel information",
      count: missingTravelGuests,
      tone: "warn" as const,
      href: "/admin/guests?tab=travel-missing",
    },
    {
      key: "contact",
      label: "Missing contact information",
      count: missingContactGuests,
      tone: "warn" as const,
      href: "/admin/guests?tab=attention",
    },
    {
      key: "awaiting",
      label: "Awaiting RSVP",
      count: awaiting,
      tone: "warn" as const,
      href: "/admin/guests?tab=awaiting",
    },
    {
      key: "meal",
      label: "Missing meal choice",
      count: missingMeal,
      tone: "info" as const,
      href: "/admin/guests?tab=attending",
    },
    {
      key: "unnamed",
      label: "Unnamed guests",
      count: unnamedGuests,
      tone: "bad" as const,
      href: "/admin/guests?view=individual&tab=attention",
    },
  ].filter((i) => i.count > 0);

  // ---- Upcoming arrivals (real, from travel_info) ----
  const arrivalMap = new Map<
    string,
    { month: string; day: number; weekday: string; guests: number; names: string[] }
  >();
  for (const p of partyList) {
    const iso = p.travel?.arrival_date;
    if (!iso) continue;
    const d = parseDate(iso);
    if (!d) continue;
    const entry =
      arrivalMap.get(d.key) ??
      { month: d.month, day: d.day, weekday: d.weekday, guests: 0, names: [] };
    entry.guests += p.guests.length || 1;
    if (entry.names.length < 2 && p.guests[0]) entry.names.push(p.guests[0].first_name);
    else if (entry.names.length < 2) entry.names.push(p.name);
    arrivalMap.set(d.key, entry);
  }
  const arrivals = [...arrivalMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(0, 4)
    .map(([, v]) => v);

  // ---- Child guests (real) ----
  const childGuests = allGuests.filter((g) => g.is_child);
  const childWithRsvp = childGuests.filter((g) => g.rsvp_status !== "Invited").length;

  // ---- Recently added (real, from created_at) ----
  const recent = [...partyList]
    .filter((p) => p.created_at)
    .sort((a, b) => (b.created_at! > a.created_at! ? 1 : -1))
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      name: p.name,
      detail: `${p.guests.length} ${p.guests.length === 1 ? "guest" : "guests"} · added`,
      when: relTime(p.created_at),
    }));

  // ---- Planning reminders (real — preserved from the prior dashboard) ----
  const budgetItems = (budget?.items ?? []) as BudgetItem[];
  const currency = (budget?.currency ?? "EUR") as string;
  const total = Number(budget?.total ?? 0);
  const allocated = budgetItems.reduce((s, i) => s + (i.estimated_amount ?? 0), 0);
  const money = (n: number) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(n);
    } catch {
      return `${currency} ${Math.round(n).toLocaleString()}`;
    }
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntil = (s: string) =>
    Math.round((new Date(s + "T00:00:00").getTime() - today.getTime()) / 86400000);

  const planning: { label: string; detail: string; href: string; tone: "bad" | "warn" | "info" }[] = [];
  if (allocated > total && total > 0) {
    planning.push({
      label: "Over budget",
      detail: `${money(allocated)} allocated of ${money(total)}`,
      href: "/admin/budget",
      tone: "bad",
    });
  }
  for (const item of budgetItems) {
    if (!item.due_date || item.status === "Paid") continue;
    const d = daysUntil(item.due_date);
    if (d <= 45) {
      planning.push({
        label: `Payment: ${item.name}`,
        detail: d < 0 ? `${Math.abs(d)}d overdue` : d === 0 ? "Due today" : `Due in ${d}d`,
        href: "/admin/budget",
        tone: d < 7 ? "bad" : "warn",
      });
    }
  }
  for (const v of [...((venues ?? []) as PipelineItem[]), ...((vendors ?? []) as PipelineItem[])]) {
    if (!v.next_action) continue;
    const isVenue = ((venues ?? []) as PipelineItem[]).some((x) => x.id === v.id);
    const d = v.next_action_date ? daysUntil(v.next_action_date) : null;
    if (d === null || d <= 30) {
      planning.push({
        label: `${v.name}: ${v.next_action}`,
        detail: d === null ? v.stage : d < 0 ? `${Math.abs(d)}d overdue` : `In ${d}d`,
        href: `${isVenue ? "/admin/venues/" : "/admin/vendors/"}${v.id}`,
        tone: "info",
      });
    }
  }

  return {
    metrics: {
      invited,
      partyCount: partyList.length,
      attending: attending.length,
      adults,
      children,
      declined,
      declinedPct: pct(declined),
      awaiting,
      awaitingPct: pct(awaiting),
      travelSubmitted,
      travelNeeded,
      attentionCount: guestIssues.reduce((s, i) => s + i.count, 0),
      activityBooked,
      activityFillPct,
    },
    guestIssues,
    arrivals,
    arrivalsTotal: travelSubmitted,
    arrivalsNeeded: travelNeeded,
    childTotal: childGuests.length,
    childWithRsvp,
    recent,
    planning: planning.slice(0, 6),
    eventProgress,
    activities: {
      total: activities.length,
      published: activityPublished,
      capacity: activityCapacity,
      booked: activityBooked,
      waitlist: activityWaitlist,
      spaces: activitySpaces,
      fillPct: activityFillPct,
    },
    lodging: {
      propertyCount: lodgingProperties.length,
      propertyLabel: lodgingPropertyLabel,
      roomsHeld,
      roomsReserved,
      roomsAvailable,
      guestsLodging,
      occupancyPct,
      invited,
    },
  };
}

/* Small SVG donut — no chart library, matches the mockup's ring treatment. */
function Donut({ pct, center, caption }: { pct: number; center: string; caption: string }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const filled = (Math.min(100, Math.max(0, pct)) / 100) * circumference;

  return (
    <div className={styles.donut}>
      <svg viewBox="0 0 88 88" className={styles.donutSvg} aria-hidden="true">
        <circle cx="44" cy="44" r={radius} className={styles.donutTrack} />
        <circle
          cx="44"
          cy="44"
          r={radius}
          className={styles.donutFill}
          strokeDasharray={`${filled} ${circumference - filled}`}
          transform="rotate(-90 44 44)"
        />
      </svg>
      <span className={styles.donutCenter}>
        <span className={styles.donutValue}>{center}</span>
        <span className={styles.donutCaption}>{caption}</span>
      </span>
    </div>
  );
}

const TONE_DOT: Record<string, string> = {
  bad: styles.dotBad,
  warn: styles.dotWarn,
  info: styles.dotInfo,
};

export default async function AdminDashboardPage() {
  const data = await getDashboard();
  if (!data) return null;
  const m = data.metrics;

  const metricCards: Metric[] = [
    { key: "invited", icon: <IconUsers size={18} />, value: String(m.invited), label: "Invited", sub: `Across ${m.partyCount} ${m.partyCount === 1 ? "party" : "parties"}` },
    { key: "attending", icon: <IconLeaf size={18} />, value: String(m.attending), label: "Attending", sub: `${m.adults} adults · ${m.children} children`, tone: "good" },
    { key: "declined", icon: <IconHeart size={18} />, value: String(m.declined), label: "Declined", sub: `${m.declinedPct}% of invited`, tone: "bad" },
    { key: "awaiting", icon: <IconClock size={18} />, value: String(m.awaiting), label: "Awaiting RSVP", sub: `${m.awaitingPct}% of invited`, tone: "warn" },
    {
      key: "activities",
      icon: <IconBasket size={18} />,
      value: String(data.metrics.activityBooked),
      label: "Activities Booked",
      sub: data.activities.capacity
        ? `${data.metrics.activityFillPct}% of capacity`
        : "No capacity set",
      disabled: data.activities.total === 0,
    },
    { key: "travel", icon: <IconPlane size={18} />, value: String(m.travelSubmitted), label: "Travel Submitted", sub: `${m.travelNeeded} still needed`, tone: "info" },
    { key: "attention", icon: <IconAlert size={18} />, value: String(m.attentionCount), label: "Needs Attention", sub: "Across guests", tone: m.attentionCount > 0 ? "bad" : "good" },
  ];

  return (
    <div>
      <PageHeader
        title="Guest Dashboard"
        subtitle="Track invitations, RSVPs, travel, activities, and lodging at a glance."
        action={
          <div className={styles.headerActions}>
            <span className={styles.datesChip}>
              <span className={styles.datesLabel}>Wedding</span>
              <span className={styles.datesValue}>Jun 16 – 21, 2027</span>
            </span>
            <Link href="/admin/guests" className="btn-primary">
              <IconPlus size={15} className={styles.btnIcon} />
              Add Guest or Party
            </Link>
          </div>
        }
      />

      <MetricStrip metrics={metricCards} />

      <div className={styles.cardGrid}>
        {/* Needs Attention */}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Needs Attention</h2>
            <Link href="/admin/guests?tab=attention" className={styles.cardLink}>
              View all
            </Link>
          </div>
          {data.guestIssues.length === 0 ? (
            <p className={styles.cardEmpty}>Nothing needs attention right now.</p>
          ) : (
            <ul className={styles.issueList}>
              {data.guestIssues.map((it) => (
                <li key={it.key}>
                  <Link href={it.href} className={styles.issueRow}>
                    <span className={`${styles.dot} ${TONE_DOT[it.tone]}`} />
                    <span className={styles.issueLabel}>{it.label}</span>
                    <span className={styles.issueCount}>{it.count}</span>
                    <IconChevronRight size={13} className={styles.issueChevron} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Upcoming Arrivals */}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Upcoming Arrivals</h2>
            <Link href="/admin/guests?tab=attending" className={styles.cardLink}>
              View all
            </Link>
          </div>
          {data.arrivals.length === 0 ? (
            <p className={styles.cardEmpty}>No arrivals submitted yet.</p>
          ) : (
            <ul className={styles.arrivalList}>
              {data.arrivals.map((a, i) => (
                <li key={i} className={styles.arrivalRow}>
                  <span className={styles.arrivalDate}>
                    <span className={styles.arrivalMonth}>{a.month.toUpperCase()}</span>
                    <span className={styles.arrivalDay}>{a.day}</span>
                  </span>
                  <span className={styles.arrivalBody}>
                    <span className={styles.arrivalCount}>
                      {a.guests} {a.guests === 1 ? "guest" : "guests"}
                    </span>
                    <span className={styles.arrivalMeta}>
                      Arriving {a.weekday}, {a.month} {a.day}
                    </span>
                    {a.names.length > 0 && (
                      <span className={styles.arrivalNames}>
                        Includes {a.names.filter(Boolean).join(", ")}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.cardFoot}>
            <span>
              <strong>{data.arrivalsTotal}</strong> parties submitted
            </span>
            <span>
              <strong>{data.arrivalsNeeded}</strong> still needed
            </span>
          </div>
        </section>

        {/* Recently Added */}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Recently Added</h2>
            <Link href="/admin/guests" className={styles.cardLink}>
              View all
            </Link>
          </div>
          {data.recent.length === 0 ? (
            <p className={styles.cardEmpty}>No parties added yet.</p>
          ) : (
            <ul className={styles.recentList}>
              {data.recent.map((r) => (
                <li key={r.id} className={styles.recentRow}>
                  <span className={styles.avatar}>
                    {r.name.trim().charAt(0).toUpperCase() || "?"}
                  </span>
                  <span className={styles.recentBody}>
                    <span className={styles.recentName}>{r.name}</span>
                    <span className={styles.recentDetail}>{r.detail}</span>
                  </span>
                  <span className={styles.recentWhen}>{r.when}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Child Guests */}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Child Guests</h2>
          </div>
          <div className={styles.bigStat}>
            <span className={styles.bigStatValue}>{data.childTotal}</span>
            <span className={styles.bigStatLabel}>under 18</span>
          </div>
          <ul className={styles.miniStats}>
            <li>
              <span>With an RSVP</span>
              <strong>{data.childWithRsvp}</strong>
            </li>
            <li className={styles.miniMuted}>
              <span>Activity preferences</span>
              <strong>Not tracked yet</strong>
            </li>
          </ul>
        </section>

        {/* Planning Reminders (preserved budget/vendor/venue attention) */}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Planning Reminders</h2>
          </div>
          {data.planning.length === 0 ? (
            <p className={styles.cardEmpty}>
              No pressing deadlines. Add due dates and next actions in Budget, Venues, and Vendors.
            </p>
          ) : (
            <ul className={styles.issueList}>
              {data.planning.map((p, i) => (
                <li key={i}>
                  <Link href={p.href} className={styles.issueRow}>
                    <span className={`${styles.dot} ${TONE_DOT[p.tone]}`} />
                    <span className={styles.issueLabel}>{p.label}</span>
                    <span className={styles.issueDetail}>{p.detail}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Activity Booking Status (mockup §11E) */}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Activity Booking Status</h2>
            <Link href="/admin/activities" className={styles.cardLink}>
              Manage
            </Link>
          </div>
          {data.activities.total === 0 ? (
            <p className={styles.cardEmpty}>
              No activities yet. Add the wine tasting or cooking class to track sign-ups here.
            </p>
          ) : (
            <>
              <div className={styles.donutRow}>
                <Donut
                  pct={data.activities.fillPct}
                  center={String(data.activities.booked)}
                  caption="Booked"
                />
                <ul className={styles.legend}>
                  <li>
                    <span className={`${styles.swatch} ${styles.swatchBooked}`} />
                    <span>Booked</span>
                    <strong>{data.activities.booked}</strong>
                  </li>
                  <li>
                    <span className={`${styles.swatch} ${styles.swatchOpen}`} />
                    <span>Spaces left</span>
                    <strong>{data.activities.spaces}</strong>
                  </li>
                  <li>
                    <span className={`${styles.swatch} ${styles.swatchWait}`} />
                    <span>Waitlisted</span>
                    <strong>{data.activities.waitlist}</strong>
                  </li>
                </ul>
              </div>
              <div className={styles.cardFoot}>
                <span>
                  {data.activities.published} of {data.activities.total} published
                </span>
                <span>
                  <strong>{data.activities.capacity}</strong> total spaces
                </span>
              </div>
            </>
          )}
        </section>

        {/* Lodging Snapshot (mockup §11F) */}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Lodging Snapshot</h2>
            <Link href="/admin/lodging" className={styles.cardLink}>
              Manage
            </Link>
          </div>
          {data.lodging.roomsHeld === 0 ? (
            <p className={styles.cardEmpty}>
              No rooms yet. Add a property and its rooms to see occupancy here.
            </p>
          ) : (
            <>
              <div className={styles.donutRow}>
                <Donut
                  pct={data.lodging.occupancyPct}
                  center={`${data.lodging.occupancyPct}%`}
                  caption="Occupancy"
                />
                <ul className={styles.legend}>
                  <li>
                    <span>Rooms held</span>
                    <strong>{data.lodging.roomsHeld}</strong>
                  </li>
                  <li>
                    <span>Reserved</span>
                    <strong>{data.lodging.roomsReserved}</strong>
                  </li>
                  <li>
                    <span>Available</span>
                    <strong>{data.lodging.roomsAvailable}</strong>
                  </li>
                </ul>
              </div>
              <div className={styles.cardFoot}>
                <span>{data.lodging.propertyLabel}</span>
                <span>
                  <strong>{data.lodging.guestsLodging}</strong> of {data.lodging.invited} lodging
                </span>
              </div>
            </>
          )}
        </section>

        {/* RSVP Progress by Event (mockup §11A) */}
        <section className={`${styles.card} ${styles.wideCard}`}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>RSVP Progress by Event</h2>
            <Link href="/admin/itinerary" className={styles.cardLink}>
              View all
            </Link>
          </div>
          {data.eventProgress.length === 0 ? (
            <p className={styles.cardEmpty}>
              No events yet. Add the Welcome Dinner, Ceremony, and Farewell Brunch in Itinerary to
              track per-event attendance here.
            </p>
          ) : (
            <table className={styles.eventTable}>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Attending</th>
                  <th>Awaiting</th>
                  <th>Declined</th>
                  <th>Response rate</th>
                </tr>
              </thead>
              <tbody>
                {data.eventProgress.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <div className={styles.eventName}>{e.title}</div>
                      {e.when && <div className={styles.eventWhen}>{e.when}</div>}
                    </td>
                    <td className={styles.numGood}>{e.attending}</td>
                    <td className={styles.numWarn}>{e.awaiting}</td>
                    <td className={styles.numBad}>{e.declined}</td>
                    <td>
                      <div className={styles.rateRow}>
                        <span className={styles.rateTrack}>
                          <span
                            className={styles.rateFill}
                            style={{ width: `${e.rate}%` }}
                          />
                        </span>
                        <span className={styles.ratePct}>{e.rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
