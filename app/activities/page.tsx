import type { Metadata } from "next";
import ResponsiveTab from "@/components/mobileproto/ResponsiveTab";
import { activitiesMeta, ActivitiesBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "Activities · Kelsey & Andrew's Wedding Week",
  description:
    "Optional experiences and things to do during Kelsey & Andrew's wedding week in Tuscany.",
};

export default function ActivitiesPage() {
  return (
    <ResponsiveTab meta={activitiesMeta} desktopActive="activities">
      <ActivitiesBody />
    </ResponsiveTab>
  );
}
