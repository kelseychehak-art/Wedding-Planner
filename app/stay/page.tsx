import type { Metadata } from "next";
import ResponsiveTab from "@/components/mobileproto/ResponsiveTab";
import { stayMeta, StayBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "Stay · Kelsey & Andrew's Wedding Week",
  description:
    "Where you'll stay for Kelsey & Andrew's wedding week in Tuscany — the villa, rooms, and lodging details.",
};

export default function StayPage() {
  return (
    <ResponsiveTab meta={stayMeta}>
      <StayBody />
    </ResponsiveTab>
  );
}
