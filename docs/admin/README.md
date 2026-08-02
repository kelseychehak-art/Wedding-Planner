# Admin back-office specs — index

**Status: all nine built** (2026-07-21). The shared foundation + Dashboard + Guest List came
first, then Settings, Travel, Itinerary, Activities, Lodging, Communications, and finally the
Budget and Vendors expansions.
This folder holds design/implementation briefs for the private wedding-planning **admin**
back-office (`/admin/*`). Each is adapted rather than followed literally: the briefs assume Tailwind
+ TanStack + direct Supabase reads, this repo uses **CSS Modules + `admin_*` RPCs**. Where a brief
assumes an integration that doesn't exist (a messaging provider, Gmail ingestion), the build stops
short of claiming it works — see `communications.md`.

Each spec is the **verbatim source brief** (converted from the original `.docx`, code blocks
preserved) with a short **header block** prepended that records status, which admin route it maps
to, a **repo-reconciliation note**, and a **transcription of the approved mockup**. The approved
mockup PNGs live in [`docs/admin/mockups/`](./mockups) and are embedded in each spec.

## The nine specs

| Spec | Mockup(s) | Maps to admin surface | Build state today |
|---|---|---|---|
| [`guest-list.md`](./guest-list.md) — **foundation + Dashboard + Guest List** | [party view](./mockups/guest-list-party-view.png), [individual view](./mockups/guest-list-individual-view.png), [dashboard](./mockups/dashboard.png) | `app/admin/(dashboard)/` (Dashboard) + `guests/` | **Foundation + Guest List + Dashboard (§11) built 2026-07-21** (adapted; see the spec's Implementation notes). §1–10 define the shared shell every other spec reuses. |
| [`travel.md`](./travel.md) | [travel](./mockups/travel.png) | `/admin/travel` | **Built 2026-07-21** — itineraries, segments, arrival/departure views. |
| [`itinerary.md`](./itinerary.md) | [itinerary](./mockups/itinerary.png) | `/admin/itinerary` | **Built 2026-07-21** — `wedding_events` + locations + per-event RSVPs. Distinct from **Timeline**, which stays the planning-milestone log. |
| [`budget.md`](./budget.md) | [budget](./mockups/budget.png) | `app/admin/(dashboard)/budget/` | **Expanded 2026-07-21** — category panel, four money columns, payment schedules. Paid and status are **derived, not stored** (D18). |
| [`settings.md`](./settings.md) | [settings](./mockups/settings.png) | `/admin/settings` | **Built 2026-07-21** — wedding details, guests & RSVP, travel, currency. Feeds every other page's config. |
| [`activities.md`](./activities.md) | [activities](./mockups/activities.png) | `/admin/activities` | **Built 2026-07-21** — capacity, age rules, sign-up window. Guest-facing sign-up flow still to build, so counts read zero. |
| [`lodging.md`](./lodging.md) | [lodging](./mockups/lodging.png) | `/admin/lodging` | **Built 2026-07-21** — properties, rooms, assignments. Distinct from **Venues**, which stays venue selection. |
| [`communications.md`](./communications.md) | [communications](./mockups/communications.png) | `/admin/communications` | **Built 2026-07-21** — messages, templates, saved recipient groups, live recipient resolution. **No messaging provider wired, so nothing sends**: draft / schedule / mark-as-sent only, and no delivery or open-rate figures. See D17. |
| [`vendors.md`](./vendors.md) | [vendors](./mockups/vendors.png) | `app/admin/(dashboard)/vendors/` | **Expanded 2026-07-21** — five tabs, proposal/contract state, follow-up tasks, spend rolled up from the Budget. Gmail ingest still unbuilt. |

Notes: the **Guest Dashboard** mockup has no standalone brief — it's specced inside `guest-list.md`
**§11**. The four newest specs (activities, lodging, communications, vendors) came bundled in one
`.docx`; their mockups include a right-hand **"Code Structure" panel** showing each brief's intended
file tree.

## Recommended build order

1. **`guest-list.md` first** — establishes the shared admin **shell, design system, typography,
   sidebar, page header, and summary metric strip** (§1–10) plus the Dashboard (§11) and Guest List
   (§12–13). Everything else reuses these primitives.
2. **`settings.md`** early — its adult/child-age classification, RSVP/travel deadlines, and currency
   feed the Dashboard, Guest List, Activities, and Lodging metrics.
3. **`travel.md`** — largest net-new data model; unifies the guest RSVP travel form with the admin view.
4. **`activities.md`** and **`lodging.md`** — depend on guest/child data and the age-band config.
5. **`itinerary.md`** — reconcile with the existing Timeline page and `data/schedule.ts`.
6. **`budget.md`** + **`vendors.md`** together — vendor payments and the budget's committed/paid
   model must reconcile, and both share one **Gmail-ingest** path.
7. **`communications.md`** — depends on recipient groups derived from the guest data; gated on a real
   email/SMS provider.

## Open reconciliation items (resolve at build time)

1. **Stack divergence.** Every brief assumes a **Tailwind + TanStack Table + React-Hook-Form/Zod**
   stack with **direct Supabase table reads** (the newest four even ship a "Code Structure" file
   tree in the mockup). This repo actually uses **CSS Modules** (co-located `*.module.css`),
   **Supabase RPCs** (`admin_*`, no ORM / no direct table reads), the **`app/admin/(dashboard)/`**
   route group, and single-token admin auth (`lib/admin-session.ts`). Treat the briefs as the source
   of truth for **layout, columns, states, data model, and behaviour**, and adapt the stack. See
   each spec's "Repo reconciliation" header.
2. **Wedding-fact discrepancies.** The mockups are internally inconsistent and conflict with the
   canonical facts in `CLAUDE.md` (**Kelsey & Andrew · Tuscany, Italy · June 16–21, 2027**):
   - Dates: Dashboard "Sep 12–16"; Settings "Sep 12–18"; Lodging "Sep 12–19"; Travel arrivals
     "Sep 11–15"; Guest List "Invited" dates "May 2027"; Budget mixed 2024/2025; only **Itinerary**
     uses June ("Jun 16–22"). **Reconcile all to June 16–21, 2027 · Tuscany on build.**
   - **Currency:** Budget + Settings use **EUR (€)**; the Vendors mockup uses **USD ($)**.
     Standardize to **EUR** (Settings is authoritative).
   - Same class of placeholder-error the guest homepage mockup had ("San Francisco / 2028").
   - ✅ **Confirmed by the Settings mockup:** couple = **Kelsey Chehak & Andrew Shults** (surname
     **Shults**; the Dashboard's "Andrew Shutts" is a typo), destination **Tuscany, Italy**, currency
     **EUR**, timezone **Europe/Rome**, domain **chehakshultswedding.com**.
3. **Mockup images — now committed.** The approved mockups live in
   [`docs/admin/mockups/`](./mockups) (moved out of the repo root, where they were first uploaded,
   into descriptive filenames) and are embedded in each spec. *(Resolves the earlier "PNGs not
   committed" item.)*
4. **Fonts.** The Guest List brief suggests **Inter / Manrope** for the admin UI font. `CLAUDE.md`
   explicitly **forbids** substituting a geometric sans (Inter, Poppins, Montserrat) for the guest
   site's "Option A" fonts. Decide deliberately whether admin shares the guest brand fonts or is
   allowed to diverge — **do not adopt Inter by default.**
5. **Design tokens.** Reuse the existing `--color-*` / `--ink` / `--olive-*` palette in
   `styles/tokens.css`; do **not** spin up a parallel `--admin-*` token set without sign-off
   (`CLAUDE.md` — "RULE — adapt, never duplicate").
6. **Cross-page overlaps to build once, not twice.** Adult/child-age rules (Settings ↔ Guest List ↔
   Activities ↔ Lodging); Gmail ingest (Budget ↔ Vendors); vendor payments ↔ budget committed/paid;
   activity age-eligibility ↔ guest child data.

## Upcoming admin work & notes (captured — not yet built)

Forward-looking notes for the next round of admin work. Nothing here is built or wired yet.

1. **Admin pages must be mobile-friendly (make it a requirement).** The admin was built
   **desktop-first**, and the site-wide mobile-first rule (**D20** in `docs/design-system.md` /
   `CLAUDE.md`) currently scopes itself to the **guest** site — it explicitly says "*guest-facing;
   `/admin` unchanged.*" **That exclusion no longer holds.** The admin will be used on a phone during
   the wedding week — seating guests, checking payments, updating RSVPs on the go — so every
   `/admin/*` surface needs a genuine phone layout, not just a shrunk desktop one:
   - No horizontal scroll at **375–390px**; treat phone as a target, not a fallback.
   - Tap targets **≥44px**; readable body type (16px+).
   - **Wide tables reflow** to stacked cards / key-value rows (guest list, budget, vendors,
     lodging), or scroll inside their own container — never force the page to scroll sideways.
   - Sidebar collapses to a drawer / bottom nav; sticky headers and action bars must not crowd
     content or overlap the keyboard on inputs.
   - **Audit all nine admin surfaces** (Dashboard, Guest List, Travel, Itinerary, Budget, Settings,
     Activities, Lodging, Communications, Vendors) once the pattern is set.

2. **Guest accommodation payments (Stripe) — leaning full integration.** For when the venue won't
   take payments directly from guests. Add an `amount_owed` + `paid` concept per **party**, an admin
   field to set/track it (Collected / Outstanding / paid count), and a guest-facing "Your Stay"
   balance-due → Stripe checkout → auto-**Paid** flow. Processor fee (~2.9%+30¢) applies whether
   integrated or a plain link. **Visual mockups prototyped on this branch:** `/pay-mockup` (guest,
   Dolce style) and `/pay-mockup-admin` (admin field + tracking) — concept only, not wired to Stripe.

3. **Interactive seating chart (admin) — keep it SUPER simple.** Plated/serviced dinner needs
   names-to-seats. Scope: **black-and-white basic shapes only** (circles = round tables, rectangles =
   banquet/head), labelled with a seated count; **drag names from the RSVP'd-yes list onto tables**,
   drag to rearrange; **pull meal choice + dietary restrictions straight from the RSVP data** and show
   them as small **text tags** (no colour, since it's B&W); one-click **caterer export** (per-table
   meal counts + allergy flags). Open decision: **table-level** assignment (recommended — hassle-free,
   all a plated caterer needs) vs. **seat-level** (assigned chairs, more fiddly). No images, no floor
   plan, no 3D. Mockup still to build.
