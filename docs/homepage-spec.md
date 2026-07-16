# Homepage Spec — Public Wedding Cover (1:1)

Build spec for `/` (`app/page.tsx` + `components/Hero.tsx`), adapted from the supplied mockup + CSS
brief onto the **existing** design system (see [`design-system.md`](./design-system.md)). The target
is a full-screen editorial "invitation cover," not a dashboard and not a stationery card.

> **Status:** spec only. No code written yet. Illustrations, the hero photo, and Canela Sans are
> pending → every dependency below is marked **[SWAP]**.

---

## 1. Intent & the big change

The mockup is a **full-bleed** landscape hero with a soft top fade, centered editorial typography,
a tilted postage stamp upper-right, and a handwritten footer line. The **current** `Hero.tsx` renders
a *framed photograph / card* (recent commits: "Make hero read as a placed, framed photograph",
"Rebuild scalloped card frames"). **This is a genuine rebuild of the hero, not a tweak** — the frame,
card, and `next/image` framing come out; a full-cover background + veil go in.

What must NOT change (from the brief's "visual rules"): no card wrapper, no dark overlay, no
saturated/heavy image, no pill button, no gradient/icon in the button, single CTA, no under-fold
scroll section, no countdown, no big footer nav, no glassmorphism/heavy shadows, stamp stays out of
the central text column, keep the handwritten line, keep the logo left-aligned.

---

## 2. Approach — adapt, don't duplicate

- **Do NOT** create `PublicWeddingHeader`, `PublicWeddingHero`, `PublicWeddingMonogram`,
  `PublicWeddingStamp`, `PublicWeddingFooterMessage`, `styles/public-home.css`, or `--home-*` tokens.
- **Reuse** existing tokens (colors already match — see design-system §1), fonts, `.page-shell`
  concept, and the `Illustration`/`PostageStamp` components.
- **Rebuild `components/Hero.tsx` + `Hero.module.css`** as the full-bleed hero.
- **Extend `components/SiteHeader.tsx` + `SiteHeader.module.css`** for the homepage header (see §4).
  Confirm against other-page mockups whether this becomes the shared header or a homepage variant
  (open item — see `decisions.md`).

---

## 3. Copy (final — overrides the mockup)

| Slot | Text |
|---|---|
| Eyebrow | Join us for a week in |
| Country (h1) | Italy |
| Couple | Kelsey & Andrew's |
| Event | Wedding Week |
| Date meta | **June 16 – 21, 2027** |
| Location meta | **Tuscany, Italy** |
| Primary CTA | RSVP / Login to Get Started → `/rsvp` |
| Footer line | We can't wait to celebrate with you |

The mockup's "San Francisco, California" and "June 16 – 21, 2028" are placeholder errors — do not use
them. At build time update `data/siteContent.ts` `wedding.dateLabel` → "June 16 – 21, 2027" and
`wedding.locationLabel` → "Tuscany, Italy" (venue/exact date still officially TBD). **[recorded — not
changed this session]**

---

## 4. Header (adapt `SiteHeader`)

Wider/airier than the content-page header. Left-aligned brand, spaced uppercase nav, olive button.

- **Brand:** "K & A" monogram (terracotta, editorial italic, ~31px desktop) **+ a small lemon sprig
  beside it** (`~73px` wide). **[SWAP]** sprig SVG — interim: reuse `Illustration name="lemonBranch"`
  or the existing `public/assets/illustrations/lemon-sprig.svg`.
- **Nav:** uppercase, `font-size ~11px`, `letter-spacing ~0.14em`, `gap clamp(26px, 3vw, 53px)`,
  hover underline. Items from `siteContent.navigation`.
  - Mockup shows **6** items: Our Weekend · Travel · Stay · **Activities** · Things to Do · FAQ.
    Repo currently has 5 (no Activities). **Open item** — do not invent the Activities route; add the
    nav entry only once its mockup is provided (see `decisions.md`).
- **Button:** label **"RSVP / Login"**, olive-dark, `border-radius: 3px` (small radius, not pill),
  `min-height 42px`, → `/rsvp`. Reuse `.btn-primary` styling; the "Login" wording is aspirational
  (see decisions).
- **Header height:** `78px` desktop, `62px` mobile. Background `rgba(250,247,242,0.97)` with a
  `1px` bottom border in `--color-border`-ish olive tint.
- **Mobile (≤767px):** hide desktop nav, show the existing hamburger → `MobileMenu`. Compact monogram
  (~26px) + smaller sprig (~57px).

---

## 5. Hero layout & background

- **Height:** `min-height: calc(100svh - header)`, floor ~`760px` desktop. `overflow: hidden`,
  `isolation: isolate`.
- **Background layer** (z-index below content): full-cover landscape,
  `background: url(...) center bottom / cover no-repeat`. Focal point tunable via CSS vars:
  ```css
  --hero-position-x: 50%;
  --hero-position-y: 100%;
  background-position: var(--hero-position-x) var(--hero-position-y);
  ```
  **[SWAP]** real image `public/images/tuscan-homepage-landscape.jpg`. Interim placeholder:
  `public/assets/hero/villa-estate.jpg` (or `valdorcia.jpg`). Because the placeholder's composition
  differs from the mockup, defer final focal-point tuning until the real image lands.
- **Veil layer (critical):** a separate absolutely-positioned element over the image (NOT lowered
  opacity on the whole hero — that would fade the text). Two stacked gradients:
  - linear top→bottom: cream `~0.97 → 0.9 → 0.58 → 0.12 → 0.08`,
  - radial ellipse at `50% 23%`: paper `~0.98 → 0.81 → 0.24 → transparent`.
  Keeps the top-center light so type stays readable; landscape detail (cypress left, villa right,
  rolling hills center-bottom) reads through the lower half.

---

## 6. Central content stack

Column `width: min(650px, 100% - 48px)`, centered, `padding-top: clamp(68px, 8.5vh, 105px)`,
`text-align: center`, above the veil (`z-index` ~4). Order + treatment:

1. **Eyebrow** — `--font-sans` (→ Canela when available **[SWAP]**), 14px, 600, `letter-spacing
   .22em`, uppercase, `--color-olive-dark`.
2. **Center lemon sprig** — `~115px` wide, centered. **[SWAP]** `small-lemon-sprig.svg`; interim
   `Illustration name="lemonBranch"`.
3. **"Italy" (h1)** — `--font-heading` (Playfair) italic, `clamp(78px, 7vw, 112px)`, `letter-spacing
   -.045em`, `line-height .96`, `--color-olive-dark`. Real semantic `<h1>`.
4. **Gold divider** — `grid 1fr / 23px / 1fr`, ~365px max-width, two `1px` citrus-gold rules flanking
   a center heart. **[SWAP]** `heart-solid-gold.svg`; interim `Illustration name="heart" tone="gold"`.
5. **Couple** — "Kelsey & Andrew's", Playfair italic, `clamp(42px, 4vw, 58px)`, `--color-ink`.
6. **Event** — "Wedding Week", Playfair italic, `clamp(49px, 4.5vw, 65px)`, `--color-ink`.
7. **Meta** — two lines, `--font-sans`, 14px, 700, `letter-spacing .19em`, uppercase,
   `--color-olive-dark`: "June 16 – 21, 2027" / "Tuscany, Italy".
8. **Primary CTA** — `.btn-primary`-based, `width: min(370px, 100%)`, `min-height 54px`,
   `border-radius 3px` (**not** pill, no icon, no gradient), soft shadow; label "RSVP / Login to Get
   Started" → `/rsvp`. Focus ring: citrus-gold outline.

---

## 7. Postage stamp (upper-right)

`width: clamp(145px, 12vw, 192px)`, absolutely positioned `top: clamp(54px,6vw,86px)` /
`right: clamp(64px,8vw,145px)`, `rotate(6deg)`, `z-index` ~3. Must not overlap the nav or enter the
central text column. **[SWAP]** `villa-postage-stamp.svg`; interim `PostageStamp variant="villa"
rotate={6}`. Mobile: shrink to ~88px / move in; hide entirely below 420px.

---

## 8. Bottom handwritten message

Absolutely positioned near the bottom fade, centered, `pointer-events: none`: "We can't wait to
celebrate with you" in an italic serif (Cormorant, ~21px, `--color-terracotta`) + a small red
outline heart below. **[SWAP]** the approved **handwritten/script font** (do not use a casual brush
font) and `heart-outline-red.svg` (interim `Illustration name="heart" tone="terracotta"`). On mobile
this becomes a static block below the content rather than absolutely positioned.

---

## 9. Mobile behavior (≤767px)

Preserve the editorial concept — do NOT convert to a card screen. Compact monogram + sprig, hamburger
menu, desktop nav hidden, background retained, smaller centered title stack, stamp moved/hidden,
full-width CTA with side margins, page allowed to scroll on short screens. Header height `62px`.
Reuse existing breakpoints (767 primary; 420 to hide the stamp).

---

## 10. Accessibility

Real `<h1>` for "Italy"; real `<a>`/`<Link>` for the CTA and header button; visible keyboard focus
states (citrus-gold ring); `alt=""` + `aria-hidden` on decorative illustrations; meaningful `alt` on
the landscape if rendered as `<img>`; ≥44px interactive targets; hamburger has an accessible name;
`prefers-reduced-motion` disables the nav-underline and CTA transitions; no text baked into the
image; correct heading order (single h1).

---

## 11. Desktop checkpoints (screenshot-compare pass)

After building, compare against the mockup at **1536×1024** (also spot-check 1440×900, 1920×1080):
- Header 78px; monogram ~52px from left; sprig beside monogram; button ends ~84px from right.
- Eyebrow ~75–95px below header; "Italy" ~100px tall; CTA ~370px wide; stamp ~175px wide.
- Cypress trees align to the left quarter; villa in the upper-right hillside; central text avoids
  high-contrast tree/building; valley leads toward center; handwritten line near the bottom fade.
- **No horizontal scrolling** at any width.

> This checkpoint pass only reaches true 1:1 once the real hero image, illustration SVGs, and Canela
> Sans / script fonts are in place. With placeholders it validates layout, spacing, and hierarchy.

---

## 12. Swap-point summary

| Placeholder (now) | Final asset **[SWAP]** |
|---|---|
| `assets/hero/villa-estate.jpg` (or valdorcia) | `images/tuscan-homepage-landscape.jpg` |
| `Illustration lemonBranch` (brand + center) | `lemon-sprig.svg` / `small-lemon-sprig.svg` |
| `Illustration heart tone="gold"` | `heart-solid-gold.svg` |
| `Illustration heart tone="terracotta"` | `heart-outline-red.svg` |
| `PostageStamp variant="villa"` | `villa-postage-stamp.svg` |
| `--font-sans` (DM Sans) for UI | Canela Sans (via `next/font/local`) |
| Cormorant italic for footer line | approved handwritten/script font |
