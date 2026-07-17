# Design System — Foundation Spec

The shared reference every page spec builds on. Describes what **already exists** in the repo so new
work reuses it. Golden rule: **adapt these tokens/components; never create a parallel system.**

---

## 1. Tokens — `styles/tokens.css`

A single `:root` block. Components should reference these via `var(--…)` and never inline hex.

### Colors

**Canonical palette (`--color-*`):**

| Token | Value | | Token | Value |
|---|---|---|---|---|
| `--color-olive-dark` | `#3f4a36` | | `--color-citrus-gold` | `#daa63a` |
| `--color-olive` | `#687a4a` | | `--color-terracotta` | `#e06454` |
| `--color-sage` | `#a9b08c` | | `--color-terracotta-dark` | `#c04b3b` |
| `--color-sand` | `#efe7da` | | `--color-sky-blue` | `#7fa2c7` |
| `--color-ivory` | `#faf7f2` | | `--color-sky-blue-deep` | `#4f77a3` |
| `--color-paper` | `#fffdf8` | | `--color-ink` | `#30342d` |
| `--color-muted-ink` | `#6d7068` | | `--color-border` | `#d8d0c4` |
| `--color-border-soft` | `#e9e2d8` | | | |

**Back-compat aliases** (older components read these; they point at the canonical palette):
`--page-bg`→ivory, `--surface`→paper, `--surface-soft`→sand, `--ink`, `--olive`, `--olive-dark`,
`--olive-muted`→muted-ink, `--sage`, `--terracotta`, `--terracotta-dark`, `--citrus`→citrus-gold,
`--blue`→sky-blue-deep, `--blue-soft`→sky-blue, `--border`, `--border-soft`.

> Note: modules mix canonical and alias tokens interchangeably (a title may use `--color-olive-dark`
> while adjacent body text uses `--ink`). Both are valid; don't "normalize" existing code.

The homepage brief's `--home-*` colors map onto existing tokens almost 1:1 (e.g. brief
`--home-olive-dark #3f4a36` = `--color-olive-dark`; brief `--home-citrus-gold #d4a63a` ≈
`--color-citrus-gold #daa63a`). **Reuse the existing tokens — do not add `--home-*`.**

### Geometry / motion
`--shadow: 0 1px 2px rgba(48,52,45,0.04)` · `--radius-card: 10px` · `--radius-button: 2px` ·
`--transition: background-color 160ms ease, color 160ms ease, border-color 160ms ease, opacity 160ms ease`.

### Spacing (8pt grid)
`--space-1:4px --space-2:8 --space-3:12 --space-4:16 --space-5:24 --space-6:32 --space-7:48
--space-8:64 --space-9:96 --space-10:128`.

### Layout widths
`--page-max: 1440px` · `--content-max: 1200px` · `--reading-max: 720px`.

### Type scale (clamp-based)
`--font-display-xl` clamp(3.75rem,7vw,7rem) · `--font-display-lg` clamp(2.5,5vw,5) ·
`--font-heading-1` clamp(2,3.5vw,3.75) · `--font-heading-2` clamp(1.5,2.5vw,2.5) ·
`--font-heading-3` clamp(1.2,1.8vw,1.75) · fixed `--font-body-lg 1.125rem` · `--font-body 1rem` ·
`--font-body-sm .875rem` · `--font-label .75rem`.

---

## 2. Fonts

Loaded in `app/layout.tsx` via `next/font/google`, each exposed as a CSS variable and consumed by a
semantic token:

**CHOSEN TYPE SYSTEM — "Option A" (all free Google Fonts).** Per the user's typography bakeoff
(`public/assets/Wedding_Typography_Bakeoff_Updated_Calligraphy.html`, System A), applied site-wide.
See `decisions.md` D10.

| Font | next/font var | Semantic token | Role | Replaces |
|---|---|---|---|---|
| **Fraunces** (opsz, italic) | `--font-fraunces` | `--font-heading` | display titles ("Italy", page titles) | Playfair Display |
| **Cormorant Garamond** (400/500/600, italic) | `--font-cormorant` | `--font-display`, `--font-serif` | couple/event names, card titles, editorial | *(unchanged)* |
| **Instrument Sans** (400/500/600) | `--font-instrument` | `--font-sans` | UI / body (eyebrow, nav, labels, buttons, meta) | DM Sans **and** Canela Sans |
| **Pinyon Script** (400) | `--font-pinyon` | `--font-script` | script accent (footer line only) | Allura |

Components keep referencing the semantic tokens (`--font-heading/display/serif/sans/script`); only the
underlying families change. Note the role split: the big **"Italy"** and page titles are **Fraunces**;
the couple/event lines ("Kelsey & Andrew's Wedding Week") stay **Cormorant**.

### Font gaps — RESOLVED
The previously-pending **Canela Sans** (UI) and **handwritten/script** fonts are no longer needed:
Option A uses **Instrument Sans** (UI) and **Pinyon Script** (accent), both free Google Fonts. No
licensing, no `next/font/local` — all four load via `next/font/google`.

**Build step (`app/layout.tsx`):** swap the four `next/font/google` imports to Fraunces, Cormorant
Garamond, Instrument Sans, Pinyon Script; retarget the tokens (`--font-heading`→Fraunces,
`--font-sans`→Instrument Sans, `--font-script`→Pinyon Script; Cormorant unchanged). Applies to the
guest-facing site; `/admin` left as-is.

**Rule:** do not silently swap in Inter / Poppins / Montserrat for the intended UI font.

---

## 3. Globals — `app/globals.css`

- **Base:** `html, body` bg `var(--page-bg)`; `body` color `var(--ink)`, `font-family
  var(--font-sans)`, antialiased. Universal `box-sizing: border-box`. `img { max-width:100%;
  display:block }`. `a { color:inherit; text-decoration:none }`. Headings/`p` margin 0.
  `prefers-reduced-motion: reduce` neutralizes animation/transition/scroll-behavior.

- **`.page-shell`** — the horizontal container. Verbatim:
  ```css
  .page-shell { width: min(100% - 48px, var(--page-max)); margin: 0 auto; }
  @media (max-width: 1099px) { .page-shell { width: min(100% - 32px, 1100px); } }
  @media (max-width: 767px)  { .page-shell { width: calc(100% - 24px); } }
  ```

- **Button family** — shared base for `.btn-primary, .btn-outline, .btn-blue`: `inline-flex`
  centered, `min-height: 44px`, `padding: 0 24px`, `border-radius: var(--radius-button)`,
  `font-family: var(--font-sans)`, `font-size: 11px`, `font-weight: 700`, `letter-spacing: 0.12em`,
  `text-transform: uppercase`, `border: 1px solid transparent`, `transition: var(--transition)`,
  `white-space: nowrap`.
  ```css
  .btn-primary { background: var(--color-olive-dark); color: var(--color-paper); border-color: var(--color-olive-dark); }
  .btn-primary:hover { background: var(--color-olive); border-color: var(--color-olive); }
  ```
  Variants: `.btn-outline` (citrus-gold border, fills on hover), `.btn-blue`, `.btn-outline-terracotta`.

- **`.eyebrow`** (global) — `--font-sans`, 11px, 600, `letter-spacing: 0.22em`, uppercase,
  `--olive-muted`. (Most modules re-declare a local eyebrow instead of using this.)

---

## 4. Reusable components

### Layout / chrome
- **`SiteHeader.tsx`** (`"use client"`) — monogram (`couple.monogram`) + nav (`navigation[]` from
  siteContent) + a `.btn-primary` RSVP link → `/rsvp` + hamburger toggling `MobileMenu`. Hamburger
  `display:none` until 767px.
- **`SiteFooter.tsx`** — `oliveBranch` illustration + "We can't wait to celebrate with you!" +
  "Kelsey & Andrew" (names hard-coded here).
- **`MobileMenu.tsx`** (`"use client"`) — full-screen `role="dialog"` overlay; prop `onClose`. Pulls
  monogram + navigation from siteContent; includes a `.btn-primary` RSVP link.
- **`PageHero.tsx`** — props `{ eyebrow, title, intro, illustration?, children? }`. Renders inside
  `page-shell`: eyebrow `<p>`, `<h1>` title, intro `<p>`, optional children, and an absolutely-placed
  aria-hidden `illustration` slot. Every content page passes a `<PostageStamp>` (RSVP passes an
  `<Illustration>`).

### Decorative
- **`Illustration.tsx`** — inline-SVG library. Props `{ name, size?, tone?, className?, title?,
  strokeWidth? }`. 18 names: `lemonBranch, lemon, oliveBranch, cypress, villa, arch, bicycle,
  suitcase, key, airplane, compass, wineGlass, wineBottle, espresso, music, candles, heart,
  envelope`. 7 tones: `olive, olive-light, terracotta, gold, sage, ink, cream` (mapped to color
  tokens). `title` → `role="img"` + `<title>`; omit → decorative `aria-hidden`.
- **`PostageStamp.tsx`** (+ `.module.css`) — vintage-stamp wrapper around `Illustration`. Props
  `{ variant, size?, rotate?, className?, label? }`. 10 variants: `villa, lemon, cypress, wine,
  bicycle, olive, espresso, music, key, compass`. Perforated frame (paper fill + sand inner tint),
  aspect `100/118`, `aria-hidden`.
- **`ScallopFrame.tsx`** (`"use client"`) — scalloped border traced around its (position:relative)
  parent. Props `{ color, target?, inset?, strokeWidth? }`. Uses `ResizeObserver`. Used by
  `ScheduleCard` (terracotta) and `KindlyRespondCard` (sky-blue).

### Content / interactive
- **`ScheduleCard.tsx`** (`"use client"`) — prop `{ showButton? }`. Reads `data/schedule.ts`; day
  tabs + event rows + optional "View Full Schedule" link. Used by `/our-weekend` (`showButton={false}`).
- **`FaqAccordion.tsx`** (`"use client"`) — exports `type FaqItem = { question, answer: ReactNode }`.
  Prop `{ items }`. Single-open accordion. Used by `/faq`.
- **`KindlyRespondCard.tsx`** (`"use client"`) — the RSVP flow. No props. State machine
  `search|found|notFound|error|submitted`; calls `findPartyForRsvp` / `submitRsvp` from
  `lib/supabase`. Wrapped in `ScallopFrame`. Used by `/rsvp`.

### Orphans (exist but unused by any route — verify intent before relying on them)
- **`EditorialCard.tsx`** — script/plain heading card with CTA. Not imported anywhere.
- **`GuestHomeCard.tsx`** — "Guest Home (My Trip)" task-list card (prop `guestName`). Not imported;
  likely a future logged-in guest dashboard.

---

## 5. Content-page template

Every non-home public page follows this skeleton (`styles` = `ContentPage.module.css`):

```tsx
export const metadata = { title, description };
export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero eyebrow title intro illustration={<PostageStamp variant="…" rotate={…} />} />
        <div className={`page-shell ${styles.page}`}>
          {/* <section className={styles.section}> … </section>  (repeated) */}
          {/* optional <div className={styles.ctaBand}> … RSVP button </div> */}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
```

`ContentPage.module.css` class API: `.page .section .sectionEyebrow .sectionTitle .sectionIntro
.prose .grid .card .cardIcon .cardTitle .cardBody .callout/.calloutIcon/.calloutBody .tbd
.scheduleWrap .ctaBand/.ctaText`. Per-page copy is co-located as `const` arrays in the page file.
RSVP is the exception (drops `KindlyRespondCard` instead of sections).

---

## 6. Breakpoints

| Width | Where |
|---|---|
| `max-width: 767px` | dominant mobile (most modules) |
| `max-width: 899px` | PageHero only (hides side illustration) |
| `768–1199px` | tablet band (Hero, page.module) |
| `1200–1599px` | large-desktop hero height (Hero only) |
| `max-width: 1099px` | page-shell gutter step |

Reuse these; do not introduce new breakpoint values.
