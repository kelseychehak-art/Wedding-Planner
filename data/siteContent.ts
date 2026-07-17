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
  navigation: [
    { label: "Our Weekend", href: "/our-weekend" },
    { label: "Travel", href: "/travel" },
    { label: "Stay", href: "/stay" },
    { label: "Things to Do", href: "/things-to-do" },
    { label: "FAQ", href: "/faq" },
  ],
} as const;

export type SiteContent = typeof siteContent;
