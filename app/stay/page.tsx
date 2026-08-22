import type { Metadata } from "next";
import ShowcaseTab from "@/components/mobileproto/ShowcaseTab";
import { stayMeta, StayBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "Stay · Kelsey & Andrew's Wedding Week",
  description:
    "Where you'll stay for Kelsey & Andrew's wedding week — the borgo in the Umbrian countryside.",
};

export default function StayPage() {
  return (
    <ShowcaseTab title={stayMeta.title} subtitle={stayMeta.subtitle} activeKey="stay">
      <StayBody />
    </ShowcaseTab>
  );
}
