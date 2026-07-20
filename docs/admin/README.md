# Admin back-office specs — index

**Status: captured, not yet built.** This folder holds design/implementation briefs for the
private wedding-planning **admin** back-office (`/admin/*`). They were provided as reference for a
future build — nothing here has been implemented yet. `CLAUDE.md` still scopes the current mockup
rebuild to the **guest-facing** site; these admin briefs are captured here so they're durable and
ready when that work is greenlit.

Each spec is the **verbatim source brief** (converted from the original `.docx`, code blocks
preserved) with a short **header block** prepended that records status, which admin route it maps
to, a **repo-reconciliation note**, and a **transcription of the approved mockup** (the mockup PNGs
themselves were shared inline and are **not** committed — see open item 3).

## The five specs

| Spec | Mockup(s) | Maps to admin surface | Build state today |
|---|---|---|---|
| [`guest-list.md`](./guest-list.md) — **foundation + Dashboard + Guest List** | Guest List ✓, Guest Dashboard ✓ | `app/admin/(dashboard)/` (Dashboard) + `guests/` | Both exist; brief is a richer redesign. **Its §1–10 define the shared admin shell/design-system every other spec reuses.** |
| [`travel.md`](./travel.md) | Travel ✓ | `/admin/travel` | **Net-new page.** Only `POST /api/admin/travel` (`admin_upsert_travel_info`) exists — no UI, not in nav. |
| [`itinerary.md`](./itinerary.md) | Itinerary ✓ | `/admin/itinerary` | Related to existing **Timeline** (milestones) but distinct — the weekend **event schedule**. |
| [`budget.md`](./budget.md) | Budget ✓ | `app/admin/(dashboard)/budget/` | Exists (`BudgetManager`, budget RPCs); brief is a richer redesign. |
| [`settings.md`](./settings.md) | — (none provided) | `/admin/settings` | **Net-new page.** Only `POST /api/admin/budget/settings` exists today. |

Note the asymmetry: the **Guest Dashboard** mockup has no standalone brief — it is specced inside
`guest-list.md` **§11**. The **Settings** brief has no mockup.

## Recommended build order

1. **`guest-list.md` first** — it establishes the shared admin **shell, design system, typography,
   sidebar, page header, and summary metric strip** (its §1–10) plus the Dashboard (§11) and Guest
   List (§12–13). Everything else reuses these primitives.
2. **`travel.md`** — largest net-new data model (`travel_itineraries` / `travel_segments` /
   `transportation_requests`); also unifies the guest RSVP travel form with the admin view.
3. **`itinerary.md`** — reconcile with the existing Timeline page and `data/schedule.ts`.
4. **`budget.md`** — extend the existing Budget RPC surface.
5. **`settings.md`** — depends on decisions from the others (esp. adult/child classification, which
   feeds the Dashboard and Guest List metrics) and introduces a team/role model.

## Open reconciliation items (resolve at build time)

1. **Stack divergence.** Every brief assumes a **Tailwind + TanStack Table + React-Hook-Form/Zod**
   stack with **direct Supabase table reads**. This repo actually uses **CSS Modules** (co-located
   `*.module.css`), **Supabase RPCs** (`admin_*`, no ORM / no direct table reads), the
   **`app/admin/(dashboard)/`** route group, and single-token admin auth (`lib/admin-session.ts`).
   Treat the briefs as the source of truth for **layout, columns, states, data model, and
   behaviour**, and adapt the stack specifics. See each spec's "Repo reconciliation" header.
2. **Wedding-fact discrepancies.** The mockups are internally inconsistent and conflict with the
   canonical facts in `CLAUDE.md` (**Kelsey & Andrew · Tuscany, Italy · June 16–21, 2027**):
   - Dashboard chip: "Sep 12–16, 2027"; Travel: arrivals "Sep 11–15"; Guest List "Invited" dates:
     "May 2027"; Budget: mixed 2024/2025 due dates.
   - Itinerary: "Jun 16–22, 2027" (closest to canonical).
   - Sidebar wordmark: "TUSCANY 2027" (correct destination, but pair with the June dates).
   - Dashboard names "Andrew Shutts" — confirm the surname.
   These are the same class of placeholder-error the guest homepage mockup had ("San Francisco /
   2028"). **Do not copy mockup dates verbatim — reconcile to June 16–21, 2027 · Tuscany on build.**
3. **Mockup PNGs not committed.** The five approved mockups (Guest List, Guest Dashboard, Budget,
   Travel, Itinerary) were shared **inline in chat**, not as files, so only their **transcriptions**
   live in each spec's "Mockup reference" section. To add the real images, drop the PNGs into
   `docs/admin/mockups/` and link them from each spec's header.
4. **Fonts.** The Guest List brief suggests **Inter / Manrope** for the admin UI font. `CLAUDE.md`
   explicitly **forbids** substituting a geometric sans (Inter, Poppins, Montserrat) for the guest
   site's "Option A" fonts. Decide deliberately whether admin shares the guest brand fonts or is
   allowed to diverge — **do not adopt Inter by default.**
5. **Design tokens.** Reuse the existing `--color-*` / `--ink` / `--olive-*` palette in
   `styles/tokens.css`; do **not** spin up a parallel `--admin-*` token set without sign-off
   (`CLAUDE.md` — "RULE — adapt, never duplicate").
