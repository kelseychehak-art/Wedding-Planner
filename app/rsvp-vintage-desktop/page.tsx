import type { Metadata } from "next";
import DesktopContentPage from "@/components/mobileproto/DesktopContentPage";
import { rsvpMeta, RsvpBody } from "@/components/mobileproto/tabs";

export const metadata: Metadata = {
  title: "RSVP · Desktop (Vintage) · Kelsey & Andrew",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <DesktopContentPage
      variant="vintage"
      art={rsvpMeta.art}
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
