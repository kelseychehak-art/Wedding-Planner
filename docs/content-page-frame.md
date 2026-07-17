# Content-Page Frame — Shared Inner-Page Spec

The **five guest content pages** (Our Weekend, Travel, Stay, Activities, FAQ) share one frame in the
mockups. This doc specifies that frame once; each per-page spec in [`pages/`](./pages) references it
and only documents its own body. The homepage is separate (full-bleed cover — see
[`homepage-spec.md`](./homepage-spec.md)).

> **Status:** spec only, no code. Assets (faded background photo, illustration SVGs, page images) are
> **[SWAP]** points with working placeholders. Copy is **June 16 – 21, 2027 / Tuscany, Italy**
> everywhere (mockups show "2028" — that's a placeholder error).

---

## 1. This supersedes the current template

The repo's inner pages currently use `SiteHeader` → **`PageHero`** → `page-shell` + **`ContentPage`**
sections → optional `.ctaBand` → **`SiteFooter`**. The mockups replace that with a richer frame (a
framed panel over a faded landscape, a centered decorative hero, an inner footer band). Build by
**adapting** the existing pieces — same tokens, CSS-Modules, and components — **not** a parallel
system. Expect to:
- Rebuild/extend `PageHero` into the centered decorative hero (§4), or add a sibling `ContentHero`.
- Extend `SiteFooter` (or add a `FooterBand`) for the richer footer (§6).
- Add a page-frame wrapper (faded background + rounded panel, §2–3).

Keep `ContentPage.module.css`'s useful primitives (`.section .grid .card .callout .ctaBand` …) where
they still fit inside the new panel.

---

## 2. Faded background wrapper

Full-bleed **Tuscan landscape**, heavily faded to a cream wash, fixed behind the whole page; the
cypress-left / villa-right detail reads faintly in the side margins outside the panel.
- Reuse the homepage hero image **[SWAP]** (`public/assets/hero/villa-estate.jpg` / `valdorcia.jpg`
  now; real `tuscan-homepage-landscape.jpg` later), low opacity over `--color-ivory`.
- Implement as a page-level wrapper element (fixed/absolute, `z-index` below the panel), same
  veil-gradient technique as the homepage (a separate overlay element — never fade the whole page).

## 3. The panel

A large **rounded cream card** holding all page content, centered with side gutters showing the
faded background.
- Background `--color-paper`/`--color-ivory`, `border-radius: var(--radius-card)` (10px),
  hairline `1px solid var(--color-border-soft)`, minimal shadow (`--shadow` — editorial, not heavy).
- Width via `.page-shell` (respects `--page-max` and the existing gutter steps).
- Comfortable interior padding on the 8pt scale (`--space-7`/`--space-8` desktop, less on mobile).

---

## 4. Centered page hero (inside the panel, top)

Order, centered:
1. **"← BACK TO HOME"** link, top-left of the panel — `--font-sans`, ~11px, uppercase, letter-spaced,
   `--color-olive-dark`, with a left arrow. Real `<Link href="/">`.
2. **Olive-&-lemon sprig** illustration, centered. **[SWAP]** — interim `Illustration
   name="lemonBranch"` / `oliveBranch`.
3. **Title** — big **Playfair italic**, `--color-olive-dark` (green), e.g. "Frequently Asked
   Questions", "Weekend Schedule", "Book Your Travel", "Browse Where You'll Stay",
   "Activities & Experiences". A small **red heart** sits to its right. Real `<h1>`.
4. **Gold divider** with a center heart (same as homepage: two citrus-gold rules flanking a small
   heart). **[SWAP]** heart SVG — interim `Illustration name="heart" tone="gold"`.
5. **Subtitle** — one line, `--font-sans`/serif muted (`--color-muted-ink`), e.g. "Find answers to
   common questions about our wedding weekend in Italy."
6. **Villa postage stamp**, tilted, upper-right of the panel — reuse `PostageStamp variant="villa"`.
   **[SWAP]** villa-stamp SVG.

## 5. Header (page chrome, above the panel)

Same header as the homepage adaptation: "K & A" monogram + lemon sprig at left, **6-item uppercase
nav** — **Our Weekend · Travel · Stay · Activities · Things to Do · FAQ** — with the **current page
underlined** (active state), and the olive RSVP button at right. On inner pages the button reads
**"RSVP"** (homepage reads "RSVP / Login") — see `decisions.md` for normalizing this. Nav data from
`data/siteContent.ts` `navigation` (needs the **Activities** entry added at build). Mobile: hamburger
→ `MobileMenu`.

## 6. Inner footer band (bottom of the panel)

A centered closing band inside the panel:
- Flanking illustrations: **wine glass** (left) ⟷ **olive/lemon branch** (right). Interim
  `Illustration name="wineGlass"` / `lemonBranch`. **[SWAP]**.
- Line 1: "WE CAN'T WAIT TO CELEBRATE WITH YOU!" (some pages: "…TO WELCOME YOU TO ITALY!" /
  "…TO SHARE THIS WEEK WITH YOU!") — Cormorant/serif, letter-spaced, `--color-olive-dark`.
- Gold divider with heart.
- **"KELSEY ♥ ANDREW"**, then **"JUNE 16 – 21, 2027"**, then **"TUSCANY, ITALY"** — uppercase,
  letter-spaced, small.
- Some mockups also show a **slim bottom bar** below the panel ("KELSEY & ANDREW ♥ June 16 – 21,
  2027" in terracotta). Treat as an optional variant of the band.

Extend `SiteFooter` or add a dedicated `FooterBand` component; reuse tokens, not new colors.

---

## 7. Reusable building blocks (adapt, don't duplicate)

| Need | Reuse |
|---|---|
| Header + mobile menu | `SiteHeader`, `MobileMenu` |
| Villa stamp | `PostageStamp variant="villa"` |
| Blue **wavy-border boxes** ("Share Your Travel Plans", "Questions?", "Still Have Questions?") | **`ScallopFrame color="var(--color-sky-blue)"`** (already used in `KindlyRespondCard`) |
| Small line icons (airplane, key, wine, bicycle, villa, cypress, music, calendar…) | `Illustration` (18 names, 7 tones) |
| Buttons | `.btn-primary` / `.btn-outline` / `.btn-blue` / `.btn-outline-terracotta` |
| Cards / grids / callouts | `ContentPage.module.css` primitives, inside the new panel |
| Panel radius / borders / shadow | `--radius-card`, `--color-border-soft`, `--shadow` |

## 8. Public vs. personalized (build-now vs. deferred)

Per the locked decision, **document the full layout, build the public/static parts now, and defer the
personalized/interactive features** to the future guest system (no guest login exists yet). Deferred
items are called out inline in each page spec:
- **Stay:** "Your Room Assignment", the "YOUR ROOM" category badge.
- **Activities:** per-activity **Sign Up** / "You're attending!" states + RSVP status.
- **Travel:** "Add Your Travel Info" / "Share Your Travel Plans" submission.
- **FAQ:** the answer to "How do I find out which room I'm in?" (links to the deferred feature).

Build these as static placeholders (or hidden) until the guest identity/auth backend is decided.

## 9. Accessibility (applies to every page)

Real `<h1>` per page (single); real `<Link>`s (back-to-home, nav, CTAs); visible focus rings;
decorative illustrations `alt=""` + `aria-hidden`; meaningful `alt` on real photos; ≥44px targets;
correct heading order (`h1` → section `h2` → card `h3`); `prefers-reduced-motion` respected; named
hamburger. FAQ accordion + any tabs must be keyboard-operable with correct ARIA.
