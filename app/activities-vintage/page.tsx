import type { Metadata } from "next";
import DolcePage from "@/components/mobileproto/DolcePage";
import { activitiesMeta, ActivitiesBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "Activities (Vintage) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <DolcePage
      eyebrow={activitiesMeta.eyebrow}
      title={activitiesMeta.title}
      subtitle={activitiesMeta.subtitle}
      titleTone={activitiesMeta.titleTone}
      active={activitiesMeta.active}
      backHref="/home-fluid"
      art={activitiesMeta.art}
    >
      <ActivitiesBody />
    </DolcePage>
  );
}
