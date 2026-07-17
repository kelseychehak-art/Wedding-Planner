# Decisions & Open Items

Running log of decisions for the wedding-site rebuild. Newest context at top of each section.

---

## Locked decisions

### D1 — Adapt the existing design system (not a parallel one)
**Decision:** Reuse `styles/tokens.css`, `app/globals.css`, and the CSS-Modules convention. Rebuild
the homepage hero as a full-bleed `Hero.module.css` and extend the existing `SiteHeader`.
**Rejected:** the brief's parallel system (`--home-*` tokens, global `styles/public-home.css`,
`PublicWeddingHeader`/`PublicWeddingHero` components).
**Rationale:** the repo already has a coherent token + component system whose colors match the brief
almost exactly. A parallel system would create two headers and two token sets that drift — bad for a
site that is "the brand of the whole wedding." Same 1:1 visual target either way; this is the
maintainable path.

### D2 — "RSVP / Login" button → existing `/rsvp`
**Decision:** The homepage CTA and header button link to the existing `/rsvp` page (name + email
lookup via `KindlyRespondCard` → Supabase RPCs).
**Rejected (for now):** building a new `/guest-access` page or a full invite-token guest-login
backend.
**Rationale:** ships immediately with zero backend work; the site has no guest-auth today. A real
guest-access flow can come later (see O3).

### D3 — Copy: Tuscany, Italy / June 16 – 21, 2027
**Decision:** Location = **"Tuscany, Italy"**; dates = **"June 16 – 21, 2027"**, used consistently on
every page. Venue and exact date remain officially TBD.
**Corrections to the mockup:** "San Francisco, California" → Tuscany, Italy; "2028" → 2027.
**Rationale:** the mockup's location/year are placeholder artifacts inconsistent with "a week in
Italy." At build time, `data/siteContent.ts` (`wedding.dateLabel`, `wedding.locationLabel`) should be
updated to match — recorded, not changed this session.

### D4 — Sequencing: homepage first, as the foundation
**Decision:** Document the homepage fully now (the only mockup we have) to establish the shared
foundation; each remaining page gets its own spec when its mockup is provided.
**Rationale:** no strong user preference; homepage-first lets the design-system doc + conventions
settle before the other pages slot in.

### D5 — This session is docs-only
**Decision:** Produce spec docs + memory (`CLAUDE.md`, `docs/*`) with **no code changes**, per the
user's explicit instruction. Building happens in a later session against these specs.

### D6 — Inner content pages redesigned to a shared frame
**Decision:** The 5 guest content pages (Our Weekend, Travel, Stay, Activities, FAQ) adopt the new
**shared frame** from the mockups (faded landscape → rounded panel → centered decorative hero →
inner footer band) documented in `docs/content-page-frame.md`. This **supersedes** the current
`PageHero` + `ContentPage` template. Built by **adapting** existing tokens/components (no parallel
system). Source of truth = the mockups (no written brief was provided).

### D7 — Personalized features deferred; build public parts now
**Decision:** Document full layouts but **build only the public/static parts**; defer personalized/
interactive features to a future guest identity system: **Stay** "Your Room Assignment" + "YOUR
ROOM" badge; **Activities** Sign-Up / "You're attending!" / RSVP status; **Travel** "Add Your Travel
Info" submission; **FAQ** "which room am I in?" answer. Rationale: no guest login exists (ties to O3).

### D8 — Spec 5 pages now; Things to Do + RSVP pending
**Decision:** Specs written for the 5 provided mockups. **Things to Do** and **RSVP** have no new
mockup yet — left on the existing template and flagged pending (see O6).

---

## Open items (resolve before/at build time)

### O1 — "Activities" nav item — ✅ RESOLVED
The Activities mockup confirms a **real `/activities` page** and the **6-item** nav (Our Weekend ·
Travel · Stay · **Activities** · Things to Do · FAQ). **At build:** add the `/activities` route and
an `{ label: "Activities", href: "/activities" }` entry to `data/siteContent.ts` `navigation`
(between Stay and Things to Do). See `docs/pages/activities.md`.

### O2 — "Login" label vs. reality
The button reads "RSVP / Login" for 1:1 fidelity, but only RSVP exists (no login). Kept as-is for
now; revisit the wording if/when a guest-access flow ships (O3). Alternative if desired: simplify to
"RSVP".

### O3 — Guest-access / invite-token flow (deferred)
The brief sketches an opaque-token guest login (`/guest-access` → `/guest/[token]`). Not built; needs
Supabase schema + auth work. Candidate to outsource if a real guest portal is wanted. The orphan
`GuestHomeCard.tsx` component may be an early stub for this.

### O4 — Header unification / RSVP button label
The inner-page mockups confirm the **same header** across all pages (K&A + sprig, 6-item nav w/
active underline). Leaning toward **one shared `SiteHeader`** with optional homepage spacing.
**Normalize the button label:** homepage shows "RSVP / Login", inner pages show "RSVP" — pick one
(or keep home's longer label as the deliberate landing-page variant). Both → `/rsvp` for now.

### O5 — Pending assets & fonts (swap points)
Real hero photo (`tuscan-homepage-landscape.jpg`), the hand-inked illustration SVGs
(`small-lemon-sprig`, `heart-solid-gold`, `heart-outline-red`, `villa-postage-stamp`), the licensed
**Canela Sans** UI font, and the handwritten/script footer font are all pending. Build proceeds with
documented placeholders (see `homepage-spec.md` §12); true 1:1 is reached when these land.
**Illustration standard:** deliver each as an **SVG**, run through **SVGO**, and give it a clean
lowercase-hyphen filename (auto-traced SVGs are ~1 MB raw → ship the minified version). Inner-page
mockups also need new **photos [SWAP]**: per-day schedule photos, the villa exterior, room-category
thumbnails, and activity photos (`public/assets/{photos,rooms,activities}/…`).

### O6 — Things to Do + RSVP mockups pending
No new mockup yet for **Things to Do** or **RSVP**. They stay on the existing `PageHero`/`ContentPage`
template until their mockups arrive, then get specs like the other five.

### O7 — schedule.ts data update
`data/schedule.ts` currently models **Wed–Mon** with only Saturday populated. The Our Weekend mockup
is **Mon–Sat, June 16–21 2027** with six events (Welcome Dinner, Wine Tasting, Cooking Class, Pool
Day & Lunch, Town Excursion, Farewell Party). Repopulate the data and extend `ScheduleEvent`/
`ScheduleDay`/`ScheduleIcon` (add `description`, `photo`, `endTime`, more icons). See
`docs/pages/our-weekend.md`.
