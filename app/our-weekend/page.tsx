import type { Metadata } from "next";
import ShowcaseWeekend from "@/components/mobileproto/ShowcaseWeekend";

export const metadata: Metadata = {
  title: "Our Weekend · Kelsey & Andrew's Wedding Week",
  description:
    "The full schedule for Kelsey & Andrew's wedding week in Umbria — every event from welcome to farewell, June 12–15, 2028.",
};

export default function OurWeekendPage() {
  return <ShowcaseWeekend />;
}
