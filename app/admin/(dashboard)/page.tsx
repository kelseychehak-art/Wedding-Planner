import Link from "next/link";
import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import styles from "./dashboard.module.css";

type BudgetItem = {
  name: string;
  estimated_amount: number | null;
  amount_paid: number;
  due_date: string | null;
  status: string;
};
type PipelineItem = { id: string; name: string; stage: string; next_action: string | null; next_action_date: string | null };
type Guest = { rsvp_status: string };
type Party = { id: string; name: string; email: string | null; guests?: Guest[] };

type Attention = { label: string; detail: string; href: string; tone: "bad" | "warn" | "info"; sortKey: number };

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + "T00:00:00");
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

async function getDashboard() {
  const token = await getAdminToken();
  if (!token) return null;

  const [{ data: budget }, { data: venues }, { data: vendors }, { data: parties }] =
    await Promise.all([
      supabase.rpc("admin_get_budget", { p_token: token }),
      supabase.rpc("admin_list_venues", { p_token: token }),
      supabase.rpc("admin_list_vendors", { p_token: token }),
      supabase.rpc("admin_list_guests", { p_token: token }),
    ]);

  const budgetItems = (budget?.items ?? []) as BudgetItem[];
  const currency = (budget?.currency ?? "USD") as string;
  const total = Number(budget?.total ?? 0);
  const venueList = (venues ?? []) as PipelineItem[];
  const vendorList = (vendors ?? []) as PipelineItem[];
  const partyList = (parties ?? []) as Party[];

  const money = (n: number) => {
    try {
      return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
    } catch {
      return `${currency} ${Math.round(n).toLocaleString()}`;
    }
  };

  const allocated = budgetItems.reduce((s, i) => s + (i.estimated_amount ?? 0), 0);
  const allGuests = partyList.flatMap((p) => p.guests ?? []);
  const confirmed = allGuests.filter((g) => g.rsvp_status === "Confirmed").length;

  // Build the "needs attention" list
  const attention: Attention[] = [];

  if (allocated > total && total > 0) {
    attention.push({
      label: "Over budget",
      detail: `Allocated ${money(allocated)} against a ${money(total)} budget.`,
      href: "/admin/budget",
      tone: "bad",
      sortKey: -1000,
    });
  }

  for (const item of budgetItems) {
    if (!item.due_date || item.status === "Paid") continue;
    const d = daysUntil(item.due_date);
    if (d <= 45) {
      const outstanding = (item.estimated_amount ?? 0) - (item.amount_paid ?? 0);
      attention.push({
        label: d < 0 ? `Payment overdue: ${item.name}` : `Payment due: ${item.name}`,
        detail:
          (d < 0 ? `Was due ${Math.abs(d)}d ago` : d === 0 ? "Due today" : `Due in ${d}d`) +
          (outstanding > 0 ? ` · ${money(outstanding)} outstanding` : ""),
        href: "/admin/budget",
        tone: d < 7 ? "bad" : "warn",
        sortKey: d,
      });
    }
  }

  for (const v of [...venueList, ...vendorList]) {
    if (!v.next_action) continue;
    const isVenue = venueList.includes(v);
    const base = isVenue ? "/admin/venues/" : "/admin/vendors/";
    const d = v.next_action_date ? daysUntil(v.next_action_date) : null;
    if (d === null || d <= 30) {
      attention.push({
        label: `${v.name}: ${v.next_action}`,
        detail: d === null ? v.stage : d < 0 ? `${Math.abs(d)}d overdue` : d === 0 ? "Today" : `In ${d}d`,
        href: base + v.id,
        tone: d !== null && d < 3 ? "warn" : "info",
        sortKey: d ?? 100,
      });
    }
  }

  attention.sort((a, b) => a.sortKey - b.sortKey);

  return {
    venueCount: venueList.length,
    vendorCount: vendorList.length,
    partyCount: partyList.length,
    guestCount: allGuests.length,
    confirmed,
    allocated: money(allocated),
    budgetTotal: money(total),
    attention: attention.slice(0, 10),
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboard();
  if (!data) return null;

  return (
    <div>
      <h1 className={styles.heading}>Dashboard</h1>
      <p className={styles.subheading}>What needs attention today.</p>

      <div className={styles.grid}>
        <Link href="/admin/guests" className={styles.card}>
          <p className={styles.cardLabel}>Guests</p>
          <p className={styles.cardValue}>{data.guestCount}</p>
          <p className={styles.cardMeta}>
            {data.confirmed} confirmed · {data.partyCount} parties
          </p>
        </Link>
        <Link href="/admin/venues" className={styles.card}>
          <p className={styles.cardLabel}>Venues</p>
          <p className={styles.cardValue}>{data.venueCount}</p>
          <p className={styles.cardMeta}>in the pipeline</p>
        </Link>
        <Link href="/admin/vendors" className={styles.card}>
          <p className={styles.cardLabel}>Vendors</p>
          <p className={styles.cardValue}>{data.vendorCount}</p>
          <p className={styles.cardMeta}>in the pipeline</p>
        </Link>
        <Link href="/admin/budget" className={styles.card}>
          <p className={styles.cardLabel}>Budget Allocated</p>
          <p className={styles.cardValue}>{data.allocated}</p>
          <p className={styles.cardMeta}>of {data.budgetTotal}</p>
        </Link>
      </div>

      <section className={styles.attentionSection}>
        <p className={styles.attentionTitle}>Needs Attention</p>
        {data.attention.length === 0 ? (
          <p className={styles.attentionEmpty}>
            Nothing pressing right now. Add due dates and next actions to see reminders here.
          </p>
        ) : (
          <div className={styles.attentionList}>
            {data.attention.map((a, i) => (
              <Link href={a.href} className={styles.attentionRow} key={i}>
                <span className={`${styles.dot} ${styles[`dot_${a.tone}`]}`} />
                <span className={styles.attentionLabel}>{a.label}</span>
                <span className={styles.attentionDetail}>{a.detail}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
