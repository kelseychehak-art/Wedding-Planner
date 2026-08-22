import type { Metadata } from "next";
import ShowcaseTab from "@/components/mobileproto/ShowcaseTab";
import { activitiesMeta, ActivitiesBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "Activities · Kelsey & Andrew's Wedding Week",
  description:
    "Optional experiences and things to do during Kelsey & Andrew's wedding week in Umbria.",
};

export default function ActivitiesPage() {
  return (
    <ShowcaseTab title={activitiesMeta.title} subtitle={activitiesMeta.subtitle} activeKey="activities">
      <ActivitiesBody />
    </ShowcaseTab>
  );
}
