import type { Metadata } from "next";
import DolcePage from "@/components/mobileproto/DolcePage";
import { travelMeta, TravelBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "Travel (Vintage) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <DolcePage
      eyebrow={travelMeta.eyebrow}
      title={travelMeta.title}
      subtitle={travelMeta.subtitle}
      titleTone={travelMeta.titleTone}
      active={travelMeta.active}
      backHref="/home-fluid"
      art={travelMeta.art}
    >
      <TravelBody />
    </DolcePage>
  );
}
