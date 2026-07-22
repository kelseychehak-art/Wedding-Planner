"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import MetricStrip, { type Metric } from "@/components/admin/MetricStrip";
import { useConfirm } from "@/components/admin/useConfirm";
import {
  IconBuilding,
  IconBed,
  IconCheckCircle,
  IconAlert,
  IconPlus,
  IconLink,
  IconMail,
  IconPhone,
  IconPalette,
} from "@/components/admin/icons";
import styles from "./venues.module.css";

/*
 * The chosen venue's home.
 *
 * Two rules run through this page, both from the AI spec addendum:
 *   Nothing is shown without saying where it came from.
 *   Nothing arrives confirmed — a fact is a suggestion until a human agrees.
 * So every fact row carries its source, and unreviewed facts are visibly
 * unreviewed rather than sitting there looking like settled truth.
 */

export type VenueFact = {
  id: string;
  section: string;
  field_key: string;
  label: string;
  value_text: string | null;
  value_number: number | null;
  unit: string | null;
  source_type: string;
  source_url: string | null;
  source_locator: string | null;
  source_quote: string | null;
  status: "suggested" | "needs_review" | "confirmed" | "corrected" | "conflicting";
  extracted_by: string;
  notes: string | null;
};

export type VenueImage = {
  id: string;
  storage_path: string | null;
  source_url: string | null;
  caption: string | null;
  credit: string | null;
  width: number | null;
  height: number | null;
  permission_status: "not_asked" | "asked" | "granted" | "press_kit" | "declined" | "own_photo";
  permission_note: string | null;
  use_web: boolean;
  use_print: boolean;
};

export type VenueQuestion = {
  id: string;
  question: string;
  answer: string | null;
  asked_on: string | null;
  answered_on: string | null;
  priority: "low" | "normal" | "high";
  source_url: string | null;
};

export type VenueDocument = {
  id: string;
  display_name: string;
  file_type: string | null;
  uploaded_at: string;
};

export type OtherVenue = {
  id: string;
  name: string;
  location: string | null;
  stage: string;
  verdict: string | null;
  budget_fit: string | null;
};

export type Dossier = {
  venue: Record<string, unknown> | null;
  facts?: VenueFact[];
  fact_summary?: { total: number; confirmed: number; unreviewed: number; conflicting: number };
  images?: VenueImage[];
  image_summary?: { total: number; cleared: number; pending: number; print_ready: number };
  questions?: VenueQuestion[];
  documents?: VenueDocument[];
  other_venues?: OtherVenue[];
};

const STATUS_LABEL: Record<VenueFact["status"], string> = {
  suggested: "Suggested",
  needs_review: "Needs review",
  confirmed: "Confirmed",
  corrected: "Corrected",
  conflicting: "Conflicting",
};

const STATUS_CLASS: Record<VenueFact["status"], string> = {
  suggested: styles.factSuggested,
  needs_review: styles.factSuggested,
  confirmed: styles.factConfirmed,
  corrected: styles.factConfirmed,
  conflicting: styles.factConflicting,
};

const SOURCE_LABEL: Record<string, string> = {
  website: "Their website",
  brochure: "Brochure",
  contract: "Contract",
  quote: "Quote",
  email: "Email",
  site_visit: "Site visit",
  manual: "Entered by hand",
};

const PERMISSION_LABEL: Record<VenueImage["permission_status"], string> = {
  not_asked: "Not asked",
  asked: "Asked",
  granted: "Granted",
  press_kit: "Press kit",
  declined: "Declined",
  own_photo: "Our own photo",
};

function isCleared(i: VenueImage) {
  return ["granted", "press_kit", "own_photo"].includes(i.permission_status);
}

export default function VenueHome({
  dossier,
  candidates,
}: {
  dossier: Dossier | null;
  candidates: OtherVenue[];
}) {
  const router = useRouter();
  const { confirm, dialog } = useConfirm();
  const [busy, setBusy] = useState(false);
  const [showOthers, setShowOthers] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");

  const venue = dossier?.venue as Record<string, string | number | boolean | null> | null;
  const images = dossier?.images ?? [];
  const questions = dossier?.questions ?? [];
  const documents = dossier?.documents ?? [];
  const others = dossier?.other_venues ?? [];
  const factSummary = dossier?.fact_summary;
  const imageSummary = dossier?.image_summary;

  const sections = useMemo(() => {
    const map = new Map<string, VenueFact[]>();
    for (const f of dossier?.facts ?? []) {
      if (!map.has(f.section)) map.set(f.section, []);
      map.get(f.section)!.push(f);
    }
    return [...map.entries()];
  }, [dossier]);

  const openQuestions = questions.filter((q) => !q.answered_on);

  async function post(body: unknown) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/venues/dossier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) router.refresh();
      return res.ok;
    } finally {
      setBusy(false);
    }
  }

  async function setFactStatus(f: VenueFact, status: VenueFact["status"]) {
    await post({ entity: "fact", item: { id: f.id, status } });
  }

  async function addQuestion() {
    if (!newQuestion.trim() || !venue) return;
    if (await post({ entity: "question", item: { venue_id: venue.id, question: newQuestion } })) {
      setNewQuestion("");
    }
  }

  async function answerQuestion(q: VenueQuestion) {
    await post({
      entity: "question",
      item: { id: q.id, answered_on: q.answered_on ? "" : new Date().toISOString().slice(0, 10) },
    });
  }

  async function removeQuestion(q: VenueQuestion) {
    if (!(await confirm({ title: "Delete this question?", body: q.question }))) return;
    const res = await fetch(`/api/admin/venues/dossier?entity=question&id=${q.id}`, {
      method: "DELETE",
    });
    if (res.ok) router.refresh();
  }

  async function setImagePermission(i: VenueImage, permission_status: string) {
    await post({ entity: "image", item: { id: i.id, permission_status } });
  }

  /* ---- Nothing chosen yet ---- */
  if (!venue) {
    return (
      <div>
        <PageHeader
          title="Venue"
          subtitle="Once you pick one, this becomes its home — every detail, and where each came from."
        />
        <p className={styles.empty}>
          No venue chosen yet. Pick the one you&rsquo;re going with and everything else moves out
          of the way.
        </p>
        <ul className={styles.candidateList}>
          {candidates.map((c) => (
            <li key={c.id} className={styles.candidateRow}>
              <div>
                <Link href={`/admin/venues/${c.id}`} className={styles.candidateName}>
                  {c.name}
                </Link>
                <div className={styles.sub}>
                  {[c.location, c.stage, c.verdict, c.budget_fit].filter(Boolean).join(" · ")}
                </div>
              </div>
              <button
                type="button"
                className="btn-outline"
                disabled={busy}
                onClick={() => post({ chooseVenueId: c.id })}
              >
                This is the one
              </button>
            </li>
          ))}
        </ul>
        {dialog}
      </div>
    );
  }

  const metrics: Metric[] = [
    {
      key: "sleeps",
      icon: <IconBed size={22} />,
      value: String(venue.sleeping_capacity ?? "—"),
      label: "Sleeps On Site",
      sub: venue.minimum_nights ? `${venue.minimum_nights}-night minimum` : "Minimum not set",
    },
    {
      key: "facts",
      icon: <IconCheckCircle size={22} />,
      value: `${factSummary?.confirmed ?? 0}/${factSummary?.total ?? 0}`,
      label: "Facts Confirmed",
      sub: factSummary?.unreviewed ? `${factSummary.unreviewed} still to check` : "All reviewed",
      tone: factSummary?.unreviewed ? "warn" : "good",
    },
    {
      key: "questions",
      icon: <IconAlert size={22} />,
      value: String(openQuestions.length),
      label: "Open Questions",
      sub: openQuestions.some((q) => q.priority === "high")
        ? `${openQuestions.filter((q) => q.priority === "high").length} high priority`
        : "Nothing pressing",
      tone: openQuestions.some((q) => q.priority === "high") ? "bad" : "default",
    },
    {
      key: "images",
      icon: <IconPalette size={22} />,
      value: `${imageSummary?.cleared ?? 0}/${imageSummary?.total ?? 0}`,
      label: "Images Cleared",
      sub: imageSummary?.print_ready
        ? `${imageSummary.print_ready} print-ready`
        : "None cleared for print",
      tone: imageSummary?.cleared ? "good" : "default",
    },
    {
      key: "docs",
      icon: <IconBuilding size={22} />,
      value: String(documents.length),
      label: "Documents",
      sub: documents.length ? "Brochures & contracts" : "Nothing uploaded yet",
    },
  ];

  const website = venue.website ? String(venue.website) : null;
  const websiteHref = website?.startsWith("http") ? website : `https://${website}`;

  return (
    <div>
      <PageHeader
        title={String(venue.name)}
        subtitle={[venue.location, venue.region, venue.country].filter(Boolean).join(", ")}
        action={
          <div className={styles.headerActions}>
            <Link href={`/admin/venues/${venue.id}`} className="btn-outline">
              Edit record
            </Link>
            {website && (
              <a
                href={websiteHref}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-primary"
              >
                <IconLink size={14} className={styles.btnIcon} />
                Their site
              </a>
            )}
          </div>
        }
      />

      <p className={styles.chosenNote}>
        <strong>This is your venue.</strong>
        {venue.chosen_on ? ` Chosen ${String(venue.chosen_on)}.` : ""} Facts below carry the source
        they came from — anything marked <em>suggested</em> or <em>needs review</em> hasn&rsquo;t
        been checked by a person yet.
      </p>

      <MetricStrip metrics={metrics} />

      <div className={styles.layout}>
        <div className={styles.mainCol}>
          {/* ---- Facts ---- */}
          {sections.length === 0 ? (
            <p className={styles.empty}>
              No details recorded yet. Upload a brochure or contract and they can be pulled in
              here.
            </p>
          ) : (
            sections.map(([section, list]) => (
              <section key={section} className={styles.card}>
                <h2 className={styles.cardTitle}>{section}</h2>
                <ul className={styles.factList}>
                  {list.map((f) => (
                    <li key={f.id} className={styles.factRow}>
                      <div className={styles.factMain}>
                        <span className={styles.factLabel}>{f.label}</span>
                        <span className={styles.factValue}>{f.value_text ?? "—"}</span>

                        <span className={styles.factSource}>
                          {SOURCE_LABEL[f.source_type] ?? f.source_type}
                          {f.source_locator ? ` · ${f.source_locator}` : ""}
                          {f.source_url && (
                            <>
                              {" · "}
                              <a href={f.source_url} target="_blank" rel="noreferrer noopener">
                                source
                              </a>
                            </>
                          )}
                        </span>

                        {/* The words it was read from, so a bad reading is obvious. */}
                        {f.source_quote && (
                          <blockquote className={styles.factQuote}>{f.source_quote}</blockquote>
                        )}
                        {f.notes && <span className={styles.factNotes}>{f.notes}</span>}
                      </div>

                      <div className={styles.factSide}>
                        <span className={`${styles.factStatus} ${STATUS_CLASS[f.status]}`}>
                          {STATUS_LABEL[f.status]}
                        </span>
                        {f.status !== "confirmed" && f.status !== "corrected" && (
                          <button
                            type="button"
                            className={styles.linkBtn}
                            disabled={busy}
                            onClick={() => setFactStatus(f, "confirmed")}
                          >
                            Confirm
                          </button>
                        )}
                        {(f.status === "confirmed" || f.status === "corrected") && (
                          <button
                            type="button"
                            className={styles.linkBtn}
                            disabled={busy}
                            onClick={() => setFactStatus(f, "needs_review")}
                          >
                            Unconfirm
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}

          {/* ---- Images ---- */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Image library</h2>
            <p className={styles.cardIntro}>
              Venue photographs belong to the venue or its photographer. Ask Marco for their{" "}
              <strong>press kit</strong> — it settles permission and gets print-resolution files in
              one email. Website images are 72dpi and will look muddy on stationery.
            </p>

            {images.length === 0 ? (
              <p className={styles.emptyInline}>
                Nothing here yet. Once you have the press kit, images land here with their source
                and permission recorded.
              </p>
            ) : (
              <ul className={styles.imageGrid}>
                {images.map((i) => (
                  <li key={i.id} className={styles.imageCard}>
                    <div className={styles.imageMeta}>
                      <span className={styles.imageCaption}>{i.caption ?? "Untitled"}</span>
                      {i.credit && <span className={styles.sub}>© {i.credit}</span>}
                      {i.width && i.height && (
                        <span className={styles.sub}>
                          {i.width}×{i.height}
                        </span>
                      )}
                    </div>
                    <span
                      className={`${styles.permPill} ${
                        isCleared(i) ? styles.permCleared : styles.permPending
                      }`}
                    >
                      {PERMISSION_LABEL[i.permission_status]}
                    </span>
                    <select
                      className={styles.select}
                      value={i.permission_status}
                      onChange={(e) => setImagePermission(i, e.target.value)}
                      aria-label="Permission status"
                    >
                      {Object.entries(PERMISSION_LABEL).map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className={styles.sideCol}>
          {/* ---- Questions ---- */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Ask the venue</h2>
            <div className={styles.questionAdd}>
              <input
                className={styles.input}
                value={newQuestion}
                placeholder="Something else to ask…"
                onChange={(e) => setNewQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addQuestion();
                }}
              />
              <button
                type="button"
                className={styles.linkBtn}
                onClick={addQuestion}
                disabled={busy || !newQuestion.trim()}
              >
                <IconPlus size={13} /> Add
              </button>
            </div>

            <ul className={styles.questionList}>
              {questions.map((q) => (
                <li
                  key={q.id}
                  className={`${styles.questionRow} ${q.answered_on ? styles.questionDone : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(q.answered_on)}
                    onChange={() => answerQuestion(q)}
                    aria-label={q.answered_on ? "Mark unanswered" : "Mark answered"}
                  />
                  <span className={styles.questionText}>
                    {q.priority === "high" && !q.answered_on && (
                      <span className={styles.priorityDot} aria-label="High priority" />
                    )}
                    {q.question}
                  </span>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => removeQuestion(q)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* ---- Contact ---- */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Contact</h2>
            <ul className={styles.contactList}>
              {venue.contact_name && <li>{String(venue.contact_name)}</li>}
              {venue.contact_email && (
                <li>
                  <IconMail size={13} />{" "}
                  <a href={`mailto:${venue.contact_email}`}>{String(venue.contact_email)}</a>
                </li>
              )}
              {venue.contact_phone && (
                <li>
                  <IconPhone size={13} /> {String(venue.contact_phone)}
                </li>
              )}
              {!venue.contact_name && !venue.contact_email && !venue.contact_phone && (
                <li className={styles.sub}>No contact details recorded.</li>
              )}
            </ul>
          </section>

          {/* ---- Documents ---- */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Documents</h2>
            {documents.length === 0 ? (
              <p className={styles.emptyInline}>
                No brochures or contracts uploaded yet. Add them on the{" "}
                <Link href={`/admin/venues/${venue.id}`}>venue record</Link> and their details can
                be pulled in here.
              </p>
            ) : (
              <ul className={styles.docList}>
                {documents.map((d) => (
                  <li key={d.id}>
                    <Link href={`/admin/venues/${venue.id}`}>{d.display_name}</Link>
                    <span className={styles.sub}>{d.file_type ?? "file"}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>

      {/* ---- The ones that didn't win ---- */}
      {others.length > 0 && (
        <section className={styles.others}>
          <button
            type="button"
            className={styles.othersToggle}
            onClick={() => setShowOthers((v) => !v)}
            aria-expanded={showOthers}
          >
            {showOthers ? "Hide" : "Show"} the {others.length} venues also considered
          </button>
          {showOthers && (
            <>
              <p className={styles.othersNote}>
                Kept in case anything changes — a date can go, or a fee can land badly.
              </p>
              <ul className={styles.othersList}>
                {others.map((o) => (
                  <li key={o.id}>
                    <Link href={`/admin/venues/${o.id}`}>{o.name}</Link>
                    <span className={styles.sub}>
                      {[o.location, o.stage, o.verdict].filter(Boolean).join(" · ")}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      {dialog}
    </div>
  );
}
