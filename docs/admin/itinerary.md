# Admin Spec — Itinerary

> **Status:** Captured 2026-07-20 — **not yet built.** Source: "Claude Code Implementation
> Brief — Admin Itinerary Page" + approved mockup (transcribed below; PNG not committed).
> **Maps to:** `/admin/itinerary`. Related to the existing **Timeline** page
> (`app/admin/(dashboard)/timeline/` — milestone-oriented) but distinct: this is the **weekend
> event schedule** (the admin counterpart of the guest-facing Weekend Schedule / `data/schedule.ts`).
> Decide on build whether to add a new route or fold into Timeline.
> **Repo reconciliation (read before building):** brief assumes Tailwind + shared `<PageTitle>`/
> `<Button>` components + direct Supabase reads; this repo uses **CSS Modules** + **Supabase RPCs**
> (`admin_*`) under `app/admin/(dashboard)/`. The guest-facing schedule already lives in
> `data/schedule.ts` (`ScheduleEvent`/`ScheduleDay`, `formatTimeRange`) — reuse/extend it rather
> than duplicating event copy. Adapt stack specifics; keep the layout, columns, and states.

## Mockup reference (transcribed)

- **Header:** title "Itinerary"; subtitle "Manage your weekend schedule, timeline, and event
  details."; olive sprig upper-right; **+ ADD EVENT** button.
- **Metric strip (6):** `7 Events` (Across 6 days) · `52 Invited` (Across 28 parties) ·
  `38 Attending` (73% of invited) · `12 Time Blocks` (Scheduled) · `9 Locations` (Across Tuscany) ·
  `4 To Do Items` (Outstanding).
- **Category tabs:** All Events · Public Schedule · Internal Timeline · Rehearsal & Welcome ·
  Weekend Events · Farewell.  **Right actions:** Export · View Timeline.
- **Table columns:** Date · Event (thumbnail + title + description + category badge) · Time ·
  Location · Attending · Visibility · Status · Actions.
- **Sample rows:** MON JUN 16 **Welcome Dinner** (WELCOME EVENT) 6:00–9:00 PM · Villa Courtyard ·
  38 Attending / 12 Awaiting · Public · Scheduled. TUE JUN 17 **Wine Tasting** (ACTIVITY) 4:00–6:30
  PM · Local Vineyard · 35/15 · Public · Scheduled. WED JUN 18 **Cooking Class** 10:30 AM–1:30 PM ·
  Villa Kitchen · 32/18. THU JUN 19 **Pool Day & Lunch** (RELAXATION) 12:00–4:00 PM · Villa Pool ·
  40/10 · **Private** · Scheduled. FRI JUN 20 **Town Excursion** (FREE TIME) 3:00–8:00 PM · Nearby
  Hill Town · 28/22. SAT JUN 21 **Farewell Party** (CELEBRATION) 7:00–11:00 PM · Under the Stars ·
  45/5. SUN JUN 22 **Farewell Brunch** (FAREWELL) 10:00 AM–12:00 PM · Villa Terrace · 30/20 ·
  **Draft**.
- **Footer legend:** Scheduled · Draft · Confirmed · Tentative · Cancelled — "Times and details are
  subject to change."

> ⚠️ **Wedding-fact note:** this mockup uses **June 16–22, 2027** (closest to canonical June 16–21).
> Other admin mockups (Dashboard, Travel) use September dates — reconcile all to the canonical
> **June 16–21, 2027 · Tuscany** on build. See `docs/admin/README.md`.

---
## CLAUDE CODE IMPLEMENTATION BRIEF

### Admin Itinerary Page

Build the next page in the private wedding-planning admin interface:

```
/admin/itinerary
```

This page must recreate the approved Itinerary admin mockup as closely as possible while using the same design system, application shell, sidebar, typography, colors, spacing, Supabase data, and reusable components already established for the Guest Dashboard and Guest List pages.

The Itinerary page should visually relate to the guest-facing Weekend Schedule, but it must function as an admin planning and operations view.

It should not simply duplicate the public guest schedule.

The public schedule is presentation-focused. The admin itinerary must support:

Creating and editing events

Managing guest visibility

Viewing attendance and missing responses

Managing internal schedule blocks

Tracking event status

Managing locations

Connecting activities to the itinerary

Identifying unfinished event setup

Exporting or previewing the guest-facing schedule

## 1. ROUTE

Use:

```
app/
  admin/
    itinerary/
      page.tsx
      loading.tsx
      error.tsx
```

The route is:

```
/admin/itinerary
```

This page must use the existing shared admin layout:

```
app/admin/layout.tsx
```

Do not recreate the sidebar or page shell locally inside this page.

## 2. PAGE COMPONENT STRUCTURE

Create:

```
components/
  admin/
    itinerary/
      ItineraryPageHeader.tsx
      ItineraryMetricStrip.tsx
      ItineraryToolbar.tsx
      ItineraryViewTabs.tsx
      ItineraryTable.tsx
      ItineraryRow.tsx
      ItineraryEventCell.tsx
      ItineraryDateCell.tsx
      ItineraryTimeCell.tsx
      ItineraryLocationCell.tsx
      ItineraryAttendanceCell.tsx
      ItineraryVisibilityCell.tsx
      ItineraryStatusCell.tsx
      ItineraryActionsMenu.tsx
      EventDetailDrawer.tsx
      EventForm.tsx
      AddEventModal.tsx
      DeleteEventDialog.tsx
      TimelineView.tsx
      PublicSchedulePreview.tsx
      ItineraryExportMenu.tsx
      ItineraryEmptyState.tsx
```

Add shared types:

```
types/
  itinerary.ts
```

Add query and mutation files:

```
lib/
  supabase/
    queries/
      itinerary.ts
    mutations/
      itinerary.ts

  itinerary/
    itinerary-status.ts
    itinerary-metrics.ts
    itinerary-filters.ts
    itinerary-validation.ts
```

## 3. PAGE HEADER

Use the same shared page title component from the Guest pages.

Display:

Title:

Itinerary

Subtitle:

Manage your weekend schedule, timeline, and event details.

Primary action:

+ Add Event

Use the same dark forest-green button styling as Add Guest or Party.

Example:

```
<PageTitle
  title="Itinerary"
  subtitle="Manage your weekend schedule, timeline, and event details."
  action={
    <Button onClick={() => setAddEventOpen(true)}>
      <Plus className="size-4" />
      Add Event
    </Button>
  }
```

/>

Retain the small decorative olive sprig at the upper-right area of the page header.

Do not place decorative wedding illustrations inside the operational table.

## 4. PAGE LAYOUT

Use this vertical structure:

Page title and Add Event button

Summary metric strip

View/filter toolbar

Itinerary table or timeline view

Table legend and schedule note

Event detail drawer/modal

Suggested JSX:

```
<div className="space-y-5">
  <ItineraryPageHeader />

  <ItineraryMetricStrip metrics={metrics} />

  <ItineraryToolbar
    activeView={activeView}
    activeCategory={activeCategory}
  />

  {activeView === 'table' ? (
    <ItineraryTable events={filteredEvents} />
  ) : (
    <TimelineView events={filteredEvents} />
  )}

  <ItineraryFooterLegend />
</div>
```

## 5. SUMMARY METRIC STRIP

The approved mockup shows six metrics:

7 Events

Across 6 days

52 Invited

Across 28 parties

38 Attending

73% of invited

12 Time Blocks

Scheduled

9 Locations

Across Tuscany

4 To Do Items

Outstanding

All metrics must be calculated from Supabase.

Do not hardcode them.

Use these icons:

Events: CalendarDays

Invited: Users

Attending: CircleCheck or UserCheck

Time Blocks: Clock3

Locations: MapPin

To Do Items: ClipboardList

Create:

```
export interface ItineraryMetrics {
  eventCount: number;
  eventDayCount: number;
  invitedGuestCount: number;
  partyCount: number;
  attendingGuestCount: number;
  attendancePercentage: number;
  timeBlockCount: number;
  locationCount: number;
  outstandingTaskCount: number;
}
```

Metric behavior:

Clicking Events resets to all events.

Clicking Attending sorts or filters by attendance.

Clicking To Do Items filters to incomplete events.

Clicking Locations may open a location filter or route to a future location-management page.

Use the same connected metric-strip visual treatment as the Guest List pages.

## 6. VIEW AND CATEGORY TOOLBAR

The approved mockup uses category tabs on the left and actions on the right.

### Category tabs

Display:

All Events

Public Schedule

Internal Timeline

Rehearsal & Welcome

Weekend Events

Farewell

Use horizontally aligned rectangular tab controls.

Selected state:

White or very light surface

Forest border

Forest text

Unselected state:

Warm surface

Light border

Dark neutral text

The categories should be data-driven where possible.

Suggested query state:

```
/admin/itinerary?category=all&view=table
/admin/itinerary?category=public&view=table
/admin/itinerary?category=internal&view=timeline
```

Supported URL parameters:

category

view

status

visibility

date

location

search

sort

### Right-side actions

Display:

Export

View Timeline

When timeline view is active, change the button to:

View Table

Suggested structure:

```
<div className="flex items-center justify-between gap-4">
  <ItineraryViewTabs />

  <div className="flex items-center gap-2">
    <ItineraryExportMenu />
    <Button variant="secondary">
      <ListTree />
      View Timeline
    </Button>
  </div>
</div>
```

## 7. TABLE STRUCTURE

Use these columns:

Date

Event

Time

Location

Attending

Visibility

Status

Actions

Recommended widths:

Date: 74px

Event: 330px

Time: 185px

Location: 180px

Attending: 150px

Visibility: 170px

Status: 125px

Actions: 52px

Set:

min-width: approximately 1250px

On narrower desktop screens, allow horizontal scrolling.

The table should not look like a generic spreadsheet.

Use:

Warm white surface

Fine horizontal separators

Subtle vertical separators between major columns

Approximately 86–98px row height

Small uppercase table headers

No heavy zebra striping

No large shadows

No excessively rounded rows

## 8. DATE CELL

Display the abbreviated weekday and date in a stacked format:

MON

JUN 16

Example:

```
<div className="w-[60px] text-left">
  <div className="text-[10px] font-semibold tracking-[0.12em] text-ink-700">
    MON
  </div>
  <div className="mt-1 text-[10px] font-medium text-ink-900">
    JUN 16
  </div>
</div>
```

If multiple events occur on the same day, either:

Repeat the date in each row for easiest scanning, or

Visually group the same-day events with a shared date block.

Use the first approach initially because it is simpler and remains clear while sorting and filtering.

## 9. EVENT CELL

The event cell contains:

Event thumbnail

Event title

Short guest-facing description

Event category badge

Example:

[image] Welcome Dinner

        Kick off the weekend with a

        relaxed welcome dinner.

        WELCOME EVENT

Thumbnail:

98px wide

66px high

8px radius

object-cover

Event title:

14px to 15px

Medium weight

Dark ink

Description:

10.5px to 11px

Maximum two or three lines

Muted dark gray

Category badge examples:

WELCOME EVENT

ACTIVITY

RELAXATION

FREE TIME

CELEBRATION

FAREWELL

CEREMONY

MEAL

TRANSPORTATION

INTERNAL

Use small understated labels, not large pills.

Suggested category colors:

Welcome: sage

Activity: forest

Relaxation: sky blue

Free time: gold

Celebration: terracotta

Farewell: muted blue or olive

Internal: neutral gray

Ceremony: soft terracotta

Transportation: sky blue

## 10. TIME CELL

Display:

6:00 PM – 9:00 PM

Use a small clock icon aligned left.

For all-day or flexible events, support:

All day

Time TBD

Flexible

If the event has multiple time blocks, show:

3 time blocks

View timeline

The main public start and end times belong in the primary row. Detailed setup, transportation, photography, vendor, and cleanup times should appear in the event drawer or timeline view.

## 11. LOCATION CELL

Display:

Villa Courtyard

Villa Rosa

View details

Use a small map-pin icon.

Structure:

Primary location name

Property or town beneath

Small action link

Example:

```
<div>
  <div className="flex items-start gap-2">
    <MapPin className="mt-0.5 size-3.5" />
    <div>
      <p className="font-medium">Villa Courtyard</p>
      <p className="text-muted">Villa Rosa</p>
      <button>View details</button>
    </div>
  </div>
</div>
```

If no location is assigned:

Location missing

Add location

Use terracotta as a warning state.

## 12. ATTENDANCE CELL

Display two values:

38 Attending

12 Awaiting

Optional third state:

2 Declined

Use:

Forest for attending

Gold or terracotta for awaiting

Terracotta for declined

Counts must be calculated from guest_event_responses.

Clicking the attendance cell should open the event detail drawer directly to the guest-response section.

Do not display only a percentage. Show the actual counts.

## 13. VISIBILITY CELL

Support:

Public

Visible to guests

Private

Not visible to guests

Selected Guests

Visible to invited guests only

Draft Preview

Visible to admins only

Use icons:

Public: Globe2

Private: Lock

Selected Guests: Users

Draft Preview: EyeOff

This is critical because the admin itinerary includes internal items that should never display on the public guest website.

Suggested type:

```
export type EventVisibility =
  | 'public'
  | 'private'
  | 'selected_guests'
  | 'admin_preview';
```

The visibility cell should be editable from the row overflow menu or event drawer.

## 14. STATUS CELL

Support these event statuses:

Draft

Tentative

Scheduled

Confirmed

Cancelled

Completed

Status colors:

Scheduled: forest green

Confirmed: sky blue

Draft: citrus gold

Tentative: neutral gray

Cancelled: terracotta

Completed: sage

Display a small colored dot followed by the status text.

Example:

```
<div className="flex items-center gap-2">
  <span className="size-2 rounded-full bg-forest-700" />
  <span>Scheduled</span>
</div>
```

Do not use a large filled badge.

## 15. ACTIONS MENU

Each row has a three-dot overflow menu.

Actions:

View event

Edit event

Duplicate event

Preview guest view

View guest responses

Manage invitees

Manage timeline

Change visibility

Change status

Archive event

Delete event

Only show Preview guest view for events that can appear publicly.

Only show View guest responses for events with RSVP enabled.

Delete must require confirmation.

Archiving should be preferred over deletion for events that already have guest responses.

## 16. SAMPLE EVENT ROWS

Seed enough data to represent the approved mockup:

Monday, June 16

Welcome Dinner

6:00 PM – 9:00 PM

Villa Courtyard

Villa Rosa

38 attending

12 awaiting

Public

Scheduled

Tuesday, June 17

Wine Tasting

4:00 PM – 6:30 PM

Local Vineyard

Tuscany

35 attending

15 awaiting

Public

Scheduled

Wednesday, June 18

Cooking Class

10:30 AM – 1:30 PM

Villa Kitchen

Villa Rosa

32 attending

18 awaiting

Public

Scheduled

Thursday, June 19

Pool Day & Lunch

12:00 PM – 4:00 PM

Villa Pool

Villa Rosa

40 attending

10 awaiting

Private or selected guests

Scheduled

Friday, June 20

Town Excursion

3:00 PM – 8:00 PM

Nearby Hill Town

Tuscany

28 attending

22 awaiting

Public

Scheduled

Saturday, June 21

Farewell Party

7:00 PM – 11:00 PM

Under the Stars

Villa Rosa

45 attending

5 awaiting

Public

Scheduled

Sunday, June 22

Farewell Brunch

10:00 AM – 12:00 PM

Villa Terrace

Villa Rosa

30 attending

20 awaiting

Public

Draft

Use properly licensed placeholder imagery or local project placeholders.

Do not depend on temporary image URLs.

## 17. EVENT DETAIL DRAWER

Clicking a row or View event opens a right-side drawer.

Use:

Drawer width: 600px to 680px

The drawer should contain these sections:

Overview

Guest-facing details

Date and time

Internal timeline

Location

Invitees and attendance

Visibility

Activities

Transportation

Vendors

Setup requirements

Tasks

Attachments

Notes

Change history

Suggested tab structure:

Details

Guests

Timeline

Planning

History

### Details tab

Fields:

Event title

Short label

Description

Category

Date

Public start time

Public end time

Location

Dress code

What to bring

Guest-facing notes

Image

Visibility

RSVP enabled

Status

### Guests tab

Show:

Invited

Attending

Awaiting

Declined

Not invited

Include:

Search

Filter

Individual guest list

Add/remove invitees

Send reminder

Export attendees

### Timeline tab

Show internal operational blocks:

Vendor arrival

Setup begins

Guest transportation

Doors open

Event starts

Meal service

Speeches

Event ends

Guest departure

Cleanup

### Planning tab

Show:

Tasks

Vendors

Transportation

Attachments

Admin notes

## 18. ADD OR EDIT EVENT FORM

Use React Hook Form and Zod.

Suggested schema:

const eventFormSchema = z

```
  .object({
    title: z.string().min(1, 'Event title is required'),
    shortLabel: z.string().max(30).optional(),
    description: z.string().max(500).optional(),
    category: z.string().min(1),
    eventDate: z.string().min(1),
    startsAt: z.string().optional(),
    endsAt: z.string().optional(),
    locationId: z.string().uuid().nullable(),
    visibility: z.enum([
      'public',
      'private',
      'selected_guests',
      'admin_preview',
    ]),
    status: z.enum([
      'draft',
      'tentative',
      'scheduled',
      'confirmed',
      'cancelled',
      'completed',
    ]),
    rsvpEnabled: z.boolean(),
    activitySignupEnabled: z.boolean(),
    guestDescription: z.string().max(1000).optional(),
    adminNotes: z.string().max(3000).optional(),
  })
  .refine(
    data =>
      !data.startsAt ||
      !data.endsAt ||
      new Date(data.endsAt) > new Date(data.startsAt),
    {
      message: 'End time must be after start time',
      path: ['endsAt'],
    }
  );
```

Form sections:

Event basics

Date and time

Location

Guest visibility

RSVP and activities

Guest-facing content

Internal planning

Image

Primary actions:

Save Draft

Save Event

Cancel

For an existing event:

Save Changes

## 19. INTERNAL TIMELINE VIEW

The View Timeline button switches from table view to an internal planning timeline.

This is not the guest-facing Weekend Schedule.

Use:

```
/admin/itinerary?view=timeline
```

The timeline should group by date and event.

Example:

MONDAY, JUNE 16

2:00 PM    Rental delivery

3:00 PM    Florist arrival

4:00 PM    Courtyard setup

5:15 PM    Photographer arrival

5:30 PM    Guest shuttle begins

6:00 PM    Welcome Dinner begins

8:45 PM    Final drinks

9:00 PM    Event concludes

9:15 PM    Shuttle departure

Timeline columns:

Time

Event

Timeline Item

Owner

Location

Status

Actions

Support drag-and-drop only if already used elsewhere. It is not required for the initial implementation.

Initial implementation should support:

Add timeline block

Edit block

Reorder by time

Assign owner

Mark complete

Flag conflict

## 20. PUBLIC SCHEDULE PREVIEW

Include an action:

Preview Guest Schedule

This should open either:

```
/admin/itinerary/preview
```

or a modal/new tab rendering the guest-facing schedule using the same data.

Only include events where:

visibility = public

or

visibility = selected_guests for the selected guest

Do not maintain a separate manual public itinerary dataset.

The admin itinerary should be the source of truth for the guest-facing schedule.

Public schedule data should derive from:

wedding_events

event visibility

event guest assignments

guest event responses

locations

event images

guest-facing descriptions

Internal timeline blocks, admin notes, vendor arrival details, and internal tasks must never be exposed publicly.

## 21. EXPORT MENU

The Export button should open:

Export public schedule PDF

Export internal timeline PDF

Export CSV

Download ICS

Print schedule

For the initial build:

CSV can be fully functional

ICS can be fully functional

Print can use a print stylesheet

PDF may initially use a print-to-PDF flow unless a PDF library is already present

The ICS export should support:

All public events

Individual event

Selected date range

## 22. SUPABASE DATA MODEL

Extend the prior wedding_events table rather than creating a duplicate itinerary table.

Use a migration resembling:

```
alter table wedding_events
add column if not exists short_label text,
add column if not exists description text,
add column if not exists guest_description text,
add column if not exists category text,
add column if not exists visibility text not null default 'private',
add column if not exists status text not null default 'draft',
add column if not exists image_url text,
add column if not exists rsvp_enabled boolean not null default true,
add column if not exists activity_signup_enabled boolean not null default false,
add column if not exists dress_code text,
add column if not exists what_to_bring text,
add column if not exists admin_notes text,
add column if not exists location_id uuid,
add column if not exists updated_at timestamptz not null default now();
```

Use database constraints where appropriate:

```
alter table wedding_events
```

add constraint wedding_events_visibility_check

```
check (
  visibility in (
    'public',
    'private',
    'selected_guests',
    'admin_preview'
  )
);
alter table wedding_events
```

add constraint wedding_events_status_check

```
check (
  status in (
    'draft',
    'tentative',
    'scheduled',
    'confirmed',
    'cancelled',
    'completed'
  )
);
```

## 23. LOCATIONS TABLE

Create or reuse a normalized location table.

```
create table if not exists event_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  property_name text,
  address_line_1 text,
  address_line_2 text,
  city text,
  region text,
  postal_code text,
  country text,
  latitude numeric,
  longitude numeric,
  guest_directions text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
Add the foreign key:
alter table wedding_events
```

add constraint wedding_events_location_id_fkey

```
foreign key (location_id)
references event_locations(id)
on delete set null;
```

## 24. EVENT INVITATIONS

Do not assume every guest is invited to every event.

Create:

```
create table if not exists event_guest_invitations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references wedding_events(id) on delete cascade,
  guest_id uuid not null references guests(id) on delete cascade,
  invitation_status text not null default 'invited',
  created_at timestamptz not null default now(),
  unique (event_id, guest_id)
);
```

Suggested statuses:

invited

not_invited

optional

waitlisted

This table controls:

Which guests can view selected events

Event-level response totals

Event reminder lists

Activity eligibility

## 25. INTERNAL TIMELINE BLOCKS

Create:

```
create table if not exists event_timeline_blocks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references wedding_events(id) on delete cascade,
  title text not null,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  owner_name text,
  owner_type text,
  location_id uuid references event_locations(id) on delete set null,
  status text not null default 'scheduled',
  visibility text not null default 'internal',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Timeline blocks are always private unless explicitly designed otherwise.

Do not send internal timeline data to public guest routes.

## 26. EVENT TASKS

Create:

```
create table if not exists event_tasks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references wedding_events(id) on delete cascade,
  title text not null,
  description text,
  assigned_to text,
  due_at timestamptz,
  status text not null default 'open',
  priority text not null default 'normal',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Suggested task statuses:

open

in_progress

blocked

complete

cancelled

The To Do Items metric should count unfinished event tasks.

## 27. TYPESCRIPT TYPES

Create:

```
export type ItineraryEventStatus =
  | 'draft'
  | 'tentative'
  | 'scheduled'
  | 'confirmed'
  | 'cancelled'
  | 'completed';

export type ItineraryEventVisibility =
  | 'public'
  | 'private'
  | 'selected_guests'
  | 'admin_preview';

export interface ItineraryEvent {
  id: string;
  title: string;
  shortLabel?: string | null;
  description?: string | null;
  guestDescription?: string | null;
  category?: string | null;
  eventDate: string;
  startsAt?: string | null;
  endsAt?: string | null;
  visibility: ItineraryEventVisibility;
  status: ItineraryEventStatus;
  imageUrl?: string | null;
  rsvpEnabled: boolean;
  activitySignupEnabled: boolean;
  location?: ItineraryLocation | null;
  attendance: ItineraryAttendanceSummary;
  timelineBlockCount: number;
  outstandingTaskCount: number;
}
export interface ItineraryAttendanceSummary {
  invited: number;
  attending: number;
  awaiting: number;
  declined: number;
  notInvited: number;
}
export interface ItineraryLocation {
  id: string;
  name: string;
  propertyName?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
}
export interface ItineraryTimelineBlock {
  id: string;
  eventId: string;
  title: string;
  description?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  ownerName?: string | null;
  ownerType?: string | null;
  status: string;
  location?: ItineraryLocation | null;
}
```

## 28. QUERY LAYER

Create a server-side function:

```
export async function getItineraryPageData(): Promise<{
  events: ItineraryEvent[];
  metrics: ItineraryMetrics;
  locations: ItineraryLocation[];
  categories: string[];
}> {
  // Fetch events, locations, invitations, event responses,
  // timeline blocks, and outstanding tasks.
  // Normalize into page view models.
}
```

Avoid per-event network requests.

Fetch the required tables in parallel where possible:

const [

  eventsResult,

  locationsResult,

  invitationsResult,

  responsesResult,

  timelineBlocksResult,

  tasksResult,

] = await Promise.all([

  getEvents(),

  getLocations(),

  getEventInvitations(),

  getEventResponses(),

  getTimelineBlocks(),

  getEventTasks(),

```
]);
```

Aggregate attendance counts in the server data layer.

## 29. MUTATIONS

Create server actions or route handlers for:

Create event

Update event

Duplicate event

Archive event

Delete event

Update event status

Update visibility

Add timeline block

Update timeline block

Delete timeline block

Add event task

Update event task

Invite guests to event

Remove guests from event

After mutation:

```
revalidatePath('/admin/itinerary');
revalidatePath('/admin/dashboard');
revalidatePath('/weekend');
```

Use the actual public itinerary route in the existing application if it differs from /weekend.

## 30. EVENT IMAGE HANDLING

Event images should use Supabase Storage.

Suggested bucket:

event-images

Store the storage path rather than relying only on an arbitrary external URL.

Use:

wedding_events.image_url

or preferably:

wedding_events.image_path

Create a reusable image uploader with:

Upload progress

Preview

Replace

Remove

File type validation

File-size validation

Alt-text field

Recommended formats:

JPEG

PNG

WebP

## 31. FOOTER LEGEND

At the bottom of the table display:

● Scheduled

● Draft

● Confirmed

● Tentative

● Cancelled

Use the same status colors as the status cells.

At the far right display a soft note:

Times and details are subject to change.

Use an info icon and subtle cream container.

## 32. LOADING AND EMPTY STATES

### Loading

Use skeletons matching:

Metric strip

Toolbar

Seven event rows

Do not use a large spinner in the center of the page.

### Empty state

When there are no events:

Your itinerary is ready to take shape.

Add your first event to begin building the wedding weekend.

Action:

Add First Event

Use a restrained calendar or villa line icon.

Do not make the empty state overly whimsical.

## 33. RESPONSIVE BEHAVIOR

### Large desktop

Match the approved mockup.

### Medium desktop

Keep sidebar

Allow table horizontal scroll

Metric strip may wrap into 3 + 3

Toolbar may wrap actions to a second line

### Tablet

Collapse sidebar to icon rail or drawer

Use event cards instead of the full table only below approximately 900px

Retain category and status filters

### Mobile

Use stacked event cards:

Date

Event name

Time

Location

Attendance

Visibility

Status

The desktop admin table remains the primary design priority.

## 34. ACCESSIBILITY

Implement:

Semantic buttons

Keyboard-accessible menus

Visible focus rings

Labels for all icon-only controls

```
Table headers using <th>
```

Status information expressed in text, not only color

Alt text for event images

Accessible modal and drawer focus trapping

Confirmation before destructive actions

## 35. DESIGN REQUIREMENTS

Match the approved mockup using the existing admin design tokens.

Maintain:

Warm cream page canvas

Soft white content surfaces

Forest-green editorial title

Fine beige borders

Minimal shadows

Thin Lucide icons

Terracotta warnings

Sky-blue secondary informational accents

Sage activity accents

Compact typography

Large desktop information density

Editorial warmth without becoming decorative or illustrative

The Itinerary page should look like it belongs directly beside:

Guest Dashboard

Guest List — Party View

Guest List — Individual View

Do not introduce a separate design language.

## 36. RELATIONSHIP TO THE GUEST-FACING SCHEDULE

The admin page should visually reference the guest-facing Weekend Schedule, but should not be an exact copy.

Use these relationships:

Guest-facing Weekend Schedule

- Large editorial display

- Descriptive event storytelling

- Simplified time and location

- Guest-relevant information only

- Decorative imagery

- RSVP/activity actions

Admin Itinerary

- Compact table

- Event management

- Attendance totals

- Visibility controls

- Draft and status tracking

- Internal timeline

- Tasks

- Vendor and setup details

- Public preview

Both views must use the same event records.

Do not duplicate events into separate admin and guest tables.

## 37. IMPLEMENTATION ORDER

Build in this order:

1. Itinerary TypeScript types

2. Database migration

3. Supabase query functions

4. Metrics aggregation

5. Itinerary page header

6. Metric strip

7. Toolbar and URL state

8. Table structure

9. Event row cells

10. Event drawer

11. Add/Edit Event form

12. Mutations

13. Timeline view

14. Public schedule preview integration

15. Export functionality

16. Loading, empty, and error states

17. Responsive behavior

18. Final visual polish

## 38. ACCEPTANCE CRITERIA

The page is complete when:

/admin/itinerary uses the existing admin shell

The page visually matches the approved Itinerary mockup

Six summary metrics are calculated from live data

All itinerary events appear in a compact operational table

Event images, descriptions, dates, times, locations, attendance, visibility, and status are visible without opening each event

The page supports table and internal timeline views

URL parameters preserve view and filter state

Clicking an event opens a detailed management drawer

Admins can create and edit events

Admins can control guest visibility

Attendance totals derive from event invitations and responses

Internal timeline blocks never appear in the guest-facing schedule

Public schedule preview uses the same underlying event data

The guest-facing schedule does not require manual duplicate updates

The page remains usable on narrower desktop screens

Styling is consistent with the approved Guest Dashboard and Guest List pages

## 39. FINAL CLAUDE RESPONSE

After implementation, provide:

1. Files created

2. Files modified

3. SQL migration added

4. Packages installed

5. Environment variables used

6. Route and query behavior

7. Features connected to Supabase

8. Features temporarily using sample data

9. Steps to test event creation and editing

10. Steps to confirm public schedule visibility

Do not report a feature as complete when it remains hardcoded or mocked.
