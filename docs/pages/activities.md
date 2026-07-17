# Page Spec — Activities & Experiences

**New route `/activities`** (confirmed by mockup; add to `siteContent.navigation`). Uses the shared
[content-page frame](../content-page-frame.md). Hero title **"Activities & Experiences"**; subtitle
"Join us for a week filled with unforgettable moments." Body = planned-activity card grid + legend +
"things to do on your own" + footer.

> Copy: **June 16 – 21, 2027**. Photos **[SWAP]**. Sign-up / attendance state is **deferred**.

## Layout

### PLANNED ACTIVITIES (clipboard icon)
Intro: "These are the events we're planning for our week together. Sign up for the ones you'd like to
join!" Then a **6-card row**, each with a **photo [SWAP]**, a **status badge** (top-left of photo), a
date label, title (Cormorant italic), location, time, short description, and a **status control**:

| Card | Date | Badge | Control (⚠️ deferred state) |
|---|---|---|---|
| Welcome Dinner · Villa Courtyard · 6–9 PM | Mon Jun 16 | REQUIRES RSVP (terracotta) | "✓ You're attending!" |
| Wine Tasting · Local Vineyard · 4–6:30 PM | Tue Jun 17 | REQUIRES RSVP | **SIGN UP** (filled) |
| Cooking Class · Villa Kitchen · 10:30 AM–1:30 PM | Wed Jun 18 | REQUIRES RSVP | **SIGN UP** (outline) |
| Pool Day & Lunch · Villa Pool · 12–4 PM | Thu Jun 19 | NO RSVP NEEDED (olive) | "✓ You're attending!" |
| Town Excursion · Nearby Hill Town · 3–8 PM | Fri Jun 20 | OPTIONAL (olive) | **SIGN UP** (outline) |
| Farewell Party · Under the Stars · 7–11 PM | Sat Jun 21 | NO RSVP NEEDED | "✓ You're attending!" |

⚠️ **DEFERRED / personalized:** the Sign-Up buttons, "You're attending!" confirmations, and per-guest
RSVP status all need the guest system. Build the cards + badges + a **static default control** (e.g.
a plain "Sign up" that links to `/rsvp`, or a disabled state) now; wire real attendance later.

### Legend (four items)
**Requires RSVP** (bookmark) — "Please sign up so we can plan accordingly." · **You're Attending**
(check) — "Thanks! We can't wait to see you there." · **No RSVP Needed** (calendar) — "Just come
ready for a great time!" · **Optional** (branch) — "Join if you'd like—no pressure either way." Plus a
**"VIEW FULL SCHEDULE →"** button (`.btn-outline` → `/our-weekend`).

### THINGS TO DO (ON YOUR OWN) (bicycle icon)
Intro "Some ideas for exploring the area in your free time." **6 mini-cards** with line
illustrations + chevrons:
- **EXPLORE LOCAL TOWNS** — "Visit nearby towns like Montepulciano, Montalcino and Pienza." (town)
- **HIKE & NATURE WALKS** — "Scenic trails and breathtaking views are everywhere." (cypress)
- **WELLNESS & RELAXATION** — "Book a spa treatment or enjoy some quiet time by the pool." (amphora)
- **GOLF** — "Beautiful courses just a short drive from the villa." (golf clubs)
- **ART & CULTURE** — "Museums, galleries and historic sites to explore." (arch/column)
- **SHOP & SIP** — "Boutiques, local markets and wine bars for a slow afternoon." (wine + bag)

Then the shared footer band ("WE CAN'T WAIT TO SHARE THIS WEEK WITH YOU!").

## Reuse vs. build
- Activity cards, status badges, and the sign-up control are **new** components (build within the
  panel; badges are simple token-colored pills — terracotta / olive).
- Reuse `Illustration` for the mini-card line icons (`cypress`, `arch`, `wineGlass`, `bicycle`,
  `oliveBranch`; add town/golf/spa or map to existing). Reuse the button family + shared frame.
- Activity **photos are new [SWAP]** assets.

## Public vs. personalized
- **Public/static:** activity list, badges, descriptions, legend, "things to do", View Full Schedule.
- **Deferred:** Sign-Up actions, "You're attending!" states, per-guest RSVP status (guest system).
