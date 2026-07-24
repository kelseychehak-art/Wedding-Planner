import type { Metadata } from "next";
import DesktopContentPage from "@/components/mobileproto/DesktopContentPage";
import { stayMeta, StayBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "Stay · Desktop (Vintage) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <DesktopContentPage
      variant="vintage"
      art={stayMeta.art}
      eyebrow={stayMeta.eyebrow}
      title={stayMeta.title}
      subtitle={stayMeta.subtitle}
      titleTone={stayMeta.titleTone}
      active="stay"
    >
      <StayBody />
    </DesktopContentPage>
  );
}
