"use client";

import { useEffect, useRef } from "react";
import { IconX } from "@/components/admin/icons";
import styles from "./drawer.module.css";
import type { Guest, Party } from "./GuestsManager";

/*
 * Right-side detail drawer — guest-list.md §18.
 * Clicking a party or a guest opens this rather than navigating away, so the
 * table keeps its scroll position and filters.
 */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value || <span className={styles.dim}>—</span>}</span>
    </div>
  );
}

export default function DetailDrawer({
  party,
  guest,
  onClose,
  onEdit,
}: {
  party: Party;
  /** When set, show the single-guest view; otherwise the whole party. */
  guest?: Guest | null;
  onClose: () => void;
  onEdit: () => void;
}) {
  const drawerRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  /*
   * Escape closes; Tab is trapped inside. An aria-modal dialog that leaves
   * focus behind the scrim tells assistive tech the rest of the page is inert
   * while still letting you tab into it — worse than no dialog role at all.
   */
  useEffect(() => {
    /* Remember where focus came from, so closing returns it there rather than
       dumping the user back at the top of the document. */
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
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
  }, [onClose]);

  const t = party.travel;
  const attending = party.guests.filter((g) => g.rsvp_status === "Confirmed").length;
  const declined = party.guests.filter((g) => g.rsvp_status === "Declined").length;
  const awaiting = party.guests.length - attending - declined;

  return (
    <>
      <div className={styles.scrim} onClick={onClose} aria-hidden="true" />
      <aside
        ref={drawerRef}
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label={guest ? `${guest.first_name} details` : `${party.name} details`}
      >
        <header className={styles.head}>
          <div>
            <p className={styles.eyebrow}>{guest ? "Guest" : "Party"}</p>
            <h2 className={styles.title}>
              {guest ? guest.first_name || "Unnamed guest" : party.name}
            </h2>
            {guest && <p className={styles.subtitle}>{party.name}</p>}
          </div>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            <IconX size={18} />
          </button>
        </header>

        <div className={styles.body}>
          {guest ? (
            <>
              <Section title="Guest details">
                <Row label="Name" value={guest.first_name} />
                <Row label="Type" value={guest.is_child ? "Child" : "Adult"} />
                <Row label="RSVP" value={guest.rsvp_status} />
              </Section>

              <Section title="Food & accessibility">
                <Row label="Meal choice" value={guest.meal_choice} />
                <Row label="Dietary" value={guest.dietary_restrictions} />
                <Row label="Allergies" value={guest.allergies} />
                <Row label="Accessibility" value={guest.accessibility_needs} />
              </Section>

              <Section title="Event attendance">
                <p className={styles.note}>
                  Per-event RSVP arrives with the Itinerary build — right now RSVP is a single
                  answer for the whole week.
                </p>
              </Section>

              <Section title="Activity bookings">
                <p className={styles.note}>
                  Guests can&rsquo;t book activities yet; the guest-facing sign-up flow is still
                  to build.
                </p>
              </Section>
            </>
          ) : (
            <>
              <Section title="Party overview">
                <Row label="Party" value={party.name} />
                <Row label="Side" value={party.side} />
                <Row
                  label="Guests"
                  value={`${party.guests.length} (${party.guests.filter((g) => g.is_child).length} children)`}
                />
              </Section>

              <Section title="Contact">
                <Row label="Email" value={party.email} />
                <Row label="Phone" value={party.phone} />
                <Row label="Address" value={party.mailing_address} />
              </Section>

              <Section title="RSVP summary">
                <Row label="Attending" value={String(attending)} />
                <Row label="Declined" value={String(declined)} />
                <Row label="Awaiting" value={String(awaiting)} />
              </Section>

              <Section title="Guests">
                {party.guests.length === 0 ? (
                  <p className={styles.note}>No guests named yet.</p>
                ) : (
                  <ul className={styles.guestList}>
                    {party.guests.map((g) => (
                      <li key={g.id} className={styles.guestItem}>
                        <span className={styles.guestName}>
                          {g.first_name || <em className={styles.dim}>(name not set)</em>}
                        </span>
                        <span className={styles.guestTags}>
                          {g.is_child && <span className={styles.tag}>Child</span>}
                          <span className={styles.tag}>{g.rsvp_status}</span>
                        </span>
                        {(g.meal_choice || g.dietary_restrictions || g.allergies) && (
                          <span className={styles.guestNotes}>
                            {[g.meal_choice, g.dietary_restrictions, g.allergies]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              <Section title="Travel">
                <Row label="Arrives" value={t?.arrival_date} />
                <Row label="Departs" value={t?.departure_date} />
                <Row label="Flight" value={t?.flight_info} />
                <Row label="Shuttle" value={t?.needs_shuttle ? "Needed" : "Not needed"} />
              </Section>

              <Section title="Lodging">
                <Row label="Room" value={t?.room_assignment} />
              </Section>

              <Section title="Notes">
                <Row label="Notes" value={party.notes} />
              </Section>
            </>
          )}
        </div>

        <footer className={styles.foot}>
          <button type="button" className="btn-primary" onClick={onEdit}>
            Edit party
          </button>
          <button type="button" className={styles.linkBtn} onClick={onClose}>
            Close
          </button>
        </footer>
      </aside>
    </>
  );
}
