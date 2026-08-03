# Kelsey & Andrew — Stationery Spec (authoritative)

**Status:** working spec, 2026‑08‑02. Merges the ChatGPT production spec (a strong skeleton
— keep its per‑item print details) with corrections grounded in *this project's* actual
website, admin, and the decisions we've locked. Where they conflict, **this doc wins.**

Everything in `[BRACKETS]` is a genuine fill‑in (not yet decided). Venue names, exact figures,
and deadlines in any earlier mockup are **placeholders** until the venue is contracted.

---

## 0 · Read this first — five corrections that override the ChatGPT spec

1. **The QR "personalized landing page" doesn't exist yet.** That spec assumes each QR opens a
   secure, per‑household, token‑gated page. The live site is a **name + email RSVP lookup**
   (`get_party_for_rsvp` / `submit_rsvp`) — **no guest accounts or tokens.** Two paths:
   - **Simplest (ship‑now):** QRs point to public pages; the guest enters **name + email** to
     reach *their* balance/room/meal form. Reuses what exists.
   - **Richer (a real build):** the per‑household portal (`/guest/[token]/…`). This is the
     "guest portal" — **not built, not greenlit.** Don't promise personalized cards until it is.
   - The website‑data + admin‑export lists in the ChatGPT spec are **half already built** (guests,
     parties, travel, CSV exports) and **half not** (deposit/Stripe, meal form). See §5.

2. **Date conflict — fix before anything prints.** Mockups say *"Saturday, June 19 — Wedding Day."*
   Our actual schedule has the **ceremony on WEDNESDAY, JUNE 18** (Thu = pool day, Sat = farewell).
   That's the traditional‑template's Saturday assumption leaking in. Correct everywhere. (Full
   week below in §4 · Weekend Itinerary.)

3. **Pricing / rooms / deposit are decided — no placeholders on these:**
   - **Flat per‑person rate, same for everyone regardless of room.** Adults `$1,000`, children
     `$500` (*example figures — confirm finals*). State the number plainly; **do not** explain the
     math, say "splitting the villa evenly" (implies guests fund our costs), or over‑reassure
     ("nothing to compare"). Less is more.
   - **We assign rooms.** Guests may submit *preferences/requests*; they do **not** select.
   - **Hybrid deposit:** available to pay **now** (Stripe) for the do‑it‑now crowd, but only
     **required by `[deposit deadline]`** for those who wait.
   - **Refund policy follows the chosen venue's.** Don't invent one.

4. **Use art you already own for the liner + motifs.** The spec rightly says *no AI imagery — use
   licensed/public‑domain art.* You already have legally‑clean **public‑domain Italian landscape
   paintings** in `public/assets/art/` (e.g. `vista`, `tivoli`, `garden-cypress`, `pastoral`). Any
   of these can be the **envelope liner** and supporting motifs — no commission, no license risk.
   (Swan *line art* would still need a licensed/commissioned vector.)

5. **Never say "buyout."** Use *"we've reserved the entire villa for our group."* (This one the
   ChatGPT spec already got right — keeping it.)

---

## 1 · Brand quick‑reference (locked)

**Palette** (core — from the brand sheet):

| Color | Hex | Use |
|---|---|---|
| Warm Cream | `#FAF6EC` | Paper ground |
| Ivory | `#FDFAF3` | Raised cards |
| Warm Ink | `#2F2A24` | Text (never pure black) |
| Cornflower | `#6F9FCE` | Dates, info labels, digital accents |
| Terracotta | `#D96B3F` | Select words, tiny rules, web buttons |
| Herb Green | `#6E8B3D` | Olive motifs, borders |
| Deep Cypress | `#3F4A36` | Dark‑green grounding |
| Golden | `#E8B23E` | Small sunlit accents |

**Approved print extensions** (ornate suite only — do NOT add to the website):
Dusty Mauve `#C5A3AD` · Rich Burgundy `#5A2430` · Soft Sage `#A2AA8D` · Dusty Cornflower `#A8BED3`
· Olive‑Gold ink `#9B8952`. Distribution ≈ cream 50‑60% / greens 20‑25% / cornflower 10‑15% /
burgundy 8‑12% / mauve 8‑12% / terracotta+gold accent only. No single card uses all accents.

> **Brand note:** the print suite is a *richer, more ornate cousin* of the website (which stays the
> cleaner terracotta "Dolce Vita" look). That's a deliberate, fine choice — just keep the **website
> touchpoints the QR leads to feeling of‑a‑piece** so the card→site jump isn't jarring.

**Type (locked):** **Cherolina** (script — names/monogram/short Italian lines only, large sizes) ·
**Fraunces** (display — names, MENU, DETAILS, big titles) · **Cormorant Garamond** (serif — body,
menu descriptions, italics) · **Instrument Sans** (uppercase labels, dates, URLs, QR captions).
⚠️ **Cherolina's license is web‑only — do NOT put it on print.** Substitute a free OFL script:
**Allura** (closest match to Cherolina, and already the site's fallback — best for signature/names) or
**Pinyon Script** (more formal, ornate — great for "Benvenuti"). Both are free for commercial print
and available in Canva. Fraunces, Cormorant Garamond, and Instrument Sans are free for any use.

---

## 2 · QR & URL map

Generate **real, static** QR codes from the final URLs (min 0.9″, black/cypress/burgundy on ivory,
printed URL beneath, tested on phones). Separate link per action:

| Card | URL | Status |
|---|---|---|
| Save‑the‑Date (reserve) | `chehakshultswedding.com/reserve` | **needs building** (RSVP + deposit) |
| Meal / dietary card | `chehakshultswedding.com/meals` | **needs building** |
| Details / itinerary | `chehakshultswedding.com/our-weekend` | **live now** |
| Activity cards | `chehakshultswedding.com/activities` | **live now** |

> The `/reserve` and `/meals` flows depend on decisions above (portal vs name+email lookup) and the
> Stripe build. Until those ship, `/reserve` can temporarily point at the existing `/rsvp`. **I can
> generate the QR image files once the final URLs are locked.**

---

## 3 · Finalized copy — Save‑the‑Date (the NOW piece)

5×7, portrait, two‑sided, standard rounded rectangle (die‑cut is prettier but pricier to mail).
**Front = sentimental keepsake, no QR. Back = the ask + QR.**

### Front
> SAVE THE DATE
>
> **KELSEY & ANDREW**  *(Fraunces)*
> *are getting married under the Tuscan sun*  *(Cormorant italic; "and"/accents in Cherolina)*
>
> **JUNE 16 – 21, 2027**  *(cornflower)*
> TUSCANY, ITALY
>
> We've reserved the entire villa for our group.
> Please turn over to save your spot.
>
> chehakshultswedding.com

### Back — "Save your spot"
> **SAVE YOUR SPOT**
>
> We're bringing everyone together under one roof in Tuscany, and because rooms are limited,
> we're planning a little ahead. So we can make sure everyone who wants to join has a spot,
> we'd love your answer early.
>
> **Kindly RSVP by `[RSVP DEADLINE]`.**
>
> We'll take care of your room from there. A small deposit toward your stay holds it — pay now, or
> any time before `[DEPOSIT DEADLINE]`, whatever's easiest.
>
> **[ QR ]**
> SCAN TO RSVP & RESERVE
> chehakshultswedding.com/reserve
>
> *No pressure — we'd just love to know either way.*

**Website `/reserve` flow** (per household, via name+email lookup unless the portal is built):
greeting → attending? → who's coming (adults/children) → room *requests* (near family / access
needs) → **the flat rate shown plainly** (`$1,000 adult · $500 child`) → deposit: pay now **or**
by `[deadline]` → refund policy (follows villa) → Stripe checkout → confirmation + email. Tone stays
warm; **never** "book now or lose your room."

---

## 4 · Finalized copy — the rest of the suite

### Details card (companion to the formal invite)
> **DETAILS**
>
> WEDDING WEEK IN TUSCANY · **JUNE 16 – 21, 2027**
>
> **ACCOMMODATIONS** — Your room was arranged through your early response. Sign in at
> chehakshultswedding.com to see your room, balance, and check‑in details.
>
> **TRANSPORTATION** — Group transport is provided to and from scheduled events; times post on the
> website and in the final itinerary.
>
> **ATTIRE** — `[FORMAL / BLACK‑TIE OPTIONAL / GARDEN FORMAL]`; per‑event notes online.
>
> **WEBSITE** — chehakshultswedding.com

### Accommodations block (website + any pricing card) — minimal, final
> **Accommodations** — Your stay is a flat rate per person: **$1,000 per adult · $500 per child.**
> We'll assign rooms with your group and any requests in mind.
> **Deposit:** `[amount]` per guest to hold your spot, applied toward your total. Our refund policy
> follows our villa's.

### Meal selections & dietary card (the formal invite's response mechanism)
> **MEAL SELECTIONS & DIETARY PREFERENCES**
>
> Please choose an entrée for each guest and share any allergies, dietary needs, or children's meals
> by **`[DEADLINE]`**.
>
> **[ QR ]** · SCAN TO SUBMIT · chehakshultswedding.com/meals
>
> *Your household's already confirmed — this is just for final dining details.*

*(Website form stores structured per‑guest data: entrée, veg/vegan, child meal, allergy, restriction,
severity — not one open text box — so the caterer export is clean.)*

### Formal invitation (ceremonial — no QR, no payment, no re‑RSVP)
> TOGETHER WITH THEIR FAMILIES
>
> **KELSEY CHEHAK**
> *and*  *(Cherolina)*
> **ANDREW SHULTS**
>
> request the pleasure of your company
> at the celebration of their marriage
>
> **WEDNESDAY, JUNE 18, 2027**  ← *(corrected from "Saturday, June 19")*
> at `[TIME]`
>
> `[VENUE NAME]` · TUSCANY, ITALY
>
> *dinner and dancing to follow*

> ⚠️ **Reconcile the ceremony day (Wed Jun 18) before printing.** If you truly want a Saturday
> ceremony, the whole `data/schedule.ts` week needs to change too — right now they disagree.

### Welcome Dinner insert (burgundy)
> **WELCOME DINNER** — Please join us celebrating **KELSEY & ANDREW** · **MONDAY, JUNE 16, 2027**
> at `[TIME]` · `[VENUE]`. *(Everyone's included — no "kindly reply" unless a separate headcount is
> genuinely needed.)*

### Weekend Itinerary card — **corrected to the real schedule**
> **WEEKEND ITINERARY**
> JUNE 16 (Mon) — Welcome Dinner
> JUNE 17 (Tue) — Wine Tasting
> JUNE 18 (Wed) — **The Wedding** · Ceremony, Reception & Dinner
> JUNE 19 (Thu) — Pool Day & Lunch
> JUNE 20 (Fri) — Town Excursion
> JUNE 21 (Sat) — Farewell Party
>
> *For live times, transport, and updates, visit chehakshultswedding.com.*

### Day‑of small pieces (copy)
- **Welcome sign:** *Benvenuti* (Cherolina, cornflower) · **KELSEY & ANDREW** · WEDDING WEEK IN
  TUSCANY · JUNE 16–21, 2027. No QR on the ceremonial sign.
- **Bar sign:** **COCKTAILS & APERITIVI** — Aperol Spritz · Hugo Spritz · Negroni Sbagliato ·
  Prosecco · Limoncello *della casa* (+ a *Senza Alcol* zero‑proof line when set).
- **Favor tag:** **GRAZIE** / for celebrating with us — reverse: *Con amore, Kelsey & Andrew.*
- **Table number:** **TAVOLO** + numeral (burgundy) on ivory, mauve border.
- **Place card:** Name (Fraunces) + table; discreet meal symbol for the caterer only.
- **Activity card (reusable):** title · day/date · time · location · one line (e.g. *Sunrise Yoga ·
  Tue Jun 17 · 7:00 AM · Villa Gardens · All welcome, bring a mat*). QR → `/activities` only if there's
  a headcount/capacity.

---

## 5 · What the website/admin must do — built vs to‑build

**Already built (admin):** guest list + parties, travel info, budget with `budget_items` +
`budget_payments`, CSV exports (room/payment/guest rosters). RSVP = public name+email lookup.

**Needs building before the suite is "real":**
- `/reserve`: early RSVP + **per‑person deposit** (adult/child) → **Stripe checkout** → auto‑Paid +
  admin tracking (the `/pay-mockup` + `/pay-mockup-admin` concepts). *Stripe = her account + keys.*
- `/meals`: structured meal/dietary form → caterer export.
- **Email provider** (Resend/Loops) for confirmations + the "get updates" opt‑in — none wired yet.
- *(Optional, bigger):* per‑household token portal if you want truly personalized cards.

---

## 6 · Cost / priority phasing (so it isn't a 17‑item bill at once)

| Phase | Pieces | When |
|---|---|---|
| **NOW** | Save‑the‑Date (front + reserve back) | The urgent one — gated on venue+dates booked, Stripe live, figures set |
| **LATER** | Formal invite · Details card · Meal card · Welcome‑Dinner insert · envelope + liner | After venue contracted |
| **DAY‑OF** | Welcome sign · dinner menus · place cards · table numbers · bar sign · itinerary card | ~1–2 months out |
| **OPTIONAL (cost‑adders)** | Belly band + medallion · coasters · die‑cut shapes · foil · envelope liners · per‑activity cards | Only if budget allows |

**Cost levers:** buy the *design* files and print economically; skip specialty finishes (die‑cuts,
foil, liners, coasters); flat rectangles on good cardstock look beautiful and print cheap.

---

## 7 · Production standards (keep the ChatGPT spec's detail; the essentials)

- **Bleed 0.125″**, live‑text safe area 0.25″ (0.375″ around die‑cuts). Separate **DIELINE / FOIL /
  WHITE_INK / DEBOSS** layers named clearly.
- **Stock:** 120–130 lb / 325–350 gsm cover, uncoated, warm ivory, light texture. QR cards on a
  *smoother* stock so modules stay crisp.
- **Burgundy cards:** true burgundy stock + white ink (premium) **or** burgundy flood on white with
  knocked‑out cream text (cost‑controlled). Standard CMYK can't print light ink on dark paper.
- **From the designer, per piece:** editable source + outlined print PDF (CMYK, bleed) + RGB web
  preview + dieline + finish spec + **one proof with live QR codes**. Order a **physical proof** —
  terracotta and cream shift screen→paper.

---

*The whole point: the paper stays formal and romantic while the website quietly does the operational
work. Save‑the‑Date secures attendance + rooms; the formal invite celebrates the marriage and gathers
dining details; day‑of pieces reuse the same shapes, colors, swans, and type without every piece
looking identical.*
