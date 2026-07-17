# Page Spec — Stay (Browse Where You'll Stay)

Route `/stay`. Uses the shared [content-page frame](../content-page-frame.md). Hero title **"Browse
Where You'll Stay"**; subtitle "Room blocks and details for our week in Italy." Body = villa hero +
room categories + policies.

> Copy: **June 16 – 21, 2027 / Tuscany, Italy**. Photos are **[SWAP]**. "Your Room" is **deferred**.

## Layout

### Top: villa intro + villa photo (two columns)
- **Left card — THE VILLA:** "**Villa di Santa Lucia**", "Tuscany, Italy", "Our home for the week! We
  have exclusive use of the villa and all amenities." Three facts w/ icons: **Sleeps 50 guests** ·
  **25 Rooms & Suites** · **Pool, gardens, terraces & multiple gathering spaces**. Link:
  "VIEW AMENITIES & PHOTOS →". (Villa name/facts are placeholder content — confirm before publish.)
- **Right — large villa photograph** **[SWAP]** (interim `public/assets/hero/villa-estate.jpg`).

### Middle: Your Room Assignment + Room Categories
- **YOUR ROOM ASSIGNMENT** card (left): "You are staying in: **Olive Grove Room** · Room 12 · King
  Bed" + info note "We can't wait to host you!…" + branch illustration. ⚠️ **DEFERRED / personalized**
  — hide or show a generic placeholder until the guest system resolves the logged-in guest's room.
- **ROOM CATEGORIES** (right, 4 cards with thumbnails **[SWAP]**):
  - **GARDEN ROOMS** — "A peaceful retreat surrounded by the villa's gardens." · 12 Rooms
  - **OLIVE GROVE ROOMS** — "Located near the olive groves with beautiful views." · 8 Rooms —
    carries the **"YOUR ROOM"** badge ⚠️ **DEFERRED** (badge only renders for the matching guest).
  - **VILLA SUITES** — "Spacious suites with separate seating areas." · 4 Suites
  - **FAMILY SUITES** — "Ideal for families or groups with extra space to relax." · 1 Suite

### Bottom: policies + questions + share (three columns)
- **ROOM POLICIES:** Check-in Mon Jun 16 after 3:00 PM · Check-out Sat Jun 21 by 11:00 AM · daily
  housekeeping · special requests welcome. Wine-glass illustration.
- **QUESTIONS?** — **blue wavy-border box** (`ScallopFrame color="var(--color-sky-blue)"`): "If you
  have any questions about your room, the villa, or need any special accommodations, we're here to
  help!" **"VIEW FAQ →"** (`.btn-outline`/`.btn-blue`) + lemon/branch illustration.
- **SHARE YOUR STAY** — "We'd love to see your photos from the villa! Tag us and use our hashtag."
  "#ChehakShultsWedding" (terracotta) + bicycle illustration.

Then the shared footer band ("WE CAN'T WAIT TO WELCOME YOU TO ITALY!").

## Reuse vs. build
- Reuse `ContentPage` `.grid`/`.card`, `Illustration` (`key`, `wineGlass`, `bicycle`, `oliveBranch`,
  building/bed icons — add bed icon or map), the button family, **`ScallopFrame`** for the blue box,
  and the shared frame.
- Room-category + villa **photos are new [SWAP]** assets (`public/assets/rooms/…` to be added).

## Public vs. personalized
- **Public/static:** villa intro, all room categories, policies, questions/share boxes.
- **Deferred:** "Your Room Assignment" card + the "YOUR ROOM" category badge (guest system).
