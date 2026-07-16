import Link from "next/link";
import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import VenueCompare, { type ComparableVenue } from "./VenueCompare";
import styles from "../venues.module.css";

async function getVenues(): Promise<ComparableVenue[]> {
  const token = await getAdminToken();
  if (!token) return [];
  const { data } = await supabase.rpc("admin_list_venues", { p_token: token });
  return (data ?? []) as ComparableVenue[];
}

export default async function VenueComparePage() {
  const venues = await getVenues();

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.heading}>Compare Venues</h1>
          <p className={styles.subheading}>
            Side by side, so you and Andrew can decide together.
          </p>
        </div>
        <Link href="/admin/venues" className="btn-outline">
          &larr; Back to List
        </Link>
      </div>

      {venues.length === 0 ? (
        <p className={styles.empty}>
          No venues yet.{" "}
          <Link href="/admin/venues/new">Add one</Link> to start comparing.
        </p>
      ) : (
        <VenueCompare venues={venues} />
      )}
    </div>
  );
}
