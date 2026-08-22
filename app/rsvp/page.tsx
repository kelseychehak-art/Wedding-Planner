import type { Metadata } from "next";
import ShowcaseTab from "@/components/mobileproto/ShowcaseTab";
import { rsvpMeta, RsvpBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "RSVP · Kelsey & Andrew's Wedding Week",
  description:
    "Let us know if you'll be joining us in Umbria for Kelsey & Andrew's wedding week.",
};

export default function RsvpPage() {
  return (
    <ShowcaseTab title={rsvpMeta.title} subtitle={rsvpMeta.subtitle} activeKey="rsvp">
      <RsvpBody />
    </ShowcaseTab>
  );
}
