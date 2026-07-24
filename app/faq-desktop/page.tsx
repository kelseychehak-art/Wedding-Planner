import type { Metadata } from "next";
import DesktopContentPage from "@/components/mobileproto/DesktopContentPage";
import { faqMeta, FaqBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "FAQ · Desktop · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <DesktopContentPage
      variant="cream"
      eyebrow={faqMeta.eyebrow}
      title={faqMeta.title}
      subtitle={faqMeta.subtitle}
      titleTone={faqMeta.titleTone}
      active="faq"
    >
      <FaqBody />
    </DesktopContentPage>
  );
}
