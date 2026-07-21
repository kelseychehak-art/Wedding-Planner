import styles from "./Money.module.css";

/*
 * Dual-currency money display (docs/decisions.md D12).
 * USD is always the primary figure; the EUR equivalent sits beside it in a
 * smaller, lighter treatment. Amounts are stored in their native currency —
 * pass that as `currency` and the rate converts for display only.
 *
 * The rate is a manually maintained planning estimate from
 * Settings → Wedding Details (`settings.eur_usd_rate`), not a live FX feed.
 */

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  }
}

/** Convert a native-currency amount into both USD and EUR. */
export function toBoth(amount: number, currency: string, eurUsdRate: number) {
  const rate = eurUsdRate > 0 ? eurUsdRate : 1;
  const usd = currency === "EUR" ? amount * rate : amount;
  const eur = currency === "EUR" ? amount : amount / rate;
  return { usd, eur };
}

export default function Money({
  amount,
  currency = "USD",
  eurUsdRate,
  size = "md",
  className,
}: {
  amount: number | null | undefined;
  /** The currency the amount is stored in. Venue prices are EUR; budget is USD. */
  currency?: string;
  eurUsdRate: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  if (amount == null) return <span className={styles.empty}>—</span>;

  const { usd, eur } = toBoth(amount, currency, eurUsdRate);

  return (
    <span className={`${styles.money} ${styles[size]} ${className ?? ""}`}>
      <span className={styles.primary}>{formatMoney(usd, "USD")}</span>
      <span className={styles.secondary} title="Estimated at the rate set in Settings">
        {formatMoney(eur, "EUR")}
      </span>
    </span>
  );
}
