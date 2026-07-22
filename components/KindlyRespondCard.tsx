"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./KindlyRespondCard.module.css";
import Illustration from "./Illustration";
import { siteContent } from "@/data/siteContent";
import { findPartyForRsvp, submitRsvp, type RsvpGuest, type RsvpParty } from "@/lib/supabase";

type Phase = "search" | "found" | "notFound" | "error" | "submitted";

function emptyGuest(): RsvpGuest {
  return {
    first_name: "",
    is_child: false,
    rsvp_status: "Confirmed",
    meal_choice: null,
    dietary_restrictions: null,
  };
}

/**
 * RSVP flow — deck slide 3 (right). Keeps the name + email guest-list lookup
 * (Supabase get_party_for_rsvp / submit_rsvp), styled as the mockup's
 * numbered-section form: find invitation → respond (guests, accept/decline,
 * dietary notes).
 */
export default function KindlyRespondCard() {
  const [phase, setPhase] = useState<Phase>("search");
  const [partyName, setPartyName] = useState("");
  const [email, setEmail] = useState("");
  const [party, setParty] = useState<RsvpParty | null>(null);
  const [guests, setGuests] = useState<RsvpGuest[]>([emptyGuest()]);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nudge, setNudge] = useState(false);

  /*
   * Every step swaps the card's contents, and the page doesn't move on its own.
   * Submitting used to leave you scrolled past a card that had just shrunk to a
   * short thank-you — on a phone the screen barely changes, which reads as
   * "nothing happened" and invites a second submission. So each step brings its
   * own card into view. Skipped on first paint, and instant rather than smooth
   * for anyone who asked for less motion.
   */
  const cardRef = useRef<HTMLElement | null>(null);
  /* Callback ref so the same handle works for the <form> and the <div>. */
  const setCard = (el: HTMLElement | null) => {
    cardRef.current = el;
  };
  const firstPaint = useRef(true);

  useEffect(() => {
    if (firstPaint.current) {
      firstPaint.current = false;
      return;
    }
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    cardRef.current?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });
  }, [phase]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearching(true);
    try {
      const result = await findPartyForRsvp(partyName.trim(), email.trim());
      if (!result) {
        setPhase("notFound");
      } else {
        setParty(result.party);
        if (result.guests.length > 0) {
          setGuests(
            result.guests.map((g) => ({
              /* Carry the id back on submit so submit_rsvp updates this row
                 rather than creating a duplicate. Dropping it here is what let
                 the old delete-and-reinsert lose everything attached to a guest. */
              id: g.id,
              first_name: g.first_name,
              is_child: g.is_child,
              /* Keep "Invited" as-is so an unanswered guest reads as
                 unanswered, rather than being pre-accepted on their behalf. */
              rsvp_status: g.rsvp_status ?? "Invited",
              meal_choice: g.meal_choice,
              dietary_restrictions: g.dietary_restrictions,
            })),
          );
        }
        setPhase("found");
      }
    } catch {
      setPhase("error");
    } finally {
      setSearching(false);
    }
  }

  /* Everyone named has to have an answer — otherwise a household submits and
     one person is silently left as "Invited", which reads as "never replied". */
  const named = guests.filter((g) => g.first_name.trim());
  const unanswered = named.filter((g) => g.rsvp_status !== "Confirmed" && g.rsvp_status !== "Declined");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!party) return;
    if (unanswered.length > 0) {
      setNudge(true);
      return;
    }
    setSubmitting(true);
    try {
      /* Each guest carries their own answer and their own notes. Dietary is
         sent for everyone (empty included) so clearing a note actually clears
         it — submit_rsvp treats a present key as the answer. */
      const finalGuests: RsvpGuest[] = named.map((g) => ({
        ...g,
        dietary_restrictions: g.rsvp_status === "Confirmed" ? g.dietary_restrictions?.trim() || null : null,
      }));

      await submitRsvp(party.id, finalGuests);
      setPhase("submitted");
    } catch {
      setPhase("error");
    } finally {
      setSubmitting(false);
    }
  }

  function setGuestField(index: number, patch: Partial<RsvpGuest>) {
    setGuests((prev) => prev.map((g, i) => (i === index ? { ...g, ...patch } : g)));
  }

  function addGuestRow() {
    setGuests((prev) => [...prev, emptyGuest()]);
  }

  function removeGuestRow(index: number) {
    setGuests((prev) => prev.filter((_, i) => i !== index));
  }

  // ---- Confirmation ----
  if (phase === "submitted") {
    return (
      <div className={styles.thanks} ref={setCard}>
        <Illustration name="heart" tone="terracotta" size={34} />
        <h2 className={styles.thanksTitle}>Thank You!</h2>
        <p className={styles.thanksBody}>
          {guests.some((g) => g.rsvp_status === "Confirmed")
            ? "Your response has been recorded. We can't wait to celebrate with you in Italy!"
            : "We're sorry you can't make it — you'll be missed. Thank you for letting us know."}
        </p>
      </div>
    );
  }

  // ---- Step 1: find invitation ----
  if (phase === "search" || phase === "notFound" || phase === "error") {
    return (
      <form className={styles.form} onSubmit={handleSearch} ref={setCard}>
        <section className={styles.section}>
          <p className={styles.stepLabel}>1. Find Your Invitation</p>
          <p className={styles.stepHelp}>
            Look up your party with the name and email on your invitation.
          </p>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Name(s) *</span>
            <input
              type="text"
              placeholder="e.g. Taylor Smith or Taylor &amp; Alex Smith"
              className={styles.input}
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Email *</span>
            <input
              type="email"
              placeholder="you@example.com"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {phase === "notFound" && (
            <p className={styles.error}>
              We couldn&rsquo;t find an invitation matching that name and email. Try the name of
              anyone in your party, and the email we sent your invitation to.
              {siteContent.contact.email ? (
                <>
                  {" "}
                  Still stuck?{" "}
                  <a href={`mailto:${siteContent.contact.email}`}>
                    {siteContent.contact.label || siteContent.contact.email}
                  </a>
                  .
                </>
              ) : null}
            </p>
          )}
          {phase === "error" && (
            <p className={styles.error}>
              Something went wrong on our end. Please try again in a moment.
            </p>
          )}
        </section>

        <button type="submit" className={`btn-primary ${styles.submit}`} disabled={searching}>
          {searching ? "Searching…" : "Find My Invitation"}
        </button>
      </form>
    );
  }

  // ---- Step 2: respond ----
  return (
    <form className={styles.form} onSubmit={handleSubmit} ref={setCard}>
      <section className={styles.section}>
        <p className={styles.stepLabel}>1. Who&rsquo;s Coming?</p>
        <p className={styles.stepHelp}>
          Found you{party?.name ? `, ${party.name}` : ""}! Please answer for each person &mdash;
          everyone can reply differently.
        </p>

        <div className={styles.guestList}>
          {guests.map((guest, index) => {
            const attending = guest.rsvp_status === "Confirmed";
            const declined = guest.rsvp_status === "Declined";
            /* Only rows added in this session can be removed. Removing an
               invited guest here never deleted them — submit only updates and
               inserts — so the row vanished and they stayed "Invited" forever.
               For a real invitee the honest answer is Can't make it. */
            const isNewRow = !guest.id;

            return (
              <div className={styles.guestCard} key={guest.id ?? `new-${index}`}>
                <div className={styles.guestRow}>
                  <input
                    type="text"
                    placeholder="Guest name"
                    className={styles.input}
                    value={guest.first_name}
                    onChange={(e) => setGuestField(index, { first_name: e.target.value })}
                  />
                  <label className={styles.childToggle}>
                    <input
                      type="checkbox"
                      checked={guest.is_child}
                      onChange={() => setGuestField(index, { is_child: !guest.is_child })}
                    />
                    Child
                  </label>
                  {isNewRow && guests.length > 1 && (
                    <button
                      type="button"
                      className={styles.removeGuest}
                      onClick={() => removeGuestRow(index)}
                      aria-label={`Remove ${guest.first_name || "guest"}`}
                    >
                      &times;
                    </button>
                  )}
                </div>

                <div
                  className={styles.choices}
                  role="radiogroup"
                  aria-label={`Will ${guest.first_name || "this guest"} attend?`}
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={attending}
                    className={`${styles.choice} ${attending ? styles.choiceAccept : ""}`}
                    onClick={() => setGuestField(index, { rsvp_status: "Confirmed" })}
                  >
                    Joyfully accepts
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={declined}
                    className={`${styles.choice} ${declined ? styles.choiceDecline : ""}`}
                    onClick={() =>
                      setGuestField(index, { rsvp_status: "Declined", dietary_restrictions: null })
                    }
                  >
                    Regretfully declines
                  </button>
                </div>

                {/* Dietary notes belong to the person eating, so they only
                    appear once that person is actually coming. */}
                {attending && (
                  <label className={styles.dietaryField}>
                    <span className={styles.fieldLabel}>
                      Dietary restrictions or allergies (optional)
                    </span>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. vegetarian, gluten-free, nut allergy"
                      maxLength={250}
                      value={guest.dietary_restrictions ?? ""}
                      onChange={(e) =>
                        setGuestField(index, { dietary_restrictions: e.target.value })
                      }
                    />
                  </label>
                )}
              </div>
            );
          })}

          <button type="button" className={styles.addGuest} onClick={addGuestRow}>
            + Add Guest
          </button>
        </div>

        {nudge && unanswered.length > 0 && (
          <p className={styles.error}>
            Please choose an answer for{" "}
            {unanswered.map((g) => g.first_name.trim()).filter(Boolean).join(", ") ||
              "each guest"}
            .
          </p>
        )}
      </section>

      <button type="submit" className={`btn-primary ${styles.submit}`} disabled={submitting}>
        {submitting ? "Submitting…" : "Submit RSVP"}
      </button>
    </form>
  );
}
