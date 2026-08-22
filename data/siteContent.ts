// Centralized guest-facing content. Keep copy here (not hardcoded in markup)
// so it stays easy to edit and can later be sourced from Supabase.

export const siteContent = {
  couple: {
    bride: "Kelsey",
    groom: "Andrew",
    monogram: "K & A",
    displayName: "Kelsey & Andrew",
  },
  wedding: {
    destination: "Italy",
    eventName: "Wedding Week",
    eyebrow: "Join us for a week in",
    // Venue: SPAO Borgo San Pietro (Allerona, Umbria) — being finalized Aug 2026.
    dateLabel: "June 12 – 15, 2028",
    locationLabel: "Umbria, Italy",
    rsvpDeadlineLabel: "By April 1, 2028",
  },
  /*
   * The one place a guest can reach you. Deliberately EMPTY until Kelsey picks
   * an address — nothing invents a contact route that doesn't work.
   *
   * While it's empty, the site says "check your invitation" and stops. Fill it
   * in and a mailto link appears on the RSVP page and in the FAQ at once.
   */
  contact: {
    email: "chehakshultswedding@gmail.com",
    label: "email us",
  },
  navigation: [
    { label: "Our Weekend", href: "/our-weekend" },
    { label: "Travel", href: "/travel" },
    { label: "Stay", href: "/stay" },
    { label: "Activities", href: "/activities" },
    { label: "FAQ", href: "/faq" },
  ],
} as const;

export type SiteContent = typeof siteContent;
