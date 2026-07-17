# Guest Portal — Master Build Brief (VERBATIM SOURCE)

> ⚠️ **FUTURE-STATE — NOT GREENLIT.** This is the user-supplied master brief for a **token-gated,
> personalized guest portal** (`/guest/[inviteToken]/…`) with a full Supabase backend. It is
> preserved here **verbatim** as the canonical future-state spec. It is **not** the current plan of
> record: the **public-first plan is in force** (see [`../decisions.md`](../decisions.md) D1/D2/D7/D9
> and [`overview.md`](./overview.md)). Do **not** build from this without an explicit greenlight and
> the foundation-first prerequisites in `overview.md`. Dates/location here must be read as
> **June 16 – 21, 2027 / Tuscany, Italy** regardless of any other value below.

---

## Scope

Five connected guest-detail pages, part of the existing personalized guest portal:

- `/guest/[inviteToken]/travel` — Book Your Travel
- `/guest/[inviteToken]/stay` — Browse Where You'll Stay
- `/guest/[inviteToken]/activities` — Activities & Experiences
- `/guest/[inviteToken]/schedule` — Weekend Schedule
- `/guest/[inviteToken]/faq` — Frequently Asked Questions

The supplied mockups are the visual source of truth: reproduce proportions, content hierarchy,
spacing, card dimensions, typography, background treatment, illustrations, image placement, tab and
button styling, decorative details, and responsive behavior. Do not loosely reinterpret the screens
or redesign them into a generic dashboard / modern SaaS interface.

## 1. Existing shared system (assumed by the brief)

Reuse the previously built: `GuestBackground`, `GuestSiteHeader`, `WeddingPageHeader`,
`WeddingPageFooter`, `DecorativeCard`, `ScallopedCard`, `WeddingSignature`, `GuestPageShell`.

> Note (repo reality): **none of these components exist in this repo** — see `overview.md` for the
> mapping onto what actually exists (`SiteHeader`, `PageHero`, `SiteFooter`, `ScallopFrame`, …).

Reuse the existing variables:

```css
:root {
  --olive-dark: #3f4a36;
  --olive: #687a4a;
  --sage: #a9b08c;
  --cream: #faf7f2;
  --paper: #fffdf8;
  --sand: #efe7da;
  --citrus-gold: #d4a63a;
  --terracotta: #e06454;
  --sky-blue: #7fa2c7;
  --ink: #26251f;
  --muted-ink: #6f6c63;
  --soft-line: rgba(63, 74, 54, 0.17);
  --soft-shadow: rgba(63, 74, 54, 0.09);

  --font-display: "Playfair Display", Georgia, serif;
  --font-editorial: "Cormorant Garamond", Georgia, serif;
  --font-body: "Canela", "Cormorant Garamond", Georgia, serif;
  --font-ui: "Canela Sans", "Avenir Next", Arial, sans-serif;

  --header-height: 64px;
  --page-width: 1160px;
  --desktop-gutter: clamp(28px, 4.5vw, 74px);

  --radius-page: 9px;
  --radius-card: 6px;
  --border-soft: 1px solid rgba(63, 74, 54, 0.16);
}
```

## 2. Required file structure

```
app/guest/[inviteToken]/{travel,stay,activities,schedule,faq}/page.tsx
components/guest/shared/{GuestBackground,GuestSiteHeader,GuestDetailPageShell,
  GuestDetailPageHeader,GuestDetailFooter,BackToGuestHome,LineIcon,EditorialButton,
  InfoNotice,ScallopedPanel}.tsx
components/guest/travel/{TravelPage,AirportCard,BookingWindowCard,GroundTransportationCard,
  TravelTipsCard,ShareTravelPlansCard,TravelQuestionsCard,TravelInfoModal}.tsx
components/guest/stay/{StayPage,VillaOverview,VillaHeroGallery,GuestRoomAssignment,
  RoomCategoryCard,RoomPoliciesCard,StayQuestionsCard,ShareYourStayCard,RoomGalleryModal}.tsx
components/guest/activities/{ActivitiesPage,PlannedActivityCard,ActivityStatusKey,
  IndependentActivityCard,ActivitySignupModal,ActivityCapacityBadge}.tsx
components/guest/schedule/{SchedulePage,ScheduleAtAGlance,ScheduleEventRow,
  DownloadItineraryCard,ScheduleUtilityBar}.tsx
components/guest/faq/{FAQPage,FAQTopicNavigation,FAQSection,FAQAccordionItem,FAQContactCard}.tsx
data/wedding/{guest,travel,stay,activities,schedule,faq}.ts
types/{guest,travel,stay,activity,schedule,faq}.ts
styles/{guest-detail-pages,travel-page,stay-page,activities-page,schedule-page,faq-page}.css
```

## 3. Shared detail-page shell
Every detail page sits inside the same large cream stationery panel. Desktop: max-width 1160px; top
margin below nav 18px; outer horizontal padding 52px; outer vertical padding 28–32px.

```
GuestDetailPageShell({ inviteToken, activePage: "travel"|"stay"|"activities"|"schedule"|"faq",
  children }) → <div.guest-page-shell><GuestBackground/><GuestSiteHeader .../>
  <main.guest-detail-main><article.guest-detail-paper>{children}</article></main></div>
```
```css
.guest-detail-main { min-height: calc(100svh - var(--header-height)); padding: 18px 22px 28px; }
.guest-detail-paper {
  width: min(var(--page-width), 100%); min-height: calc(100svh - 110px); margin: 0 auto;
  padding: 27px 52px 18px; position: relative; background: rgba(255,253,248,0.965);
  border: var(--border-soft); border-radius: var(--radius-page);
  box-shadow: 0 15px 45px rgba(63,74,54,0.055), 0 2px 7px rgba(63,74,54,0.025);
}
```

## 4. Shared page header (all five pages)
`GuestDetailPageHeader({ title, subtitle, inviteToken, titleColor="olive"|"terracotta" })` →
`BackToGuestHome` (abs top-left) · center `small-lemon-sprig.svg` (97px) · title row = italic
Playfair `<h1>` `clamp(43px,4vw,57px)` (olive, or terracotta via `data-color`) + `heart-outline-red`
(28px) · gold `detail-title-rule` (238px, heart-outline-gold 11px) · `detail-page-subtitle`
(font-ui 12px) · `villa-postage-stamp.svg` (112px, abs top-right, rotate 4deg). Header min-height
145px, centered. `.back-to-guest-home`: font-ui 11px/600, uppercase, letter-spacing .15em, olive.

## 5. Shared page footer (message varies per page)
`GuestDetailFooter({ heading, subheading="More details, updates and reminders will be shared here.",
  config })` → `.guest-detail-footer` grid `75px 1fr 125px`: `wine-glass.svg` (45px) · center copy
(`h2` editorial 17px/500 uppercase + gold divider + two `p` editorial 12px) · `lemon-sprig.svg`
(116px). Then `.detail-page-signature` (editorial 12px/600 uppercase): `{coupleNames}` | sep |
`heart-outline-red` (20px) | sep | `{weddingDateRange}`.

---

## PAGE 1 — Book Your Travel  (`/guest/[inviteToken]/travel`)

Route loads `getGuestByInviteToken(inviteToken)` + `getWeddingTravelData()`, renders inside
`GuestDetailPageShell activePage="travel"` with header title "Book Your Travel" / subtitle "Flights,
transportation options and tips to help you plan your journey to Italy." and footer heading "We Can't
Wait to Welcome You to Italy!".

**Data model**
```ts
interface AirportOption { code; city; country; recommended?: boolean }
interface GroundTransportationOption { id; title; description; icon; href? }
interface TravelTip { id; title; description; icon }
interface GuestTravelPlan { arrivalAirport?; arrivalDate?; arrivalTime?; airline?; flightNumber?;
  departureAirport?; transportationNeeded?: boolean }
interface WeddingTravelData { airports: AirportOption[]; bookingWindow; arrivalWindow;
  welcomeEventStart; groundTransportation: GroundTransportationOption[]; travelTips: TravelTip[] }
```
**Layout** — row 1 (`.travel-primary-grid`, cols `0.95fr 1.15fr 1.18fr`): AirportCard | BookingWindowCard
| GroundTransportationCard. Row 2 (`.travel-secondary-grid`, cols `1.58fr 1.14fr 0.9fr`): TravelTipsCard
(wide) | ShareTravelPlansCard | TravelQuestionsCard.
- `.travel-card`: min-height 250px, padding 22/23, bg rgba(255,253,248,0.56), border-soft, radius 6.
  `.travel-card-heading`: font-ui 13px/700, uppercase, .15em, olive; icon 27px.
- **AirportCard:** "Getting to Italy" + airplane; intro; `<dl.airport-list>` (`44px 1fr` rows: `dt`
  code 12/700, `dd` "City, Country" 12); `InfoNotice`: "Florence (FLR) is the closest and most
  convenient option to our wedding villa."
- **BookingWindowCard:** "Recommended Booking Window" + calendar; `calendar-sketch.svg` + "Book your
  flights **{bookingWindow}** for the best prices and availability."; "Plan to arrive between
  **{arrivalWindow}**"; "Our welcome events begin {welcomeEventStart}."
- **GroundTransportationCard:** "Ground Transportation" + car; intro; `.transport-option-list` of
  anchors (icon + title/desc + "›"); text link "View full transportation guide →".
- **TravelTipsCard:** `.travel-tip-row` grid `35px 1fr`, top-border between rows; strong 11px + small
  10px muted. (Passport validity / Travel insurance / Pack smart / Stay connected.)
- **ShareTravelPlansCard:** **blue scalloped border** (`url(/borders/scalloped-blue-card.svg)`), h2
  sky-blue editorial 17/600 uppercase, `heart-outline-red` 20px, copy 11px, `.sky-blue-button`
  "Add Your Travel Info", `bicycle.svg` 110px.
- **TravelQuestionsCard:** VIEW FAQ + amphora/branch (per mockup).

---

## PAGE 2 — Browse Where You'll Stay  (`/guest/[inviteToken]/stay`)

**Data model**
```ts
interface VillaAmenity { id; title; icon }
interface RoomCategory { id; name; slug; shortDescription; inventoryLabel; imageUrl? }
interface GuestRoomAssignment { guestHouseholdId; roomCategoryId; roomName; roomNumber?; bedType?;
  assignedAt?; visibleToGuest: boolean }
interface StayPageData { villaName; region; country; description; heroImageUrl; gallery: string[];
  guestCapacity; roomCount; amenities: VillaAmenity[]; categories: RoomCategory[]; policies: string[] }
```
**Hierarchy** — `stay-villa-overview` (grid `255px 1fr`): VillaOverview | VillaHeroGallery.
`stay-room-section` (grid `310px 1fr`): GuestRoomAssignmentCard | RoomCategoryGallery.
`stay-utility-row` (grid `1fr 1.12fr 1.08fr`): RoomPoliciesCard | StayQuestionsCard | ShareYourStayCard.
- **VillaOverview:** eyebrow editorial 16/600 uppercase; `villa-name` display italic 24px; location
  11px; description 11px; `villa-feature-list` (icon 23px + 11px): Sleeps N / N Rooms & Suites /
  Pool·gardens·terraces.
- **VillaHeroGallery:** `<button>` 282px, `object-fit:cover`, overlay "View all photos".
- **GuestRoomAssignmentCard (personalized):** if `visibleToGuest` → "You are staying in:" + roomName
  (display italic 23) + meta (Room N • bedType) + `olive-sprig` + info note; else → "Your room
  assignment is being finalized." / "Details Coming Soon". Section label editorial 13/600 uppercase +
  `tiny-olive-sprig`.
- **RoomCategoryGallery:** "Room Categories"; `.room-category-grid` = 4 cols. `.room-category-card`
  border-soft radius 6; `.is-assigned` → 1.5px olive border + `.room-assignment-badge` ("YOUR ROOM",
  olive, top-center). Image 96px; copy: h3 10/700 uppercase, p 9px, strong 9px uppercase. Missing
  photo → neutral branded placeholder w/ room line drawing (never unrelated stock hotel room).
- **Lower cards:** `.stay-utility-card` min-height 118. Questions = blue scalloped frame; RoomPolicies
  has wine-glass; ShareYourStay has bicycle + hashtag.

---

## PAGE 3 — Activities & Experiences  (`/guest/[inviteToken]/activities`)

**Data model**
```ts
type ActivitySignupRequirement = "required" | "not_required" | "optional";
type GuestActivityStatus = "not_selected" | "attending" | "waitlisted" | "declined";
interface PlannedActivity { id; title; dateLabel; startTime; endTime; location; description;
  imageUrl?; signupRequirement: ActivitySignupRequirement; capacity?; spotsRemaining?;
  guestStatus?: GuestActivityStatus }
interface IndependentActivity { id; title; description; iconOrIllustration; detailsHref?;
  category: "towns"|"nature"|"wellness"|"golf"|"culture"|"shopping" }
```
**Layout** — `planned-activities-section` (heading "Planned Activities" + calendar; intro) →
`.planned-activity-grid` **6 cols** → `ActivityStatusKey`. Then `independent-activities-section`
("Things to Do on Your Own" + bicycle) → `.independent-activity-grid` **6 cols**.
- `.planned-activity-card`: image-wrap 137px + `.activity-requirement-badge` (olive; terracotta when
  `required`); copy min-height 183, date terracotta 9/700 uppercase, h3 display italic 18px,
  location/time/description 9px.
- **Action:** `attending` OR `not_required` → "✓ You're attending!"; else → "Sign Up" button
  (`.activity-signup-button` solid when required, `.activity-optional-button` outline otherwise).
- **Sign-up must:** respect capacity; support waitlists; store each invited guest independently; allow
  household members to choose differently; allow changes before the deadline; show "You're attending"
  / "Waitlisted" / "Sign up".
- **ActivityStatusKey:** grid `repeat(4,1fr) auto` — Requires RSVP / You're Attending / No RSVP Needed
  / Optional + "View Full Schedule →".
- `.independent-activity-card` 6-up: h3 9/700 uppercase, p 8px muted, illustration 67px bottom-right,
  arrow top-right.

---

## PAGE 4 — Weekend Schedule  (`/guest/[inviteToken]/schedule`)

**Data model**
```ts
interface WeddingScheduleEvent { id; dateISO; dayLabel; dateLabel; title; description; startTime;
  endTime?; location; imageUrl?; icon; dressCode?; guestVisible: boolean; calendarUid }
interface SchedulePageData { events: WeddingScheduleEvent[]; scheduleNote; downloadableCalendarUrl? }
```
**Layout** — `.schedule-page-content` grid `212px 1fr`: sidebar (`ScheduleAtAGlance` +
`InfoNotice title="Note"` + `DownloadItineraryCard` + `bicycle-with-branch`) | main (`.schedule-event-list`
of `ScheduleEventRow` + `ScheduleUtilityBar`). Filter to `guestVisible` events.
- **At-a-glance:** `.glance-event-row` grid `55px 1px 1fr`, top-border; day strong 9 + small 8.
- **ScheduleEventRow:** grid `52px 93px 145px minmax(230px,1fr) 200px`: icon 29 · day/date (uppercase
  strong 10 + span 9) · image 145×82 radius 4 · copy (h2 11/700 uppercase + p 10) · meta (clock/pin
  16px, span 9/600), left-bordered.
- **Calendar:** one combined `.ics` generated **from the DB schedule** (not a static file), optional
  per-event links. `Download ICS` button + calendar icon.
- **ScheduleUtilityBar:** grid `1fr 1fr 0.9fr`, bg rgba(127,162,199,0.09) — What to Wear / Share Your
  Photos / Questions (icon 39 + h3 9/700 + p 8).

---

## PAGE 5 — Frequently Asked Questions  (`/guest/[inviteToken]/faq`)

**Data model**
```ts
interface FAQItem { id; categoryId; question; answer; sortOrder; published: boolean }
interface FAQCategory { id; slug; title; icon; sortOrder }
interface FAQPageData { categories: FAQCategory[]; items: FAQItem[]; contactEmail? }
```
FAQs editable from the private admin view without a deployment.
**Layout** — `.faq-page-content` grid `280px 1fr`: sidebar (`FAQTopicNavigation` + `FAQContactCard`) |
main (`FAQSection` per category + `.faq-update-notice`). Categories sorted by `sortOrder`.
- **FAQTopicNavigation:** "Browse by Topic"; anchor rows grid `29px 1fr 15px` (icon 22 + title + "›")
  linking `#faq-{slug}`.
- **FAQContactCard:** blue scalloped frame; h2 sky-blue editorial 17/600; `heart-outline-red`; copy;
  "Contact Us →" (`editorial-outline-button` → `mailto:` or `/contact`); `olive-sprig`.
- **FAQAccordionItem** (`"use client"`): `<button aria-expanded aria-controls>` question + `›`/`−`;
  `.faq-answer[hidden]` p 10/1.65 muted. Smooth height animation only if accessible; respect
  `prefers-reduced-motion`.

---

## 33. Shared navigation
Primary nav: Our Weekend · Travel · Stay · Activities · Things to Do · FAQ · RSVP. Guest nav hrefs are
token-scoped (`/guest/${inviteToken}/{schedule,travel,stay,activities,things-to-do,faq}`). Active =
`a[aria-current="page"]` with a 1.5px olive underline (bottom -9px). Do not omit/duplicate labels.

## 34. Responsive
Convert dense desktop layouts carefully (don't just shrink). `@1023px`: travel grids → 2-col (last/first
span all); stay overview `240px 1fr`; room-section 1-col; activity grids 3-col; schedule 1-col (sidebar
2-col); tighter event-row cols. `@767px`: paper padding 21/15/14; header 164px + hide stamp; all grids
1-col; hero gallery 220px; room/activity/independent grids → horizontal scroll-snap; status-key 2-col;
schedule event-row → stacked grid-areas (icon/date, image, copy, meta); utility-bar 1-col; FAQ sidebar
below main + hide topic card; footer `48px 1fr` + hide lemons.

## 35. Image handling
Use `next/image` (`fill` + `object-fit: cover`) but preserve the mockup crop. Do NOT distort, use
portrait in landscape without cropping, substitute unrelated photography, put text over busy photos w/o
a background, or ship AI placeholder photos as permanent venue content. Room page must handle a missing
image gracefully.

## 36. Supabase tables (single source of truth)
`wedding_config, guest_households, guests, guest_invitations, guest_travel_plans, venues,
venue_images, room_categories, rooms, room_images, room_assignments, activities, activity_images,
activity_signups, schedule_events, faq_categories, faq_items`. Relationships:
`guest_households.id→guests.household_id`, `guest_households.id→room_assignments.household_id`,
`guests.id→activity_signups.guest_id`, `activities.id→activity_signups.activity_id`,
`room_categories.id→rooms.room_category_id`, `rooms.id→room_assignments.room_id`. Do not hard-code
guest-specific room assignments in the page component.

## 37. Loading / empty / private states (must implement, using the approved visual system)
- **Stay:** assigned+published · assigned+unpublished · not assigned · gallery empty · category no image.
- **Activities:** sign-ups not open · open · full · waitlisted · attending · no-RSVP · cancelled.
- **Travel:** none submitted · partial · complete · transportation requested.
- **FAQ:** category empty · loading · contact email unavailable.
- **Schedule:** preliminary · published · one event cancelled/updated · no downloadable calendar yet.

## 38. Accessibility
Real links for nav; meaningful/empty alt; keyboard-operable sign-up controls; `aria-expanded` +
`aria-controls` on FAQ; keyboard-accessible horizontal mobile rows; visible focus; legible at 200%
zoom; avoid text-in-images; don't signal sign-up state by color alone; live-region feedback after
activity changes; descriptive labels on calendar download links.

## 39. Visual-fidelity rules (must NOT)
Add hero images above content · remove the faded countryside background · turn cards into large rounded
app tiles · use ≥20px radii · bold modern sans headings · glassmorphism · heavy shadows · generic
emoji · colorful UI icons instead of illustrated ones · dark background · remove the header postage
stamp · remove the header lemon sprig · remove footer art · convert schedule to a calendar grid ·
convert FAQ to an ungrouped list · hide the personalized room assignment among generic room info ·
merge planned activities with independent recommendations.

## 40. Asset manifest (expected)
`/images/tuscan-countryside.jpg`; `/illustrations/{lemon-sprig,small-lemon-sprig,tiny-olive-sprig,
olive-sprig,wine-glass,bicycle,bicycle-small,bicycle-with-branch,villa-postage-stamp,calendar-sketch,
heart-outline-red,heart-outline-gold,heart-outline-white}.svg`; `/icons/{airplane,car,train,shuttle,
calendar,passport,shield,suitcase,mobile,villa,bed,pool,clock,pin,question,wine,attire,gift,health,
camera}.svg`; `/borders/{scalloped-blue-card,scalloped-red-card}.svg`. Use the approved illustration
files, not generic icon libraries.

## 41. Final instruction (from the brief)
Treat the portal + these five mockups as one connected design system; screenshots are the visual
source of truth. Build reusable components without over-generalizing away each page's nuances. Use the
supplied measurements as initial CSS, then compare against the screenshots at a 1536px desktop viewport
and adjust until major edges/columns/heights/spacing align. Don't declare finished after only an
approximate layout. Every personalized/interactive element must be backed by structured data, not baked
into static text.
