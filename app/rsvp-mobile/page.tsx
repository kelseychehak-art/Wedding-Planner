import type { Metadata } from "next";
import DolcePage, { dolce as d } from "@/components/mobileproto/DolcePage";
import KindlyRespondCard from "@/components/KindlyRespondCard";
import { siteContent } from "@/data/siteContent";

/*
 * MOBILE-NATIVE PROTOTYPE — RSVP, "Dolce" art direction.
 * Reuses the real, functional KindlyRespondCard (name + email lookup →
 * get_party_for_rsvp / submit_rsvp) inside the Dolce frame. Noindex.
 */

export const metadata: Metadata = {
  title: "RSVP (Dolce) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

export default function RsvpMobilePage() {
  return (
    <DolcePage
      eyebrow="Kindly respond"
      title="RSVP"
      subtitle="Let us know if you'll be joining us in Tuscany."
      titleTone="coral"
      active="rsvp"
    >
      <p className={d.lead} style={{ textAlign: "center", marginTop: 4 }}>
        Kindly respond by {siteContent.wedding.rsvpDeadlineLabel.replace(/^By /, "")}
      </p>
      <KindlyRespondCard />

      <p className={d.sign}>Con amore</p>
      <p className={d.signSub}>With love, Kelsey &amp; Andrew</p>
    </DolcePage>
  );
}
