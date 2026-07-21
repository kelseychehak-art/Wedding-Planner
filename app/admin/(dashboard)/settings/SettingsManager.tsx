"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import {
  IconCalendarHeart,
  IconUsers,
  IconCalendar,
  IconLuggage,
  IconMail,
  IconPalette,
  IconLink,
  IconShield,
  IconLock,
} from "@/components/admin/icons";
import styles from "./settings.module.css";

/*
 * Admin Settings — docs/admin/settings.md, adapted to this repo's stack
 * (CSS Modules + Supabase RPCs instead of the brief's Tailwind/RHF/Zod).
 *
 * Sections backed by real storage: Wedding Details, Guests & RSVP,
 * Travel & Lodging, Events & Activities. The rest are honest placeholders —
 * they need backends (messaging provider, OAuth, multi-user auth) that don't
 * exist yet. A placeholder must describe what is genuinely missing today; if a
 * module ships, its section stops being a placeholder.
 */

type Settings = Record<string, string>;

type SectionKey =
  | "wedding"
  | "guests"
  | "events"
  | "travel"
  | "communications"
  | "branding"
  | "integrations"
  | "team"
  | "privacy";

const SECTIONS: { key: SectionKey; label: string; Icon: typeof IconUsers }[] = [
  { key: "wedding", label: "Wedding Details", Icon: IconCalendarHeart },
  { key: "guests", label: "Guests & RSVP", Icon: IconUsers },
  { key: "events", label: "Events & Activities", Icon: IconCalendar },
  { key: "travel", label: "Travel & Lodging", Icon: IconLuggage },
  { key: "communications", label: "Communications", Icon: IconMail },
  { key: "branding", label: "Website & Branding", Icon: IconPalette },
  { key: "integrations", label: "Integrations", Icon: IconLink },
  { key: "team", label: "Team & Access", Icon: IconShield },
  { key: "privacy", label: "Data & Privacy", Icon: IconLock },
];

const TIMEZONES = [
  "Europe/Rome",
  "Europe/London",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "UTC",
];

type SaveState = "clean" | "dirty" | "saving" | "saved" | "error";

export default function SettingsManager({ initialSettings }: { initialSettings: Settings }) {
  const [saved, setSaved] = useState<Settings>(initialSettings);
  const [draft, setDraft] = useState<Settings>(initialSettings);
  const [section, setSection] = useState<SectionKey>("wedding");
  const [saveState, setSaveState] = useState<SaveState>("clean");
  const [errors, setErrors] = useState<string[]>([]);

  const dirty = useMemo(
    () => Object.keys(draft).some((k) => draft[k] !== saved[k]),
    [draft, saved]
  );

  function get(key: string, fallback = "") {
    return draft[key] ?? fallback;
  }

  function set(key: string, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaveState("dirty");
  }

  function validate(): string[] {
    const problems: string[] = [];
    const start = get("wedding_start_date");
    const end = get("wedding_end_date");
    if (start && end && new Date(end) < new Date(start)) {
      problems.push("Wedding end date must be on or after the start date.");
    }
    const email = get("admin_contact_email");
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      problems.push("Admin contact email doesn't look like a valid address.");
    }
    const rate = Number(get("eur_usd_rate"));
    if (!(rate > 0)) {
      problems.push("EUR → USD rate must be greater than zero.");
    }
    const age = Number(get("adult_age_threshold"));
    if (get("adult_age_threshold") && (!Number.isInteger(age) || age < 0 || age > 30)) {
      problems.push("Adult age threshold must be a whole number between 0 and 30.");
    }
    return problems;
  }

  async function save() {
    const problems = validate();
    setErrors(problems);
    if (problems.length) {
      setSaveState("error");
      return;
    }

    setSaveState("saving");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: draft }),
      });
      if (!res.ok) {
        setSaveState("error");
        setErrors(["Unable to save changes. Try again."]);
        return;
      }
      const { settings } = await res.json();
      setSaved(settings ?? draft);
      setDraft(settings ?? draft);
      setSaveState("saved");
    } catch {
      setSaveState("error");
      setErrors(["Unable to save changes. Try again."]);
    }
  }

  const statusLabel =
    saveState === "saving"
      ? "Saving…"
      : saveState === "error"
        ? "Unable to save changes"
        : dirty
          ? "Unsaved changes"
          : saveState === "saved"
            ? "All changes saved"
            : "All changes saved";

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage wedding details, preferences, permissions, and integrations."
        action={
          <span className={`${styles.status} ${styles[`status_${saveState}`]}`}>
            {statusLabel}
          </span>
        }
      />

      <div className={styles.layout}>
        <aside className={styles.sideNav}>
          <ul className={styles.navList}>
            {SECTIONS.map(({ key, label, Icon }) => (
              <li key={key}>
                <button
                  type="button"
                  className={`${styles.navItem} ${section === key ? styles.navItemActive : ""}`}
                  onClick={() => setSection(key)}
                  aria-current={section === key ? "true" : undefined}
                >
                  <Icon size={16} className={styles.navIcon} />
                  <span>{label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.helpCard}>
            <p className={styles.helpTitle}>Need help?</p>
            <p className={styles.helpBody}>
              These settings feed the guest site, the dashboard metrics, and every export.
            </p>
          </div>
        </aside>

        <section className={styles.panel}>
          {section === "wedding" && (
            <SectionCard
              title="Wedding Details"
              errors={errors}
              dirty={dirty}
              saveState={saveState}
              onSave={save}
            >
              <div className={styles.grid}>
                <Field label="Couple Names (displayed on site)" wide>
                  <input
                    className={styles.input}
                    value={get("couple_display_name")}
                    onChange={(e) => set("couple_display_name", e.target.value)}
                  />
                </Field>
                <Field label="Formal Name 1">
                  <input
                    className={styles.input}
                    value={get("partner_one_formal_name")}
                    onChange={(e) => set("partner_one_formal_name", e.target.value)}
                  />
                </Field>
                <Field label="Formal Name 2">
                  <input
                    className={styles.input}
                    value={get("partner_two_formal_name")}
                    onChange={(e) => set("partner_two_formal_name", e.target.value)}
                  />
                </Field>
                <Field label="Wedding Location">
                  <input
                    className={styles.input}
                    value={get("wedding_location_label")}
                    onChange={(e) => set("wedding_location_label", e.target.value)}
                  />
                </Field>
                <Field label="Time Zone">
                  <select
                    className={styles.input}
                    value={get("timezone", "Europe/Rome")}
                    onChange={(e) => set("timezone", e.target.value)}
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Wedding Start Date">
                  <input
                    className={styles.input}
                    type="date"
                    value={get("wedding_start_date")}
                    onChange={(e) => set("wedding_start_date", e.target.value)}
                  />
                </Field>
                <Field label="Wedding End Date">
                  <input
                    className={styles.input}
                    type="date"
                    value={get("wedding_end_date")}
                    onChange={(e) => set("wedding_end_date", e.target.value)}
                  />
                </Field>
              </div>

              <p className={styles.note}>
                Changing the wedding dates may affect event dates, RSVP deadlines, travel
                windows, and age calculations.
              </p>

              <h3 className={styles.subhead}>Currency</h3>
              <p className={styles.subheadNote}>
                Amounts display in USD with the euro equivalent beside them. Venue quotes are
                stored in euros, so this rate is a planning estimate you maintain by hand — not
                a live exchange feed.
              </p>
              <div className={styles.grid}>
                <Field label="Primary Currency">
                  <input className={styles.input} value="USD — US Dollar" readOnly />
                </Field>
                <Field label="Secondary Currency">
                  <input className={styles.input} value="EUR — Euro" readOnly />
                </Field>
                <Field label="EUR → USD Rate">
                  <input
                    className={styles.input}
                    type="number"
                    step="0.01"
                    min="0"
                    value={get("eur_usd_rate", "1.08")}
                    onChange={(e) => set("eur_usd_rate", e.target.value)}
                  />
                </Field>
              </div>
              <p className={styles.rateExample}>
                At {get("eur_usd_rate", "1.08")}, €1,000 shows as{" "}
                <strong>
                  $
                  {Math.round(1000 * (Number(get("eur_usd_rate", "1.08")) || 1)).toLocaleString()}
                </strong>
                .
              </p>

              <h3 className={styles.subhead}>Contact & Web</h3>
              <div className={styles.grid}>
                <Field label="Website Domain">
                  <input
                    className={styles.input}
                    value={get("website_domain")}
                    onChange={(e) => set("website_domain", e.target.value)}
                  />
                </Field>
                <Field label="Admin Contact Email">
                  <input
                    className={styles.input}
                    type="email"
                    placeholder="not set yet"
                    value={get("admin_contact_email")}
                    onChange={(e) => set("admin_contact_email", e.target.value)}
                  />
                </Field>
                <Field label="Wedding Hashtag">
                  <input
                    className={styles.input}
                    placeholder="#…"
                    value={get("wedding_hashtag")}
                    onChange={(e) => set("wedding_hashtag", e.target.value)}
                  />
                </Field>
              </div>
            </SectionCard>
          )}

          {section === "guests" && (
            <SectionCard
              title="Guests & RSVP"
              errors={errors}
              dirty={dirty}
              saveState={saveState}
              onSave={save}
            >
              <h3 className={styles.subheadFirst}>Adult & child classification</h3>
              <p className={styles.subheadNote}>
                Drives the child counts on the dashboard and guest list, and later the meal and
                activity age rules.
              </p>
              <div className={styles.grid}>
                <Field label="Classification method">
                  <select
                    className={styles.input}
                    value={get("guest_classification_method", "age_on_wedding_date")}
                    onChange={(e) => set("guest_classification_method", e.target.value)}
                  >
                    <option value="age_on_wedding_date">Age on wedding start date</option>
                    <option value="manual">Manual classification</option>
                  </select>
                </Field>
                <Field label="Adult begins at (years)">
                  <input
                    className={styles.input}
                    type="number"
                    min="0"
                    max="30"
                    value={get("adult_age_threshold", "18")}
                    onChange={(e) => set("adult_age_threshold", e.target.value)}
                  />
                </Field>
              </div>

              <h3 className={styles.subhead}>RSVP window</h3>
              <div className={styles.grid}>
                <Field label="RSVP opens">
                  <input
                    className={styles.input}
                    type="date"
                    value={get("rsvp_opens")}
                    onChange={(e) => set("rsvp_opens", e.target.value)}
                  />
                </Field>
                <Field label="RSVP deadline">
                  <input
                    className={styles.input}
                    type="date"
                    value={get("rsvp_deadline")}
                    onChange={(e) => set("rsvp_deadline", e.target.value)}
                  />
                </Field>
              </div>
              <Toggle
                label="Allow late responses after the deadline"
                checked={get("allow_late_rsvp", "true") === "true"}
                onChange={(v) => set("allow_late_rsvp", String(v))}
              />
              <Toggle
                label="Allow guests to update their response"
                checked={get("allow_guest_updates", "true") === "true"}
                onChange={(v) => set("allow_guest_updates", String(v))}
              />

              <p className={styles.note}>
                Child-specific RSVP questions (date of birth, high chair, crib) arrive with the
                guest RSVP form rebuild — the fields aren&rsquo;t collected publicly yet.
              </p>
            </SectionCard>
          )}

          {section === "travel" && (
            <SectionCard
              title="Travel & Lodging"
              errors={errors}
              dirty={dirty}
              saveState={saveState}
              onSave={save}
            >
              <div className={styles.grid}>
                <Field label="Travel collection closes">
                  <input
                    className={styles.input}
                    type="date"
                    value={get("travel_deadline")}
                    onChange={(e) => set("travel_deadline", e.target.value)}
                  />
                </Field>
              </div>
              <Toggle
                label="Offer group transportation / shuttles"
                checked={get("transportation_enabled", "true") === "true"}
                onChange={(v) => set("transportation_enabled", String(v))}
              />
              <h3 className={styles.subhead}>Required travel fields</h3>
              <Toggle
                label="Require arrival date"
                checked={get("travel_require_arrival", "true") === "true"}
                onChange={(v) => set("travel_require_arrival", String(v))}
              />
              <Toggle
                label="Require departure date"
                checked={get("travel_require_departure", "true") === "true"}
                onChange={(v) => set("travel_require_departure", String(v))}
              />
              <Toggle
                label="Require flight numbers"
                checked={get("travel_require_flight", "false") === "true"}
                onChange={(v) => set("travel_require_flight", String(v))}
              />
              <p className={styles.note}>
                Room assignments live under <Link href="/admin/lodging">Lodging</Link>; flights and
                transfers live under <Link href="/admin/travel">Travel</Link>. Both are
                admin-entered today — guests can&rsquo;t submit their own details until the
                guest-facing travel form exists.
              </p>
            </SectionCard>
          )}

          {section === "events" && (
            <SectionCard
              title="Events & Activities"
              errors={errors}
              dirty={dirty}
              saveState={saveState}
              onSave={save}
            >
              <h3 className={styles.subhead}>Activity sign-up window</h3>
              <div className={styles.grid}>
                <Field label="Sign-ups open">
                  <input
                    className={styles.input}
                    type="date"
                    value={get("activity_signup_opens")}
                    onChange={(e) => set("activity_signup_opens", e.target.value)}
                  />
                </Field>
                <Field label="Sign-ups close">
                  <input
                    className={styles.input}
                    type="date"
                    value={get("activity_signup_closes")}
                    onChange={(e) => set("activity_signup_closes", e.target.value)}
                  />
                </Field>
              </div>
              <Toggle
                label="Keep a waitlist when an activity is full"
                checked={get("activity_waitlist_enabled", "true") === "true"}
                onChange={(v) => set("activity_waitlist_enabled", String(v))}
              />

              <h3 className={styles.subhead}>Event defaults</h3>
              <div className={styles.grid}>
                <Field label="New events default to">
                  <select
                    className={styles.input}
                    value={get("event_default_visibility", "public")}
                    onChange={(e) => set("event_default_visibility", e.target.value)}
                  >
                    <option value="public">Public — visible to guests</option>
                    <option value="private">Private — internal only</option>
                  </select>
                </Field>
              </div>
              <p className={styles.note}>
                The schedule itself lives under <Link href="/admin/itinerary">Itinerary</Link> and
                the optional experiences under <Link href="/admin/activities">Activities</Link>.
                The sign-up window is shown on the Activities page; it will gate guest sign-ups
                once the guest-facing form is built.
              </p>
            </SectionCard>
          )}
          {section === "communications" && (
            <Placeholder
              title="Communications"
              needs="an email/SMS provider"
              detail="Sender identity, automatic notifications, reminders, and quiet hours need a real messaging provider wired up. Until then nothing can send, so these settings would be inert."
            />
          )}
          {section === "branding" && (
            <Placeholder
              title="Website & Branding"
              needs="a deliberate decision, not a backend"
              detail="Palette, typography, and navigation labels are currently set in code (styles/tokens.css and data/siteContent.ts) so the brand stays consistent. Making them editable here risks drift — worth discussing before building."
            />
          )}
          {section === "integrations" && (
            <Placeholder
              title="Integrations"
              needs="Gmail OAuth setup"
              detail="Gmail ingestion is specced but unbuilt, and it needs Google Cloud OAuth credentials plus the dedicated wedding email address. Calendar sync is not started."
            />
          )}
          {section === "team" && (
            <Placeholder
              title="Team & Access"
              needs="multi-user auth"
              detail="Admin access today is a single shared password with one session token — there are no per-user accounts, so roles and permissions have nothing to attach to."
            />
          )}
          {section === "privacy" && (
            <Placeholder
              title="Data & Privacy"
              needs="partly available today"
              detail="CSV exports already exist under Exports. Retention windows and guest-data deletion controls still need building."
            />
          )}
        </section>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
  onSave,
  dirty,
  saveState,
  errors,
}: {
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  dirty: boolean;
  saveState: SaveState;
  errors: string[];
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <h2 className={styles.cardTitle}>{title}</h2>
      </div>

      {children}

      {errors.length > 0 && (
        <ul className={styles.errorList}>
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <div className={styles.cardFoot}>
        <button
          type="button"
          className="btn-primary"
          onClick={onSave}
          disabled={!dirty || saveState === "saving"}
        >
          {saveState === "saving" ? "Saving…" : "Save Changes"}
        </button>
        {dirty && <span className={styles.footNote}>You have unsaved changes.</span>}
      </div>
    </div>
  );
}

function Placeholder({
  title,
  needs,
  detail,
}: {
  title: string;
  needs: string;
  detail: string;
}) {
  return (
    <div className={`${styles.card} ${styles.placeholder}`}>
      <h2 className={styles.cardTitle}>{title}</h2>
      <p className={styles.placeholderNeeds}>Needs {needs}.</p>
      <p className={styles.placeholderDetail}>{detail}</p>
    </div>
  );
}

function Field({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`${styles.field} ${wide ? styles.fieldWide : ""}`}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className={styles.toggle}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
