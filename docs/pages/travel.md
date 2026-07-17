# Page Spec — Travel (Book Your Travel)

Route `/travel`. Uses the shared [content-page frame](../content-page-frame.md). Hero title **"Book
Your Travel"**; subtitle "Flights, transportation options and tips to help you plan your journey to
Italy." Body = a **two-row grid of cards** (3 across, then 3 across).

> Copy: **June 16 – 21, 2027**. Icons via `Illustration`; the "Add Travel Info" form is **deferred**.

## Layout

### Row 1 (three cards)
1. **GETTING TO ITALY** (airplane icon) — "We recommend flying into one of the following airports:"
   - **FLR** — Florence, Italy
   - **PSA** — Pisa, Italy
   - **ROM** — Rome, Italy
   - `.callout`: "Florence (FLR) is the closest and most convenient option to our wedding villa."
2. **RECOMMENDED BOOKING WINDOW** (calendar-check icon) — a calendar illustration + "Book your
   flights **4–6 months in advance** for the best prices and availability." Then: "Plan to arrive
   between **Monday, June 16 – Wednesday, June 18**. Our welcome events begin the afternoon of
   June 16."
3. **GROUND TRANSPORTATION** (car icon) — "Once you arrive, here are the best ways to reach the
   villa:" three rows with chevrons:
   - **PRIVATE SHUTTLE** — "Pre-book a group or private transfer"
   - **RENT A CAR** — "Recommended for flexibility"
   - **TRAIN** — "Scenic option to nearby towns"
   - link: "View full transportation guide →"

### Row 2 (three cards)
4. **TRAVEL TIPS** (lightbulb icon) — four items with small icons: **Check passport validity**
   (passport valid ≥6 months after return) · **Travel insurance** (recommended) · **Pack smart**
   (comfortable shoes, sun protection, layers) · **Stay connected** (international plan / eSIM).
   Decorative branch bottom-right.
5. **SHARE YOUR TRAVEL PLANS** — **blue wavy-border box** → reuse **`ScallopFrame
   color="var(--color-sky-blue)"`**. Heading (sky-blue), red heart, "Let us know your flight details
   so we can plan your arrival and any transportation needs!", **"ADD YOUR TRAVEL INFO"** button
   (`.btn-blue`), decorative bicycle. ⚠️ **DEFERRED** — the submission needs the guest system; build
   the box + disabled/placeholder button now, wire it up later.
6. **QUESTIONS?** — "Check out our FAQ or reach out if you need any help planning your trip."
   **"VIEW FAQ"** button (`.btn-outline` → `/faq`) + decorative amphora/vase illustration.

Then the shared footer band ("WE CAN'T WAIT TO WELCOME YOU TO ITALY!").

## Reuse vs. build
- Reuse `Illustration` (`airplane`, `suitcase`/passport, `key`, `compass`, `wineGlass`, `bicycle`);
  some icons (car, calendar-check, lightbulb, shield, passport, vase/amphora, train) may need adding
  to the library or mapping to existing names. **[decide at build]**
- Reuse `ContentPage` `.grid`/`.card`/`.callout`, the button family, and **`ScallopFrame`** for the
  blue box. No new tokens.

## Public vs. personalized
- **Public/static:** all travel info, tips, airports, transport, Questions box.
- **Deferred:** "Add Your Travel Info" / "Share Your Travel Plans" submission (guest system).
