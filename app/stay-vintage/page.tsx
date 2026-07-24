import type { Metadata } from "next";
import DolcePage from "@/components/mobileproto/DolcePage";
import { stayMeta, StayBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "Stay (Vintage) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <DolcePage
      eyebrow={stayMeta.eyebrow}
      title={stayMeta.title}
      subtitle={stayMeta.subtitle}
      titleTone={stayMeta.titleTone}
      active={stayMeta.active}
      backHref="/home-fluid"
      art={stayMeta.art}
    >
      <StayBody />
    </DolcePage>
  );
}
