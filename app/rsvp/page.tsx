import type { Metadata } from "next";
import ResponsiveTab from "@/components/mobileproto/ResponsiveTab";
import { rsvpMeta, RsvpBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "RSVP · Kelsey & Andrew's Wedding Week",
  description:
    "Let us know if you'll be joining us in Tuscany for Kelsey & Andrew's wedding week.",
};

export default function RsvpPage() {
  return (
    <ResponsiveTab meta={rsvpMeta}>
      <RsvpBody />
    </ResponsiveTab>
  );
}
