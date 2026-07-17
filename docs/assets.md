# Assets — Standard & Inventory

Single source of truth for illustrations, photos, and fonts. Use this checklist while producing the
SVG set. Copy/dates policy is unaffected: **June 16 – 21, 2027 / Tuscany, Italy** everywhere.

---

## Delivery standard (illustrations)

1. **Format: SVG.** Deliver each illustration as an SVG — crisp at every size (73px header sprig up to
   large hero art), one file per asset.
2. **Run SVGO before committing.** Auto-traced SVGs are huge (~1 MB raw); SVGO cuts them by roughly a
   third and gzips to ~200–280 KB. Command: `npx svgo -i file.svg -o file.svg --multipass`. Ship the
   minified version, never the raw trace. (I can do this pass when wiring them in.)
3. **Clean filenames.** Lowercase, hyphenated, descriptive — **no spaces or commas** (they break in
   URLs). E.g. `lemon-branch.svg`, `villa-stamp.svg`, `heart-gold.svg`.
4. **Transparent background.** No white box behind the art (corners must be fully transparent).
5. **Reference as `<img>` / `next/image`, not inlined into JSX.** A traced SVG is ~2 000 path nodes;
   inlining bloats the DOM. As an external `<img src>` the browser decodes it once.
6. **Colored SVGs have baked fills.** Unlike the line-art `Illustration` component (which recolors via
   `currentColor` + tone tokens), these painterly/colored SVGs are **standalone assets**, not new
   `Illustration` entries. That's fine — just don't expect to re-tint them via CSS.
7. **Header crop.** The full three-lemon branch is too busy at the ~73px header slot beside "K & A" —
   provide a **cropped single-sprig variant** for the header.
8. **PNG only as fallback.** If an asset can't be vector, deliver a transparent PNG at **2–3× its
   display size** (e.g. ≥345 px for a 115 px sprig).

---

## Illustration inventory (public-first — build now)

Canonical filename = what the build will reference (interim placeholder = existing repo asset used
until the real one lands). Target dir: `public/assets/illustrations/` (or `public/illustrations/`).

| Canonical file | Used on | Interim placeholder | Status |
|---|---|---|---|
| `lemon-branch.svg` (colored) | homepage/footer bands, section accents | uploaded (see below) | ⏳ rename + SVGO |
| `lemon-sprig.svg` (header, beside "K & A") | homepage + all page headers | `Illustration lemonBranch` / existing `lemon-sprig.svg` | ⏳ needs **cropped single-sprig** |
| `small-lemon-sprig.svg` (centered, above titles) | homepage hero, content-page hero | `Illustration lemonBranch` | ⏳ pending |
| `olive-lemon-sprig.svg` (centered hero sprig) | 5 content-page heroes | `Illustration oliveBranch`/`lemonBranch` | ⏳ pending |
| `heart-gold.svg` (gold divider heart) | homepage + every page divider/footer | `Illustration heart tone="gold"` | ⏳ pending |
| `heart-outline-red.svg` (title + footer heart) | homepage footer, page title rows, signatures | `Illustration heart tone="terracotta"` | ⏳ pending |
| `villa-stamp.svg` (tilted postage stamp) | homepage + every page header, upper-right | `PostageStamp variant="villa"` | ⏳ pending |
| `wine-glass.svg` (footer band, left) | content-page footer bands | `Illustration wineGlass` | ⏳ pending |
| `bicycle.svg` (decorative) | our-weekend, travel, activities, faq | `Illustration bicycle` | ⏳ pending |
| Line icons — `airplane, car/compass, key, suitcase, calendar, clock, pin, wine, bicycle, cypress, arch, music, villa` | travel/stay/activities/schedule/faq cards & badges | `Illustration` names (18 available) | ⏳ some map, some to add |

> The existing line-art `Illustration` set (18 names, 7 tones — see `design-system.md` §4) already
> covers many small icons. Only deliver custom SVGs where the mockup's art differs from those.

## Illustration inventory (portal — FUTURE-STATE, not greenlit)

The full manifest for the personalized portal is in
[`guest-portal/master-brief.md`](./guest-portal/master-brief.md) §40 (adds `tiny-olive-sprig`,
`olive-sprig`, `bicycle-small`, `bicycle-with-branch`, `calendar-sketch`, `heart-outline-gold`,
`heart-outline-white`, plus a `/icons/*` set and `/borders/scalloped-*-card.svg`). Only relevant if
the portal is greenlit (see `decisions.md` D9). Several overlap with the public set above — reuse, do
not duplicate.

---

## Photo inventory

Real photography **[SWAP]**; interim = existing `public/assets/hero|photos/*`. Never ship AI
placeholder photos as permanent venue content.

| Need | Target path | Interim | Status |
|---|---|---|---|
| Hero landscape (homepage + faded page bg) | `public/images/tuscan-homepage-landscape.jpg` | `assets/hero/villa-estate.jpg` / `valdorcia.jpg` | ⏳ pending |
| Villa exterior (Stay) | `public/assets/hero/…` | `assets/hero/villa-estate.jpg` | ⏳ pending |
| Room-category thumbnails ×4 (Stay) | `public/assets/rooms/…` | branded placeholder w/ room line-drawing | ⏳ pending |
| Per-day schedule photos ×6 (Our Weekend / Schedule) | `public/assets/photos/…` | existing `photos/*` | ⏳ pending |
| Activity photos ×6 (Activities) | `public/assets/activities/…` | existing `photos/*` | ⏳ pending |

---

## Fonts

| Font | Role | Status |
|---|---|---|
| **Canela Sans** | primary UI font (`--font-sans` swap) | ⏳ licensed, not supplied — interim DM Sans |
| **Canela** | editorial body (portal only) | ⏳ pending (future-state) |
| Handwritten / script | homepage footer line ("We can't wait…") | ⏳ pending — interim Cormorant italic |
| Playfair Display · Cormorant Garamond · DM Sans · Allura | already wired (`app/layout.tsx`) | ✅ in place |

Never substitute a geometric sans (Inter/Poppins/Montserrat) for the UI font, or a casual brush font
for the script line, without sign-off.

---

## Already uploaded (needs housekeeping)

On **`main`** (not the working branch `claude/wedding-homepage-brief-review-xtzdc1`):
- `public/assets/illustrations/ChatGPT_Image_Jul_16__2026__04_49_44_PM__1_-removebg-preview.png` —
  transparent PNG, 612×408, faithful. Fine as a fallback.
- `public/assets/illustrations/ChatGPT Image Jul 16, 2026, 04_49_44 PM (1).svg` — **true vector**
  (1 959 paths), renders identically; **1.23 MB raw** → 734 KB (SVGO) → ~278 KB gzipped.

**Action at build:** adopt the SVG as `lemon-branch.svg` → run SVGO → rename (kill the
spaces/commas) → bring onto the working branch. Prefer the SVG over the PNG.
