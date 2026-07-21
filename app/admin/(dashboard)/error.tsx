"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./error.module.css";

/*
 * Error boundary for the admin pages. Without one, a failed Supabase call
 * showed Next's raw error screen.
 *
 * This is a private back-office used by two people, so it shows the actual
 * error text rather than hiding it — being able to read "connection timeout"
 * is the difference between retrying and thinking the data is gone. Nothing
 * here is guest-facing.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin page error:", error);
  }, [error]);

  return (
    <div className={styles.wrap} role="alert">
      <p className={styles.eyebrow}>Something went wrong</p>
      <h1 className={styles.heading}>This page didn&rsquo;t load</h1>
      <p className={styles.body}>
        Your data is safe — this is a display problem, not a lost record. Try again; if it keeps
        happening the database connection is the likeliest cause.
      </p>

      <div className={styles.actions}>
        <button type="button" className="btn-primary" onClick={reset}>
          Try again
        </button>
        <Link href="/admin" className="btn-outline">
          Back to dashboard
        </Link>
      </div>

      <details className={styles.details}>
        <summary className={styles.summary}>Technical details</summary>
        <pre className={styles.pre}>{error.message || "No error message was provided."}</pre>
        {error.digest && <p className={styles.digest}>Digest: {error.digest}</p>}
      </details>
    </div>
  );
}
