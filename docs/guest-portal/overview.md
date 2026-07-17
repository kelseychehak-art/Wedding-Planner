# Guest Portal — Overview, Reconciliation & Sequencing

> ⚠️ **FUTURE-STATE TARGET — NOT the current plan of record.** The **public-first plan is in force**
> (see [`../decisions.md`](../decisions.md) D1/D2/D7/D9). This doc explains how the
> [`master-brief.md`](./master-brief.md) portal maps onto the **existing** codebase, what must be
> built **first**, and how it relates to the public pages we're building now. Nothing here is greenlit
> to build.

## What this is vs. what we're building now

| | Public-first (plan of record — build now) | Guest portal (this folder — later) |
|---|---|---|
| Routes | Flat: `/travel`, `/stay`, `/activities`, `/schedule`(our-weekend), `/faq` | Token-gated: `/guest/[inviteToken]/…` |
| Auth | None (RSVP = name+email at `/rsvp`) | Opaque **invite-token** identity per guest |
| Personalization | **Deferred** (public/static layouts) | Live: room assignment, sign-ups, travel info |
| Backend | Existing RSVP RPCs only | **16 new Supabase tables** + access layer |
| Specs | [`../content-page-frame.md`](../content-page-frame.md) + [`../pages/`](../pages) | `master-brief.md` (here) |

The five public page specs in `docs/pages/` are the **build-now** versions of the same five pages.
The portal is the **later, personalized** version. When (if) the portal is greenlit, its pages either
supersede the public ones or coexist (public marketing shell + token-gated portal) — a decision for
greenlight time.

## Prerequisites — foundation FIRST (before any of the 5 detail pages)

The master brief assumes a portal that **does not exist in this repo** (verified: no
`/guest/[inviteToken]` route, no invite-token system, none of its shell components). Building the 5
pages is blocked on:

1. **Guest-access / invite-token foundation** — `/guest/[inviteToken]` route resolution + a
   `getGuestByInviteToken()` lookup, using **opaque tokens** (never put guest name / email / household
   id in the URL). This is the previously-deferred item (`decisions.md` O3) and the likely
   **outsource candidate**.
2. **Portal shell components** — the brief's `GuestBackground`, `GuestSiteHeader`,
   `GuestDetailPageShell`, `GuestDetailPageHeader`, `GuestDetailFooter`, `BackToGuestHome`, plus the
   shared primitives — built by **adapting** existing components (see mapping below).
3. **Supabase schema** — the 16 tables + relationships (`master-brief.md` §36) and a
   `data/wedding/*` data-access layer. Admin editing for FAQ/schedule/activities.
4. **Assets & fonts** — fonts resolved (Option A, D10 — no Canela needed); the illustration/icon/border SVGs and photos in
   the manifest (`master-brief.md` §40).

## Component mapping (adapt — do NOT duplicate)

| Brief component | Build on existing | Notes |
|---|---|---|
| `GuestSiteHeader` | adapt `components/SiteHeader.tsx` | token-scoped nav hrefs, active `aria-current` underline |
| `GuestBackground` | new wrapper; see `content-page-frame.md` §2 | faded landscape behind the panel |
| `GuestDetailPageShell` / `GuestPageShell` | `content-page-frame.md` §3 panel | cream stationery panel |
| `GuestDetailPageHeader` / `WeddingPageHeader` | extend `components/PageHero.tsx` | centered sprig+title+heart+divider+stamp |
| `GuestDetailFooter` / `WeddingPageFooter` / `WeddingSignature` | extend `components/SiteFooter.tsx` | footer band + signature line |
| `ScallopedCard` / `ScallopedPanel` | **`components/ScallopFrame.tsx`** | prefer the dynamic component over the brief's static `/borders/scalloped-blue-card.svg` |
| `InfoNotice` | `.callout` in `ContentPage.module.css` | info/note boxes |
| `LineIcon` | **`components/Illustration.tsx`** | 18 names, 7 tones |
| `EditorialButton` | `.btn-primary/-outline/-blue` (`globals.css`) | plus `.sky-blue-button` = `.btn-blue` |
| `DecorativeCard` | `EditorialCard.tsx` (currently orphan) or a generic card | |

## Token mapping + value diffs to reconcile at greenlight

**Do NOT silently fork the palette.** Same values → reuse directly; differing values → a deliberate
decision at greenlight (pick one, update `tokens.css` or the portal, don't run two).

| Brief var | Existing token | Match? |
|---|---|---|
| `--olive-dark #3f4a36` | `--color-olive-dark` | ✅ same |
| `--olive #687a4a` · `--sage #a9b08c` · `--sand #efe7da` · `--cream #faf7f2` · `--paper #fffdf8` · `--terracotta #e06454` | `--color-*` equivalents | ✅ same |
| `--sky-blue #7fa2c7` | `--color-sky-blue` | ✅ same |
| `--citrus-gold #d4a63a` | `--color-citrus-gold #daa63a` | ⚠️ differs |
| `--ink #26251f` | `--color-ink #30342d` | ⚠️ differs (brief darker) |
| `--muted-ink #6f6c63` | `--color-muted-ink #6d7068` | ⚠️ differs |
| `--radius-page 9px` / `--radius-card 6px` | `--radius-card 10px` / `--radius-button 2px` | ⚠️ differs |
| `--page-width 1160px` | `--page-max 1440` / `--content-max 1200` | ⚠️ narrower |
| `--header-height 64px` | (SiteHeader; homepage spec uses 78px) | ⚠️ reconcile |
| `--font-display` Playfair · `--font-editorial` Cormorant | `--font-heading` (**Fraunces**, D10) / `--font-serif` (Cormorant) | ✅ resolved |
| `--font-ui` Canela Sans · `--font-body` Canela | `--font-sans` (**Instrument Sans**, D10) | ✅ resolved — no Canela needed |

## Per-page detail
Layouts, data-model interfaces, and the required loading/empty/private **states** live in
[`master-brief.md`](./master-brief.md) (Pages 1–5, §37). All dates/location must read
**June 16 – 21, 2027 / Tuscany, Italy** regardless of any value quoted in the brief.

## When greenlit — suggested build order
1. Supabase schema + `data/wedding/*` + admin editing.
2. Guest-access/token foundation + route group + `getGuestByInviteToken`.
3. Portal shell (adapted header/panel/hero/footer + primitives).
4. Pages in ascending complexity: FAQ → Schedule → Travel → Stay → Activities (sign-up state last).
5. States, a11y, and the 1536px screenshot-compare pass per page.
