"use client";

import { useState } from "react";
import styles from "./KindlyRespondCard.module.css";
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

export default function KindlyRespondCard() {
  const [phase, setPhase] = useState<Phase>("search");
  const [partyName, setPartyName] = useState("");
  const [email, setEmail] = useState("");
  const [party, setParty] = useState<RsvpParty | null>(null);
  const [response, setResponse] = useState<"accept" | "decline">("accept");
  const [guests, setGuests] = useState<RsvpGuest[]>([emptyGuest()]);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
              first_name: g.first_name,
              is_child: g.is_child,
              rsvp_status: g.rsvp_status === "Declined" ? "Declined" : "Confirmed",
              meal_choice: g.meal_choice,
              dietary_restrictions: g.dietary_restrictions,
            }))
          );
          setResponse(result.guests.some((g) => g.rsvp_status !== "Declined") ? "accept" : "decline");
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
      const finalGuests: RsvpGuest[] =
        response === "decline"
          ? guests
              .filter((g) => g.first_name.trim())
              .map((g) => ({ ...g, rsvp_status: "Declined" as const }))
          : guests
              .filter((g) => g.first_name.trim())
              .map((g) => ({ ...g, rsvp_status: "Confirmed" as const }));

      await submitRsvp(party.id, finalGuests.length > 0 ? finalGuests : []);
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

  if (phase === "submitted") {
    return (
      <div className={styles.card}>
        <div className={styles.left}>
          <div className={styles.headingRow}>
            <h3 className={styles.heading}>Thank You</h3>
            <img src="/assets/illustrations/heart.svg" alt="" className={styles.heart} />
          </div>
          <p className={styles.subtitle}>
            Your response has been recorded. We can&rsquo;t wait to celebrate with you.
          </p>
        </div>
      </div>
    );
  }

  if (phase === "search" || phase === "notFound" || phase === "error") {
    return (
      <form className={styles.card} onSubmit={handleSearch}>
        <div className={styles.left}>
          <div className={styles.headingRow}>
            <h3 className={styles.heading}>Kindly Respond</h3>
            <img src="/assets/illustrations/heart.svg" alt="" className={styles.heart} />
          </div>
          <p className={styles.subtitle}>By April 1, 2027</p>

          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="rsvp-party-name">
              Party Name
            </label>
            <input
              id="rsvp-party-name"
              name="partyName"
              type="text"
              placeholder="As shown on your invitation"
              className={styles.fieldInput}
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="rsvp-email">
              Email
            </label>
            <input
              id="rsvp-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className={styles.fieldInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {phase === "notFound" && (
            <p className={styles.formError}>
              We couldn&rsquo;t find an invitation matching that name and email. Please check
              your invitation or reach out to us directly.
            </p>
          )}
          {phase === "error" && (
            <p className={styles.formError}>
              Something went wrong on our end. Please try again in a moment.
            </p>
          )}
        </div>

        <div className={styles.right}>
          <button type="submit" className={`btn-blue ${styles.submit}`} disabled={searching}>
            {searching ? "Searching…" : "Find My Invitation"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <div className={styles.left}>
        <div className={styles.headingRow}>
          <h3 className={styles.heading}>Kindly Respond</h3>
          <img src="/assets/illustrations/heart.svg" alt="" className={styles.heart} />
        </div>
        <p className={styles.subtitle}>{party?.name}</p>

        <div className={styles.guestList}>
          {guests.map((guest, index) => (
            <div className={styles.guestRow} key={index}>
              <input
                type="text"
                placeholder="Guest name"
                className={styles.fieldInput}
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
      </div>

      <div className={styles.right}>
        <div className={styles.responseOptions} role="radiogroup" aria-label="RSVP response">
          <label className={styles.responseOption}>
            <input
              type="radio"
              name="response"
              value="accept"
              checked={response === "accept"}
              onChange={() => setResponse("accept")}
            />
            Accepts with pleasure
          </label>
          <label className={styles.responseOption}>
            <input
              type="radio"
              name="response"
              value="decline"
              checked={response === "decline"}
              onChange={() => setResponse("decline")}
            />
            Declines with regret
          </label>
        </div>
        <button type="submit" className={`btn-blue ${styles.submit}`} disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Response"}
        </button>
      </div>
    </form>
  );
}
