# Page Spec — Our Weekend (Weekend Schedule)

Route `/our-weekend`. Uses the shared [content-page frame](../content-page-frame.md). Hero title
**"Weekend Schedule"**; subtitle "A week of celebration, connection and unforgettable moments in
Italy." Body = a left **AT A GLANCE** sidebar + a right **day-by-day timeline**.

> Copy: **June 16 – 21, 2027**. Images are **[SWAP]** points.

## Layout (two-column, sidebar left)

### Left sidebar
1. **AT A GLANCE** card (calendar icon) — compact list of all days:
   | Day | Event |
   |---|---|
   | MON · Jun 16 | Welcome Dinner · 6:00 PM |
   | TUE · Jun 17 | Wine Tasting · 4:00 PM |
   | WED · Jun 18 | Cooking Class · 10:30 AM |
   | THU · Jun 19 | Pool Day & Lunch · 12:00 PM |
   | FRI · Jun 20 | Town Excursion · 3:00 PM |
   | SAT · Jun 21 | Farewell Party · 7:00 PM |
2. **NOTE** callout (info icon, sand/grey box): "Times and details are subject to change. Check back
   for updates as we get closer!" → reuse `ContentPage` `.callout`.
3. **DOWNLOAD ITINERARY** card → **"DOWNLOAD ICS"** button (`.btn-outline`) with a calendar icon.
   Generates an `.ics` from the schedule (public, no personalization).
4. Decorative **bicycle + branch** illustrations below the sidebar. Interim `Illustration
   name="bicycle"` / `lemonBranch`.

### Right timeline (one row per day)
Each row: **day icon** (left) · **DAY + DATE** · **photo thumbnail** · **title + description** ·
**time** (clock icon) · **location** (pin icon). Rows:

| Icon | Day | Title | Time | Location |
|---|---|---|---|---|
| wine glass | MON Jun 16 | Welcome Dinner — "Kick off the week with a relaxed welcome dinner at the villa…" | 6:00–9:00 PM | Villa Courtyard |
| wine bottle | TUE Jun 17 | Wine Tasting — "…an afternoon at a local vineyard to taste the best of Tuscany…" | 4:00–6:30 PM | Local Vineyard |
| rolling pin* | WED Jun 18 | Cooking Class — "Learn to make fresh pasta and classic Italian dishes…" | 10:30 AM–1:30 PM | Villa Kitchen |
| sun* | THU Jun 19 | Pool Day & Lunch — "Relax, swim and soak up the sun. Lunch served poolside." | 12:00–4:00 PM | Villa Pool |
| church/town | FRI Jun 20 | Town Excursion — "Explore a charming local town with shopping, aperitivo and dinner…" | 3:00–8:00 PM | Nearby Hill Town |
| music | SAT Jun 21 | Farewell Party — "Our last night together! Dinner, dancing and memories to last a lifetime." | 7:00–11:00 PM | Under the Stars |

\* `Illustration` has no `rollingPin`/`sun` — either add them to the library, or map to existing
names (`espresso`/`candles`) as interim. **[decide at build]**

### Bottom band (inside panel, above footer band)
Three mini-blocks in a sand/grey strip: **WHAT TO WEAR** (megaphone) · **SHARE YOUR PHOTOS** (camera,
"#ChehakShultsWedding" in terracotta) · **QUESTIONS?** (olive branch, **"VIEW FAQ"** `.btn-outline` →
`/faq`). Then the shared footer band.

## Reuse vs. build
- **Reuse/extend `ScheduleCard`** + **`data/schedule.ts`**. The data file currently models Wed–Mon
  with only Saturday populated; **repopulate to Mon–Sat June 16–21 2027** with the six events above.
  Extend `ScheduleEvent`/`ScheduleDay` to carry `description`, `photo`, and `endTime`.
- `ScheduleIcon` type is currently `"villa" | "wine" | "music"` — **extend** to cover the six icons.
- Timeline photos + the ICS generator are new. Photos = **[SWAP]** (`public/assets/photos/…` interim).
- Reuse `.callout`, `.btn-outline`, `Illustration`, the shared frame header/footer/stamp.

## Public vs. personalized
Entirely **public/static** — no deferred features on this page.
