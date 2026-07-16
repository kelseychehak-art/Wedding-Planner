import Link from "next/link";
import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import styles from "./venues.module.css";

const STAGES = [
  "Researching",
  "Contacted",
  "Waiting",
  "In conversation",
  "Proposal received",
  "Top contender",
  "Site visit",
  "Selected",
  "Eliminated",
];

type Venue = {
  id: string;
  name: string;
  location: string | null;
  region: string | null;
  stage: string;
  estimated_total_price: number | null;
  currency: string | null;
};

async function getVenues(): Promise<Venue[]> {
  const token = await getAdminToken();
  if (!token) return [];
  const { data } = await supabase.rpc("admin_list_venues", { p_token: token });
  return (data ?? []) as Venue[];
}

export default async function AdminVenuesPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>;
}) {
  const { stage: activeStage } = await searchParams;
  const venues = await getVenues();
  const filtered = activeStage ? venues.filter((v) => v.stage === activeStage) : venues;

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.heading}>Venues</h1>
          <p className={styles.subheading}>{venues.length} in the pipeline</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/admin/venues/compare" className="btn-outline">
            Compare
          </Link>
          <Link href="/admin/venues/new" className="btn-primary">
            Add Venue
          </Link>
        </div>
      </div>

      <div className={styles.stageFilters}>
        <Link
          href="/admin/venues"
          className={`${styles.stageFilter} ${!activeStage ? styles.stageFilterActive : ""}`}
        >
          All ({venues.length})
        </Link>
        {STAGES.map((stage) => {
          const count = venues.filter((v) => v.stage === stage).length;
          return (
            <Link
              key={stage}
              href={`/admin/venues?stage=${encodeURIComponent(stage)}`}
              className={`${styles.stageFilter} ${
                activeStage === stage ? styles.stageFilterActive : ""
              }`}
            >
              {stage} ({count})
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className={styles.empty}>
          {venues.length === 0
            ? "No venues yet. Add the first one to start tracking your search."
            : "No venues at this stage."}
        </p>
      ) : (
        <div className={styles.list}>
          {filtered.map((venue) => (
            <Link href={`/admin/venues/${venue.id}`} className={styles.row} key={venue.id}>
              <div className={styles.rowMeta}>
                <div className={styles.rowName}>{venue.name}</div>
                {(venue.location || venue.region) && (
                  <div className={styles.rowLocation}>
                    {[venue.location, venue.region].filter(Boolean).join(", ")}
                  </div>
                )}
              </div>
              {venue.estimated_total_price && (
                <span className={styles.rowPrice}>
                  {venue.currency ?? "EUR"} {venue.estimated_total_price.toLocaleString()}
                </span>
              )}
              <span className={styles.rowStage}>{venue.stage}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
