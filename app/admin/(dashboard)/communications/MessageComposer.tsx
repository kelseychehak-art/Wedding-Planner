"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Party } from "../guests/GuestsManager";
import { IconX } from "@/components/admin/icons";
import { useBodyScrollLock } from "@/components/admin/useBodyScrollLock";
import type { Message, Template, RecipientGroup } from "./CommunicationsManager";
import RuleBuilder from "./RuleBuilder";
import {
  CHANNEL_LABEL,
  MERGE_TOKENS,
  emptyRule,
  renderTokens,
  resolveRecipients,
  type Channel,
  type RecipientRule,
  type RuleLookups,
} from "./recipients";
import styles from "./communications.module.css";

/*
 * Write a message: channel, who it goes to, what it says, and when.
 *
 * There is no Send button, because there is nothing to send with. A message is
 * saved as a draft, scheduled for a date, or marked as already sent once it has
 * gone out some other way. When a provider is wired up, "Schedule" becomes the
 * thing a worker picks up and this panel doesn't have to change.
 */

const CHANNELS: Channel[] = ["email", "sms", "both", "announcement"];

/* The usual GSM segment limit; past it a text is billed and delivered as two. */
const SMS_SEGMENT = 160;

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

type Draft = {
  id: string;
  name: string;
  channel: Channel;
  subject: string;
  preview_text: string;
  body_text: string;
  cta_label: string;
  cta_url: string;
  status: Message["status"];
  scheduled_at: string;
  sent_at: string;
  sent_note: string;
  notes: string;
  recipient_definition: RecipientRule;
};

function draftFrom(message: Message | null, seed: Template | null): Draft {
  if (message) {
    return {
      id: message.id,
      name: message.name ?? "",
      channel: message.channel,
      subject: message.subject ?? "",
      preview_text: message.preview_text ?? "",
      body_text: message.body_text ?? "",
      cta_label: message.cta_label ?? "",
      cta_url: message.cta_url ?? "",
      status: message.status,
      scheduled_at: toLocalInput(message.scheduled_at),
      sent_at: toLocalInput(message.sent_at),
      sent_note: message.sent_note ?? "",
      notes: message.notes ?? "",
      recipient_definition: message.recipient_definition ?? emptyRule(),
    };
  }
  return {
    id: "",
    name: seed?.name ?? "",
    channel: seed?.channel ?? "email",
    subject: seed?.subject ?? "",
    preview_text: seed?.preview_text ?? "",
    body_text: seed?.body_text ?? "",
    cta_label: seed?.cta_label ?? "",
    cta_url: seed?.cta_url ?? "",
    status: "draft",
    scheduled_at: "",
    sent_at: "",
    sent_note: "",
    notes: "",
    recipient_definition: seed?.default_recipient_definition ?? emptyRule(),
  };
}

export default function MessageComposer({
  message,
  seed,
  parties,
  groups,
  lookups,
  onCancel,
  onSaved,
}: {
  message: Message | null;
  seed: Template | null;
  parties: Party[];
  groups: RecipientGroup[];
  lookups: RuleLookups;
  onCancel: () => void;
  onSaved: (saved: Message) => void;
}) {
  const [form, setForm] = useState<Draft>(() => draftFrom(message, seed));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const resolved = useMemo(
    () => resolveRecipients(parties, form.recipient_definition, form.channel),
    [parties, form.recipient_definition, form.channel]
  );

  const isSms = form.channel === "sms";
  const needsSubject = form.channel === "email" || form.channel === "both";

  /*
   * Say what's wrong before saving rather than blocking the button with no
   * explanation. None of these stop a draft being saved — a half-written draft
   * is a legitimate thing to keep — but they do stop it being scheduled.
   */
  const problems = useMemo(() => {
    const out: string[] = [];
    if (!form.body_text.trim()) out.push("The message has no body text.");
    if (needsSubject && !form.subject.trim()) out.push("An email needs a subject line.");
    if (form.cta_url.trim() && !form.cta_label.trim()) {
      out.push("The button has a destination but no label.");
    }
    if (form.cta_label.trim() && !form.cta_url.trim()) {
      out.push("The button has a label but no destination.");
    }
    if (form.status === "scheduled") {
      if (!form.scheduled_at) out.push("Pick a date and time to schedule it for.");
      else if (new Date(form.scheduled_at) < new Date()) {
        out.push("That scheduled time is in the past.");
      }
    }
    if (form.status === "sent" && !form.sent_at) out.push("When did it go out?");
    if (resolved.reachable.length === 0) {
      out.push("Nobody matching this rule has contact details, so it would reach no one.");
    }
    return out;
  }, [form, needsSubject, resolved.reachable.length]);

  const blocking = form.status !== "draft" && problems.length > 0;

  const smsLength = form.body_text.length;
  const segments = Math.max(1, Math.ceil(smsLength / SMS_SEGMENT));

  const previewParty = resolved.reachable[0] ?? resolved.matched[0] ?? parties[0];
  const previewBody = renderTokens(form.body_text, previewParty);
  const previewSubject = renderTokens(form.subject, previewParty);

  async function save() {
    setSaving(true);
    setError("");
    try {
      const payload: Record<string, unknown> = {
        id: form.id,
        name: form.name,
        channel: form.channel,
        subject: form.subject,
        preview_text: form.preview_text,
        body_text: form.body_text,
        cta_label: form.cta_label,
        cta_url: form.cta_url,
        status: form.status,
        scheduled_at:
          form.status === "scheduled" && form.scheduled_at
            ? new Date(form.scheduled_at).toISOString()
            : "",
        sent_at:
          form.status === "sent" && form.sent_at ? new Date(form.sent_at).toISOString() : "",
        sent_note: form.sent_note,
        notes: form.notes,
        recipient_definition: form.recipient_definition,
      };

      /* Freeze who it actually went to at the moment it's marked sent — after
         that the guest list can change without rewriting history. */
      if (form.status === "sent") {
        payload.resolved_recipient_count = String(resolved.reachable.length);
        payload.resolved_guest_count = String(resolved.guestCount);
      }

      const res = await fetch("/api/admin/communications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "message", item: payload }),
      });
      const body = (await res.json()) as { item?: Message; error?: string };
      if (!res.ok || !body.item) {
        setError(body.error || "Couldn't save that message.");
        return;
      }
      onSaved(body.item);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className={styles.scrim} onClick={onCancel} aria-hidden="true" />
      <div
        ref={panelRef}
        className={styles.composer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="composer-title"
      >
        <header className={styles.composerHead}>
          <h2 id="composer-title" className={styles.composerTitle}>
            {message ? "Edit message" : seed ? `New message — ${seed.name}` : "New message"}
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onCancel}
            aria-label="Close composer"
          >
            <IconX size={16} />
          </button>
        </header>

        <div className={styles.composerBody}>
          {/* ---- Channel ---- */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Channel</h3>
            <div className={styles.channelRow}>
              {CHANNELS.map((c) => (
                <label
                  key={c}
                  className={`${styles.channelChip} ${
                    form.channel === c ? styles.channelChipActive : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="channel"
                    checked={form.channel === c}
                    onChange={() => set("channel", c)}
                  />
                  {CHANNEL_LABEL[c]}
                </label>
              ))}
            </div>
            {form.channel === "announcement" && (
              <p className={styles.hint}>
                An announcement is written here and posted to the website by hand — it needs no
                address, so every household counts as reachable.
              </p>
            )}
          </section>

          {/* ---- Recipients ---- */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Recipients</h3>
            {groups.length > 0 && (
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Start from a saved group</span>
                <select
                  className={styles.input}
                  value=""
                  onChange={(e) => {
                    const g = groups.find((x) => x.id === e.target.value);
                    if (g) set("recipient_definition", g.rule_definition);
                  }}
                >
                  <option value="">Choose a group…</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <RuleBuilder
              rule={form.recipient_definition}
              onChange={(r) => set("recipient_definition", r)}
              parties={parties}
              lookups={lookups}
              channel={form.channel}
            />
          </section>

          {/* ---- Content ---- */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Content</h3>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Internal name</span>
              <input
                className={styles.input}
                value={form.name}
                placeholder="RSVP reminder — round two"
                onChange={(e) => set("name", e.target.value)}
              />
              <span className={styles.hint}>Only you see this. Handy when two drafts share a subject.</span>
            </label>

            {!isSms && (
              <>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Subject</span>
                  <input
                    className={styles.input}
                    value={form.subject}
                    placeholder="A gentle nudge — could you let us know?"
                    onChange={(e) => set("subject", e.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Preview text</span>
                  <input
                    className={styles.input}
                    value={form.preview_text}
                    placeholder="The line that shows under the subject in an inbox."
                    onChange={(e) => set("preview_text", e.target.value)}
                  />
                </label>
              </>
            )}

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Message</span>
              <textarea
                className={styles.textarea}
                rows={isSms ? 4 : 12}
                value={form.body_text}
                onChange={(e) => set("body_text", e.target.value)}
              />
              {isSms ? (
                <span className={`${styles.hint} ${segments > 1 ? styles.hintWarn : ""}`}>
                  {smsLength} characters · {segments} message{segments === 1 ? "" : "s"}
                  {segments > 1 ? " — over 160 characters it sends as more than one text." : ""}
                </span>
              ) : (
                <span className={styles.hint}>
                  Tokens:{" "}
                  {MERGE_TOKENS.map((t) => (
                    <button
                      key={t.token}
                      type="button"
                      className={styles.tokenBtn}
                      title={t.note}
                      onClick={() => set("body_text", `${form.body_text}${t.token}`)}
                    >
                      {t.token}
                    </button>
                  ))}
                </span>
              )}
            </label>

            {!isSms && (
              <div className={styles.fieldRow}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Button label</span>
                  <input
                    className={styles.input}
                    value={form.cta_label}
                    placeholder="RSVP now"
                    onChange={(e) => set("cta_label", e.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Button destination</span>
                  <input
                    className={styles.input}
                    value={form.cta_url}
                    placeholder="{{rsvp_link}}"
                    onChange={(e) => set("cta_url", e.target.value)}
                  />
                </label>
              </div>
            )}
          </section>

          {/* ---- Schedule ---- */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>When</h3>
            <div className={styles.statusRow}>
              {(
                [
                  ["draft", "Keep as draft"],
                  ["scheduled", "Schedule for later"],
                  ["sent", "Mark as already sent"],
                  ["cancelled", "Cancelled"],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className={`${styles.channelChip} ${
                    form.status === value ? styles.channelChipActive : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    checked={form.status === value}
                    onChange={() => set("status", value)}
                  />
                  {label}
                </label>
              ))}
            </div>

            {form.status === "scheduled" && (
              <>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Send at</span>
                  <input
                    className={styles.input}
                    type="datetime-local"
                    value={form.scheduled_at}
                    onChange={(e) => set("scheduled_at", e.target.value)}
                  />
                </label>
                <p className={styles.hint}>
                  Nothing will send on its own — this is a reminder for you, and the queue a
                  provider would read from once one is connected.
                </p>
              </>
            )}

            {form.status === "sent" && (
              <div className={styles.fieldRow}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Sent at</span>
                  <input
                    className={styles.input}
                    type="datetime-local"
                    value={form.sent_at}
                    onChange={(e) => set("sent_at", e.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Sent using</span>
                  <input
                    className={styles.input}
                    value={form.sent_note}
                    placeholder="Gmail"
                    onChange={(e) => set("sent_note", e.target.value)}
                  />
                </label>
              </div>
            )}
          </section>

          {/* ---- Preview ---- */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Preview</h3>
            <div className={styles.preview}>
              {previewParty ? (
                <>
                  <div className={styles.previewMeta}>
                    As {previewParty.email || previewParty.phone || "this household"} would see it
                  </div>
                  {!isSms && previewSubject && (
                    <div className={styles.previewSubject}>{previewSubject}</div>
                  )}
                  <div className={styles.previewBody}>{previewBody || "…"}</div>
                  {form.cta_label && (
                    <span className={styles.previewCta}>{form.cta_label}</span>
                  )}
                </>
              ) : (
                <p className={styles.hint}>Add a guest household to see a preview.</p>
              )}
            </div>
          </section>

          {problems.length > 0 && (
            <section className={styles.section}>
              <ul className={styles.problems}>
                {problems.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <footer className={styles.composerFoot}>
          {error && <span className={styles.error}>{error}</span>}
          <button type="button" className={styles.linkBtn} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={save}
            disabled={saving || blocking}
            title={blocking ? "Fix the problems listed above first." : undefined}
          >
            {saving ? "Saving…" : message ? "Save changes" : "Save message"}
          </button>
        </footer>
      </div>
    </>
  );
}
