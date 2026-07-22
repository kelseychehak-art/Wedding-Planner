"use client";

import { useMemo } from "react";
import type { Party } from "../guests/GuestsManager";
import { displayName } from "../guests/household";
import {
  BASE_LABEL,
  resolveRecipients,
  type Channel,
  type RecipientRule,
  type RuleLookups,
} from "./recipients";
import styles from "./communications.module.css";

/*
 * The recipient rule, and what it currently resolves to. Shared by the message
 * composer and the saved-group form so the two can't drift apart.
 *
 * The resolved count is shown while you build the rule, not after — the whole
 * risk with a filter like this is confidently sending to the wrong 40 people,
 * and the only defence is being able to read the names back before you commit.
 */

const BASES: RecipientRule["base"][] = ["all", "attending", "awaiting", "declined"];

export default function RuleBuilder({
  rule,
  onChange,
  parties,
  lookups,
  channel = "email",
}: {
  rule: RecipientRule;
  onChange: (next: RecipientRule) => void;
  parties: Party[];
  lookups: RuleLookups;
  channel?: Channel;
}) {
  const resolved = useMemo(
    () => resolveRecipients(parties, rule, channel),
    [parties, rule, channel]
  );

  function set<K extends keyof RecipientRule>(key: K, value: RecipientRule[K]) {
    const next = { ...rule, [key]: value };
    /* Drop empty keys so a stored rule stays readable and describeRule stays honest. */
    if (value === "" || value === false || value === undefined) delete next[key];
    onChange(next);
  }

  return (
    <div className={styles.ruleBuilder}>
      <div className={styles.ruleRow}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Send to</span>
          <select
            className={styles.input}
            value={rule.base}
            onChange={(e) => set("base", e.target.value as RecipientRule["base"])}
          >
            {BASES.map((b) => (
              <option key={b} value={b}>
                {BASE_LABEL[b]}
              </option>
            ))}
          </select>
        </label>

        {lookups.sides.length > 0 && (
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Side</span>
            <select
              className={styles.input}
              value={rule.side ?? ""}
              onChange={(e) => set("side", e.target.value)}
            >
              <option value="">Either side</option>
              {lookups.sides.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        )}

        {lookups.activities.size > 0 && (
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Booked on</span>
            <select
              className={styles.input}
              value={rule.activityId ?? ""}
              onChange={(e) => set("activityId", e.target.value)}
            >
              <option value="">Any activity</option>
              {[...lookups.activities].map(([id, title]) => (
                <option key={id} value={id}>
                  {title}
                </option>
              ))}
            </select>
          </label>
        )}

        {lookups.events.size > 0 && (
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Invited to</span>
            <select
              className={styles.input}
              value={rule.eventId ?? ""}
              onChange={(e) => set("eventId", e.target.value)}
            >
              <option value="">Any event</option>
              {[...lookups.events].map(([id, title]) => (
                <option key={id} value={id}>
                  {title}
                </option>
              ))}
            </select>
          </label>
        )}

        {lookups.properties.length > 0 && (
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Staying at</span>
            <select
              className={styles.input}
              value={rule.lodgingProperty ?? ""}
              onChange={(e) => set("lodgingProperty", e.target.value)}
            >
              <option value="">Anywhere</option>
              {lookups.properties.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className={styles.ruleChecks}>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={Boolean(rule.hasChildren)}
            onChange={(e) => set("hasChildren", e.target.checked)}
          />
          Only households with children
        </label>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={Boolean(rule.missingTravel)}
            onChange={(e) => set("missingTravel", e.target.checked)}
          />
          Only households with no travel details yet
        </label>
      </div>

      <div className={styles.resolvedBox}>
        <div className={styles.resolvedHead}>
          <span className={styles.resolvedCount}>
            {resolved.reachable.length} household{resolved.reachable.length === 1 ? "" : "s"}
          </span>
          <span className={styles.resolvedGuests}>
            {resolved.guestCount} guest{resolved.guestCount === 1 ? "" : "s"} reached
          </span>
        </div>

        {resolved.unreachable.length > 0 && (
          <p className={styles.resolvedWarn}>
            {resolved.unreachable.length} more household
            {resolved.unreachable.length === 1 ? "" : "s"} match ({resolved.missedGuestCount}{" "}
            guest{resolved.missedGuestCount === 1 ? "" : "s"}) but have no{" "}
            {channel === "sms" ? "phone number" : "email address"} on file, so they will be
            left out: {resolved.unreachable.slice(0, 4).map(displayName).join(", ")}
            {resolved.unreachable.length > 4 ? `, and ${resolved.unreachable.length - 4} more` : ""}.
          </p>
        )}

        {resolved.reachable.length > 0 && (
          <details className={styles.resolvedList}>
            <summary>Who that is</summary>
            <ul>
              {resolved.reachable.map((p) => (
                <li key={p.id}>
                  <span>{displayName(p)}</span>
                  <span className={styles.resolvedAddress}>
                    {channel === "sms" ? p.phone : p.email}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
