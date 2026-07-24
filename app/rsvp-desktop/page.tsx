import type { Metadata } from "next";
import DesktopContentPage from "@/components/mobileproto/DesktopContentPage";
import { rsvpMeta, RsvpBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "RSVP · Desktop · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <DesktopContentPage
      variant="cream"
      eyebrow={rsvpMeta.eyebrow}
      title={rsvpMeta.title}
      subtitle={rsvpMeta.subtitle}
      titleTone={rsvpMeta.titleTone}
      active="rsvp"
    >
      <RsvpBody />
    </DesktopContentPage>
  );
}
