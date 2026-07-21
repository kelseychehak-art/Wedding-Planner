"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import styles from "./Toolbar.module.css";
import { IconSearch, IconSettings, IconChevronRight } from "./icons";

/*
 * Shared list-page chrome: search, filter dropdowns, a sort row and a column
 * picker. Guest List, Travel, Lodging and Activities all had the same table
 * with a different subset of these controls bolted on, so they live here once.
 *
 * Layout follows the mockups' toolbar: search left at 260–300px, filters
 * beside it, view toggle and Columns pushed right; the sort row sits under it.
 */

export function Toolbar({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className={styles.toolbar}>
      {children}
      {right && <div className={styles.toolbarRight}>{right}</div>}
    </div>
  );
}

export function ToolbarSearch({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <span className={styles.searchWrap}>
      <IconSearch size={14} className={styles.searchIcon} />
      <input
        className={styles.search}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </span>
  );
}

/** "RSVP: All" — the label stays visible so a set filter is obvious at a glance. */
export function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const active = value !== "" && value !== "All";
  return (
    <label className={`${styles.filter} ${active ? styles.filterActive : ""}`}>
      <span className={styles.filterLabel}>{label}:</span>
      <select
        className={styles.filterControl}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SortBar({
  value,
  options,
  onChange,
  children,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className={styles.sortBar}>
      <span className={styles.sortLabel}>Sort by</span>
      <select
        className={styles.sortControl}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort by"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {children}
    </div>
  );
}

export type ColumnDef = { key: string; label: string; locked?: boolean };

/*
 * Column visibility, remembered per page in localStorage. The tables run past
 * 1400px, so hiding what you aren't using is how the page stops scrolling
 * sideways. Locked columns (the name, the row actions) can't be turned off —
 * a table with no identifying column is unusable.
 */
const COLUMNS_EVENT = "admin:columns-changed";
const EMPTY = "[]";

function subscribe(cb: () => void) {
  window.addEventListener(COLUMNS_EVENT, cb);
  /* Keep two open tabs in step. */
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(COLUMNS_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useColumnVisibility(storageKey: string, columns: ColumnDef[]) {
  /*
   * useSyncExternalStore rather than an effect: localStorage is external state,
   * and the server has no access to it. getServerSnapshot returns "[]" so the
   * server and the first client paint agree — all columns visible — and the
   * stored value applies on the following tick without a hydration mismatch.
   * The snapshot stays the raw string so it's referentially stable between
   * reads; parsing happens in the memo below.
   */
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return window.localStorage.getItem(storageKey) ?? EMPTY;
      } catch {
        return EMPTY;
      }
    },
    () => EMPTY
  );

  const hidden = useMemo(() => {
    try {
      const parsed = JSON.parse(raw) as string[];
      if (!Array.isArray(parsed)) return [];
      /* Drop keys for columns that no longer exist, so a renamed or removed
         column can't stay invisible forever. */
      const known = new Set(columns.map((c) => c.key));
      const lockedOff = new Set(columns.filter((c) => c.locked).map((c) => c.key));
      return parsed.filter((k) => known.has(k) && !lockedOff.has(k));
    } catch {
      return [];
    }
  }, [raw, columns]);

  function write(next: string[]) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* Storage can be unavailable (private mode, quota) — the UI still works,
         it just won't remember the choice. */
    }
    window.dispatchEvent(new Event(COLUMNS_EVENT));
  }

  return {
    hidden,
    isVisible: (key: string) => !hidden.includes(key),
    toggle: (key: string) =>
      write(hidden.includes(key) ? hidden.filter((k) => k !== key) : [...hidden, key]),
    reset: () => write([]),
    hiddenCount: hidden.length,
  };
}

export function ColumnsButton({
  columns,
  hidden,
  onToggle,
  onReset,
}: {
  columns: ColumnDef[];
  hidden: string[];
  onToggle: (key: string) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={styles.columnsWrap} ref={wrapRef}>
      <button
        type="button"
        className={`${styles.columnsBtn} ${hidden.length > 0 ? styles.columnsBtnActive : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span>Columns</span>
        {hidden.length > 0 && <span className={styles.columnsCount}>{hidden.length} hidden</span>}
        <IconSettings size={13} />
      </button>
      {open && (
        <div className={styles.columnsMenu} role="group" aria-label="Toggle columns">
          {columns.map((c) => (
            <label
              key={c.key}
              className={`${styles.columnsItem} ${c.locked ? styles.columnsItemLocked : ""}`}
            >
              <input
                type="checkbox"
                checked={c.locked || !hidden.includes(c.key)}
                disabled={c.locked}
                onChange={() => onToggle(c.key)}
              />
              <span>{c.label}</span>
            </label>
          ))}
          <button type="button" className={styles.columnsReset} onClick={onReset}>
            Show all
            <IconChevronRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
