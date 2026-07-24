import type { Metadata } from "next";
import DesktopContentPage from "@/components/mobileproto/DesktopContentPage";
import WeekendPager from "@/components/mobileproto/WeekendPager";
import WeekendAgenda from "@/components/mobileproto/WeekendAgenda";
import { weekendMeta } from "@/components/mobileproto/tabs";
import rt from "@/components/mobileproto/ResponsiveTab.module.css";

export const metadata: Metadata = {
  title: "Our Weekend · Kelsey & Andrew's Wedding Week",
  description:
    "The full schedule for Kelsey & Andrew's wedding week in Tuscany — every event from welcome to farewell, June 16–21, 2027.",
};

/*
 * Weekend gets a bespoke split: the phone shows a one-day-at-a-time pager
 * (WeekendPager), while wider viewports show every day at once as an agenda
 * (WeekendBody in the desktop shell). Same breakpoint toggle as ResponsiveTab.
 */
export default function OurWeekendPage() {
  return (
    <>
      <div className={rt.mobile}>
        <WeekendPager backHref="/" />
      </div>
      <div className={rt.desktop}>
        <DesktopContentPage
          variant="vintage"
          art={weekendMeta.art}
          eyebrow={weekendMeta.eyebrow}
          title={weekendMeta.title}
          subtitle={weekendMeta.subtitle}
          active="weekend"
        >
          <WeekendAgenda />
        </DesktopContentPage>
      </div>
    </>
  );
}
