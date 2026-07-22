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
    // Venue + exact date still officially TBD (docs/decisions.md D3).
    dateLabel: "June 16 – 21, 2027",
    locationLabel: "Tuscany, Italy",
    rsvpDeadlineLabel: "By April 1, 2027",
  },
  /*
   * The one place a guest can reach you. Deliberately EMPTY until Kelsey picks
   * an address — nothing invents a contact route that doesn't work.
   *
   * While it's empty, the site says "check your invitation" and stops. Fill it
   * in and a mailto link appears on the RSVP page and in the FAQ at once.
   */
  contact: {
    email: "",
    label: "",
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
