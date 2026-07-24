import type { Metadata } from "next";
import DesktopContentPage from "@/components/mobileproto/DesktopContentPage";
import { weekendMeta, WeekendBody } from "@/components/mobileproto/tabs";

/*
 * PROTOTYPE — Weekend Schedule, desktop (vintage). The phone version
 * (/our-weekend-vintage) pages through one day at a time; desktop has the room
 * to show the whole week at once. Noindex.
 */

export const metadata: Metadata = {
  title: "Weekend Schedule · Desktop (Vintage) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <DesktopContentPage
      variant="vintage"
      art={weekendMeta.art}
      eyebrow={weekendMeta.eyebrow}
      title={weekendMeta.title}
      subtitle={weekendMeta.subtitle}
      active="weekend"
    >
      <WeekendBody />
    </DesktopContentPage>
  );
}
