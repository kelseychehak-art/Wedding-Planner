import type { Metadata } from "next";
import ShowcaseTab from "@/components/mobileproto/ShowcaseTab";
import { travelMeta, TravelBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "Travel · Kelsey & Andrew's Wedding Week",
  description:
    "Flights, transfers, and a few tips for the journey to Umbria for Kelsey & Andrew's wedding week.",
};

export default function TravelPage() {
  return (
    <ShowcaseTab title={travelMeta.title} subtitle={travelMeta.subtitle} activeKey="travel">
      <TravelBody rsvpHref="/rsvp" />
    </ShowcaseTab>
  );
}
