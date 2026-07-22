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
  const [response, setResponse] = useState<"accept" | "decline">("accept");
  const [guests, setGuests] = useState<RsvpGuest[]>([emptyGuest()]);
  const [dietary, setDietary] = useState("");
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
              rsvp_status: g.rsvp_status === "Declined" ? "Declined" : "Confirmed",
              meal_choice: g.meal_choice,
              dietary_restrictions: g.dietary_restrictions,
            })),
          );
          setResponse(
            result.guests.some((g) => g.rsvp_status !== "Declined") ? "accept" : "decline",
          );
          const existingDietary = result.guests
            .map((g) => g.dietary_restrictions)
            .find((d) => d && d.trim());
          if (existingDietary) setDietary(existingDietary);
        }
        setPhase("found");
      }
    } catch {
      setPhase("error");
    } finally {
      setSearching(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!party) return;
    setSubmitting(true);
    try {
      const dietaryNote = dietary.trim() || null;
      const status = response === "decline" ? ("Declined" as const) : ("Confirmed" as const);
      const finalGuests: RsvpGuest[] = guests
        .filter((g) => g.first_name.trim())
        .map((g) => ({ ...g, rsvp_status: status, dietary_restrictions: dietaryNote }));

      await submitRsvp(party.id, finalGuests);
      setPhase("submitted");
    } catch {
      setPhase("error");
    } finally {
      setSubmitting(false);
    }
  }

  function updateGuestName(index: number, value: string) {
    setGuests((prev) => prev.map((g, i) => (i === index ? { ...g, first_name: value } : g)));
  }

  function toggleGuestChild(index: number) {
    setGuests((prev) => prev.map((g, i) => (i === index ? { ...g, is_child: !g.is_child } : g)));
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
          {response === "decline"
            ? "We're sorry you can't make it — you'll be missed. Thank you for letting us know."
            : "Your response has been recorded. We can't wait to celebrate with you in Italy!"}
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
        <p className={styles.stepLabel}>1. Your Party</p>
        <p className={styles.stepHelp}>
          Found you{party?.name ? `, ${party.name}` : ""}! Confirm who we should plan for.
        </p>
        <div className={styles.guestList}>
          {guests.map((guest, index) => (
            <div className={styles.guestRow} key={index}>
              <input
                type="text"
                placeholder="Guest name"
                className={styles.input}
                value={guest.first_name}
                onChange={(e) => updateGuestName(index, e.target.value)}
              />
              <label className={styles.childToggle}>
                <input
                  type="checkbox"
                  checked={guest.is_child}
                  onChange={() => toggleGuestChild(index)}
                />
                Child
              </label>
              {guests.length > 1 && (
                <button
                  type="button"
                  className={styles.removeGuest}
                  onClick={() => removeGuestRow(index)}
                  aria-label="Remove guest"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button type="button" className={styles.addGuest} onClick={addGuestRow}>
            + Add Guest
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.stepLabel}>2. Will You Be Joining Us?</p>
        <div className={styles.choices} role="radiogroup" aria-label="RSVP response">
          <button
            type="button"
            role="radio"
            aria-checked={response === "accept"}
            className={`${styles.choice} ${response === "accept" ? styles.choiceAccept : ""}`}
            onClick={() => setResponse("accept")}
          >
            Joyfully Accepts
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={response === "decline"}
            className={`${styles.choice} ${response === "decline" ? styles.choiceDecline : ""}`}
            onClick={() => setResponse("decline")}
          >
            Regretfully Declines
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.stepLabel}>3. Any Dietary Restrictions or Allergies?</p>
        <p className={styles.stepHelp}>Let us know so we can plan accordingly.</p>
        <textarea
          className={styles.textarea}
          placeholder="e.g. Vegetarian, gluten-free, nut allergy, etc."
          maxLength={250}
          rows={3}
          value={dietary}
          onChange={(e) => setDietary(e.target.value)}
        />
        <span className={styles.counter}>{dietary.length} / 250</span>
      </section>

      <button type="submit" className={`btn-primary ${styles.submit}`} disabled={submitting}>
        {submitting ? "Submitting…" : "Submit RSVP"}
      </button>
    </form>
  );
}
