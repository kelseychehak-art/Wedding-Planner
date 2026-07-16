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

---

## Open items (resolve before/at build time)

### O1 — "Activities" nav item
The homepage mockup shows a **6-item** nav (Our Weekend · Travel · Stay · **Activities** · Things to
Do · FAQ). The repo has **5** (no `Activities` route). **Do not invent it.** Add the nav entry +
route only when the Activities mockup arrives. Until then the homepage nav renders the existing 5.

### O2 — "Login" label vs. reality
The button reads "RSVP / Login" for 1:1 fidelity, but only RSVP exists (no login). Kept as-is for
now; revisit the wording if/when a guest-access flow ships (O3). Alternative if desired: simplify to
"RSVP".

### O3 — Guest-access / invite-token flow (deferred)
The brief sketches an opaque-token guest login (`/guest-access` → `/guest/[token]`). Not built; needs
Supabase schema + auth work. Candidate to outsource if a real guest portal is wanted. The orphan
`GuestHomeCard.tsx` component may be an early stub for this.

### O4 — Header unification
Decide whether every page shares one adapted `SiteHeader`, or the homepage uses an "airier" header
variant. Confirm against the other-page mockups when they arrive. Leaning toward one shared header
with optional homepage spacing, to keep the brand consistent.

### O5 — Pending assets & fonts (swap points)
Real hero photo (`tuscan-homepage-landscape.jpg`), the hand-inked illustration SVGs
(`small-lemon-sprig`, `heart-solid-gold`, `heart-outline-red`, `villa-postage-stamp`), the licensed
**Canela Sans** UI font, and the handwritten/script footer font are all pending. Build proceeds with
documented placeholders (see `homepage-spec.md` §12); true 1:1 is reached when these land.
