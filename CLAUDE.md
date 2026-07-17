# CLAUDE.md — Kelsey & Andrew's Wedding Site

Operating guide for anyone (human or Claude) working in this repo. Read this first, then the specs
in [`docs/`](./docs).

## Project overview

This is the public brand site for **Kelsey & Andrew's wedding week** (chehakshultswedding.com), built
with **Next.js 16 (App Router) + React 19 + TypeScript**. It has two surfaces:

- **Public guest site** — `/` (home) plus `/our-weekend`, `/travel`, `/stay`, `/things-to-do`,
  `/faq`, `/rsvp`. This is the design-mockup work.
- **Admin back-office** — `/admin` (auth + dashboard for vendors, venues, guests, budget, timeline,
  decisions, exports), backed by `app/api/admin/*` route handlers. Not part of the mockup rebuild.

**Supabase** (`@supabase/supabase-js`) powers the RSVP flow and admin. RSVP works by **name + email
lookup** (RPCs `get_party_for_rsvp` / `submit_rsvp` in `lib/supabase.ts`). There is **no guest login
or invite-token system** — do not assume one exists.

## Wedding facts (source of truth for copy)

| Field | Value |
|---|---|
| Couple | Kelsey & Andrew |
| Monogram | K & A |
| Eyebrow | Join us for a week in |
| Destination | Italy (full: **Tuscany, Italy**) |
| Event name | Wedding Week |
| Dates | **June 16 – 21, 2027** (venue + exact date officially TBD) |

Use these consistently on every page. The homepage mockup's "San Francisco, California" and "2028"
are **placeholder errors** — use Tuscany, Italy / June 16 – 21, 2027 instead. Canonical strings live
in `data/siteContent.ts` (`couple`, `wedding`, `navigation`).

## Design system

- **Tokens:** `styles/tokens.css` — a single `:root` block. Canonical **`--color-*`** palette plus
  **back-compat aliases** (`--ink`, `--olive-dark`, `--citrus`, `--surface`, `--border`, …) that
  older components read. Also font vars, an 8pt spacing scale (`--space-1..10`), a clamp-based type
  scale, radii (`--radius-card: 10px`, `--radius-button: 2px`), and `--transition`.
- **Globals:** `app/globals.css` — base resets, `.page-shell` (centered gutter container),
  the button family (`.btn-primary`, `.btn-outline`, `.btn-blue`, `.btn-outline-terracotta`), a
  global `.eyebrow`, and a `prefers-reduced-motion` block.
- **Fonts — "Option A" type system** (all free Google Fonts via `next/font/google`; see
  `docs/decisions.md` D10). Applied site-wide (guest-facing; `/admin` unchanged):
  **Fraunces** → `--font-heading` (display titles: "Italy", page titles),
  **Cormorant Garamond** → `--font-cormorant` (`--font-display`/`--font-serif`; couple/event, card titles),
  **Instrument Sans** → `--font-sans` (UI/body), **Pinyon Script** → `--font-script` (footer accent).
  Components reference the semantic `--font-display/heading/serif/script/sans` tokens, never raw vars.
  *(Currently the repo wires Playfair/DM Sans/Allura — the build swaps these to Fraunces/Instrument
  Sans/Pinyon Script.)*

See [`docs/design-system.md`](./docs/design-system.md) for the full inventory and component APIs.

## Conventions & rules

- **CSS Modules, co-located.** Each component has a sibling `*.module.css` with **camelCase** class
  names that reference tokens via `var(--…)`. No BEM, no utility framework.
- **Per-page copy is co-located** as `const` arrays inside each `page.tsx` (not in `siteContent`).
  Only couple/wedding/navigation strings come from `data/siteContent.ts`; the weekend schedule lives
  in `data/schedule.ts`.
- **Content-page template:** `SiteHeader` → `PageHero` (with a `PostageStamp` illustration) →
  `page-shell` sections → optional `.ctaBand` → `SiteFooter`. The homepage is the one exception (a
  full-bleed hero, see the homepage spec).
- **Breakpoints in use:** `767px` (mobile, dominant), `899px` (PageHero only), `768–1199px` (tablet
  band), `1200–1599px` (large-desktop hero), `1099px` (page-shell gutter step). Reuse these; don't
  invent new ones.
- **RULE — adapt, never duplicate.** Extend existing tokens/components. Do **not** introduce a
  parallel token set (e.g. `--home-*`), a second global stylesheet, or duplicate header/hero
  components. This keeps the brand consistent across every page.

## Assets & fonts (pending — swap points)

Fonts are resolved (Option A, all Google Fonts — see above / D10). Illustrations and the hero
photograph are still pending. Until they land:

- Use documented placeholders (existing `public/assets/` images; `Illustration`/`PostageStamp`
  components) and mark every swap point in the relevant spec.
- **Never** substitute a geometric sans (Inter, Poppins, Montserrat) for the intended UI font, or
  emoji / clip-art / flat-vector icons for the hand-inked illustrations, without sign-off.
- The full asset standard + checklist (SVG + SVGO + naming rules, illustration/photo/font inventory)
  lives in [`docs/assets.md`](./docs/assets.md).

## Docs index

- [`docs/design-system.md`](./docs/design-system.md) — foundation: tokens, fonts, globals, component APIs.
- [`docs/assets.md`](./docs/assets.md) — asset standard + illustration/photo/font inventory checklist.
- [`docs/homepage-spec.md`](./docs/homepage-spec.md) — 1:1 homepage build spec (full-bleed cover).
- [`docs/content-page-frame.md`](./docs/content-page-frame.md) — shared inner-page frame (faded bg +
  panel + centered hero + footer band); supersedes the old `PageHero`/`ContentPage` template.
- **Per-page specs** — [`docs/pages/our-weekend.md`](./docs/pages/our-weekend.md),
  [`travel.md`](./docs/pages/travel.md), [`stay.md`](./docs/pages/stay.md),
  [`activities.md`](./docs/pages/activities.md), [`faq.md`](./docs/pages/faq.md).
  (Things to Do + RSVP specs pending their mockups.)
- **Guest portal (FUTURE-STATE — not the current plan)** —
  [`docs/guest-portal/overview.md`](./docs/guest-portal/overview.md) +
  [`master-brief.md`](./docs/guest-portal/master-brief.md): the token-gated personalized portal
  (`/guest/[inviteToken]/…`) + Supabase backend. **Not greenlit**; public-first plan is in force.
- [`docs/decisions.md`](./docs/decisions.md) — locked decisions + open items.

Navigation is **6 items**: Our Weekend · Travel · Stay · **Activities** · Things to Do · FAQ
(`/activities` is a new route to add). Personalized features (Your Room, activity sign-up, Add Travel
Info) are **deferred** to a future guest system — build the public/static parts first.
