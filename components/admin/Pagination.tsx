"use client";

import styles from "./Pagination.module.css";
import { IconChevronLeft, IconChevronRight } from "./icons";

/*
 * Shared table pagination — "Showing 1 to 10 of 78 assignments", numbered
 * pages, rows-per-page. Matches the mockups' footer on every list page.
 *
 * Long page runs collapse to first / neighbours / last with ellipses, so 40
 * pages don't push the rows-per-page control off screen.
 */

function pageNumbers(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const out: (number | "gap")[] = [1];
  const from = Math.max(2, current - 1);
  const to = Math.min(total - 1, current + 1);

  if (from > 2) out.push("gap");
  for (let i = from; i <= to; i++) out.push(i);
  if (to < total - 1) out.push("gap");
  out.push(total);
  return out;
}

export default function Pagination({
  total,
  page,
  pageSize,
  onPage,
  onPageSize,
  noun = "rows",
  pageSizes = [10, 25, 50],
}: {
  total: number;
  page: number;
  pageSize: number;
  onPage: (p: number) => void;
  onPageSize: (n: number) => void;
  /** Plural noun for the count, e.g. "guests", "assignments". */
  noun?: string;
  pageSizes?: number[];
}) {
  if (total === 0) return null;

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  const first = (current - 1) * pageSize + 1;
  const last = Math.min(current * pageSize, total);

  return (
    <div className={styles.pagination}>
      <span className={styles.info}>
        {`Showing ${first} to ${last} of ${total} ${noun}`}
      </span>

      {pageCount > 1 && (
        <div className={styles.pages}>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={current <= 1}
            onClick={() => onPage(current - 1)}
            aria-label="Previous page"
          >
            <IconChevronLeft size={14} />
          </button>
          {pageNumbers(current, pageCount).map((n, i) =>
            n === "gap" ? (
              <span key={`gap-${i}`} className={styles.gap}>
                …
              </span>
            ) : (
              <button
                key={n}
                type="button"
                className={n === current ? styles.pageBtnActive : styles.pageBtn}
                aria-current={n === current ? "page" : undefined}
                onClick={() => onPage(n)}
              >
                {n}
              </button>
            )
          )}
          <button
            type="button"
            className={styles.pageBtn}
            disabled={current >= pageCount}
            onClick={() => onPage(current + 1)}
            aria-label="Next page"
          >
            <IconChevronRight size={14} />
          </button>
        </div>
      )}

      <label className={styles.sizeWrap}>
        <span>Rows per page</span>
        <select
          className={styles.sizeSelect}
          value={pageSize}
          onChange={(e) => {
            onPageSize(Number(e.target.value));
            onPage(1);
          }}
        >
          {pageSizes.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
