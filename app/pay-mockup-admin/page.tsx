import type { Metadata } from "next";
import styles from "./pay-mockup-admin.module.css";

/*
 * MOCKUP ONLY — NOT WIRED TO PAYMENTS. Visual concept for the admin side of
 * guest accommodation payments: an amount-owed field per party + paid/unpaid
 * tracking. Static — no data, no Stripe. Noindex.
 */

export const metadata: Metadata = {
  title: "Pay Mockup (Admin) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

type Row = {
  party: string;
  room: string;
  amount: string;
  status: "paid" | "unpaid";
  paidOn?: string;
  editing?: boolean;
};

const ROWS: Row[] = [
  { party: "The Rivera Family", room: "Villa Toscana · Garden Room", amount: "1,250.00", status: "paid", paidOn: "Jun 2" },
  { party: "The Chen Party", room: "Villa Toscana · Olive Suite", amount: "1,600.00", status: "unpaid" },
  { party: "Sam & Alex Ford", room: "Cypress Room", amount: "980.00", status: "paid", paidOn: "May 28" },
  { party: "The Okonkwo Family", room: "Vineyard Suite", amount: "2,100.00", status: "unpaid", editing: true },
  { party: "Priya Nair", room: "Garden Room (shared)", amount: "625.00", status: "paid", paidOn: "Jun 1" },
];

export default function PayMockupAdminPage() {
  return (
    <div className={styles.frame}>
      <div className={styles.wrap}>
        <p className={styles.mockNote}>Mockup — static concept, not wired to real data or payments</p>

        <div className={styles.panel}>
          <div className={styles.head}>
            <div>
              <h1 className={styles.h1}>Accommodations · Payments</h1>
              <p className={styles.sub}>Set each party&rsquo;s balance and track who&rsquo;s paid.</p>
            </div>
            <button type="button" className={styles.exportBtn}>Export CSV</button>
          </div>

          {/* summary */}
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Collected</span>
              <span className={styles.statValue}>$2,855</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Outstanding</span>
              <span className={`${styles.statValue} ${styles.statOutstanding}`}>$3,700</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Paid</span>
              <span className={styles.statValue}>3 <span className={styles.statMuted}>of 5</span></span>
            </div>
          </div>

          {/* table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Party</th>
                  <th>Room</th>
                  <th className={styles.right}>Amount owed</th>
                  <th className={styles.center}>Status</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.party} className={r.editing ? styles.rowEditing : undefined}>
                    <td className={styles.partyCell}>{r.party}</td>
                    <td className={styles.roomCell}>{r.room}</td>
                    <td className={styles.right}>
                      {r.editing ? (
                        <span className={styles.amountInput}>
                          <span className={styles.dollar}>$</span>
                          <span className={styles.amountVal}>{r.amount}</span>
                          <span className={styles.caret} aria-hidden="true" />
                        </span>
                      ) : (
                        <span className={styles.amountStatic}>${r.amount}</span>
                      )}
                    </td>
                    <td className={styles.center}>
                      {r.status === "paid" ? (
                        <span className={`${styles.pill} ${styles.pillPaid}`}>Paid · {r.paidOn}</span>
                      ) : (
                        <span className={`${styles.pill} ${styles.pillUnpaid}`}>Unpaid</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className={styles.hint}>
            Amounts you enter here are what each party sees on their “Your Stay” page. Payments made
            through Stripe flip the status to <strong>Paid</strong> automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
