import type { Metadata } from "next";
import DesktopContentPage from "@/components/mobileproto/DesktopContentPage";
import { activitiesMeta, ActivitiesBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "Activities · Desktop · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <DesktopContentPage
      variant="cream"
      eyebrow={activitiesMeta.eyebrow}
      title={activitiesMeta.title}
      subtitle={activitiesMeta.subtitle}
      titleTone={activitiesMeta.titleTone}
      active="activities"
    >
      <ActivitiesBody />
    </DesktopContentPage>
  );
}
