import type { Metadata } from "next";
import styles from "./pay-mockup.module.css";

/*
 * MOCKUP ONLY — NOT WIRED TO PAYMENTS. Visual concept for guest accommodation
 * payments in the "Dolce" style. Shows two states (balance due / paid). The
 * "Pay" button is a static placeholder — no Stripe, no card form. Noindex.
 */

export const metadata: Metadata = {
  title: "Pay Mockup · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

function Lock() {
  return (
    <svg viewBox="0 0 24 24" className={styles.lock} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function PayMockupPage() {
  return (
    <div className={styles.frame}>
      <div className={styles.wrap}>
        <p className={styles.mockNote}>Mockup — the “Pay” button is not live</p>

        {/* ---------- STATE 1: balance due ---------- */}
        <p className={styles.stateLabel}>① What your guest sees</p>
        <section className={styles.screen}>
          <p className={styles.eyebrow}>Your Accommodations</p>
          <h1 className={styles.title}>Your Stay</h1>
          <p className={styles.intro}>
            Our villa collects room payments through us, so we&rsquo;ve set aside your balance here.
          </p>

          <div className={styles.card}>
            <p className={styles.party}>The Rivera Family</p>
            <dl className={styles.details}>
              <div className={styles.detailRow}>
                <dt>Room</dt>
                <dd>Villa Toscana · Garden Room</dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Nights</dt>
                <dd>5 nights · Jun 16 – 21, 2027</dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Guests</dt>
                <dd>Ana &amp; Marco Rivera</dd>
              </div>
            </dl>

            <div className={styles.balanceBlock}>
              <span className={styles.balanceLabel}>Balance due</span>
              <span className={styles.balanceAmount}>$1,250.00</span>
            </div>

            <button type="button" className={styles.payBtn}>
              Pay with Card
            </button>
            <p className={styles.secure}>
              <Lock /> Secure checkout via Stripe · Visa · Mastercard · Amex · Apple&nbsp;Pay
            </p>
          </div>

          <p className={styles.note}>
            Questions about your room? <span className={styles.link}>Get in touch</span> — we&rsquo;re happy to help.
          </p>
        </section>

        {/* ---------- STATE 2: paid ---------- */}
        <p className={styles.stateLabel}>② After they pay</p>
        <section className={styles.screen}>
          <p className={styles.eyebrow}>Your Accommodations</p>
          <h1 className={styles.title}>Your Stay</h1>

          <div className={`${styles.card} ${styles.cardPaid}`}>
            <span className={styles.paidPill}>
              <svg viewBox="0 0 24 24" className={styles.check} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Paid
            </span>
            <p className={styles.party}>The Rivera Family</p>
            <dl className={styles.details}>
              <div className={styles.detailRow}>
                <dt>Room</dt>
                <dd>Villa Toscana · Garden Room</dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Paid on</dt>
                <dd>June 2, 2027</dd>
              </div>
            </dl>

            <div className={styles.balanceBlock}>
              <span className={styles.balanceLabel}>Amount paid</span>
              <span className={styles.balanceAmount}>$1,250.00</span>
            </div>

            <p className={styles.thanks}>Grazie! A receipt was emailed to you.</p>
            <button type="button" className={styles.receiptBtn}>
              View receipt
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
