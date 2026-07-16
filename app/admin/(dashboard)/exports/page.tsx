import styles from "./exports.module.css";

const EXPORTS = [
  {
    type: "guests",
    label: "Guests & RSVPs",
    detail: "Every party and guest with side, contact, RSVP status, meal, dietary, allergies, and accessibility.",
  },
  {
    type: "travel",
    label: "Travel & Shuttle Manifest",
    detail: "Arrival and departure dates, flights, room assignments, and who needs a shuttle.",
  },
  {
    type: "missing-info",
    label: "Missing-Info Report",
    detail: "Parties with gaps — no email/phone, awaiting RSVPs, confirmed guests without a meal choice, missing travel.",
  },
  {
    type: "venues",
    label: "Venue Comparison",
    detail: "All venues with verdict, budget fit, exclusivity, capacity, cost split, and notes.",
  },
  {
    type: "vendors",
    label: "Vendor Contacts",
    detail: "Vendors with category, stage, contact details, cost, deposit, and payment terms.",
  },
  {
    type: "budget",
    label: "Budget & Payment Schedule",
    detail: "Every line item with estimated, paid, outstanding, due date, and status.",
  },
];

export default function ExportsPage() {
  return (
    <div>
      <h1 className={styles.heading}>Exports</h1>
      <p className={styles.subheading}>
        Download any of these as a CSV — opens straight into Excel or Google Sheets.
      </p>

      <div className={styles.list}>
        {EXPORTS.map((e) => (
          <a key={e.type} href={`/api/admin/exports/${e.type}`} className={styles.row} download>
            <div className={styles.rowMain}>
              <span className={styles.rowLabel}>{e.label}</span>
              <span className={styles.rowDetail}>{e.detail}</span>
            </div>
            <span className={styles.download}>Download CSV</span>
          </a>
        ))}
      </div>
    </div>
  );
}
