"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ConfirmDialog.module.css";

/*
 * Replacement for window.confirm(). The browser dialog is unstyled OS chrome
 * in the middle of a carefully typeset product, it can't say which record it's
 * about in anything but plain text, and it can't mark a destructive action as
 * destructive.
 *
 * Deliberately promise-based so call sites read almost the same as before:
 *
 *   if (!(await confirm({ title: "Delete X?" }))) return;
 *
 * Render `dialog` anywhere in the component; it portals nothing and only
 * appears while a confirmation is pending.
 */

export type ConfirmOptions = {
  title: string;
  /** Optional supporting sentence — say what is lost, not just "are you sure". */
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Red confirm button for anything that destroys data. Defaults to true. */
  destructive?: boolean;
};

export function useConfirm() {
  const [pending, setPending] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((ok: boolean) => void) | null>(null);
  const confirmBtn = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    setPending(options);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const settle = useCallback((ok: boolean) => {
    resolver.current?.(ok);
    resolver.current = null;
    setPending(null);
  }, []);

  useEffect(() => {
    if (!pending) return;
    const opener = document.activeElement as HTMLElement | null;
    confirmBtn.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        settle(false);
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>("button");
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [pending, settle]);

  const dialog = pending ? (
    <>
      <div className={styles.scrim} onClick={() => settle(false)} aria-hidden="true" />
      <div
        ref={panelRef}
        className={styles.panel}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby={pending.body ? "confirm-body" : undefined}
      >
        <h2 id="confirm-title" className={styles.title}>
          {pending.title}
        </h2>
        {pending.body && (
          <p id="confirm-body" className={styles.body}>
            {pending.body}
          </p>
        )}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancel}
            onClick={() => settle(false)}
          >
            {pending.cancelLabel ?? "Cancel"}
          </button>
          <button
            ref={confirmBtn}
            type="button"
            className={
              pending.destructive === false ? styles.confirm : styles.confirmDestructive
            }
            onClick={() => settle(true)}
          >
            {pending.confirmLabel ?? "Delete"}
          </button>
        </div>
      </div>
    </>
  ) : null;

  return { confirm, dialog };
}
