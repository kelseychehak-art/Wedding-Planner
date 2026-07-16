import Link from "next/link";
import { getAdminToken } from "@/lib/admin-session";
import { supabase } from "@/lib/supabase";
import styles from "./vendors.module.css";

const STAGES = [
  "Researching",
  "Contacted",
  "Waiting",
  "In conversation",
  "Proposal received",
  "Top contender",
  "Booked",
  "Declined",
];

type Vendor = {
  id: string;
  name: string;
  category: string;
  location: string | null;
  stage: string;
  estimated_cost: number | null;
  currency: string | null;
};

async function getVendors(): Promise<Vendor[]> {
  const token = await getAdminToken();
  if (!token) return [];
  const { data } = await supabase.rpc("admin_list_vendors", { p_token: token });
  return (data ?? []) as Vendor[];
}

export default async function AdminVendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>;
}) {
  const { stage: activeStage } = await searchParams;
  const vendors = await getVendors();
  const filtered = activeStage ? vendors.filter((v) => v.stage === activeStage) : vendors;

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.heading}>Vendors</h1>
          <p className={styles.subheading}>{vendors.length} in the pipeline</p>
        </div>
        <Link href="/admin/vendors/new" className="btn-primary">
          Add Vendor
        </Link>
      </div>

      <div className={styles.stageFilters}>
        <Link
          href="/admin/vendors"
          className={`${styles.stageFilter} ${!activeStage ? styles.stageFilterActive : ""}`}
        >
          All ({vendors.length})
        </Link>
        {STAGES.map((stage) => {
          const count = vendors.filter((v) => v.stage === stage).length;
          return (
            <Link
              key={stage}
              href={`/admin/vendors?stage=${encodeURIComponent(stage)}`}
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
          {vendors.length === 0
            ? "No vendors yet. Add the first one to start tracking."
            : "No vendors at this stage."}
        </p>
      ) : (
        <div className={styles.list}>
          {filtered.map((vendor) => (
            <Link href={`/admin/vendors/${vendor.id}`} className={styles.row} key={vendor.id}>
              <div className={styles.rowMeta}>
                <div className={styles.rowName}>{vendor.name}</div>
                <div className={styles.rowCategory}>
                  {vendor.category}
                  {vendor.location ? ` · ${vendor.location}` : ""}
                </div>
              </div>
              {vendor.estimated_cost != null && (
                <span className={styles.rowPrice}>
                  {vendor.currency ?? "EUR"} {vendor.estimated_cost.toLocaleString()}
                </span>
              )}
              <span className={styles.rowStage}>{vendor.stage}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
