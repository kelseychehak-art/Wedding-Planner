"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useConfirm } from "@/components/admin/useConfirm";
import styles from "./vendor-detail.module.css";

const CATEGORIES = [
  "Photographer",
  "Videographer",
  "Florist",
  "Caterer",
  "Music/DJ",
  "Band",
  "Planner",
  "Hair & Makeup",
  "Officiant",
  "Transport",
  "Rentals",
  "Cake",
  "Stationery",
  "Décor",
  "Other",
];

const STAGES = [
  "Researching",
  "Contacted",
  "Waiting",
  "In conversation",
  "Proposal received",
  "Top contender",
  "Booked",
  "Declined",
];

const COMM_TYPES = [
  "Initial inquiry",
  "Reply",
  "Follow-up",
  "Quote received",
  "Call scheduled",
  "Contract sent",
  "Deposit paid",
  "Internal note",
];

export type VendorRecord = {
  id?: string;
  name: string;
  category: string;
  stage: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  location: string;
  estimated_cost: string;
  deposit_amount: string;
  currency: string;
  payment_terms: string;
  deliverables: string;
  hours_coverage: string;
  cancellation_terms: string;
  next_action: string;
  notes: string;
  why_we_love_it: string;
  why_we_hesitate: string;
  questions_remaining: string;
  decision: string;
  /* Where the paperwork has got to. Drives the Status column on the list. */
  proposal_status: string;
  proposal_amount: string;
  proposal_received_on: string;
  contract_status: string;
  contract_sent_on: string;
  contract_signed_on: string;
};

const PROPOSAL_STATUSES = [
  { value: "none", label: "Not requested" },
  { value: "requested", label: "Requested" },
  { value: "received", label: "Received" },
  { value: "under_review", label: "Under review" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
];

const CONTRACT_STATUSES = [
  { value: "none", label: "None yet" },
  { value: "drafted", label: "Drafted" },
  { value: "sent", label: "Sent" },
  { value: "signed", label: "Signed" },
];

export type CommunicationEntry = {
  id: string;
  entry_type: string;
  summary: string;
  entry_date: string;
};

function emptyVendor(): VendorRecord {
  return {
    name: "",
    category: "Photographer",
    stage: "Researching",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    website: "",
    location: "",
    estimated_cost: "",
    deposit_amount: "",
    currency: "EUR",
    payment_terms: "",
    deliverables: "",
    hours_coverage: "",
    cancellation_terms: "",
    next_action: "",
    notes: "",
    why_we_love_it: "",
    why_we_hesitate: "",
    questions_remaining: "",
    decision: "",
    proposal_status: "none",
    proposal_amount: "",
    proposal_received_on: "",
    contract_status: "none",
    contract_sent_on: "",
    contract_signed_on: "",
  };
}

export default function VendorForm({
  initialVendor,
  initialCommunications,
}: {
  initialVendor: VendorRecord | null;
  initialCommunications: CommunicationEntry[];
}) {
  const { confirm, dialog } = useConfirm();
  const router = useRouter();
  const isNew = !initialVendor;
  const [vendor, setVendor] = useState<VendorRecord>(initialVendor ?? emptyVendor());
  const [communications, setCommunications] = useState(initialCommunications);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [commType, setCommType] = useState(COMM_TYPES[0]);
  const [commSummary, setCommSummary] = useState("");
  const [addingComm, setAddingComm] = useState(false);

  function update<K extends keyof VendorRecord>(key: K, value: VendorRecord[K]) {
    setVendor((v) => ({ ...v, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/admin/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendor),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setSaveMessage(body.error ?? "Couldn't save. Try again.");
        return;
      }
      const { vendor: saved } = await res.json();
      setSaveMessage("Saved.");
      if (isNew) {
        router.replace(`/admin/vendors/${saved.id}`);
      } else {
        router.refresh();
      }
    } catch {
      setSaveMessage("Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!vendor.id) return;
    if (!(await confirm({ title: `Delete ${vendor.name || "this vendor"}?`, body: "Quotes, contacts and communication history will be removed. This can't be undone." }))) return;
    await fetch(`/api/admin/vendors/${vendor.id}`, { method: "DELETE" });
    router.push("/admin/vendors");
  }

  async function handleAddCommunication() {
    if (!vendor.id || !commSummary.trim()) return;
    setAddingComm(true);
    try {
      const res = await fetch(`/api/admin/vendors/${vendor.id}/communications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry_type: commType, summary: commSummary }),
      });
      if (res.ok) {
        const { entry } = await res.json();
        setCommunications((prev) => [entry, ...prev]);
        setCommSummary("");
      }
    } finally {
      setAddingComm(false);
    }
  }

  return (
    <div>
      <Link href="/admin/vendors" className={styles.backLink}>
        &larr; All Vendors
      </Link>

      <div className={styles.headerRow}>
        <input
          className={styles.nameInput}
          value={vendor.name}
          placeholder="Vendor name"
          onChange={(e) => update("name", e.target.value)}
        />
        <select
          className={styles.stageSelect}
          value={vendor.stage}
          onChange={(e) => update("stage", e.target.value)}
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.actions}>
        <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        {saveMessage && <span className={styles.saveStatus}>{saveMessage}</span>}
        {!isNew && (
          <button type="button" className={styles.deleteButton} onClick={handleDelete}>
            Delete Vendor
          </button>
        )}
      </div>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Overview</p>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select
              className={styles.select}
              value={vendor.category}
              onChange={(e) => update("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Location</label>
            <input
              className={styles.input}
              value={vendor.location}
              onChange={(e) => update("location", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Website</label>
            <input
              className={styles.input}
              value={vendor.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Next Action</label>
            <input
              className={styles.input}
              value={vendor.next_action}
              onChange={(e) => update("next_action", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Contact</p>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Contact Name</label>
            <input
              className={styles.input}
              value={vendor.contact_name}
              onChange={(e) => update("contact_name", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Contact Email</label>
            <input
              className={styles.input}
              value={vendor.contact_email}
              onChange={(e) => update("contact_email", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Contact Phone</label>
            <input
              className={styles.input}
              value={vendor.contact_phone}
              onChange={(e) => update("contact_phone", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Pricing &amp; Terms</p>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Estimated Cost</label>
            <input
              className={styles.input}
              type="number"
              value={vendor.estimated_cost}
              onChange={(e) => update("estimated_cost", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Deposit</label>
            <input
              className={styles.input}
              type="number"
              value={vendor.deposit_amount}
              onChange={(e) => update("deposit_amount", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Currency</label>
            <input
              className={styles.input}
              value={vendor.currency}
              onChange={(e) => update("currency", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Hours of Coverage</label>
            <input
              className={styles.input}
              value={vendor.hours_coverage}
              onChange={(e) => update("hours_coverage", e.target.value)}
            />
          </div>
          <div className={`${styles.field} ${styles.fieldWide}`}>
            <label className={styles.label}>Payment Terms</label>
            <textarea
              className={styles.textarea}
              value={vendor.payment_terms}
              onChange={(e) => update("payment_terms", e.target.value)}
              placeholder="Deposit, installments, balance due…"
            />
          </div>
          <div className={`${styles.field} ${styles.fieldWide}`}>
            <label className={styles.label}>Deliverables</label>
            <textarea
              className={styles.textarea}
              value={vendor.deliverables}
              onChange={(e) => update("deliverables", e.target.value)}
            />
          </div>
          <div className={`${styles.field} ${styles.fieldWide}`}>
            <label className={styles.label}>Cancellation / Rescheduling Terms</label>
            <textarea
              className={styles.textarea}
              value={vendor.cancellation_terms}
              onChange={(e) => update("cancellation_terms", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Proposal &amp; Contract</p>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Proposal</label>
            <select
              className={styles.input}
              value={vendor.proposal_status}
              onChange={(e) => update("proposal_status", e.target.value)}
            >
              {PROPOSAL_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Quoted Amount</label>
            <input
              className={styles.input}
              type="number"
              value={vendor.proposal_amount}
              onChange={(e) => update("proposal_amount", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Proposal Received</label>
            <input
              className={styles.input}
              type="date"
              value={vendor.proposal_received_on}
              onChange={(e) => update("proposal_received_on", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Contract</label>
            <select
              className={styles.input}
              value={vendor.contract_status}
              onChange={(e) => update("contract_status", e.target.value)}
            >
              {CONTRACT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Contract Sent</label>
            <input
              className={styles.input}
              type="date"
              value={vendor.contract_sent_on}
              onChange={(e) => update("contract_sent_on", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Contract Signed</label>
            <input
              className={styles.input}
              type="date"
              value={vendor.contract_signed_on}
              onChange={(e) => update("contract_signed_on", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Notes &amp; Decision</p>
        <div className={styles.fieldGrid}>
          <div className={`${styles.field} ${styles.fieldWide}`}>
            <label className={styles.label}>General Notes</label>
            <textarea
              className={styles.textarea}
              value={vendor.notes}
              onChange={(e) => update("notes", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Why We Love It</label>
            <textarea
              className={styles.textarea}
              value={vendor.why_we_love_it}
              onChange={(e) => update("why_we_love_it", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Why We Hesitate</label>
            <textarea
              className={styles.textarea}
              value={vendor.why_we_hesitate}
              onChange={(e) => update("why_we_hesitate", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Questions Remaining</label>
            <textarea
              className={styles.textarea}
              value={vendor.questions_remaining}
              onChange={(e) => update("questions_remaining", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Decision</label>
            <input
              className={styles.input}
              value={vendor.decision}
              onChange={(e) => update("decision", e.target.value)}
            />
          </div>
        </div>
      </section>

      {!isNew && (
        <section className={styles.section}>
          <p className={styles.sectionTitle}>Communication Timeline</p>
          {communications.length === 0 ? (
            <p className={styles.timelineSummary}>No entries yet.</p>
          ) : (
            communications.map((c) => (
              <div className={styles.timelineEntry} key={c.id}>
                <span className={styles.timelineType}>{c.entry_type}</span>
                <span className={styles.timelineDate}>{c.entry_date}</span>
                {c.summary && <p className={styles.timelineSummary}>{c.summary}</p>}
              </div>
            ))
          )}
          <div className={styles.addEntryRow}>
            <select
              className={styles.select}
              value={commType}
              onChange={(e) => setCommType(e.target.value)}
            >
              {COMM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              className={styles.input}
              placeholder="What happened…"
              value={commSummary}
              onChange={(e) => setCommSummary(e.target.value)}
            />
            <button
              type="button"
              className="btn-outline"
              onClick={handleAddCommunication}
              disabled={addingComm || !commSummary.trim()}
            >
              {addingComm ? "Adding…" : "Add"}
            </button>
          </div>
        </section>
      )}
      {dialog}
    </div>
  );
}
