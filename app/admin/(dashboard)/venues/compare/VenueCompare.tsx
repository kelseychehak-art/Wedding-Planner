"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./compare.module.css";

export type ComparableVenue = {
  id: string;
  name: string;
  location: string | null;
  region: string | null;
  country: string | null;
  stage: string;
  research_verdict: string | null;
  budget_fit: string | null;
  exclusivity_status: string | null;
  research_notes: string | null;
  availability: string | null;
  capacity: number | null;
  sleeping_capacity: number | null;
  minimum_nights: number | null;
  has_pool: boolean | null;
  has_outdoor_space: boolean | null;
  estimated_total_price: number | null;
  currency: string | null;
  accommodation_cost_note: string | null;
  wedding_day_cost_note: string | null;
  airport_distance: string | null;
  curfew: string | null;
  noise_restrictions: string | null;
  catering_model: string | null;
  why_we_love_it: string | null;
  why_we_hesitate: string | null;
  questions_remaining: string | null;
  decision: string | null;
};

function yesNo(value: boolean | null) {
  return value ? "Yes" : "—";
}

function priceLabel(v: ComparableVenue) {
  if (!v.estimated_total_price) return "—";
  return `${v.currency ?? "EUR"} ${v.estimated_total_price.toLocaleString()}`;
}

function verdictTone(v: string | null) {
  if (v === "Strong Contender") return styles.badgeGood;
  if (v === "Over Budget") return styles.badgeBad;
  if (v === "Need More Info" || v === "Ask") return styles.badgeWarn;
  return styles.badgeNeutral; // Ruled Out, null
}

function budgetTone(v: string | null) {
  if (v === "Fits") return styles.badgeGood;
  if (v === "Over") return styles.badgeBad;
  if (v === "Tight") return styles.badgeWarn;
  return styles.badgeNeutral; // Unknown, null
}

const ROWS: {
  label: string;
  render: (v: ComparableVenue) => string;
}[] = [
  { label: "Verdict", render: (v) => v.research_verdict || "—" },
  { label: "Budget Fit", render: (v) => v.budget_fit || "—" },
  { label: "Exclusivity", render: (v) => v.exclusivity_status || "—" },
  { label: "Research Notes", render: (v) => v.research_notes || "—" },
  { label: "Stage", render: (v) => v.stage },
  {
    label: "Location",
    render: (v) => [v.location, v.region, v.country].filter(Boolean).join(", ") || "—",
  },
  { label: "Availability", render: (v) => v.availability || "—" },
  { label: "Guest Capacity", render: (v) => (v.capacity ? String(v.capacity) : "—") },
  {
    label: "Sleeping Capacity",
    render: (v) => (v.sleeping_capacity ? String(v.sleeping_capacity) : "—"),
  },
  {
    label: "Minimum Nights",
    render: (v) => (v.minimum_nights ? String(v.minimum_nights) : "—"),
  },
  { label: "Pool", render: (v) => yesNo(v.has_pool) },
  { label: "Outdoor Space", render: (v) => yesNo(v.has_outdoor_space) },
  { label: "Estimated Price", render: (v) => priceLabel(v) },
  {
    label: "Accommodation Cost (guest-payable)",
    render: (v) => v.accommodation_cost_note || "—",
  },
  {
    label: "Wedding-Day Cost (counts against budget)",
    render: (v) => v.wedding_day_cost_note || "—",
  },
  { label: "Airport Distance", render: (v) => v.airport_distance || "—" },
  { label: "Curfew", render: (v) => v.curfew || "—" },
  { label: "Noise Restrictions", render: (v) => v.noise_restrictions || "—" },
  { label: "Catering Model", render: (v) => v.catering_model || "—" },
  { label: "Why We Love It", render: (v) => v.why_we_love_it || "—" },
  { label: "Why We Hesitate", render: (v) => v.why_we_hesitate || "—" },
  { label: "Questions Remaining", render: (v) => v.questions_remaining || "—" },
  { label: "Decision", render: (v) => v.decision || "—" },
];

export default function VenueCompare({ venues }: { venues: ComparableVenue[] }) {
  const [view, setView] = useState<"table" | "cards">("cards");
  const [includeEliminated, setIncludeEliminated] = useState(false);

  const filtered = useMemo(
    () =>
      includeEliminated ? venues : venues.filter((v) => v.stage !== "Eliminated"),
    [venues, includeEliminated]
  );

  return (
    <div>
      <div className={styles.controls}>
        <div className={styles.viewToggle}>
          <button
            type="button"
            className={view === "cards" ? styles.toggleActive : styles.toggle}
            onClick={() => setView("cards")}
          >
            Tile View
          </button>
          <button
            type="button"
            className={view === "table" ? styles.toggleActive : styles.toggle}
            onClick={() => setView("table")}
          >
            Table View
          </button>
        </div>
        <label className={styles.includeEliminated}>
          <input
            type="checkbox"
            checked={includeEliminated}
            onChange={(e) => setIncludeEliminated(e.target.checked)}
          />
          Include eliminated
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className={styles.empty}>Nothing to compare at this filter.</p>
      ) : view === "cards" ? (
        <div className={styles.cardGrid}>
          {filtered.map((v) => (
            <div className={styles.card} key={v.id}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardName}>{v.name}</h3>
                <span className={styles.cardStage}>{v.stage}</span>
              </div>
              {(v.research_verdict || v.budget_fit) && (
                <div className={styles.badgeRow}>
                  {v.research_verdict && (
                    <span className={`${styles.badge} ${verdictTone(v.research_verdict)}`}>
                      {v.research_verdict}
                    </span>
                  )}
                  {v.budget_fit && (
                    <span className={`${styles.badge} ${budgetTone(v.budget_fit)}`}>
                      Budget: {v.budget_fit}
                    </span>
                  )}
                </div>
              )}
              {(v.location || v.region) && (
                <p className={styles.cardLocation}>
                  {[v.location, v.region].filter(Boolean).join(", ")}
                </p>
              )}
              {v.research_notes && (
                <p className={`${styles.cardNote} ${styles.researchNote}`}>{v.research_notes}</p>
              )}
              <div className={styles.cardStats}>
                <div>
                  <span className={styles.statLabel}>Guests</span>
                  <span className={styles.statValue}>{v.capacity ?? "—"}</span>
                </div>
                <div>
                  <span className={styles.statLabel}>Sleeps</span>
                  <span className={styles.statValue}>{v.sleeping_capacity ?? "—"}</span>
                </div>
                {v.minimum_nights != null && (
                  <div>
                    <span className={styles.statLabel}>Min Nights</span>
                    <span className={styles.statValue}>{v.minimum_nights}</span>
                  </div>
                )}
              </div>
              <div className={styles.cardFlags}>
                {v.has_pool && <span className={styles.flag}>Pool</span>}
                {v.has_outdoor_space && <span className={styles.flag}>Outdoor Space</span>}
                {v.exclusivity_status && (
                  <span className={styles.flag}>Exclusivity: {v.exclusivity_status}</span>
                )}
              </div>
              {v.wedding_day_cost_note ? (
                <p className={styles.cardNote}>
                  <strong>Counts against budget:</strong> {v.wedding_day_cost_note}
                </p>
              ) : (
                v.estimated_total_price && (
                  <p className={styles.cardNote}>
                    <strong>Estimated price:</strong> {priceLabel(v)}
                  </p>
                )
              )}
              {v.accommodation_cost_note && (
                <p className={styles.cardNote}>
                  <strong>Guest-payable lodging:</strong> {v.accommodation_cost_note}
                </p>
              )}
              <Link href={`/admin/venues/${v.id}`} className={styles.cardLink}>
                View full details &rarr;
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.rowLabelHeader}></th>
                {filtered.map((v) => (
                  <th key={v.id} className={styles.venueHeader}>
                    <Link href={`/admin/venues/${v.id}`}>{v.name}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <th className={styles.rowLabel}>{row.label}</th>
                  {filtered.map((v) => (
                    <td key={v.id} className={styles.cell}>
                      {row.render(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
