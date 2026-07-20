# Admin Spec — Settings

> **Status:** Captured 2026-07-20 — **not yet built.** Source: "Claude Code Implementation
> Brief — Admin Settings Page". **No mockup was provided** for this page — layout is described by
> the brief only.
> **Maps to:** net-new page `/admin/settings`. Today only `POST /api/admin/budget/settings` exists;
> there is no general settings surface and no sidebar entry.
> **Repo reconciliation (read before building):** brief assumes Tailwind + shared form components +
> direct Supabase reads and introduces several new settings/config tables plus a team/permission
> model. This repo uses **CSS Modules**, **Supabase RPCs** (`admin_*`), a single-token admin auth
> (`lib/admin-session.ts` cookie `admin_token`, `admin_valid` RPC) — **not** a multi-user role
> system yet. The Settings brief's **Team & Access / role-based access** section is therefore a
> larger net-new capability, not a tweak. Adapt the stack; the settings sections, dependency rules
> (esp. adult/child classification feeding Dashboard + Guest List), and save/unsaved-changes UX are
> the valuable parts.

## Mockup reference

No mockup image was provided with this brief. The brief specifies a **settings sidebar (≈260px) +
form panel** layout with these sections: Wedding Details · Guests & RSVP · Events & Activities ·
Travel & Lodging · Communications · Website & Branding · Integrations · Team & Access · Data &
Privacy, plus summary cards beneath the active form. When a mockup is provided, transcribe it here.

---
## CLAUDE CODE IMPLEMENTATION BRIEF

### Admin Settings Page

Build the Settings section for the private wedding-planning admin interface.

Primary route:

```
/admin/settings
```

The page must recreate the approved Settings mockup as closely as possible while functioning as a real configuration center for the wedding workspace.

This should not be a single oversized form. Build it as a structured settings system with:

A persistent admin sidebar

A secondary settings-navigation column

A main settings form panel

Settings summary cards beneath the active form

Save-state feedback

Role-based access controls

Shared configuration used by the other admin and guest-facing pages

The Settings area should control global rules and defaults, while operational data stays in its relevant page.

Examples:

Guest age category = Guest List

Age cutoff rules = Settings

Guest flight = Travel

Travel submission deadline = Settings

Expense payment = Budget

Primary currency = Settings

Activity booking = Activities

Waitlist behavior = Settings

## 1. ROUTE STRUCTURE

Create:

```
app/
  admin/
    settings/
      page.tsx
      loading.tsx
      error.tsx

      wedding-details/
        page.tsx

      guests-rsvp/
        page.tsx

      events-activities/
        page.tsx

      travel-lodging/
        page.tsx

      communications/
        page.tsx

      website-branding/
        page.tsx

      integrations/
        page.tsx

      team-access/
        page.tsx

      data-privacy/
        page.tsx
```

Preferred routes:

```
/admin/settings
/admin/settings/wedding-details
/admin/settings/guests-rsvp
/admin/settings/events-activities
/admin/settings/travel-lodging
/admin/settings/communications
/admin/settings/website-branding
/admin/settings/integrations
/admin/settings/team-access
/admin/settings/data-privacy
```

Use nested routes rather than keeping every section in one client-side component.

The default /admin/settings route may redirect to:

```
/admin/settings/wedding-details
```

or render the Wedding Details section directly.

Do not create a separate admin shell for the settings routes.

Use the existing:

```
app/admin/layout.tsx
```

## 2. SETTINGS COMPONENT STRUCTURE

Create:

```
components/
  admin/
    settings/
      SettingsPageHeader.tsx
      SettingsLayout.tsx
      SettingsSidebar.tsx
      SettingsNavItem.tsx
      SettingsSaveBar.tsx
      SettingsStatusIndicator.tsx
      SettingsSummaryGrid.tsx
      SettingsSummaryCard.tsx
      SettingsHelpCard.tsx

      wedding-details/
        WeddingDetailsForm.tsx
        WeddingIdentitySection.tsx
        WeddingDatesSection.tsx
        WeddingLocationSection.tsx
        WeddingRegionalSettingsSection.tsx
        WeddingContactSection.tsx

      guests-rsvp/
        GuestsRsvpSettingsForm.tsx
        GuestClassificationSection.tsx
        ChildAgeRulesSection.tsx
        RsvpWindowSection.tsx
        RsvpFormFieldsSection.tsx
        PlusOneRulesSection.tsx
        DietarySettingsSection.tsx
        AccessibilitySettingsSection.tsx
        GuestUpdateRulesSection.tsx

      events-activities/
        EventsActivitiesSettingsForm.tsx
        EventDefaultsSection.tsx
        ActivitySignupWindowSection.tsx
        ActivityCapacitySection.tsx
        ActivityAgeRulesSection.tsx
        EventNotificationDefaultsSection.tsx

      travel-lodging/
        TravelLodgingSettingsForm.tsx
        TravelCollectionSection.tsx
        TravelRequiredFieldsSection.tsx
        TransportationQuestionsSection.tsx
        ChildTravelRequirementsSection.tsx
        LodgingCollectionSection.tsx
        LodgingVisibilitySection.tsx

      communications/
        CommunicationsSettingsForm.tsx
        SenderIdentitySection.tsx
        NotificationDefaultsSection.tsx
        ReminderScheduleSection.tsx
        QuietHoursSection.tsx
        CommunicationTemplatesSection.tsx

      website-branding/
        WebsiteBrandingSettingsForm.tsx
        WebsitePublishingSection.tsx
        DomainSection.tsx
        BrandPaletteSection.tsx
        TypographySection.tsx
        NavigationLabelsSection.tsx
        BrandPreviewPanel.tsx
        SocialSharingSection.tsx

      integrations/
        IntegrationsSettingsPage.tsx
        IntegrationCard.tsx
        GmailIntegrationCard.tsx
        CalendarIntegrationCard.tsx
        DomainIntegrationCard.tsx
        EmailProviderIntegrationCard.tsx
        SmsProviderIntegrationCard.tsx

      team-access/
        TeamAccessSettingsPage.tsx
        TeamMembersTable.tsx
        InviteTeamMemberDialog.tsx
        EditRoleDialog.tsx
        PermissionMatrix.tsx
        SecuritySettingsSection.tsx

      data-privacy/
        DataPrivacySettingsPage.tsx
        ExportDataSection.tsx
        DataRetentionSection.tsx
        PrivacyNoticeSection.tsx
        BackupStatusSection.tsx
        DangerZoneSection.tsx
        DeleteWorkspaceDialog.tsx
```

Create shared field components only if they do not already exist:

```
components/
  admin/
    forms/
      SettingsSection.tsx
      SettingsRow.tsx
      SettingsToggle.tsx
      SettingsSelect.tsx
      SettingsTextField.tsx
      SettingsDateField.tsx
      SettingsNumberField.tsx
      SettingsRadioGroup.tsx
      SettingsCheckboxGroup.tsx
      SettingsWarning.tsx
```

Reuse the existing global form components wherever possible.

## 3. SETTINGS PAGE LAYOUT

The approved mockup uses three visual layers:

Admin sidebar

Settings secondary navigation

Main settings content

Desktop structure:

```
<div className="grid min-h-[calc(100vh-var(--admin-header-height))] grid-cols-[260px_minmax(0,1fr)]">
  <SettingsSidebar />

  <section className="min-w-0">
    {children}
  </section>
</div>
```

The main admin sidebar remains outside this component through the shared admin layout.

Recommended widths:

Admin sidebar: existing width, approximately 228–244px

Settings sidebar: 260px

Main settings content: remaining width

Main page padding:

24px to 28px

Settings content should use a maximum readable form width inside the main pane:

max-width: approximately 1050px

The summary cards may span the full main-pane width.

## 4. PAGE HEADER

Display:

Title:

Settings

Subtitle:

Manage wedding details, preferences, permissions, and integrations.

Right-side save status:

Saved 2 minutes ago

Possible states:

All changes saved

Saving…

Unsaved changes

Save failed

Last saved 2 minutes ago

Suggested component:

```
<SettingsPageHeader
  title="Settings"
  subtitle="Manage wedding details, preferences, permissions, and integrations."
  saveStatus={saveStatus}
```

/>

Retain the editorial forest-green serif title and small olive sprig.

The settings header does not need a summary metric strip.

## 5. SETTINGS SECONDARY NAVIGATION

Display:

Wedding Details

Guests & RSVP

Events & Activities

Travel & Lodging

Communications

Website & Branding

Integrations

Team & Access

Data & Privacy

Suggested icons:

Wedding Details: CalendarHeart

Guests & RSVP: Users

Events & Activities: CalendarRange

Travel & Lodging: Luggage

Communications: Mail

Website & Branding: Palette

Integrations: Link2

Team & Access: ShieldCheck

Data & Privacy: LockKeyhole

Selected item:

Soft forest-tinted background

Forest text

Fine radius

No heavy shadow

Navigation item height:

48px

The settings navigation should remain sticky within the viewport on desktop:

```
position: sticky;
top: var(--admin-page-top);
```

At the bottom, include a Help card:

NEED HELP?

Visit our help center

for guides and tutorials.

Open help center →

## 6. SETTINGS FORM PANEL

Use a large warm-white bordered panel.

Example:

```
<SettingsSectionCard>
  <div className="flex items-center justify-between">
    <h2>Wedding Details</h2>
    <Button variant="secondary">
      Preview Guest Site
    </Button>
  </div>

  <WeddingDetailsForm />
</SettingsSectionCard>
```

Panel styling:

Background: warm white

Border: fine beige

Radius: 8–10px

Shadow: extremely subtle

Padding: 24px

Form grids:

Desktop: two or three columns where appropriate

Tablet: two columns

Mobile: one column

Use visible labels above fields.

Do not rely on placeholder text as the label.

## 7. SAVE BEHAVIOR

Use one of two supported patterns.

Preferred pattern:

Local Save Changes button inside the active settings panel

+

Global save status in the page header

Primary button:

Save Changes

When a field changes:

Unsaved changes

When saving:

Saving…

On success:

All changes saved

On error:

Unable to save changes

Try again

Do not automatically save sensitive settings such as:

Permissions

Integration disconnection

Workspace deletion

Domain changes

Standard form fields may support debounced autosave later, but initial implementation should use an explicit Save Changes action.

Use React Hook Form and Zod for each settings section.

## 8. WEDDING DETAILS SECTION

Route:

```
/admin/settings/wedding-details
```

Display fields from the approved mockup:

Couple Names displayed on site

Formal Name 1

Formal Name 2

Wedding Location

Primary Venue

Wedding Dates

Time Zone

Primary Currency

Website Domain

Admin Contact Email

Wedding Hashtag

Recommended additional fields:

Wedding workspace name

Short wedding title

Default language

Date format

Time format

Primary locale

Guest-facing contact email

Support phone number

Suggested interface:

```
export interface WeddingDetailsSettings {
  workspaceName: string;
  coupleDisplayName: string;

  partnerOneFormalName: string;
  partnerTwoFormalName: string;

  weddingLocationLabel: string;
  primaryVenueId?: string | null;

  weddingStartDate: string;
  weddingEndDate: string;

  timezone: string;
  currencyCode: string;
  locale: string;
  languageCode: string;

  websiteDomain?: string | null;
  adminContactEmail: string;
  guestContactEmail?: string | null;
  weddingHashtag?: string | null;

  dateFormat: string;
  timeFormat: '12-hour' | '24-hour';
}
```

Validation:

const weddingDetailsSchema = z

```
  .object({
    coupleDisplayName: z.string().min(1),
    partnerOneFormalName: z.string().min(1),
    partnerTwoFormalName: z.string().min(1),

    weddingLocationLabel: z.string().min(1),
    primaryVenueId: z.string().uuid().nullable().optional(),

    weddingStartDate: z.string().min(1),
    weddingEndDate: z.string().min(1),

    timezone: z.string().min(1),
    currencyCode: z.string().length(3),

    websiteDomain: z.string().optional(),
    adminContactEmail: z.string().email(),
    weddingHashtag: z.string().max(80).optional(),
  })
  .refine(
    data =>
      new Date(data.weddingEndDate) >=
      new Date(data.weddingStartDate),
    {
      message: 'Wedding end date must be on or after the start date.',
      path: ['weddingEndDate'],
    }
  );
```

Changing these fields should show warnings where relevant.

Example:

Changing the wedding dates may affect event dates,

RSVP deadlines, travel windows, and age calculations.

## 9. GUESTS & RSVP SETTINGS

Route:

```
/admin/settings/guests-rsvp
```

This section must include the newly approved adult/child logic.

### 9A. Guest classification mode

Allow:

Simple classification

Adult / Child

Detailed classification

Adult / Teen / Child / Toddler / Infant

Setting:

```
export type GuestClassificationMode =
  | 'simple'
  | 'detailed';
```

### 9B. Classification method

Allow:

Determine classification from:

Age on wedding start date

Manual classification

Recommended:

```
export type GuestClassificationMethod =
  | 'age_on_wedding_date'
  | 'manual';
```

### 9C. Simple age cutoff

For simple mode:

Adult begins at:

18 years old

Store:

```
adultAgeThreshold: number;
```

### 9D. Detailed age groups

Recommended defaults:

Infant: 0–1

Toddler: 2–4

Child: 5–12

Teen: 13–17

Adult: 18+

Interface:

```
export interface GuestAgeBand {
  id: string;
  key: 'infant' | 'toddler' | 'child' | 'teen' | 'adult';
  label: string;
  minimumAge: number;
  maximumAge?: number | null;
  sortOrder: number;
  mealCategory: string;
}
```

The UI should allow editing labels and age ranges but validate that:

No ranges overlap

There are no gaps unless intentionally allowed

Adult has no upper maximum

Minimum ages are non-negative

### 9E. Guest child-related RSVP questions

Toggle options:

Collect each child’s date of birth

Collect each child’s age

Ask whether a children’s meal is required

Ask whether a high chair is required

Ask whether a booster seat is required

Ask whether a crib is required

Ask whether a car seat is required

Ask whether the child requires adult accompaniment

Recommended distinction:

Date of birth

More accurate but more personal

Age

Less sensitive and sufficient for most planning

Default to collecting age, not full date of birth, unless the user enables DOB.

### 9F. RSVP window

Fields:

RSVP opens

RSVP deadline

Allow late responses

Late-response message

Allow guests to update responses

Guest-update cutoff date

### 9G. Party and plus-one rules

Settings:

Allow unnamed plus-ones

Require plus-one name before final submission

Allow party members to submit separately

Allow primary contact to respond for the full party

Allow different event responses per party member

Default maximum party size

### 9H. Guest-form collection fields

Toggles:

Email

Mobile number

Mailing address

Dietary preference

Food allergy

Accessibility requirement

Song request

Guest note

Emergency contact

Keep dietary preference and food allergy separate.

### 9I. Summary use

These settings must feed:

Guest List child/adult classification

Dashboard attending adult/child counts

Catering reports

Activity age eligibility

Transportation seat requirements

Lodging crib requirements

## 10. ADULT AND CHILD CALCULATION

Create:

```
lib/guests/guest-classification.ts
```

Example:

```
export type GuestAgeCategory =
  | 'adult'
  | 'teen'
  | 'child'
  | 'toddler'
  | 'infant'
  | 'unknown';

export interface GuestClassificationSettings {
  mode: 'simple' | 'detailed';
  method: 'age_on_wedding_date' | 'manual';
  adultAgeThreshold: number;
  ageBands: GuestAgeBand[];
  classificationDate: string;
}
```

Function:

```
export function classifyGuestAge(
  guest: {
    birthDate?: string | null;
    ageAtWedding?: number | null;
    manualAgeCategory?: GuestAgeCategory | null;
  },
  settings: GuestClassificationSettings
): GuestAgeCategory {
  if (
    settings.method === 'manual' &&
    guest.manualAgeCategory
  ) {
    return guest.manualAgeCategory;
  }

  const age =
    guest.ageAtWedding ??
    calculateAgeOnDate(
      guest.birthDate,
      settings.classificationDate
    );

  if (age == null) return 'unknown';

  if (settings.mode === 'simple') {
    return age >= settings.adultAgeThreshold
      ? 'adult'
      : 'child';
  }

  const matchedBand = settings.ageBands
    .sort((a, b) => a.minimumAge - b.minimumAge)
    .find(band => {
      const aboveMinimum = age >= band.minimumAge;
      const belowMaximum =
        band.maximumAge == null ||
        age <= band.maximumAge;

      return aboveMinimum && belowMaximum;
    });

  return matchedBand?.key ?? 'unknown';
}
```

Do not store only a static is_child value without preserving the data needed to recalculate.

Recommended guest fields:

birth_date

age_at_wedding

manual_age_category

age_category_override

The category may be cached for performance, but the classification source must remain clear.

## 11. EVENTS & ACTIVITIES SETTINGS

Route:

```
/admin/settings/events-activities
```

### Event defaults

Fields:

Default event visibility

Default RSVP enabled

Default event status

Allow selected-guest events

Default reminder timing

Allow guest calendar downloads

### Activity sign-up window

Fields:

Activity sign-ups open

Activity sign-up deadline

Allow updates after submission

Cancellation cutoff

### Capacity behavior

Options:

When an activity reaches capacity:

Close sign-ups

Start a waitlist

Allow overbooking and flag it

### Age rules

Settings:

Allow age restrictions by activity

Show child-friendly label

Require adult accompaniment

Allow infant participation

Use guest age category or exact age

### Party-level choices

Settings:

Allow party members to choose different activities

Allow primary contact to select for all members

Require one selection per guest

Allow no-selection response

## 12. TRAVEL & LODGING SETTINGS

Route:

```
/admin/settings/travel-lodging
```

### Travel collection window

Fields:

Collection open

Collection opens at

Collection closes at

Allow guest updates

Guest update cutoff

### Required travel fields

Toggles:

Require arrival information

Require departure information

Require arrival time

Require departure time

Require airline or train operator

Require flight or train number

Allow approximate times

Ask transportation needs

Ask luggage count

Ask rental-car use

### Child travel questions

Toggles:

Ask whether a child car seat is required

Ask whether a booster seat is required

Ask whether a lap infant is traveling

Ask number of child seats needed

### Lodging settings

Fields:

Lodging collection open

Lodging collection deadline

Allow off-site lodging

Allow room requests

Allow roommate requests

Show assigned property to guests

Show room number to guests

Default check-in

Default checkout

Enable room-capacity warnings

Child-related lodging fields:

Ask whether a crib is required

Ask whether a rollaway bed is required

Ask whether a high chair is required

## 13. COMMUNICATIONS SETTINGS

Route:

```
/admin/settings/communications
```

### Sender identity

Fields:

Sender display name

Reply-to email

Email signature

SMS sender label

### Automatic notifications

Toggles:

RSVP confirmation

RSVP update confirmation

Activity booking confirmation

Travel submission confirmation

Lodging assignment confirmation

Schedule-change notification

Guest-account login link

### Schedule-change behavior

Options:

Notify for any public event change

Notify only for date, time, or location changes

Never notify automatically

### Reminder defaults

Fields:

RSVP reminder cadence

Travel reminder cadence

Activity reminder cadence

Final reminder timing

### Quiet hours

Fields:

Quiet hours enabled

Start time

End time

Time-zone behavior

Options:

Send in wedding time zone

Send in each guest’s local time zone

### Template defaults

Manage templates for:

Initial invitation

RSVP reminder

Travel reminder

Activity reminder

Schedule update

Custom announcement

## 14. WEBSITE & BRANDING SETTINGS

Route:

```
/admin/settings/website-branding
```

### Publishing

Fields:

Website status

Draft

Published

Maintenance mode

Require invitation access

Require RSVP login

Allow public homepage

### Domain

Fields:

Primary domain

Redirect domain

SSL status

Domain verification status

### Brand palette

Use the approved constrained palette.

Default tokens:

Forest green

Terracotta

Sky blue

Sage

Citrus gold

Warm cream

Do not present an unrestricted color picker by default.

Allow:

Select one of approved tones

Enter custom hex through Advanced controls

Reset to approved palette

### Typography

Fields:

Editorial heading font

Interface font

Script accent font

Do not share or expose font files.

Use configured web-safe or project-installed fonts.

### Navigation labels

Allow editing labels such as:

Our Weekend

Travel

Stay

Activities

Things to Do

FAQ

RSVP

### Brand preview

Render:

Couple name

Heading sample

Paragraph sample

Primary button

Secondary button

Status colors

This preview should update locally before save.

### Social sharing

Fields:

Page title

Meta description

Social-sharing image

Favicon

## 15. INTEGRATIONS SETTINGS

Route:

```
/admin/settings/integrations
```

Display integration cards.

Possible states:

Connected

Setup required

Connection expired

Sync error

Disabled

Each card should show:

Integration name

Purpose

Connected account

Last synchronized

Current status

Manage Connection

Disconnect

### Gmail card

Display:

Gmail

Connected

Used to import vendor brochures, contracts,

proposals, invoices, and email details.

Configurable options:

```
Import message body
Import attachments
```

Extract vendor contact details

Suggest budget values

Suggest deadlines

Create vendor records automatically

Require admin review before import

Do not automatically ingest every email.

Include filtering rules:

Only emails with wedding label

Only selected senders

Only selected threads

Manual import only

### Google Calendar

Options:

Sync public wedding events

Sync internal timeline blocks

Create guest-facing calendar events

One-way or two-way sync

### Other integration cards

Potential:

Domain and Cloudflare

Email provider

SMS provider

Google Maps

Supabase storage

Vercel deployment

Only render actual connection actions for integrations that are implemented.

Unavailable integrations should clearly say:

Not configured

## 16. TEAM & ACCESS SETTINGS

Route:

```
/admin/settings/team-access
```

### Roles

Support:

Owner

Full Admin

Planner

Finance

Guest Manager

Read Only

Types:

```
export type WorkspaceRole =
  | 'owner'
  | 'admin'
  | 'planner'
  | 'finance'
  | 'guest_manager'
  | 'read_only';
```

### Permission areas

Dashboard

Guests

Itinerary

Travel

Activities

Lodging

Communications

Budget

Vendors

Settings

Integrations

Team access

Data export

Permission levels:

None

View

Edit

Manage

### Members table

Columns:

Name

Email

Role

Status

Last active

Actions

Statuses:

Active

Invited

Expired invitation

Suspended

Actions:

Change role

Edit custom permissions

Resend invitation

Suspend access

Remove user

Sensitive areas should be separately restricted:

Budget

Contracts

Integrations

Team access

Data deletion

### Security settings

Fields:

Require two-factor authentication

Session timeout

Allow remembered devices

Require reauthentication for sensitive changes

## 17. DATA & PRIVACY SETTINGS

Route:

```
/admin/settings/data-privacy
```

### Data exports

Actions:

Export all wedding data

Export guest data

Export RSVP data

Export travel data

Export activity data

Export lodging data

Export budget data

Export vendor data

### Imports

Actions:

```
Import guest CSV
Import vendor CSV
```

Validate import before saving

Download import template

### Privacy controls

Fields:

Guest privacy notice

Data retention duration

Delete declined guest travel data

Anonymize archived guest data

Cookie-consent mode

### Backup status

Display:

Last backup

Backup frequency

Backup status

Restore availability

Do not claim backups exist unless implemented.

### Danger zone

Actions:

Archive wedding workspace

Delete test data

Delete wedding workspace

Deletion flow must require:

Reauthentication

Typing the wedding workspace name

Final destructive confirmation

Do not allow one-click deletion.

## 18. SETTINGS SUMMARY CARDS

Beneath the active Wedding Details form, display summary cards like the approved mockup.

Cards:

Guests & RSVP

RSVP closes Jun 1, 2027

Adult age begins at 18

Manage →

Events & Activities

7 events scheduled

Activity sign-ups open

Manage →

Travel & Lodging

Travel collection closes Aug 15, 2027

Transportation enabled

Manage →

Communications

Email connected

SMS not configured

Manage →

Website & Branding

Published

chehakshultswedding.com

Manage →

Integrations

Gmail connected

Calendar connected

Manage →

Team & Access

2 administrators

Role-based permissions

Manage →

Data & Privacy

Data export available

Privacy and retention settings

Manage →

Cards should link to their respective settings routes.

Do not hardcode their values. Derive them from current settings and connection records.

Grid:

```
grid-template-columns: repeat(3, minmax(0, 1fr));
gap: 16px;
```

At smaller widths:

2 columns

then 1 column

## 19. DATABASE DESIGN

Use a hybrid approach:

One central workspace settings table for core wedding values

Dedicated settings tables for complex domains

Avoid one giant JSON blob for everything

JSON may be used for small flexible preferences, but not critical relational rules

### 19A. Wedding workspace settings

```
create table if not exists wedding_settings (
  id uuid primary key default gen_random_uuid(),

  workspace_name text not null default 'Wedding Workspace',
  couple_display_name text not null,
  partner_one_formal_name text,
  partner_two_formal_name text,

  wedding_location_label text,
  primary_venue_id uuid,

  wedding_start_date date,
  wedding_end_date date,

  timezone text not null default 'Europe/Rome',
  currency_code text not null default 'EUR',
  locale text not null default 'en-US',
  language_code text not null default 'en',
  date_format text not null default 'MMM d, yyyy',
  time_format text not null default '12-hour',

  website_domain text,
  admin_contact_email text,
  guest_contact_email text,
  wedding_hashtag text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 19B. Guest and RSVP settings

```
create table if not exists guest_rsvp_settings (
  id uuid primary key default gen_random_uuid(),

  classification_mode text not null default 'simple',
  classification_method text not null default 'age_on_wedding_date',
  adult_age_threshold integer not null default 18,

  collect_guest_age boolean not null default true,
  collect_birth_date boolean not null default false,

  collect_children_meal boolean not null default true,
  collect_high_chair boolean not null default false,
  collect_booster_seat boolean not null default false,
  collect_crib boolean not null default false,
  collect_car_seat boolean not null default false,

  rsvp_opens_at timestamptz,
  rsvp_closes_at timestamptz,
  allow_late_rsvp boolean not null default true,
  allow_guest_updates boolean not null default true,
  guest_update_cutoff_at timestamptz,

  allow_unnamed_plus_ones boolean not null default true,
  require_plus_one_name boolean not null default false,
  allow_party_member_separate_submission boolean not null default false,
  allow_primary_contact_party_submission boolean not null default true,

  require_email boolean not null default false,
  require_phone boolean not null default false,
  collect_address boolean not null default false,
  collect_dietary_preferences boolean not null default true,
  collect_food_allergies boolean not null default true,
  collect_accessibility_requirements boolean not null default true,
  collect_guest_notes boolean not null default true,

  confirmation_message text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Constraints:

```
alter table guest_rsvp_settings
```

add constraint guest_rsvp_classification_mode_check

```
check (
  classification_mode in ('simple', 'detailed')
);

alter table guest_rsvp_settings
```

add constraint guest_rsvp_classification_method_check

```
check (
  classification_method in (
    'age_on_wedding_date',
    'manual'
  )
);
```

### 19C. Guest age bands

```
create table if not exists guest_age_bands (
  id uuid primary key default gen_random_uuid(),

  settings_id uuid not null
    references guest_rsvp_settings(id)
    on delete cascade,

  category_key text not null,
  display_label text not null,

  minimum_age integer not null,
  maximum_age integer,

  meal_category text,
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (settings_id, category_key)
);
```

Default records:

infant   0–1

toddler  2–4

child    5–12

teen     13–17

adult    18+

### 19D. Events and activities settings

```
create table if not exists event_activity_settings (
  id uuid primary key default gen_random_uuid(),

  default_event_visibility text not null default 'private',
  default_rsvp_enabled boolean not null default true,
  default_event_status text not null default 'draft',

  activity_signup_opens_at timestamptz,
  activity_signup_closes_at timestamptz,
  allow_activity_updates boolean not null default true,
  activity_update_cutoff_at timestamptz,

  capacity_behavior text not null default 'waitlist',
  allow_party_member_separate_choices boolean not null default true,
  allow_no_activity_selection boolean not null default true,

  enable_activity_age_restrictions boolean not null default true,
  enable_child_friendly_label boolean not null default true,
  enable_adult_accompaniment_rule boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 19E. Travel and lodging settings

```
create table if not exists travel_lodging_settings (
  id uuid primary key default gen_random_uuid(),

  travel_collection_open boolean not null default false,
  travel_collection_opens_at timestamptz,
  travel_collection_closes_at timestamptz,
  allow_travel_updates boolean not null default true,
  travel_update_cutoff_at timestamptz,

  require_arrival boolean not null default true,
  require_departure boolean not null default true,
  require_arrival_time boolean not null default true,
  require_departure_time boolean not null default true,
  require_carrier boolean not null default false,
  require_service_number boolean not null default false,
  allow_approximate_times boolean not null default true,

  ask_transportation_needed boolean not null default true,
  ask_luggage_count boolean not null default false,
  ask_rental_car boolean not null default false,

  ask_child_car_seat boolean not null default false,
  ask_booster_seat boolean not null default false,
  ask_lap_infant boolean not null default false,

  lodging_collection_open boolean not null default false,
  lodging_collection_closes_at timestamptz,
  allow_offsite_lodging boolean not null default true,
  allow_room_requests boolean not null default false,
  allow_roommate_requests boolean not null default false,

  show_lodging_property_to_guest boolean not null default true,
  show_room_number_to_guest boolean not null default false,

  default_check_in_date date,
  default_check_out_date date,

  enable_room_capacity_warnings boolean not null default true,
  ask_crib_requirement boolean not null default false,
  ask_rollaway_bed_requirement boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 19F. Communication settings

```
create table if not exists communication_settings (
  id uuid primary key default gen_random_uuid(),

  sender_display_name text,
  reply_to_email text,
  email_signature text,
  sms_sender_label text,

  send_rsvp_confirmation boolean not null default true,
  send_rsvp_update_confirmation boolean not null default true,
  send_activity_confirmation boolean not null default true,
  send_travel_confirmation boolean not null default true,
  send_lodging_confirmation boolean not null default true,

  schedule_change_notification_mode text not null
    default 'critical_changes',

  quiet_hours_enabled boolean not null default false,
  quiet_hours_start time,
  quiet_hours_end time,
  delivery_timezone_mode text not null default 'guest',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 19G. Website branding settings

```
create table if not exists website_branding_settings (
  id uuid primary key default gen_random_uuid(),

  publish_status text not null default 'draft',
  require_invitation_access boolean not null default true,
  require_rsvp_login boolean not null default true,
  public_homepage_enabled boolean not null default false,

  primary_domain text,

  forest_hex text not null default '#3F4A36',
  terracotta_hex text not null default '#E08454',
  sky_blue_hex text not null default '#7FA2C7',
  sage_hex text not null default '#A2B29C',
  gold_hex text not null default '#D4A43A',
  cream_hex text not null default '#FAF7F2',

  heading_font_key text,
  interface_font_key text,
  script_font_key text,

  navigation_labels jsonb not null default '{}'::jsonb,

  social_title text,
  social_description text,
  social_image_path text,
  favicon_path text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## 20. TEAM AND PERMISSION MODEL

Use separate tables.

```
create table if not exists workspace_members (
  id uuid primary key default gen_random_uuid(),

  user_id uuid,
  email text not null,
  display_name text,

  role text not null,
  status text not null default 'invited',

  invited_at timestamptz,
  accepted_at timestamptz,
  last_active_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (email)
);
create table if not exists workspace_member_permissions (
  id uuid primary key default gen_random_uuid(),

  member_id uuid not null
    references workspace_members(id)
    on delete cascade,

  permission_area text not null,
  permission_level text not null,

  unique (member_id, permission_area)
);
```

Do not grant settings access only from client-side checks.

Enforce permissions in server actions and Supabase RLS.

## 21. TYPESCRIPT SETTINGS TYPES

Create:

```
types/settings.ts
```

Example:

```
export interface SettingsNavigationItem {
  key:
    | 'wedding-details'
    | 'guests-rsvp'
    | 'events-activities'
    | 'travel-lodging'
    | 'communications'
    | 'website-branding'
    | 'integrations'
    | 'team-access'
    | 'data-privacy';

  label: string;
  href: string;
  icon: React.ComponentType;
}
export interface SettingsSaveState {
  status:
    | 'saved'
    | 'dirty'
    | 'saving'
    | 'error';

  savedAt?: string | null;
  errorMessage?: string | null;
}
export interface GuestRsvpSettings {
  classificationMode: 'simple' | 'detailed';
  classificationMethod:
    | 'age_on_wedding_date'
    | 'manual';

  adultAgeThreshold: number;
  ageBands: GuestAgeBand[];

  collectGuestAge: boolean;
  collectBirthDate: boolean;

  collectChildMeal: boolean;
  collectHighChair: boolean;
  collectBoosterSeat: boolean;
  collectCrib: boolean;
  collectCarSeat: boolean;

  rsvpOpensAt?: string | null;
  rsvpClosesAt?: string | null;
  allowLateRsvp: boolean;
  allowGuestUpdates: boolean;

  allowUnnamedPlusOnes: boolean;
  requirePlusOneName: boolean;

  requireEmail: boolean;
  requirePhone: boolean;
  collectAddress: boolean;
  collectDietaryPreferences: boolean;
  collectFoodAllergies: boolean;
  collectAccessibilityRequirements: boolean;
}
```

## 22. QUERY STRUCTURE

Create:

```
lib/
  supabase/
    queries/
      settings.ts
    mutations/
      settings.ts
```

Server-side loader:

```
export async function getSettingsPageData(): Promise<{
  weddingDetails: WeddingDetailsSettings;
  guestRsvp: GuestRsvpSettings;
  eventsActivities: EventActivitySettings;
  travelLodging: TravelLodgingSettings;
  communications: CommunicationSettings;
  websiteBranding: WebsiteBrandingSettings;
  integrations: IntegrationSummary[];
  teamSummary: TeamAccessSummary;
  privacySummary: DataPrivacySummary;
}> {
  // Fetch in parallel.
}
```

Use:

const [

  weddingResult,

  guestResult,

  ageBandsResult,

  eventResult,

  travelResult,

  communicationResult,

  brandingResult,

  integrationResult,

  membersResult,

] = await Promise.all([

  getWeddingSettings(),

  getGuestRsvpSettings(),

  getGuestAgeBands(),

  getEventActivitySettings(),

  getTravelLodgingSettings(),

  getCommunicationSettings(),

  getWebsiteBrandingSettings(),

  getIntegrationConnections(),

  getWorkspaceMembers(),

```
]);
```

Do not make one settings query per field.

## 23. MUTATIONS

Create server actions or route handlers for:

Update wedding details

Update guest and RSVP settings

Update guest age bands

Update event and activity settings

Update travel and lodging settings

Update communication settings

Update branding settings

Update navigation labels

Invite team member

Update team role

Update team permissions

Remove team member

Update privacy settings

Request data export

Archive workspace

Delete workspace

After global settings changes, revalidate affected routes.

Example:

```
revalidatePath('/admin/settings');
revalidatePath('/admin/dashboard');
revalidatePath('/admin/guests');
revalidatePath('/admin/itinerary');
revalidatePath('/admin/travel');
revalidatePath('/admin/activities');
revalidatePath('/admin/lodging');
revalidatePath('/admin/budget');
revalidatePath('/weekend');
revalidatePath('/rsvp');
```

Use the project’s actual public route names.

## 24. SETTINGS DEPENDENCY RULES

When global settings change, dependent features must update.

Examples:

### Wedding dates changed

Recalculate or review:

Guest age categories

Event date warnings

RSVP deadline validation

Travel collection dates

Lodging defaults

Reminder schedules

### Adult age threshold changed

Update:

Dashboard adult/child totals

Guest List child labels

Catering totals

Activity eligibility

Child transportation requirements

Do not rewrite manual guest overrides.

### Currency changed

Warn:

Existing budget values will not be converted automatically.

Require an explicit conversion workflow.

### Time zone changed

Warn:

Event, reminder, and travel display times may change.

Do not mutate stored timestamps incorrectly.

### Website publishing changed

Update guest-site availability.

## 25. SETTINGS SUMMARY DATA

Create:

```
export interface SettingsSummaryCardData {
  key: string;
  title: string;
  icon: React.ComponentType;
  lines: string[];
  href: string;
  tone:
    | 'forest'
    | 'sage'
    | 'sky'
    | 'terracotta'
    | 'gold'
    | 'neutral';
}
```

Example derivation:

```
{
  key: 'guests-rsvp',
  title: 'Guests & RSVP',
  lines: [
    `RSVP closes ${formatDate(settings.rsvpClosesAt)}`,
    `Adult age begins at ${settings.adultAgeThreshold}`,
  ],
  href: '/admin/settings/guests-rsvp',
  tone: 'sage',
}
```

## 26. FORM UX REQUIREMENTS

Each settings section should:

Use a clear title

Include a short explanation

Group related controls

Use toggles only for true binary settings

Use radio groups for mutually exclusive choices

Use numeric fields for age thresholds

Show consequences near impactful settings

Disable dependent fields when their parent feature is off

Preserve unsaved changes when validation fails

Provide field-level and form-level errors

Show a confirmation dialog for consequential changes

Example dependency:

Collect child age: Off

Disabled:

Ask children’s meal

Ask high chair

Ask booster seat

However, existing guest values should not be deleted when collection is disabled.

## 27. UNSAVED-CHANGES PROTECTION

When a form is dirty and the user attempts to navigate away:

You have unsaved changes.

Leave without saving?

Cancel

Leave Page

Use:

Router navigation interception where supported

Browser beforeunload for tab closing or refresh

Do not trigger this warning after a successful save.

## 28. INTEGRATION SECURITY

Integration secrets must never be stored in client-readable public environment variables.

Use server-side secret storage.

Do not expose:

Gmail refresh tokens

Email provider API keys

SMS provider secrets

Supabase service-role key

OAuth client secrets

The client may receive only:

Connection status

Connected account label

Last sync time

Permission scope summary

## 29. ROLE-BASED ACCESS

Suggested permissions:

Owner

Full settings access

Admin

Most settings access, excluding workspace deletion

Planner

Wedding, guest, event, travel, and communication settings

Finance

Budget currency and finance-relevant settings only

Guest Manager

Guest and RSVP settings only

Read Only

No settings mutations

Hide navigation items where appropriate, but also enforce authorization on the server.

## 30. SETTINGS ACTIVITY LOG

Write settings changes to the admin activity log.

Suggested events:

wedding_details_updated

guest_classification_updated

rsvp_window_updated

guest_form_fields_updated

activity_settings_updated

travel_collection_updated

lodging_settings_updated

communication_settings_updated

branding_settings_updated

integration_connected

integration_disconnected

team_member_invited

team_member_role_changed

privacy_settings_updated

workspace_archived

Log:

Actor

Setting group

Changed fields

Previous values where safe

New values where safe

Timestamp

Do not log secrets or sensitive tokens.

## 31. VISUAL REQUIREMENTS

Match the approved Settings mockup.

Retain:

Warm cream page canvas

Warm-white bordered settings panels

Forest-green editorial title

Fine beige borders

Thin Lucide icons

Secondary settings navigation

Soft selected-navigation background

Compact field labels

Generous form spacing

Dark forest Save Changes button

Small save-status indicator

Three-column summary-card grid

Terracotta postmark in the shared admin sidebar

Olive branch used sparingly near the title

Do not:

Use a generic account-settings template

Put every setting into accordions

Use bright blue SaaS styling

Create huge toggle switches

Overuse pills

Add heavy shadows

Use unrestricted brand controls by default

Place destructive actions near normal form controls

Mix operational data-management tools into Settings

Hide important consequences of changing global rules

## 32. RESPONSIVE BEHAVIOR

### Large desktop

Match the approved mockup.

### Medium desktop

Settings sidebar may reduce to approximately 230px

Form grid reduces from 3 columns to 2

Summary cards become 2 columns

### Tablet

Admin sidebar collapses

Settings navigation becomes a horizontal scroll row or select menu

Form sections use one or two columns

Summary cards use one column or two columns

### Mobile

Use:

Page header

Settings section selector

One-column form

Sticky Save Changes footer

Summary cards

Do not show the secondary settings sidebar as a narrow vertical rail on mobile.

## 33. ACCESSIBILITY

Implement:

Semantic labels for every field

Field descriptions linked through aria-describedby

Keyboard-accessible navigation

Visible focus states

Accessible toggle labels

Accessible radio groups

Error summary at form top

Focus the first invalid field on submission

Status announcements for save success or failure

Accessible confirmation dialogs

Text labels in addition to connection-status colors

No color-only validation

## 34. LOADING STATES

Use skeletons matching:

Settings page header

Secondary settings navigation

Active settings form

Summary cards

Do not use a large central spinner.

## 35. EMPTY AND UNCONFIGURED STATES

Examples:

### No venue configured

No primary venue selected.

Select a venue or add one from Vendors.

### No communication provider

Email delivery is not configured.

Connect an email provider before enabling automatic notifications.

### No team members

Only you currently have access.

Invite a planner or collaborator when you are ready.

### No integration

Gmail is not connected.

Connect Gmail to import selected vendor emails and attachments.

## 36. ERROR STATES

Handle:

Settings failed to load

Settings failed to save

Date range invalid

Age bands overlap

Age bands contain a gap

RSVP deadline is after the wedding

Travel deadline is after the wedding

Integration connection expired

Permission update failed

Domain verification failed

Workspace deletion failed

Use plain language.

Do not expose raw database errors.

## 37. IMPLEMENTATION ORDER

Build in this order:

1. Inspect the existing admin shell and shared form components

2. Add settings database migrations

3. Create TypeScript settings types

4. Create settings query layer

5. Build SettingsLayout and SettingsSidebar

6. Build Wedding Details form

7. Build Guests & RSVP settings

8. Implement guest classification and age-band logic

9. Connect adult/child totals to Dashboard and Guest List

10. Build Events & Activities settings

11. Build Travel & Lodging settings

12. Build Communications settings

13. Build Website & Branding settings

14. Build Integrations cards

15. Build Team & Access settings

16. Build Data & Privacy settings

17. Build summary cards

18. Add save-state and unsaved-change protection

19. Add permissions and server authorization

20. Add activity logging

21. Add loading, error, and responsive states

22. Complete visual polish

## 38. ACCEPTANCE CRITERIA

The Settings system is complete when:

/admin/settings uses the existing admin shell

The page closely matches the approved mockup

The secondary Settings navigation works through nested routes

Wedding Details can be edited and saved

Adult/child classification can use simple or detailed rules

Adult age threshold defaults to 18 but is editable

Child age bands can be configured without overlaps

Dashboard attending metrics show adult and child totals

Guest List displays each guest’s age category

Child meal, high-chair, crib, booster-seat, and car-seat questions are configurable

RSVP, activity, travel, and lodging collection windows are configurable

Communication defaults can be configured

Website branding controls use the approved palette

Integration cards display real connection states

Team roles and permissions are enforced server-side

Data export and danger-zone actions have proper safeguards

Settings summary cards reflect current saved values

Save-state feedback is visible

Unsaved-change warnings work

Settings changes revalidate affected admin and guest routes

The page remains visually consistent with Dashboard, Guest List, Itinerary, Travel, and Budget

## 39. FINAL CLAUDE RESPONSE

After implementation, provide:

1. Files created

2. Files modified

3. SQL migrations added

4. Packages installed

5. Settings routes implemented

6. Existing shared components reused

7. Settings connected to Supabase

8. Settings still mocked or unavailable

9. Adult/child calculation rules implemented

10. Steps to test simple Adult/Child mode

11. Steps to test detailed age categories

12. Steps to confirm Dashboard totals update

13. Steps to confirm Guest List categories update

14. Steps to test RSVP and travel deadlines

15. Steps to test permissions

16. Steps to test unsaved-change warnings

17. Any assumptions made about existing schema or routes

Do not describe Gmail, SMS, domain verification, backups, exports, or automated reminders as functional unless those integrations are actually connected.
