import type { Metadata } from "next";
import DolcePage from "@/components/mobileproto/DolcePage";
import { faqMeta, FaqBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "FAQ (Vintage) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <DolcePage
      eyebrow={faqMeta.eyebrow}
      title={faqMeta.title}
      subtitle={faqMeta.subtitle}
      titleTone={faqMeta.titleTone}
      active={faqMeta.active}
      backHref="/home-fluid"
      art={faqMeta.art}
    >
      <FaqBody />
    </DolcePage>
  );
}
