"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./venue-detail.module.css";

const STAGES = [
  "Researching",
  "Contacted",
  "Waiting",
  "In conversation",
  "Proposal received",
  "Top contender",
  "Site visit",
  "Selected",
  "Eliminated",
];

const COMM_TYPES = [
  "Initial inquiry",
  "Reply",
  "Follow-up",
  "Pricing received",
  "Availability confirmed",
  "Call scheduled",
  "New proposal",
  "Internal note",
];

export type VenueRecord = {
  id?: string;
  name: string;
  location: string;
  country: string;
  region: string;
  website: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  stage: string;
  availability: string;
  capacity: string;
  sleeping_capacity: string;
  has_pool: boolean;
  has_outdoor_space: boolean;
  exclusive_buyout: boolean;
  minimum_nights: string;
  estimated_total_price: string;
  currency: string;
  airport_distance: string;
  curfew: string;
  noise_restrictions: string;
  catering_model: string;
  notes: string;
  why_we_love_it: string;
  why_we_hesitate: string;
  questions_remaining: string;
  decision: string;
  elimination_reason: string;
  kelsey_comments: string;
  andrew_comments: string;
};

export type CommunicationEntry = {
  id: string;
  entry_type: string;
  summary: string;
  entry_date: string;
};

export type DocumentEntry = {
  id: string;
  display_name: string;
  file_type: string;
  storage_path: string;
  notes: string | null;
  uploaded_at: string;
};

const DOCUMENT_CATEGORIES = [
  "Brochure",
  "Pricing Guide",
  "Proposal",
  "Contract",
  "Menu",
  "Floor Plan",
  "Sample Itinerary",
  "Invoice",
  "Payment Schedule",
  "Photo",
  "Other",
];

function emptyVenue(): VenueRecord {
  return {
    name: "",
    location: "",
    country: "",
    region: "",
    website: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    stage: "Researching",
    availability: "",
    capacity: "",
    sleeping_capacity: "",
    has_pool: false,
    has_outdoor_space: false,
    exclusive_buyout: false,
    minimum_nights: "",
    estimated_total_price: "",
    currency: "EUR",
    airport_distance: "",
    curfew: "",
    noise_restrictions: "",
    catering_model: "",
    notes: "",
    why_we_love_it: "",
    why_we_hesitate: "",
    questions_remaining: "",
    decision: "",
    elimination_reason: "",
    kelsey_comments: "",
    andrew_comments: "",
  };
}

export default function VenueForm({
  initialVenue,
  initialCommunications,
  initialDocuments,
}: {
  initialVenue: VenueRecord | null;
  initialCommunications: CommunicationEntry[];
  initialDocuments: DocumentEntry[];
}) {
  const router = useRouter();
  const isNew = !initialVenue;
  const [venue, setVenue] = useState<VenueRecord>(initialVenue ?? emptyVenue());
  const [communications, setCommunications] = useState(initialCommunications);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [commType, setCommType] = useState(COMM_TYPES[0]);
  const [commSummary, setCommSummary] = useState("");
  const [addingComm, setAddingComm] = useState(false);
  const [documents, setDocuments] = useState(initialDocuments);
  const [uploadCategory, setUploadCategory] = useState(DOCUMENT_CATEGORIES[0]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  function update<K extends keyof VenueRecord>(key: K, value: VenueRecord[K]) {
    setVenue((v) => ({ ...v, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/admin/venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venue),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setSaveMessage(body.error ?? "Couldn't save. Try again.");
        return;
      }
      const { venue: saved } = await res.json();
      setSaveMessage("Saved.");
      if (isNew) {
        router.replace(`/admin/venues/${saved.id}`);
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
    if (!venue.id) return;
    if (!confirm(`Delete ${venue.name || "this venue"}? This can't be undone.`)) return;
    await fetch(`/api/admin/venues/${venue.id}`, { method: "DELETE" });
    router.push("/admin/venues");
  }

  async function handleAddCommunication() {
    if (!venue.id || !commSummary.trim()) return;
    setAddingComm(true);
    try {
      const res = await fetch(`/api/admin/venues/${venue.id}/communications`, {
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

  async function handleUpload() {
    if (!venue.id || !uploadFile) return;
    setUploading(true);
    setUploadMessage(null);
    try {
      const body = new FormData();
      body.append("file", uploadFile);
      body.append("category", uploadCategory);
      const res = await fetch(`/api/admin/venues/${venue.id}/documents`, {
        method: "POST",
        body,
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setUploadMessage(payload.error ?? "Upload failed. Try again.");
        return;
      }
      setDocuments((prev) => [payload.document, ...prev]);
      setUploadFile(null);
      setFileInputKey((k) => k + 1);
      setUploadMessage("Uploaded.");
    } catch {
      setUploadMessage("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleViewDocument(docId: string) {
    if (!venue.id) return;
    const res = await fetch(`/api/admin/venues/${venue.id}/documents/${docId}`);
    if (!res.ok) return;
    const { url } = await res.json();
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleDeleteDocument(doc: DocumentEntry) {
    if (!venue.id) return;
    if (!confirm(`Delete "${doc.display_name}"? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/venues/${venue.id}/documents/${doc.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    }
  }

  return (
    <div>
      <Link href="/admin/venues" className={styles.backLink}>
        &larr; All Venues
      </Link>

      <div className={styles.headerRow}>
        <input
          className={styles.nameInput}
          value={venue.name}
          placeholder="Venue name"
          onChange={(e) => update("name", e.target.value)}
        />
        <select
          className={styles.stageSelect}
          value={venue.stage}
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
            Delete Venue
          </button>
        )}
      </div>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Overview</p>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Location</label>
            <input
              className={styles.input}
              value={venue.location}
              onChange={(e) => update("location", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Region</label>
            <input
              className={styles.input}
              value={venue.region}
              onChange={(e) => update("region", e.target.value)}
              placeholder="e.g. Umbria"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Country</label>
            <input
              className={styles.input}
              value={venue.country}
              onChange={(e) => update("country", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Website</label>
            <input
              className={styles.input}
              value={venue.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Availability</label>
            <input
              className={styles.input}
              value={venue.availability}
              onChange={(e) => update("availability", e.target.value)}
              placeholder="e.g. open May 2027"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Airport Distance</label>
            <input
              className={styles.input}
              value={venue.airport_distance}
              onChange={(e) => update("airport_distance", e.target.value)}
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
              value={venue.contact_name}
              onChange={(e) => update("contact_name", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Contact Email</label>
            <input
              className={styles.input}
              value={venue.contact_email}
              onChange={(e) => update("contact_email", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Contact Phone</label>
            <input
              className={styles.input}
              value={venue.contact_phone}
              onChange={(e) => update("contact_phone", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Capacity &amp; Logistics</p>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Capacity</label>
            <input
              className={styles.input}
              type="number"
              value={venue.capacity}
              onChange={(e) => update("capacity", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Sleeping Capacity</label>
            <input
              className={styles.input}
              type="number"
              value={venue.sleeping_capacity}
              onChange={(e) => update("sleeping_capacity", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Minimum Nights</label>
            <input
              className={styles.input}
              type="number"
              value={venue.minimum_nights}
              onChange={(e) => update("minimum_nights", e.target.value)}
            />
          </div>
          <div className={styles.checkboxRow}>
            <input
              id="has_pool"
              type="checkbox"
              checked={venue.has_pool}
              onChange={(e) => update("has_pool", e.target.checked)}
            />
            <label htmlFor="has_pool">Pool</label>
          </div>
          <div className={styles.checkboxRow}>
            <input
              id="has_outdoor_space"
              type="checkbox"
              checked={venue.has_outdoor_space}
              onChange={(e) => update("has_outdoor_space", e.target.checked)}
            />
            <label htmlFor="has_outdoor_space">Outdoor Space</label>
          </div>
          <div className={styles.checkboxRow}>
            <input
              id="exclusive_buyout"
              type="checkbox"
              checked={venue.exclusive_buyout}
              onChange={(e) => update("exclusive_buyout", e.target.checked)}
            />
            <label htmlFor="exclusive_buyout">Exclusive Buyout</label>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Curfew</label>
            <input
              className={styles.input}
              value={venue.curfew}
              onChange={(e) => update("curfew", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Noise Restrictions</label>
            <input
              className={styles.input}
              value={venue.noise_restrictions}
              onChange={(e) => update("noise_restrictions", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Catering Model</label>
            <input
              className={styles.input}
              value={venue.catering_model}
              onChange={(e) => update("catering_model", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Pricing</p>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Estimated Total Price</label>
            <input
              className={styles.input}
              type="number"
              value={venue.estimated_total_price}
              onChange={(e) => update("estimated_total_price", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Currency</label>
            <input
              className={styles.input}
              value={venue.currency}
              onChange={(e) => update("currency", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Notes</p>
        <div className={styles.fieldGrid}>
          <div className={`${styles.field} ${styles.fieldWide}`}>
            <textarea
              className={styles.textarea}
              value={venue.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="General notes"
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Decision Notes</p>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Why We Love It</label>
            <textarea
              className={styles.textarea}
              value={venue.why_we_love_it}
              onChange={(e) => update("why_we_love_it", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Why We Hesitate</label>
            <textarea
              className={styles.textarea}
              value={venue.why_we_hesitate}
              onChange={(e) => update("why_we_hesitate", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Questions Remaining</label>
            <textarea
              className={styles.textarea}
              value={venue.questions_remaining}
              onChange={(e) => update("questions_remaining", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Kelsey&rsquo;s Comments</label>
            <textarea
              className={styles.textarea}
              value={venue.kelsey_comments}
              onChange={(e) => update("kelsey_comments", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Andrew&rsquo;s Comments</label>
            <textarea
              className={styles.textarea}
              value={venue.andrew_comments}
              onChange={(e) => update("andrew_comments", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Decision</label>
            <input
              className={styles.input}
              value={venue.decision}
              onChange={(e) => update("decision", e.target.value)}
            />
          </div>
          {venue.stage === "Eliminated" && (
            <div className={`${styles.field} ${styles.fieldWide}`}>
              <label className={styles.label}>Elimination Reason</label>
              <textarea
                className={styles.textarea}
                value={venue.elimination_reason}
                onChange={(e) => update("elimination_reason", e.target.value)}
              />
            </div>
          )}
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

      {!isNew && (
        <section className={styles.section}>
          <p className={styles.sectionTitle}>Documents</p>
          {documents.length === 0 ? (
            <p className={styles.timelineSummary}>No documents yet.</p>
          ) : (
            documents.map((d) => (
              <div className={styles.documentRow} key={d.id}>
                <div className={styles.documentInfo}>
                  <span className={styles.documentName}>{d.display_name}</span>
                  <span className={styles.documentMeta}>
                    {d.file_type} &middot; {new Date(d.uploaded_at).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.documentActions}>
                  <button type="button" onClick={() => handleViewDocument(d.id)}>
                    View
                  </button>
                  <button
                    type="button"
                    className={styles.documentDelete}
                    onClick={() => handleDeleteDocument(d)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
          <div className={styles.uploadRow}>
            <select
              className={styles.select}
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
            >
              {DOCUMENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              key={fileInputKey}
              className={styles.input}
              type="file"
              accept=".pdf,.docx,.xlsx,.csv,.jpg,.jpeg,.png,.webp"
              onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              className="btn-outline"
              onClick={handleUpload}
              disabled={uploading || !uploadFile}
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
            {uploadMessage && <span className={styles.uploadStatus}>{uploadMessage}</span>}
          </div>
        </section>
      )}
    </div>
  );
}
