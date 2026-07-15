import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import styles from "./dashboard.module.css";

async function getDashboardSummary() {
  const token = await getAdminToken();
  if (!token) {
    return { venueTotal: 0, byStage: {} as Record<string, number>, partyCount: 0, partiesWithEmail: 0 };
  }

  const [{ data: venueData }, { data: allData }] = await Promise.all([
    supabase.rpc("admin_list_venues", { p_token: token }),
    supabase.rpc("admin_get_all_data", { p_token: token }),
  ]);

  const venues = (venueData ?? []) as { stage: string }[];
  const byStage: Record<string, number> = {};
  for (const v of venues) {
    byStage[v.stage] = (byStage[v.stage] ?? 0) + 1;
  }

  const parties = (allData?.parties ?? []) as { email: string | null }[];
  const partiesWithEmail = parties.filter((p) => p.email).length;

  return { venueTotal: venues.length, byStage, partyCount: parties.length, partiesWithEmail };
}

export default async function AdminDashboardPage() {
  const { venueTotal, byStage, partyCount, partiesWithEmail } = await getDashboardSummary();

  return (
    <div>
      <h1 className={styles.heading}>Dashboard</h1>
      <p className={styles.subheading}>What needs attention today.</p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Venue Pipeline</p>
          <p className={styles.cardValue}>{venueTotal}</p>
          <p className={styles.cardMeta}>
            {venueTotal === 0
              ? "No venues added yet."
              : Object.entries(byStage)
                  .map(([stage, count]) => `${count} ${stage}`)
                  .join(" · ")}
          </p>
        </div>

        <div className={styles.card}>
          <p className={styles.cardLabel}>Guest Parties</p>
          <p className={styles.cardValue}>{partyCount}</p>
          <p className={styles.cardMeta}>
            {`${partiesWithEmail} of ${partyCount} have an email on file — RSVP lookup can’t resolve for the rest until they do.`}
          </p>
        </div>
      </div>
    </div>
  );
}
