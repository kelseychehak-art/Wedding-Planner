"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./venues.module.css";

export type VenueRow = {
  id: string;
  name: string;
  location: string | null;
  region: string | null;
  stage: string;
  estimated_total_price: number | null;
  currency: string | null;
  research_verdict: string | null;
  budget_fit: string | null;
  exclusivity_status: string | null;
  next_action: string | null;
  is_shortlist: boolean;
};

type SortKey = "shortlist" | "verdict" | "price" | "name";

const VERDICT_RANK: Record<string, number> = {
  "Strong Contender": 0,
  "Need More Info": 1,
  "Over Budget": 2,
  "Ruled Out": 3,
};

// Badge tone by value → drives the CSS class suffix (good/warn/bad/neutral).
function verdictTone(v: string | null): string {
  if (v === "Strong Contender") return "good";
  if (v === "Over Budget") return "warn";
  if (v === "Ruled Out") return "bad";
  return "neutral";
}
function budgetTone(v: string | null): string {
  if (v === "Fits") return "good";
  if (v === "Tight") return "warn";
  if (v === "Over") return "bad";
  return "neutral";
}

export default function VenueList({ venues }: { venues: VenueRow[] }) {
  const router = useRouter();
  const [sort, setSort] = useState<SortKey>("shortlist");
  const [busy, setBusy] = useState<string | null>(null);

  const sorted = [...venues].sort((a, b) => {
    if (sort === "price") {
      return (b.estimated_total_price ?? -1) - (a.estimated_total_price ?? -1);
    }
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "verdict") {
      return (VERDICT_RANK[a.research_verdict ?? ""] ?? 9) - (VERDICT_RANK[b.research_verdict ?? ""] ?? 9);
    }
    // shortlist first, then verdict rank
    if (a.is_shortlist !== b.is_shortlist) return a.is_shortlist ? -1 : 1;
    return (VERDICT_RANK[a.research_verdict ?? ""] ?? 9) - (VERDICT_RANK[b.research_verdict ?? ""] ?? 9);
  });

  async function toggleStar(e: React.MouseEvent, venue: VenueRow) {
    e.preventDefault();
    e.stopPropagation();
    setBusy(venue.id);
    try {
      await fetch(`/api/admin/venues/${venue.id}/shortlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: !venue.is_shortlist }),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <div className={styles.sortRow}>
        <label className={styles.sortLabel} htmlFor="venue-sort">
          Sort
        </label>
        <select
          id="venue-sort"
          className={styles.sortSelect}
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          <option value="shortlist">Shortlist &amp; verdict</option>
          <option value="verdict">Verdict</option>
          <option value="price">Price (high → low)</option>
          <option value="name">Name (A → Z)</option>
        </select>
      </div>

      <div className={styles.list}>
        {sorted.map((venue) => (
          <Link href={`/admin/venues/${venue.id}`} className={styles.row} key={venue.id}>
            <button
              type="button"
              className={`${styles.star} ${venue.is_shortlist ? styles.starOn : ""}`}
              onClick={(e) => toggleStar(e, venue)}
              disabled={busy === venue.id}
              aria-label={venue.is_shortlist ? "Remove from shortlist" : "Add to shortlist"}
              title={venue.is_shortlist ? "On shortlist" : "Add to shortlist"}
            >
              {venue.is_shortlist ? "★" : "☆"}
            </button>

            <div className={styles.rowMeta}>
              <div className={styles.rowName}>{venue.name}</div>
              {(venue.location || venue.region) && (
                <div className={styles.rowLocation}>
                  {[venue.location, venue.region].filter(Boolean).join(", ")}
                </div>
              )}
              {venue.next_action && (
                <div className={styles.rowAction}>→ {venue.next_action}</div>
              )}
            </div>

            <div className={styles.badges}>
              {venue.research_verdict && (
                <span className={`${styles.badge} ${styles[`badge_${verdictTone(venue.research_verdict)}`]}`}>
                  {venue.research_verdict}
                </span>
              )}
              {venue.budget_fit && (
                <span className={`${styles.badge} ${styles[`badge_${budgetTone(venue.budget_fit)}`]}`}>
                  Budget: {venue.budget_fit}
                </span>
              )}
              {venue.exclusivity_status && venue.exclusivity_status !== "N/A" && (
                <span className={`${styles.badge} ${styles.badge_neutral}`}>
                  Exclusive: {venue.exclusivity_status}
                </span>
              )}
            </div>

            {venue.estimated_total_price != null && (
              <span className={styles.rowPrice}>
                {venue.currency ?? "EUR"} {venue.estimated_total_price.toLocaleString()}
              </span>
            )}
            <span className={styles.rowStage}>{venue.stage}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
