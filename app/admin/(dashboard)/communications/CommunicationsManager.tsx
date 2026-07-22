"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import MetricStrip, { type Metric } from "@/components/admin/MetricStrip";
import Pagination from "@/components/admin/Pagination";
import { Toolbar, ToolbarSearch, FilterSelect } from "@/components/admin/Toolbar";
import { useConfirm } from "@/components/admin/useConfirm";
import {
  IconMail,
  IconCalendar,
  IconPencil,
  IconCheckCircle,
  IconAlert,
  IconPlus,
  IconUsers,
} from "@/components/admin/icons";
import type { Party } from "../guests/GuestsManager";
import {
  CHANNEL_LABEL,
  describeRule,
  emptyRule,
  resolveRecipients,
  ruleLookups,
  type Channel,
  type RecipientRule,
} from "./recipients";
import MessageComposer from "./MessageComposer";
import GroupForm from "./GroupForm";
import styles from "./communications.module.css";

/*
 * Admin Communications — docs/admin/communications.md, adapted to this repo.
 *
 * The brief assumes an email/SMS provider is wired up. None is. So this page
 * does everything up to the moment of sending — writes the message, resolves
 * exactly who it goes to from live guest data, schedules it — and then stops
 * and says so. Nothing here claims a message was delivered, and there is no
 * open-rate column, because an open rate we cannot measure is a made-up number.
 *
 * "Mark as sent" exists for the real workflow in the meantime: send it from
 * Gmail, then log it here so the history is complete.
 */

export type Message = {
  id: string;
  name: string | null;
  channel: Channel;
  subject: string | null;
  preview_text: string | null;
  body_text: string | null;
  cta_label: string | null;
  cta_url: string | null;
  status: "draft" | "scheduled" | "sent" | "cancelled";
  scheduled_at: string | null;
  sent_at: string | null;
  sent_note: string | null;
  recipient_definition: RecipientRule;
  resolved_recipient_count: number | null;
  resolved_guest_count: number | null;
  template_id: string | null;
  notes: string | null;
  created_at: string;
};

export type Template = {
  id: string;
  name: string;
  category: string | null;
  channel: Channel;
  subject: string | null;
  preview_text: string | null;
  body_text: string | null;
  cta_label: string | null;
  cta_url: string | null;
  default_recipient_definition: RecipientRule | null;
  is_system: boolean;
};

export type RecipientGroup = {
  id: string;
  name: string;
  group_type: "static" | "dynamic";
  rule_definition: RecipientRule;
  description: string | null;
};

type TabKey = "messages" | "scheduled" | "templates" | "groups" | "history";

const TABS: { key: TabKey; label: string }[] = [
  { key: "messages", label: "Messages" },
  { key: "scheduled", label: "Scheduled" },
  { key: "templates", label: "Templates" },
  { key: "groups", label: "Groups" },
  { key: "history", label: "History" },
];

const STATUS_LABEL: Record<Message["status"], string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  sent: "Sent",
  cancelled: "Cancelled",
};

const STATUS_CLASS: Record<Message["status"], string> = {
  draft: styles.pillDraft,
  scheduled: styles.pillScheduled,
  sent: styles.pillSent,
  cancelled: styles.pillCancelled,
};

export function fmtWhen(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} · ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

function fmtDay(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function messageTitle(m: Message): string {
  return m.subject?.trim() || m.name?.trim() || "Untitled message";
}

export default function CommunicationsManager({
  initialMessages,
  initialTemplates,
  initialGroups,
  parties,
  initialTab,
}: {
  initialMessages: Message[];
  initialTemplates: Template[];
  initialGroups: RecipientGroup[];
  parties: Party[];
  initialTab?: string;
}) {
  const router = useRouter();
  const { confirm, dialog } = useConfirm();

  const [messages, setMessages] = useState(initialMessages);
  const [templates] = useState(initialTemplates);
  const [groups, setGroups] = useState(initialGroups);

  const [tab, setTab] = useState<TabKey>(
    TABS.some((t) => t.key === initialTab) ? (initialTab as TabKey) : "messages"
  );
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [composing, setComposing] = useState<Message | "new" | null>(null);
  const [composerSeed, setComposerSeed] = useState<Template | null>(null);
  const [editingGroup, setEditingGroup] = useState<RecipientGroup | "new" | null>(null);

  const lookups = useMemo(() => ruleLookups(parties), [parties]);

  /* How many households can actually be contacted at all, on any channel. */
  const contactable = useMemo(() => {
    const withGuests = parties.filter((p) => p.guests.length > 0);
    const reachable = withGuests.filter((p) => p.email?.trim() || p.phone?.trim());
    return { total: withGuests.length, reachable: reachable.length };
  }, [parties]);

  const metrics: Metric[] = useMemo(() => {
    const drafts = messages.filter((m) => m.status === "draft");
    const scheduled = messages
      .filter((m) => m.status === "scheduled")
      .sort((a, b) => (a.scheduled_at ?? "").localeCompare(b.scheduled_at ?? ""));
    const sent = messages.filter((m) => m.status === "sent");
    const noContact = contactable.total - contactable.reachable;

    return [
      {
        key: "sent",
        icon: <IconMail size={22} />,
        value: String(sent.length),
        label: "Messages Sent",
        sub: sent.length ? "Logged by hand" : "Nothing sent yet",
      },
      {
        key: "scheduled",
        icon: <IconCalendar size={22} />,
        value: String(scheduled.length),
        label: "Scheduled",
        sub: scheduled.length ? `Next ${fmtDay(scheduled[0].scheduled_at)}` : "Nothing queued",
        tone: scheduled.length ? "info" : "default",
      },
      {
        key: "drafts",
        icon: <IconPencil size={22} />,
        value: String(drafts.length),
        label: "Drafts",
        sub: "In progress",
      },
      {
        key: "reachable",
        icon: <IconCheckCircle size={22} />,
        value: String(contactable.reachable),
        label: "Reachable",
        sub: `of ${contactable.total} households`,
        tone: contactable.reachable > 0 ? "good" : "default",
      },
      {
        key: "nocontact",
        icon: <IconAlert size={22} />,
        value: String(noContact),
        label: "No Contact Details",
        sub: noContact > 0 ? "Add an email or phone" : "All households covered",
        tone: noContact > 0 ? "bad" : "good",
      },
    ];
  }, [messages, contactable]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    /* Messages is everything current; Scheduled is the queue; History is the
       closed record — sent or abandoned. */
    const scope =
      tab === "scheduled"
        ? messages.filter((m) => m.status === "scheduled")
        : tab === "history"
          ? messages.filter((m) => m.status === "sent" || m.status === "cancelled")
          : messages;

    return scope.filter((m) => {
      if (channelFilter && m.channel !== channelFilter) return false;
      if (statusFilter && m.status !== statusFilter) return false;
      if (q && !`${messageTitle(m)} ${m.preview_text ?? ""}`.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [messages, tab, search, channelFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const clampedPage = Math.min(page, pageCount);
  const visible = filtered.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);

  function changeTab(next: TabKey) {
    setTab(next);
    setPage(1);
    router.replace(`/admin/communications${next === "messages" ? "" : `?tab=${next}`}`, {
      scroll: false,
    });
  }

  async function removeMessage(m: Message) {
    const ok = await confirm({
      title: `Delete “${messageTitle(m)}”?`,
      body:
        m.status === "sent"
          ? "It will disappear from History too, so there'll be no record this went out."
          : "The draft and its recipient rule go with it.",
    });
    if (!ok) return;
    const res = await fetch(`/api/admin/communications?entity=message&id=${m.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMessages((prev) => prev.filter((x) => x.id !== m.id));
      router.refresh();
    }
  }

  async function removeGroup(g: RecipientGroup) {
    const ok = await confirm({
      title: `Delete the “${g.name}” group?`,
      body: "Messages already using it keep their own copy of the rule.",
    });
    if (!ok) return;
    const res = await fetch(`/api/admin/communications?entity=group&id=${g.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setGroups((prev) => prev.filter((x) => x.id !== g.id));
      router.refresh();
    }
  }

  function openComposer(m: Message | "new", seed?: Template) {
    setComposerSeed(seed ?? null);
    setComposing(m);
  }

  const showToolbar = tab === "messages" || tab === "scheduled" || tab === "history";

  return (
    <div>
      <PageHeader
        title="Communications"
        subtitle="Write, schedule, and keep a record of everything you send your guests."
        action={
          <button type="button" className="btn-primary" onClick={() => openComposer("new")}>
            <IconPlus size={15} className={styles.btnIcon} />
            New Message
          </button>
        }
      />

      <MetricStrip metrics={metrics} />

      {/*
        Stated once, plainly, at the top — not buried in a footnote. Everything
        below saves and schedules; nothing below sends.
      */}
      <p className={styles.notice}>
        <strong>No email or SMS provider is connected yet.</strong> Messages are written,
        scheduled and kept here, but nothing leaves this page. Send from your own inbox, then
        mark the message sent so the record stays complete.
      </p>

      <div className={styles.tabs} role="tablist" aria-label="Communications views">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={`${styles.tab} ${tab === t.key ? styles.tabActive : ""}`}
            onClick={() => changeTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {showToolbar && (
        <Toolbar>
          <ToolbarSearch value={search} onChange={setSearch} placeholder="Search messages…" />
          <FilterSelect
            label="Channel"
            value={channelFilter}
            onChange={setChannelFilter}
            options={[
              { value: "", label: "All" },
              { value: "email", label: "Email" },
              { value: "sms", label: "SMS" },
              { value: "both", label: "Email + SMS" },
              { value: "announcement", label: "Announcement" },
            ]}
          />
          {tab === "messages" && (
            <FilterSelect
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "", label: "All" },
                { value: "draft", label: "Draft" },
                { value: "scheduled", label: "Scheduled" },
                { value: "sent", label: "Sent" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />
          )}
        </Toolbar>
      )}

      {showToolbar && (
        <>
          {filtered.length === 0 ? (
            <p className={styles.empty}>
              {messages.length === 0
                ? "Nothing written yet. Start from a template, or write a message from scratch — either way it saves as a draft until you say otherwise."
                : "No messages match these filters."}
            </p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Channel</th>
                    <th>Recipients</th>
                    <th>Status</th>
                    <th>Sent / Scheduled</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {visible.map((m) => {
                    const rule = m.recipient_definition ?? emptyRule();
                    /* Sent messages keep the count from the day they went out;
                       anything still open resolves against today's guest list. */
                    const live = resolveRecipients(parties, rule, m.channel);
                    const households =
                      m.status === "sent" && m.resolved_recipient_count != null
                        ? m.resolved_recipient_count
                        : live.reachable.length;
                    const guests =
                      m.status === "sent" && m.resolved_guest_count != null
                        ? m.resolved_guest_count
                        : live.guestCount;

                    return (
                      <tr key={m.id}>
                        <td>
                          <button
                            type="button"
                            className={styles.subject}
                            onClick={() => openComposer(m)}
                          >
                            {messageTitle(m)}
                          </button>
                          {m.preview_text && <div className={styles.sub}>{m.preview_text}</div>}
                        </td>
                        <td>{CHANNEL_LABEL[m.channel]}</td>
                        <td>
                          <div className={styles.recipients}>
                            {households} household{households === 1 ? "" : "s"}
                          </div>
                          <div className={styles.sub}>
                            {guests} guest{guests === 1 ? "" : "s"}
                            {m.status !== "sent" && live.unreachable.length > 0 && (
                              <span className={styles.warnInline}>
                                {" "}
                                · {live.unreachable.length} unreachable
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`${styles.pill} ${STATUS_CLASS[m.status]}`}>
                            {STATUS_LABEL[m.status]}
                          </span>
                        </td>
                        <td>
                          {m.status === "sent" ? fmtWhen(m.sent_at) : fmtWhen(m.scheduled_at)}
                          {m.status === "sent" && m.sent_note && (
                            <div className={styles.sub}>via {m.sent_note}</div>
                          )}
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <button type="button" onClick={() => openComposer(m)}>
                              Edit
                            </button>
                            <button
                              type="button"
                              className={styles.deleteBtn}
                              onClick={() => removeMessage(m)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {filtered.length > 0 && (
            <Pagination
              total={filtered.length}
              page={clampedPage}
              pageSize={pageSize}
              onPage={setPage}
              onPageSize={setPageSize}
              noun="messages"
            />
          )}
        </>
      )}

      {tab === "templates" && (
        <div className={styles.templateGrid}>
          {templates.map((t) => (
            <article key={t.id} className={styles.templateCard}>
              <header className={styles.templateHead}>
                <h3 className={styles.templateName}>{t.name}</h3>
                {t.category && <span className={styles.templateTag}>{t.category}</span>}
              </header>
              {t.subject && <p className={styles.templateSubject}>{t.subject}</p>}
              <p className={styles.templateBody}>
                {(t.body_text ?? "").split("\n").filter(Boolean).slice(1, 2).join(" ") ||
                  "Blank — write your own."}
              </p>
              <footer className={styles.templateFoot}>
                <span className={styles.templateMeta}>
                  {CHANNEL_LABEL[t.channel]}
                  {t.default_recipient_definition
                    ? ` · ${describeRule(t.default_recipient_definition, lookups)}`
                    : ""}
                </span>
                <button
                  type="button"
                  className={styles.templateUse}
                  onClick={() => openComposer("new", t)}
                >
                  Use this
                </button>
              </footer>
            </article>
          ))}
        </div>
      )}

      {tab === "groups" && (
        <>
          <div className={styles.groupsHead}>
            <p className={styles.groupsIntro}>
              A saved rule, so you don&rsquo;t rebuild &ldquo;families with children who
              haven&rsquo;t sent travel yet&rdquo; every time. Groups resolve fresh whenever
              they&rsquo;re used, so they stay right as the guest list changes.
            </p>
            <button
              type="button"
              className="btn-outline"
              onClick={() => setEditingGroup("new")}
            >
              <IconPlus size={15} className={styles.btnIcon} />
              New Group
            </button>
          </div>

          {groups.length === 0 ? (
            <p className={styles.empty}>No saved groups yet.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Group</th>
                    <th>Rule</th>
                    <th>Resolves to</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {groups.map((g) => {
                    const r = resolveRecipients(parties, g.rule_definition, "email");
                    return (
                      <tr key={g.id}>
                        <td>
                          <button
                            type="button"
                            className={styles.subject}
                            onClick={() => setEditingGroup(g)}
                          >
                            {g.name}
                          </button>
                          {g.description && <div className={styles.sub}>{g.description}</div>}
                        </td>
                        <td className={styles.ruleCell}>
                          {describeRule(g.rule_definition, lookups)}
                        </td>
                        <td>
                          <div className={styles.recipients}>
                            <IconUsers size={13} /> {r.matched.length} household
                            {r.matched.length === 1 ? "" : "s"}
                          </div>
                          <div className={styles.sub}>{r.guestCount} guests reachable</div>
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <button type="button" onClick={() => setEditingGroup(g)}>
                              Edit
                            </button>
                            <button
                              type="button"
                              className={styles.deleteBtn}
                              onClick={() => removeGroup(g)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {composing && (
        <MessageComposer
          message={composing === "new" ? null : composing}
          seed={composerSeed}
          parties={parties}
          groups={groups}
          lookups={lookups}
          onCancel={() => {
            setComposing(null);
            setComposerSeed(null);
          }}
          onSaved={(saved) => {
            setMessages((prev) => {
              const exists = prev.some((m) => m.id === saved.id);
              return exists ? prev.map((m) => (m.id === saved.id ? saved : m)) : [saved, ...prev];
            });
            setComposing(null);
            setComposerSeed(null);
            router.refresh();
          }}
        />
      )}

      {editingGroup && (
        <GroupForm
          group={editingGroup === "new" ? null : editingGroup}
          parties={parties}
          lookups={lookups}
          onCancel={() => setEditingGroup(null)}
          onSaved={(saved) => {
            setGroups((prev) => {
              const exists = prev.some((g) => g.id === saved.id);
              return exists ? prev.map((g) => (g.id === saved.id ? saved : g)) : [...prev, saved];
            });
            setEditingGroup(null);
            router.refresh();
          }}
        />
      )}

      {dialog}
    </div>
  );
}
