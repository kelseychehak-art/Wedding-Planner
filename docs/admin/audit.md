# Admin back-office audit — 2026-07-21

Every admin page built so far, compared line-by-line against its mockup in
[`mockups/`](./mockups) and its brief. Ordered by severity, not by page.

**Method:** source + spec + mockup comparison, plus `next build`, `tsc`, `eslint`, and a schema
check against Supabase. Layout values were then **measured live** in the DOM at a 1512px viewport on
the dev build (`/admin/guests`), so the geometry below is observed, not inferred.

**Legend:** 🔴 wrong or misleading · 🟠 missing vs mockup · 🟡 consistency/polish

**Status:** P0 items 1, 2, 3, 4, 5, 8, 9, 10 are done and verified in the browser, as is the
`submit_rsvp` data-loss bug under "guest-facing" (see `decisions.md` D14). The shared toolbar and
pagination are built and applied to Guest List, Travel, Lodging and Activities.
**All ten P0 items are now done and verified in the browser.** What remains is P1 (structural gaps
vs the mockups) and P2 (consistency/polish), plus the unbuilt Communications page.

---

## 🔴 P0 — Says something untrue, or breaks for a real user

### 1. ✅ FIXED — Settings told you modules don't exist that shipped weeks ago
`settings/SettingsManager.tsx:446` — the Events & Activities panel reads *"…need the Itinerary and
Activities data model, **which doesn't exist yet**."* Both were built after that copy was written.
`:436` — Travel & Lodging reads *"Room assignments live under Lodging, **which isn't built yet**."*
Lodging shipped. Anyone opening Settings is told the product is less complete than it is.

### 2. ✅ FIXED — Guest List's Activities metric was hard-coded to empty
`GuestsManager.tsx:307-313` — `value: "—"`, `sub: "Not tracked yet"`, `disabled: true`. The
`activities` and `activity_bookings` tables both exist and the Dashboard already reads them.
Mockup expects `31 ACTIVITIES BOOKED / 8 need to select`.

### 3. Guest List's two richest columns render `—`
Weekend Events and Activities (`GuestsManager.tsx:999-1000`, `1124-1125`) are placeholders. The
mockup's Weekend Events cell is the single most informative thing on the page — a per-guest
green/amber/grey dot matrix under `WELCOME FRI · WEDDING SAT · BRUNCH SUN`. `event_guest_invitations`
(7 cols) and `activity_bookings` (12 cols) both exist now; only the `admin_list_guests` join is
missing. Same for the Activities cell (`3 activities / Wine Tasting (2) / Cooking Class (2)`).

### 4. D12 (dual currency) is honoured on exactly one page
`Money.tsx` is imported only by `BudgetManager.tsx`. Everywhere else money is raw single-currency:
- `vendors/page.tsx:97` — `{currency} {estimated_cost.toLocaleString()}`
- `venues/VenueList.tsx:145` and `venues/compare/VenueCompare.tsx:44` — same pattern
- `(dashboard)/page.tsx:306` — `Intl.NumberFormat` with the budget's currency only

The decision says *every* money value shows USD primary + EUR secondary. Venue quotes are the
figures most likely to be misread, and they're the ones still EUR-only.

### 5. ✅ FIXED — Dashboard Child Guests card was half-empty
`(dashboard)/page.tsx:597` — one of two rows reads "Activity preferences → **Not tracked yet**".
The mockup's Child Guest Overview has four rows, each with a count *and* a percentage, plus a
`VIEW CHILD GUEST DETAILS →` footer link. Activity preferences are now trackable.

### 6. ✅ FIXED — No error or loading boundaries anywhere in the app
`find app -name "error.tsx" -o -name "loading.tsx"` returns nothing. Every admin page is an async
server component doing 1–7 Supabase RPCs. One failed call = Next's raw error screen, and every
navigation is a blank pause with no skeleton. For a tool you'd hand to another bride, this is the
single biggest "feels unfinished" gap.

### 7. ✅ FIXED — Keyboard users couldn't open a guest
`GuestsManager.tsx:929-932` and `1089-1092` — rows are `<tr onClick>` with no `tabIndex`,
no `role`, no `onKeyDown`. Measured live: every row reports `tabIndex: -1`, `role: none`.
The detail drawer is unreachable without a mouse. The drawer itself is
otherwise well done (`role="dialog"`, `aria-modal`, Escape handler) but never receives focus on
open and doesn't trap it, so screen-reader users land behind the scrim.

### 8. ✅ FIXED — The metric strip generated a phantom column and wrapped ragged

Measured on the live page: `grid-template-columns` resolves to **8 tracks for 7 cards**, the eighth
`0px`. `MetricStrip.module.css:5` uses `repeat(auto-fit, minmax(150px, 1fr))` and `.card` has no
`min-width: 0`, so each column's floor is set by its own longest sub-line, not by 150px. At a full
1512px viewport it fits one row; the moment the container narrows (a sidebar open, a smaller laptop)
it collapses to 4 columns and renders **4 + 3 with an empty cell and no divider along the seam**.

The tidy-up rule at `:106` can't help — it's a `@media (max-width: 1099px)` viewport query, but the
thing that is narrow is the *strip*, not the window. Spec (`guest-list.md:672`) is explicit:
"Seven equal columns in one horizontal strip." Use `repeat(7, minmax(0, 1fr))` with real wrap
breakpoints, or a container query.

### 9. ✅ FIXED — The Invited metric card was permanently highlighted

`GuestsManager.tsx:276` keys the Invited card `"all"`, and `tab` also defaults to `"all"`, so
`activeKey === m.key` matches on first paint. Measured live: `activeCards: ["INVITED"]`. It renders
with the selected background and olive underline forever, reading as a filter the user never chose.

### 10. ✅ FIXED — Lint failed (build passed)
- `settings/SettingsManager.tsx:391` — unescaped `'` (`react/no-unescaped-entities`)
- `components/SiteHeader.tsx:18` — raw `<a href="/">` instead of `<Link>`, which forces a full
  page reload on the logo click

---

## 🟠 P1 — Structural gaps vs the mockups

### Dashboard (`dashboard.png`)

| Mockup | Built |
|---|---|
| Row 1: **RSVP Progress by Event** (wide, top-left), Needs Attention, Recent Submissions | ✅ reordered to match |
| Row 2: Arrivals Overview · Activity Booking Status · Child Guest Overview | order differs; an extra **Planning Reminders** card (not in mockup) sits mid-grid |
| Every card title has a **line icon** to its left | ✅ added |
| Card actions are uppercase footer links with `→` (`VIEW FULL RSVP REPORT →`, `MANAGE ACTIVITIES →`) | ✅ added, pinned to the card foot |
| **Recent Submissions** — an activity feed: *"Karen Chehak · Travel submitted · Today, 9:41 AM"* | **Recently Added** — party rows by `created_at`. No audit/event log exists, so this can't be built without one |
| Needs Attention rows: icon + label + count on its own line + red sub-note (*"Due 4+ days ago"*) | coloured dot + label + count, one line |
| Activity Booking Status: 4-segment donut, per-guest booking status, each with **%** (`Booked 31 (60%)`, `Partially Booked 12 (23%)`, `No Response 9 (17%)`) | single-arc donut measuring **capacity fill**; legend has no percentages. Different question being answered |
| Lodging Snapshot: 4 stat columns across + donut on the right | donut left + legend list (same layout as Activities card) |
| Arrivals footer: *"24 **guests** total travel submitted"* | ✅ now counts guests |
| Wedding-dates control: calendar icon, label, value, chevron — a picker | static chip, no icon, no chevron |
| Metric cards clickable ("Click to view") | `MetricStrip` gets no `onSelect` on this page |

Event sub-lines show `Sep 12, 2027` (`relTime`) where the mockup shows `Fri, Sep 12` — weekday is
more useful at a glance.

### Guest List (`guest-list-party-view.png`, spec §12)

- ✅ **Sort By** (spec §12B), **Columns picker** (§12A) and the **Activities / Lodging** filters are
  now built, on a shared `components/admin/Toolbar` reused by Travel, Lodging and Activities.
  Still missing: the mockup's "Information" filter.
- ⚠️ **`Child` column — the brief contradicts itself.** §12C lists 9 columns without it; the summary
  at line 86 lists 11 columns *including* Child and Invited. Left in place, and now hideable via the
  Columns picker, which makes the disagreement moot.
- **Rows aren't row-cards.** Spec §12D: each party is a bordered card, `border-radius: 8px`, ~12px
  apart, 138px (2 guests) / 172px (4 guests) tall. Measured live: `border-radius: 0px`, heights
  **77px** (0 guests) to **103px** (1 guest + child) — flat rows at roughly half the intended height.
- Table `min-width: 1120px` vs spec's 1450px. Measured: 10 columns sharing 1206px (~120px average)
  where the spec allots 250px to Guest/Party alone. Columns are compressed instead of scrolling.
- **No expand/collapse chevron** per party — the mockup lets you collapse a household's member list.
- Travel cell has no `2 of 2 submitted` rollup and no `FCO → Delta 182` flight formatting, though
  `travel_segments` (20 cols) stores exactly that.
- Lodging cell shows free-text `room_assignment`; mockup shows `Villa Rosa / Room 4 / Sep 14 – Sep 20`
  and `lodging_assignments` now holds it.
- Tabs (6) **and** clickable metric cards **and** filters all filter the same list — three
  mechanisms for one job. The mockup has no tab row.

### Travel (`travel.png`)

Missing: **Arrival** and **Departure** filters · **Group By** · **Columns** · **Table View /
Timeline View** toggle · **row checkboxes** for bulk actions · **pagination** ("Showing 1 to 6 of
28", page chips, "Show 25 per page") · the three footer cards — **Travel Collection Window**
("Customize reminder email →"), **Travel Reminders** ("Send reminder email →"), **Transportation
Summary** ("View transportation schedule →").

The table itself (two-tier Arrival/Departure header groups, submission status with date + "by
Karen") matches the mockup well.

### Itinerary (`itinerary.png`)

- **No event photo thumbnails.** The mockup's ~90×60 rounded photo per event is most of its
  character; without them the page is a plain table. Needs a `photo_url` on `wedding_events`.
- No **"View details"** link under each location.
- No **EXPORT** or **VIEW TIMELINE** buttons on the tab row.
- Row actions are inline `Edit` / `Delete` text; mockup (and Guest List) use a `…` overflow menu.
- The "Times and details are subject to change" note is plain text; mockup puts it in a bordered
  pill with an ⓘ icon.
- Extra `Add Location` button in the header (reasonable, not in mockup).

### Lodging (`lodging.png`)

Missing: **Child Needs** column (`Crib`, `Crib, High Chair` — a real planning need) · **All Room
Types** and **All Child Needs** filters · **Filters** button · **sortable column headers** (mockup
shows ↕ on eight of them) · **pagination**. Occupancy cell should read `2 adults, 2 children
(ages 6, 8)`.

Tabs (Properties / Room Assignments / Room Requests 11 / Lodging Summary) and the 8 shared columns
match well.

### Activities (`activities.png`)

Missing: **photo thumbnails** per activity · **All Dates** and **All Locations** filters · the
**three view-mode toggles** (list / compact / grid) · **Child Friendly** column · sortable headers ·
pagination.

### Settings (`settings.png`)

Missing: **Primary Venue** select · **PREVIEW GUEST SITE ↗** button in the card header · the **eight
summary cards** below the panel (Guests & RSVP, Events & Activities, Travel & Lodging,
Communications, Website & Branding, Integrations, Team & Access, Data & Privacy — each with icon,
two status lines, `Manage →`). Those cards are how the mockup makes a 9-section settings page
navigable at a glance.

Sections, side nav, and the Wedding Details field set otherwise match. The mockup's Wedding Dates is
one range field vs. two date inputs — fine.

### Budget (`budget.png`) — predates the briefs, not yet reconciled

Mockup has a left **Budget by Category** panel (icon + name + budgeted/spent + % + progress bar per
category, `+ Add Category` at the foot), tabs (All Items / Over Budget / Unpaid / Upcoming
Payments), **FILTERS** + **EXPORT** buttons, a 9-column item table with category chips and a
`Dec 1, 2024 / Paid` two-line due-date cell, pagination, and four footer cards. Tracked as task #102.

### Communications — not built (task #101). Mockup exists.

---

## 🟡 P2 — Consistency and professional polish

1. **Two button idioms.** Dashboard and Guest List use `<IconPlus />`; Itinerary and Travel use a
   literal `"+ "` string. Pick one.
2. **Two row-action idioms.** `…` menu (Guest List) vs inline `Edit`/`Delete` text (Itinerary,
   Lodging, Travel).
3. **Label drift.** "Needs Attention" (Dashboard) vs "Need Attention" (Guest List).
4. **Nav has grown to 13 flat items** vs the mockup's 10, in a different order, with Communications
   missing and Venues/Timeline/Decisions/Exports added. It needs grouping (e.g. *Guests · Planning ·
   Money · Admin*) before it grows further.
5. **No global top bar.** The Activities and Settings mockups both show one (⌘K search, notification
   bell, `KA ⌄` account menu, `VIEW SITE ↗`). Nothing like it exists. Worth deciding for or against
   deliberately — right now it's absent by omission, and the two mockups that show it disagree with
   the nine that don't.
6. **`window.confirm()` for deletes** (`GuestsManager.tsx:511`) — a browser-chrome alert in an
   otherwise carefully styled product.
7. **`/admin` is indexable.** No `robots.ts`, no `noindex` on admin routes, no distinct `<title>`.
8. **Login has no rate limiting or lockout** — a single shared password with unlimited attempts. Fine
   for one couple; not fine if this is ever handed to other people.
9. **`tsc --noEmit` reports 2 errors** from stray `.next/types/*  2.ts` files (a filesystem-sync
   artifact, not source). Harmless, but it means the typecheck signal is dirty.
10. **Mobile.** The 13-item sidebar becomes a tall stack under 767px, and tables are 1120px+ wide so
    they scroll horizontally (which the spec permits). Only 4 breakpoints across all admin CSS —
    thin coverage for tables this wide *(unverified visually)*.

---

## Suggested order

1. **Truth pass** — P0 items 1, 2, 5 (stale copy + the disabled metric). Small, and stops the
   product lying about itself.
2. **Wire the dead columns** — P0 items 3 and 4. Extend `admin_list_guests` to join events,
   activities and lodging; apply `Money` everywhere. Highest visible payoff.
3. **Robustness** — P0 items 6, 7, 8. `error.tsx` + `loading.tsx` per route group, keyboard rows,
   lint clean.
4. **Toolbar parity** — Sort By, Columns, missing filters, pagination across Guest List / Travel /
   Lodging / Activities. Mostly one shared toolbar + pagination component, reused five times.
5. **Dashboard re-layout** — reorder to the mockup, add card icons + footer links, fix the
   guests-vs-parties count.
6. **Visual fidelity** — row-cards, photo thumbnails, the Settings summary cards.
7. **Consistency sweep** — P2 1–4.
