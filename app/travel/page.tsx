import type { Metadata } from "next";
import ResponsiveTab from "@/components/mobileproto/ResponsiveTab";
import { travelMeta, TravelBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "Travel · Kelsey & Andrew's Wedding Week",
  description:
    "Flights, transfers, and a few tips for the journey to Tuscany for Kelsey & Andrew's wedding week.",
};

export default function TravelPage() {
  return (
    <ResponsiveTab meta={travelMeta}>
      <TravelBody rsvpHref="/rsvp" />
    </ResponsiveTab>
  );
}
