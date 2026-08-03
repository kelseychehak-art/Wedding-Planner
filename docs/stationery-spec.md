# Kelsey & Andrew — Stationery & Signage Spec (all‑in‑one)

**Status:** authoritative production spec, 2026‑08‑02. Single source of truth — hand this to any
stationer. Combines the full per‑piece production detail with this project's real website/admin and
the decisions we've locked. Recommended dimensions are production sizes; the mockups are conceptual.
Everything in `[BRACKETS]` is a genuine fill‑in. Venue names/times/deadlines are **placeholders until
the venue is contracted.**

---

## 0 · Read first — the decisions that govern everything

1. **Script font is not Cherolina on print.** Cherolina is licensed **web‑only.** For paper use a
   free OFL script: **Allura** (closest to Cherolina; best for names/signature) or **Pinyon Script**
   (more formal/ornate; good for "Benvenuti"). Both are free for commercial print and in Canva.
2. **Ceremony is WEDNESDAY, JUNE 18, 2027** — *not* Saturday June 19 (the mockups inherited a
   traditional‑template assumption). Thu = pool day, Sat = farewell. Fix everywhere.
3. **Pricing is flat per person, same for everyone regardless of room:** adults `$1,000`, children
   `$500` (*example figures — confirm finals*). State the number plainly; never explain the math,
   say "splitting the villa," or over‑reassure. **We assign rooms** (guests submit *preferences*, not
   selections). **Hybrid deposit:** payable **now** (Stripe) or required by `[deposit deadline]`.
   **Refund policy follows the chosen venue's.**
4. **The QR "personalized landing page" doesn't exist yet.** The live site is a **name + email RSVP
   lookup** — no guest accounts/tokens. Either point QRs at public pages where a guest enters
   name+email to reach *their* info (ship‑now), or build the per‑household token portal (a real,
   ungreenlit build). See §9.
5. **No AI imagery, and use art we already own.** Replace the mock swan *painting* with the
   **public‑domain Italian landscape paintings already in `public/assets/art/`** (`vista`, `tivoli`,
   `garden-cypress`, `pastoral`) for the envelope liner + motifs — legally clean, free. Swan *line
   art* still needs a licensed/commissioned vector.
6. **Never say "buyout."** Use *"we've reserved the entire villa for our group."*
7. **The Save‑the‑Date does the RSVP + deposit; the formal invite does NOT re‑ask attendance** — it
   collects meals/dietary only. The website quietly does the operational work; the paper stays
   romantic.

---

## 1 · Master visual system

**Feel:** warm, editorial, Italian, layered, romantic, collected — *not* pastel, overly bridal, or
theme‑party Tuscan. The print suite is a richer, more ornate cousin of the (cleaner, terracotta)
website; keep the website touchpoints the QR leads to feeling of‑a‑piece so the card→site jump isn't
jarring.

**Core palette**

| Color | Hex | Use |
|---|---|---|
| Warm Cream | `#FAF6EC` | Paper ground, large signs |
| Ivory | `#FDFAF3` | Raised cards, inset panels |
| Warm Ink | `#2F2A24` | Body + display text (never pure black) |
| Cornflower | `#6F9FCE` | Dates, info labels, digital accents |
| Herb Green | `#6E8B3D` | Olive motifs, borders, botanicals |
| Deep Cypress | `#3F4A36` | Dark‑green grounding |
| Terracotta | `#D96B3F` | Select words, tiny rules, web buttons |
| Golden | `#E8B23E` | Small sunlit accents (not a fill) |

**Approved print extensions** (ornate suite only — do NOT add to the website)

| Color | Hex | Use |
|---|---|---|
| Dusty Mauve | `#C5A3AD` | Envelopes, secondary cards, soft backing |
| Rich Burgundy | `#5A2430` | Belly band, welcome‑dinner + bar signage |
| Soft Sage | `#A2AA8D` | Invitation backing, ribbon, large surfaces |
| Dusty Cornflower | `#A8BED3` | Day‑of cards, itinerary |
| Olive‑Gold ink | `#9B8952` | Printed border when metallic foil isn't used |

**Distribution** ≈ cream/ivory 50‑60% · olive/sage/deep green 20‑25% · cornflower 10‑15% · burgundy
8‑12% · mauve 8‑12% · terracotta+gold accent only. **No single card uses all six accents.** Each
piece = one ground + warm ink + one dominant accent + at most one secondary + olive‑gold linework.
For print, the printer builds physical swatches; the hex values are the digital standard, CMYK via
the press profile.

---

## 2 · Typography system

Locked family: **Fraunces** (display serif) · **Cormorant Garamond** (refined serif/italics) ·
**Instrument Sans** (functional/uppercase labels) · **script = Allura** on print (Pinyon Script for a
more formal look). *(On the website the script is Cherolina; on paper it is Allura — see §0.1.)*

**Hierarchy**
- **Script (Allura):** "Benvenuti," "and," "in honor of," "dinner and dancing to follow," short
  Italian sign‑offs, occasional name/monogram accents. **Never** paragraphs, menus, addresses.
- **Fraunces:** Kelsey & Andrew's names, MENU, DETAILS, RSVP, WELCOME DINNER, large sign titles,
  large table numbers. Weights Regular–SemiBold; avoid the heaviest.
- **Cormorant Garamond:** invitation wording, body, menu descriptions, italic location/sign‑off lines.
- **Instrument Sans:** dates, deadlines, URLs, QR instructions, small uppercase labels
  (ACCOMMODATIONS, ATTIRE). Tracking ~`0.10em–0.18em` on small caps.

**Minimum print sizes:** display title 22–32pt · invite names 24–30pt · script accent 18–32pt ·
section heading 10–14pt · body serif 9.5–11.5pt · uppercase sans label 7.5–9pt · URL 8–9pt. Never put
functional print below 8pt. Scale signage proportionally.

---

## 3 · Illustration & motif system

**Swan line illustration** (invite, dinner menu, bar menu, thank‑you tags, select signage): custom‑
drawn or licensed **human‑created** vector; single‑color olive‑gold or deep olive; delicate but
printable small; no photographic shading; symmetrical‑but‑not‑perfectly‑digital.

**Envelope‑liner painting:** the mock painting is a placeholder — **do not use AI imagery.** Use one
of the **public‑domain Italian landscapes already in `public/assets/art/`** (e.g. `vista`,
`garden-cypress`, `pastoral`, `tivoli`), a licensed human painting, or a commission. Requirements:
≥300 ppi at full liner size (600 preferred), room to crop around folds, no key detail within 0.25″ of
folds, blue water / olive / warm cream light / restrained mauve — no strong violet cast.

**Supporting motifs (limited library):** paired swans · small olive sprigs · fine corner flourishes ·
oval K&A medallion · slim double‑line borders · subtle Italian damask/textile · occasional cypress.
Keep the formal suite centered on **swans + olive + framed editorial type**; don't scatter
lemons/tiles/postage/florals across every piece.

---

## 4 · Print & file standards

**Paper:** 120–130 lb cover (~325–350 gsm), natural white / warm ivory, uncoated, lightly textured /
eggshell, thick enough to die‑cut without curl. **QR cards use a smoother stock** so modules stay
crisp.

**Bleed & safe area (every file):** 0.125″ bleed all sides · 0.25″ live‑text safe · 0.375″ safe
around custom die‑cut edges · vector dieline on a separate non‑printing spot layer · foil/emboss/
white‑ink on their own layers. Layer names: `ARTWORK` · `DIELINE` · `FOIL_GOLD` · `WHITE_INK` ·
`BLIND_DEBOSS` · `VARIABLE_DATA`.

**Borders:** outer 0.6–0.75pt · inner 0.35–0.5pt · gap 0.08–0.12″ · corner ornament ≤~0.45″ · min
printable stroke 0.3pt.

**Background texture:** premium = custom blind deboss · mid = pre‑embossed stock · budget = tone‑on‑
tone print at 4–7% contrast. Never under QR codes or tiny text.

**QR codes:** generate from the **real final URL** · ≥0.9″ (1.0–1.15″ preferred) · black / deep
cypress / dark burgundy on ivory · 4‑module quiet zone · error‑correction Q or H · never over texture/
foil/art/folds · printed URL beneath · tested on multiple phones. **URL map:**

| Card | URL | Status |
|---|---|---|
| Save‑the‑Date reserve | `chehakshultswedding.com/reserve` | needs building (RSVP + deposit) |
| Meal / dietary | `chehakshultswedding.com/meals` | needs building |
| Details / itinerary | `chehakshultswedding.com/our-weekend` | **live** |
| Activity cards | `chehakshultswedding.com/activities` | **live** |

Personalized links can carry a **secure household token** (guest name never visible in the URL) —
but that needs the portal (§9); until then, `/reserve` can point at the existing `/rsvp`. **I can
generate the real QR image files once URLs are locked.**

---

## 5 · Save‑the‑Date & early reservation (the NOW piece)

### Item 1 — Save‑the‑Date FRONT (sentimental keepsake; no QR)
5×7, portrait, two‑sided, standard rounded/framed rectangle (a die‑cut front is prettier but costs
more to mail). Cream ground · fine olive double‑line border · names in Fraunces (warm ink) · "and"
in Allura · dates in cornflower · one restrained terracotta rule.

> SAVE THE DATE
> **KELSEY & ANDREW**
> *are getting married under the Tuscan sun*
> **JUNE 16 – 21, 2027** · TUSCANY, ITALY
> We've reserved the entire villa for our group.
> Please turn over to save your spot.
> chehakshultswedding.com

### Item 2 — Save‑the‑Date BACK / "Save your spot" (replaces a traditional RSVP card)
Same size. Cream · large QR (black/cypress). Collects (via the website): attending, household count,
adults/children, room *preferences*, accessibility, and the deposit.

> **SAVE YOUR SPOT**
>
> We're bringing everyone together under one roof in Tuscany, and because rooms are limited, we're
> planning a little ahead. So we can make sure everyone who wants to join has a spot, we'd love your
> answer early.
>
> **Kindly RSVP by `[RSVP DEADLINE]`.**
>
> We'll take care of your room from there. A small deposit toward your stay holds it — pay now, or any
> time before `[DEPOSIT DEADLINE]`, whatever's easiest.
>
> **[ QR ]** · SCAN TO RSVP & RESERVE · chehakshultswedding.com/reserve
>
> *No pressure — we'd just love to know either way.*

**Website `/reserve` flow** (per household; name+email lookup unless the portal is built): greeting →
attending? → who's coming (adults/children) → room *requests* (near family / access needs) → **flat
rate shown plainly** (`$1,000 adult · $500 child`) → deposit: pay now **or** by `[deadline]` → refund
policy (follows villa) → Stripe checkout → confirmation + email. Warm tone; **never** "book now or
lose your room."

---

## 6 · Formal invitation package

### Item 3 — Main formal invitation (ceremonial; no QR, no payment, no re‑RSVP)
Cream die‑cut 5×7 · sage backing 5.25×7.25 (visible as a 0.125″ border) · envelope A7.5 / custom
5.5×7.5. Shape: symmetrical triple‑lobed Italianate arch (central dome + side shoulders, straight
lower edges, square lower corners), dieline supplied as vector. Cream 130 lb natural‑white; sage
120–130 lb, optional blind deboss.

> TOGETHER WITH THEIR FAMILIES
> **KELSEY CHEHAK**
> *and*  *(Allura)*
> **ANDREW SHULTS**
> request the pleasure of your company
> at the celebration of their marriage
> **WEDNESDAY, JUNE 18, 2027** · at `[TIME]`
> `[VENUE NAME]` · TUSCANY, ITALY
> *dinner and dancing to follow*

Color: warm ink names/body · cornflower "and" + ceremony date · olive‑gold swans/borders/flourishes ·
**no burgundy on the invite face.** Finish: olive‑gold foil swans+border + flat text + blind deboss on
sage (premium) or one warm‑olive ink + printed tone‑on‑tone sage (budget). **Do NOT include:** QR,
payment details, another attendance RSVP, menu checkboxes, heavy website info. Keep it ceremonial.
> ⚠️ Reconcile the ceremony day (Wed Jun 18) with `data/schedule.ts` before printing.

### Item 4 — Details card
3.5×7 rectangle, warm ivory, front (+ optional back). DETAILS in Fraunces · dates/micro‑rules in
cornflower · warm‑ink body · small olive flourishes.
> **DETAILS** · WEDDING WEEK IN TUSCANY · **JUNE 16 – 21, 2027**
> **ACCOMMODATIONS** — Your room was arranged through your early response. Sign in at
> chehakshultswedding.com to see your room, balance, and check‑in details. *(Off‑site guests: hotel
> + transport guidance online.)*
> **TRANSPORTATION** — Group transport to/from scheduled events; times posted on the website + final
> itinerary.
> **ATTIRE** — `[FORMAL / BLACK‑TIE OPTIONAL / GARDEN FORMAL]`; per‑event notes online.
> **WEBSITE** — chehakshultswedding.com  *(small `/our-weekend` QR may go on the back)*

### Item 5 — Meal selections & dietary card (the formal invite's response mechanism)
4×6 portrait, ivory, smooth (QR). Does **not** re‑ask attendance.
> **MEAL SELECTIONS & DIETARY PREFERENCES**
> Please choose an entrée for each guest and share any allergies, dietary needs, or children's meals
> by **`[DEADLINE]`**.
> **[ QR ]** · SCAN TO SUBMIT · chehakshultswedding.com/meals
> *Your household's already confirmed — this is just for final dining details.*

Website form stores **structured per‑guest** data (entrée · veg/vegan · child meal · allergy ·
restriction · cross‑contamination severity · note) — not one open text box — for a clean caterer
export. Household fields: contact email · emergency dietary contact · optional welcome‑dinner/
farewell‑brunch headcount · confirmation.

### Item 6 — Welcome Dinner insert
4×6 portrait, burgundy ground, decorative frame. **Light ink can't print on burgundy via standard
CMYK:** true burgundy stock + opaque white ink + gold foil (premium) **or** burgundy flood on white
with knocked‑out cream text + printed olive‑gold border (budget).
> **WELCOME DINNER** — Please join us celebrating **KELSEY & ANDREW** · **MONDAY, JUNE 16, 2027** at
> `[TIME]` · `[VENUE]` · attire: `[ATTIRE]`.

Everyone's included — **omit "kindly reply"** unless a separate headcount is genuinely needed (then:
"Please confirm on the meal‑selection form by `[DATE]`").

### Item 7 — Weekend Itinerary card (corrected to the real schedule)
4.25×6.25, custom bracketed/scalloped, dusty cornflower stock, deep‑burgundy or warm‑ink text, olive‑
gold border. One per household/room.
> **WEEKEND ITINERARY**
> JUNE 16 (Mon) — Welcome Dinner
> JUNE 17 (Tue) — Wine Tasting
> JUNE 18 (Wed) — **The Wedding** · Ceremony, Reception & Dinner
> JUNE 19 (Thu) — Pool Day & Lunch
> JUNE 20 (Fri) — Town Excursion
> JUNE 21 (Sat) — Farewell Party
> *For live times, transport & updates, visit chehakshultswedding.com.*

Live `/our-weekend` page carries precise times, map links, transport points, attire, rain plan, and
calendar‑add.

### Item 8 — Envelope + liner
Envelope A7.5 / 5.5×7.5, dusty mauve, 80–100 lb text, pointed/euro flap, subtle pattern. Exterior:
guest names + address in warm ink or burgundy (Cormorant or restrained calligraphy). Back flap: small
oval K&A monogram in olive‑gold; return address under the flap or front upper‑left. **Liner:** the
public‑domain landscape (§3), 70–80 lb text, full bleed, visible when opened. Mailing: avoid a raised
wax seal on the outer envelope unless hand‑canceled + packaged; a printed medallion / belly‑band
closure is safer; weigh a full assembled suite before buying postage.

### Item 9 — Belly band + oval medallion
Band: 1.4–1.6″ tall × ~11–11.5″ flat (confirm after a test assembly), burgundy center (+ optional
mauve backing +0.125″), thin gold rules near edges, sealed at back. Medallion: ~2×2.6″ vertical oval,
cream center, burgundy edge, olive‑gold frame, K & A stacked/intertwined. Finish: antique‑gold foil
frame + blind deboss + foam‑mounted medallion (keep total thickness mailable). **Assembly order:**
invitation → details → meal card → welcome‑dinner → optional itinerary → wrap in belly band → affix
medallion → insert into lined envelope.

---

## 7 · Day‑of & on‑site pieces

### Item 10 — Welcome sign
24×36 (entrance) or 30×40 (courtyard), portrait, arched/scalloped top. Indoor: 3/16″ foamboard or
3 mm PVC; outdoor: 6 mm PVC / aluminum composite / sealed wood + weighted easel. Cream face, sage
mount visible at edges, olive border. **No large QR on the ceremonial sign** (a small separate info
sign may say "Scan for the weekend schedule").
> *Benvenuti* (Allura, cornflower) · **KELSEY & ANDREW** (Fraunces) · WEDDING WEEK IN TUSCANY ·
> JUNE 16 – 21, 2027

### Item 11 — Formal dinner menu
4.25×9.25 per place setting (or shared 5×10.5), softly arched top, 120 lb ivory. Swan line art · MENU
(Fraunces) · course labels in cornflower · dish names Cormorant · English descriptions in small
italics. Guests already chose entrées via the meal form → **no checkboxes**; the menu describes the
dinner and may list all entrée options; the place card marks each guest's choice for the caterer.
> ANTIPASTI / PRIMO / SECONDO / DOLCE — `[DISH]` + `[description]` per course.

### Item 12 — Place / escort card
Folded tent 3.5×2 finished (3.5×4 flat) or flat escort 3.5×2.25. Ivory, olive double border, name in
Fraunces, table in Cormorant italic. No QR, no swan painting.
> **KELSEY CHEHAK** · Table 3

**Meal code (caterer/planner only — never printed for guests):** olive leaf = beef · blue dot =
fish · burgundy flower = vegetarian · gold star = child's meal · outlined ring = allergy plate.

### Item 13 — Table number
5×7 (intimate) or 6×8 (banquet), double‑sided, custom scalloped frame. Ivory center, mauve outer
border, olive‑gold linework, large **burgundy** numeral. Small olive motif + `TAVOLO`. 130 lb mounted
back‑to‑back or 3 mm PVC. Readable from ~15 ft; low‑profile brass/weighted stands.

### Item 14 — Cocktails & Aperitivi bar sign
8×12 (small) or 11×14 (main), arched top, burgundy ground + cream text + gold/olive‑gold border + swan
line art (white ink on burgundy stock **or** burgundy flood on ivory).
> **COCKTAILS & APERITIVI** — Aperol Spritz · Hugo Spritz · Negroni Sbagliato · Prosecco `[type]` ·
> Limoncello *della casa* — add a **Senza Alcol** zero‑proof line when set; note common allergens
> discreetly.

### Item 15 — Monogram coaster
4″ round, ~40 pt absorbent pulpboard. Dusty‑cornflower ground, oval olive‑gold K&A frame, subtle
tone‑on‑tone, no date. Premium = letterpress + gold foil; budget = flat print in olive‑gold ink. Must
tolerate moisture + partial glass cover.

### Item 16 — Grazie favor / welcome‑bag tag
2×3.5, portrait, clipped/arched top corners, 3/16″ hole. Cream, swan line art, olive border, burgundy
or warm‑ink heading, sage ribbon / burgundy cord.
> **GRAZIE** / FOR CELEBRATING WITH US — reverse: *Con amore, Kelsey & Andrew.*

Use for welcome bags, favors, olive oil, limoncello, room + farewell gifts.

### Item 17 — Activity info card (reusable: yoga, wine, pool, cooking, transport)
4×5 portrait, dusty‑cornflower stock. Olive motif · title · day/date · time · location · one line ·
optional QR → `/activities` only if there's a capacity/headcount (omit otherwise).
> **SUNRISE YOGA** · TUESDAY, JUNE 17 · 7:00 AM · VILLA GARDENS · *All welcome. Please bring a mat.*

---

## 8 · Print‑vs‑digital split
**Print & mail:** two‑sided Save‑the‑Date · formal invite · details card · meal QR card · welcome‑
dinner insert · envelope + liner · belly band + medallion.
**Digital‑first (website):** early attendance · room preferences · **deposit payment** · room balances
+ schedule · meal + dietary · live itinerary · activity sign‑ups · transport updates · calendar files ·
last‑minute changes.
**Printed on site:** welcome sign · dinner menus · place cards · table numbers · bar sign · coasters ·
favor tags · select activity reminders · one abbreviated itinerary per room/welcome bag.

---

## 9 · Website & data — what's built vs to‑build (reality‑check)

**Already built (admin):** guest list + parties, travel info, budget (`budget_items` +
`budget_payments`), CSV exports (room / payment / guest rosters). Public RSVP = **name + email lookup**
(`get_party_for_rsvp` / `submit_rsvp`) — **no accounts or per‑guest tokens.**

**Needs building before the suite is "real":**
- `/reserve`: early RSVP + **per‑person deposit** (adult/child) → **Stripe** checkout → auto‑Paid +
  admin tracking (concepts exist at `/pay-mockup` + `/pay-mockup-admin`). *Stripe = Kelsey's account
  + keys.* Build/test in Stripe test mode first.
- `/meals`: structured meal/dietary form → caterer export.
- **Email provider** (Resend/Loops) for confirmations + the "get updates" opt‑in — none wired yet.
- *(Optional, bigger)* per‑household **token portal** if you want truly personalized cards/QRs.

**Reserve form stores:** household ID · named guests · attendance · adult/child · accommodation
preference · room assignment · deposit amount · payment status · refund acknowledgment · accessibility.
**Meal form stores:** per‑guest entrée · child meal · allergy · restriction · aux‑event attendance ·
submitted/edited timestamps. **Admin exports:** room roster · payment roster · adults vs children ·
meal counts · allergy report · table assignments · transport manifest. Guests get an emailed
confirmation after both submissions.

---

## 10 · Deliverables from the designer + proofs

**Per printed item, request:** editable source · outlined‑font print PDF (CMYK, bleed) · packaged
font‑linked working file · RGB web preview · separate dieline · separate foil / white‑ink / emboss
layers · exact finished dimensions · stock + finish spec · QR destination list · **one proof with
live QR codes.**

**File naming:** `KA_STD_FRONT_5x7_CMYK.pdf` · `KA_STD_RESERVE_BACK_5x7_CMYK.pdf` ·
`KA_FORMAL_INVITE_DIECUT_5x7.pdf` · `KA_DETAILS_3.5x7.pdf` · `KA_MEAL_SELECTIONS_4x6.pdf` ·
`KA_WELCOME_DINNER_4x6.pdf` · `KA_WEEKEND_ITINERARY_4.25x6.25.pdf` · `KA_ENVELOPE_LINER_A7.5.pdf` ·
`KA_BELLY_BAND_1.5x11.5.pdf` · `KA_WELCOME_SIGN_24x36.pdf` · `KA_DINNER_MENU_4.25x9.25.pdf` ·
`KA_PLACE_CARD_3.5x4.pdf` · `KA_TABLE_NUMBER_5x7.pdf` · `KA_BAR_MENU_11x14.pdf` · `KA_COASTER_4IN.pdf` ·
`KA_GRAZIE_TAG_2x3.5.pdf` · `KA_ACTIVITY_CARD_4x5.pdf`.

**Proof sequence:** digital PDF proof → live QR test → untrimmed printed color proof → physical stock
swatches → die‑cut dummy → assembled & stuffed envelope → postage/weight test → production approval.
**Always order a physical proof** — terracotta and cream shift screen→paper.

---

## 11 · Cost / priority phasing (so it isn't a 17‑piece bill at once)

| Phase | Pieces | When |
|---|---|---|
| **NOW** | Save‑the‑Date (front + reserve back) | Urgent — gated on venue+dates booked, Stripe live, figures set |
| **LATER** | Formal invite · details · meal card · welcome‑dinner · envelope + liner | After venue contracted |
| **DAY‑OF** | Welcome sign · dinner menus · place cards · table numbers · bar sign · itinerary | ~1–2 months out |
| **OPTIONAL (cost‑adders)** | Belly band + medallion · coasters · die‑cut shapes · foil · liners · per‑activity cards | Only if budget allows |

**Cost levers:** buy the *design* files and print economically · skip specialty finishes (die‑cuts,
foil, liners, coasters) · flat rectangles on good cardstock look beautiful and print cheap · phase it.

---

*The whole point: the paper stays formal and romantic while the website quietly does the operational
work. Save‑the‑Date secures attendance + rooms; the formal invite celebrates the marriage and gathers
dining details; day‑of pieces reuse the same shapes, colors, swans, and type without every piece
looking identical.*
